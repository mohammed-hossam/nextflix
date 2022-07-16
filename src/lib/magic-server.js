import { Magic } from '@magic-sdk/admin';

const magicServer = new Magic(process.env.MAGIC_SERVER_SECRET_KEY);

export { magicServer };
