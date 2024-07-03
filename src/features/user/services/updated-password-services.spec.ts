import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BcryptoRepository } from '../../../infra/crypto/bcrypto.repository';
import { UserRepository } from '../repository/user.repository';
import { UserMock } from './factory/make.user.faker';
import { UserService } from './user.service';

describe('[Service updated] Should create a user', () => {
  let userRepository: UserRepository;
  let bcrypt: BcryptoRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            updatedPassword: jest.fn(),
          },
        },
        {
          provide: BcryptoRepository,
          useValue: {
            compare: jest.fn(),
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get(UserRepository);
    bcrypt = module.get(BcryptoRepository);
    userService = module.get(UserService);
  });

  describe('[Success]', () => {
    it('should update the user password', async () => {
      const userMock = UserMock.create({ name: 'Yan Edwards' });

      await userRepository.updatedPassword({
        id: userMock.id,
        password: 'Hashed-Password',
      });

      const mockPrismaAdapter = jest
        .spyOn(userRepository, 'updatedPassword')
        .mockResolvedValue({ password: 'Hashed-Password', ...userMock });

      expect(mockPrismaAdapter).toHaveBeenCalledWith({
        id: userMock.id,
        password: 'Hashed-Password',
      });
    });
  });

  describe('[Err]', () => {
    it('Should not update if the user has not been found ', async () => {
      const userMock = UserMock.create({ name: 'Yan Edwards' });

      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(() => {
        return userService.updatedPassword(userMock);
      }).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
