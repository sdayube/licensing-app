import { ClientRepository } from './client.repository';
import { LicenseRepository } from './license.repository';
import { RobotTypeRepository } from './robot-type.repository';
import { RobotRepository } from './robot.repository';
import { UserRepository } from './user.repository';
import { BankRepository } from './bank.repository';
import { TaskRepository } from './task.repository';
import { CredentialRepository } from './credential.repository';

export const repositoryProviders = [
  ClientRepository,
  UserRepository,
  LicenseRepository,
  RobotRepository,
  RobotTypeRepository,
  BankRepository,
  TaskRepository,
  CredentialRepository,
];

export {
  ClientRepository,
  UserRepository,
  LicenseRepository,
  RobotRepository,
  RobotTypeRepository,
  BankRepository,
  TaskRepository,
  CredentialRepository,
};
