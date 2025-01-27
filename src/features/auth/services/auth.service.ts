import { EnvService } from '@/env/env.service';
import { User } from '@/features/user/entities/user.entity';
import { BcryptoRepository } from '@/infra/crypto/bcrypto.repository';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptRepository: BcryptoRepository,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async validateUser({ email, password }: Input) {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      throw new ConflictException('Invalid credentials!');
    }

    const isSamePassword = await this.bcryptRepository.compare(
      password,
      user.password,
    );

    if (!isSamePassword) {
      throw new ConflictException('Invalid credentials!');
    }

    return { user };
  }

  async createToken(user: User) {
    const payload = { sub: user.id };

    if (!user) {
      throw new ConflictException('Invalid credentials!');
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    const bearer = token.split(' ')[1];

    if (!bearer) {
      throw new UnauthorizedException('Invalid Token');
    }

    const verifyToken = await this.jwtService.verifyAsync(bearer, {
      secret: this.envService.get('JWT_SECRET_KEY'),
    });

    if (!verifyToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = await this.userRepository.findById(verifyToken.user);

    return {
      accessToken: this.jwtService.sign({ id: user.id }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

export type Input = {
  email: string;
  password: string;
};
