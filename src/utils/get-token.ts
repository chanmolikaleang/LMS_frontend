import { JwtService } from '@nestjs/jwt';
const jwtService = new JwtService();

export async function getTokens(
  userUid: string,
  email: string,
  // permissions: string[],
  role?: string,
) {
  const payload = {
    sub: userUid,
    email,
    role,
  };
  const at = await jwtService.signAsync(payload, {
    secret: 'at-secret',
  });
  return at;
}
