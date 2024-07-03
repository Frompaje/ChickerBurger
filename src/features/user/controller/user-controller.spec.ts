import { Test } from '@nestjs/testing';

import { UserController } from './user.controller';
import { BcryptoRepository } from '@/infra/crypto/bcrypto.repository';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';
import { UserMock } from '../services/factory/make.user.faker';

describe('User Controller', () => {
  let userController: UserController;
  let userServices: UserService;
  let bcrypt: BcryptoRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: BcryptoRepository,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userServices = module.get<UserService>(UserService);
    bcrypt = module.get<BcryptoRepository>(BcryptoRepository);
  });

  it('[POST] /user ', async () => {
    const result = { user: UserMock.create() };

    jest
      .spyOn(userServices, 'create')
      .mockImplementation(() => Promise.resolve(result));
    expect(
      await userController.create({
        name: 'Yan Edwards',
        email: 'pajezinhofofinhokawway@gmail.com',
        password: '123456',
        address: 'Rua Madeira',
      }),
    ).toBe(result);
  });
});
