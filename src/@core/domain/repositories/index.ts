import { ClientRepository } from './client.repository';
import { UserRepository } from './user.repository';

export const repositoryProviders = [ClientRepository, UserRepository];

export { ClientRepository, UserRepository };
