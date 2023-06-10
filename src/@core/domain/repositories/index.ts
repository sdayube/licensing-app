import { ClientRepository } from './client.repository';
import { LicenseRepository } from './license.repository';
import { RobotTypeRepository } from './robot-type.repository';
import { RobotRepository } from './robot.repository';
import { UserRepository } from './user.repository';

export const repositoryProviders = [
  ClientRepository,
  UserRepository,
  LicenseRepository,
  RobotRepository,
  RobotTypeRepository,
];

export {
  ClientRepository,
  UserRepository,
  LicenseRepository,
  RobotRepository,
  RobotTypeRepository,
};
