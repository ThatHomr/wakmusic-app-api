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
import { AppleInfo, AppleKey, AppleKeyResponseDto } from './dto/apple.dto';
import { generateKeyPair, KeyObject } from 'crypto';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: process.env.OAUTH_GOOGLE_ID,
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
        const publicKeys =
          await this.httpService.axiosRef.get<AppleKeyResponseDto>(
            'https://appleid.apple.com/auth/keys',
          );
        const header = this.headerDecode(token);

        const key = this.findKey(
          publicKeys.data.keys,
          header['kid'],
          header['alg'],
        );
        if (key === undefined) {
          throw new Error('invaild token.');
        }
        this.logger.debug(key);
        this.logger.debug(this.decodeBase64(key.n).toString('utf-8'));
        this.logger.debug(this.decodeBase64(key.e).toString('utf-8'));

        const m = parseInt(this.decodeBase64(key.n).toString('hex'), 16);
        const e = parseInt(this.decodeBase64(key.e).toString('hex'), 16);
        this.logger.debug(m);
        this.logger.debug(e);

        const publicKey = await this.generatePublicKey(m, e);

        const decodedToken = this.jwtService.verify<AppleInfo>(token, {
          publicKey: publicKey.export({ format: 'pem', type: 'pkcs8' }),
        });

        return decodedToken.sub;
      default:
        throw new Error('invaild token.');
    }
  }

  private headerDecode(token: string): { [key: string]: string } {
    const header = token.split('.')[0];
    return JSON.parse(Buffer.from(header, 'base64').toString());
  }

  private findKey(
    keys: Array<AppleKey>,
    kid: string,
    alg: string,
  ): AppleKey | undefined {
    return keys.find((key) => key.kid === kid && key.alg === alg);
  }

  private decodeBase64(base64: string): Buffer {
    // Add removed at end '='
    base64 += Array(5 - (base64.length % 4)).join('=');

    base64 = base64
      .replace(/\-/g, '+') // Convert '-' to '+'
      .replace(/\_/g, '/'); // Convert '_' to '/'

    return Buffer.from(base64, 'base64');
  }

  private generatePublicKey(m: number, e: number): Promise<KeyObject> {
    return new Promise((resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: m,
          publicExponent: e,
        },
        (err, publicKey, privateKey) => {
          if (err !== null) {
            reject(err.message);
          } else {
            resolve(publicKey);
          }
        },
      );
    });
  }
}
