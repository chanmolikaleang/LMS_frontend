import * as jwt from 'jsonwebtoken';

export function isValidToken(token: string) {
  try {
    const decoded = jwt.verify(token, 'at-secret', { algorithms: ['HS256'] });
    if (decoded) return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
