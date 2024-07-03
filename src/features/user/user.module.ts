import { PrismaUserRepository } from '@/infra/database/repository/prisma-user.repository';
import { BcryptoRepository } from '@/infra/crypto/bcrypto.repository';
import { PrismaService } from '@/infra/database/database.service';
import { BcryptoService } from '@/infra/crypto/bcrypto.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: BcryptoRepository,
      useClass: BcryptoService,
    },
  ],
})
export class UserModule {}
