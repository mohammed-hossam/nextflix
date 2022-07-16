import cookie from 'cookie';

const MAX_AGE = 7 * 24 * 60 * 60;

export const setTokenCookie = (token, res) => {
  const setCookie = cookie.serialize('token', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
    //if secure is true means that, the browser(request) must have https connection
    path: '/',
    //path define the path that where the cookie will be set
  });
  res.setHeader('Set-Cookie', setCookie);
};

export const removeTokenCookie = (res) => {
  const val = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', val);
};
