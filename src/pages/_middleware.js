import { NextResponse } from 'next/server';
// import { verifyTokenMiddleware } from '../lib/utils';
import { jwtVerify } from 'jose'; //for middleware only due to edge Runtime limitations

//for middleware only due to edge Runtime limitations
async function verifyTokenMiddleware(token) {
  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.HASURA_JWT_SECRET)
      );
      return verified.payload && verified.payload?.issuer;
    }
    return null;
  } catch (err) {
    console.error({ err });
    return null;
  }
}

export async function middleware(req) {
  //check token
  const token = req ? req.cookies?.token : null;
  const userId = await verifyTokenMiddleware(token);
  console.log({ userId });
  const { pathname } = req.nextUrl;
  console.log({ pathname });

  //if token is valied or the page is already login, then NextResponse
  if (
    userId ||
    pathname.includes('/api/login') ||
    pathname.includes('/static')
  ) {
    return NextResponse.next();
  }

  //if token not valid or no token at all, then redirect to login page
  if ((!token || !userId) && pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.rewrite(url);
  }
}
