import { ClientRepository } from './client.repository';
import { LicenseRepository } from './license.repository';
import { UserRepository } from './user.repository';

export const repositoryProviders = [
  ClientRepository,
  UserRepository,
  LicenseRepository,
];

export { ClientRepository, UserRepository, LicenseRepository };
