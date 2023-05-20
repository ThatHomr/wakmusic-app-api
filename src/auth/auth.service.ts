import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { UserService } from '../user/user.service';
import { OauthDto } from './dto/oauth.dto';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(reqUser: OauthDto) {
    const user = await this.userService.findByProviderIdOrSave(reqUser);

    const payload: JwtPayload = { id: user.userId };

    return this.getToken(payload);
  }

  private getToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken };
  }
}
