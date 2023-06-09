import { v4 as uuidv4, validate as uuidVal } from 'uuid';

export const generateUUID = () => {
  return uuidv4();
};

export const validateUUID = (uuid: string) => {
  return uuidVal(uuid);
};
