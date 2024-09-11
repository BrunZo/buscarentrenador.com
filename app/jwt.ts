import { jwtVerify, SignJWT } from 'jose';

const secret_key = 'secret';
const key = new TextEncoder().encode(secret_key);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 h from now')
    .sign(key);
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  })
  return payload
}