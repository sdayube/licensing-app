import * as bcrypt from 'bcrypt';

export const hashPasswordTransform = {
  async to(password: string): Promise<string> {
    return await bcrypt.hash(password, parseInt(process.env.SECURITY_SALTS));
  },
  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  },
};
