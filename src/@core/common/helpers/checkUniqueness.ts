import { ConflictException } from '@nestjs/common';
import { IRepository } from '../interface/repository.interface';

const defaultOptions = { excludeId: '' };

export const checkUniqueness = async <Entity, WhereInput>(
  fields: Partial<Entity>,
  repository: IRepository<Entity, WhereInput, any, any>,
  options?: { excludeId?: string },
) => {
  const { excludeId } = { ...defaultOptions, ...options };

  const whereArray = Object.keys(fields).reduce((acc, key) => {
    return [...acc, { [key]: fields[key] }];
  }, []);

  const filter = { OR: whereArray } as WhereInput;

  if (excludeId) {
    filter['NOT'] = { id: excludeId };
  }

  const existingClient = await repository.findOne(filter);

  if (existingClient) {
    const equalFields = Object.keys(fields).filter(
      (field) => existingClient[field] === fields[field],
    );

    const fieldsMessage = equalFields.join(' and ');

    throw new ConflictException(
      `Entity with same ${fieldsMessage} already exists`,
    );
  }
};
