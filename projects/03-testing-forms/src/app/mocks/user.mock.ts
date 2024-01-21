import { faker } from '@faker-js/faker';
import { User } from '@models/user.interface';

export const generateOneUser = () => {
  const user: User = {
    id: faker.string.uuid(),
    name: faker.name.firstName(),
    emaiil: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin',
  };

  return user;
};
