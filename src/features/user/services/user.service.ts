import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptoRepository } from '../../../infra/crypto/bcrypto.repository';

import {
  UserCreateInput,
  UserRepository,
  UserUpdatedPasswordInput,
} from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bscrypt: BcryptoRepository,
  ) {}

  async create({ name, password, email, address }: UserCreateInput) {
    const userExist = await this.userRepository.findByEmail({ email });

    if (userExist) {
      throw new ConflictException('User Already Exist');
    }
    const passwordHashed = await this.bscrypt.hash(password);
    const user = await this.userRepository.create({
      name,
      password: passwordHashed,
      email,
      address,
    });
    return { user };
  }

  async updatedPassword({ id, password }: UserUpdatedPasswordInput) {
    const userExist = await this.userRepository.findById({ id });

    console.log(userExist);

    if (!userExist) {
      throw new NotFoundException();
    }

    const newPasswordHashed = await this.bscrypt.hash(password);

    const user = await this.userRepository.updatedPassword({
      id,
      password: newPasswordHashed,
    });

    return { user };
  }
}
