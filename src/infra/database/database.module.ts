import { PrismaUserRepository } from './repository/prisma-user.repository';
import { BcryptoRepository } from 'src/infra/crypto/bcrypto.repository';
import { BcryptoService } from 'src/infra/crypto/bcrypto.service';
import { UserRepository } from '@/features/user/repository/user.repository';
import { UserController } from '@/features/user/controller/user.controller';
import { PrismaService } from 'src/infra/database/database.service';
import { UserService } from '@/features/user/services/user.service';
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
export class UserDataBaseModule {}
