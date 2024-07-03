import { randomUUID } from 'crypto';
import { hashSync } from 'bcryptjs';
import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';

export class UserMock {
  public static create(override?: Partial<User>): User {
    return {
      id: override?.id ?? randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.city(),
      password: hashSync(override?.password ?? faker.internet.password(), 8),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'User',
      ...override,
    };
  }
}
