import bcrypt from 'bcrypt';

const saltRounds = 10;

export function hashPwd(pwd: string): Promise<string> {
  return bcrypt.hash(pwd, saltRounds);
}

export function checkPwd(pwd: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(pwd, storedHash);
}
