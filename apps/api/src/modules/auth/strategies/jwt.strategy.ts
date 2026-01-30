import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

type JwtPayload = {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret')
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByIdOrThrow(payload.sub);
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
