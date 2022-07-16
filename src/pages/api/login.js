import { magicServer } from '../../lib/magic-server';
import { createNewUser, isNewUser } from '../../lib/hasura';
import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../../lib/cookies';

export default async function login(req, res) {
  if ((req.method = 'POST')) {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : '';
      const metaData = await magicServer.users.getMetadataByToken(didToken);
      console.log(metaData);
      const token = jwt.sign(
        {
          ...metaData,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': `${metaData.issuer}`,
          },
        },
        process.env.HASURA_JWT_SECRET
      );
      const newAccount = await isNewUser(token, metaData.issuer);
      console.log({ newAccount });
      if (newAccount) {
        await createNewUser(token, metaData);
      }
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (err) {
      console.log('error at login', err);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
