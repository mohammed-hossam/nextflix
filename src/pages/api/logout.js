import { removeTokenCookie } from '../../lib/cookies';
import { magicServer } from '../../lib/magic-server';
import { verifyToken } from '../../lib/utils';

export default async function login(req, res) {
  try {
    if (!req.cookies.token) {
      return res
        .status(401)
        .json({ message: 'no token found in cookies User is not logged in' });
    } else {
      //remove token from cookies
      const token = req.cookies.token;
      const userId = await verifyToken(token);
      removeTokenCookie(res);

      //logout from magic
      try {
        await magicServer.users.logoutByIssuer(userId);
      } catch (error) {
        console.log("User's session with Magic already expired");
        console.error('Error occurred while logging out magic user', error);
        return res
          .status(400)
          .json({ message: 'Error occurred while logging out magic user' });
      }

      //redirects user to login page
      // res.redirect(302, '/login');
      res.writeHead(302, { Location: '/login' });
      res.end();
      return;
    }
  } catch (error) {
    console.error({ error });
    return res.status(401).json({ message: 'User is not logged in' });
  }
}
