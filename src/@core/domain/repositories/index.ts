import { ClientRepository } from './client.repository';
import { LicenseRepository } from './license.repository';
import { RobotRepository } from './robot.repository';
import { UserRepository } from './user.repository';

export const repositoryProviders = [
  ClientRepository,
  UserRepository,
  LicenseRepository,
  RobotRepository,
];

export { ClientRepository, UserRepository, LicenseRepository, RobotRepository };
