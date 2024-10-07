import * as bcrypt from 'bcrypt';

export async function hashData(data: string) {
  return await bcrypt.hash(data, 10);
}
