import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { UserService } from '../user/user.service';
import { LoginMobileBodyDto } from './dto/body/login-mobile.body.dto';
import { OauthDto } from './dto/oauth.dto';
import { OAuth2Client } from 'google-auth-library';
import { HttpService } from '@nestjs/axios';
import { getError } from 'src/utils/error.utils';
import { BadRequestException } from '@nestjs/common';
import { NaverResponseDto } from './dto/naver-response.dto';
import { AppleInfo } from './dto/apple.dto';
import { verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly jwksClient: JwksClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: process.env.OAUTH_GOOGLE_ID,
    });
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
  }

  async login(reqUser: OauthDto) {
    const user = await this.userService.findByProviderIdOrSave(reqUser);

    const payload: JwtPayload = { id: user.userId };

    const token = this.getToken(payload);

    await this.userService.createAccessLog(user);

    return token;
  }

  async loginMobile(
    body: LoginMobileBodyDto,
  ): Promise<{ accessToken: string }> {
    try {
      const oauthId = await this.verify(body.provider, body.token);

      return await this.login({ id: oauthId, provider: body.provider });
    } catch (error) {
      this.logger.error(getError(error));

      throw new BadRequestException('invaild oauth token.');
    }
  }

  private getToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRE_IN,
      secret: process.env.JWT_SECRET,
    });

    return { accessToken };
  }

  async verify(type: string, token: string): Promise<string> {
    switch (type) {
      case 'google':
        const ticket = await this.googleClient.getTokenInfo(token);
        const userId = ticket.sub;
        if (!userId) throw new Error('invaild token.');
        return userId;
      case 'naver':
        const result = await this.httpService.axiosRef.get<NaverResponseDto>(
          'https://openapi.naver.com/v1/nid/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return result.data.response.id;
      case 'apple':
        const header = this.headerDecode(token);

        const key = await this.jwksClient.getSigningKey(header['kid']);
        if (key === undefined) {
          throw new Error('invaild token.');
        }

        const publicKey = key.getPublicKey();

        const decodedToken = verify(token, publicKey, {
          algorithms: ['RS256'],
        }) as AppleInfo;

        return decodedToken.sub;
      default:
        throw new Error('invaild token.');
    }
  }

  private headerDecode(token: string): { [key: string]: string } {
    const header = token.split('.')[0];
    return JSON.parse(Buffer.from(header, 'base64').toString());
  }
}
