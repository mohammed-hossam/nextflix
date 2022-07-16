import { Magic } from 'magic-sdk';

function createMagic() {
  if (typeof window !== 'undefined') {
    console.log(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY);
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY);
  }
}
const magic = createMagic();
export { magic };
