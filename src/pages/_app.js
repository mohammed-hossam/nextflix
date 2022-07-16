import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '../lib/magic-client';
import '../styles/globals.css';
import Loading from '../components/loading/loading';

function MyApp({ Component, pageProps }) {
  // const router = useRouter();
  // console.log(router);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   async function protectRoute() {
  //     const loggedIn = await magic.user.isLoggedIn();
  //     console.log(loggedIn);
  //     if (loggedIn) {
  //       router.push('./');
  //     } else {
  //       if (router.pathname === '/login' || router.pathname === '/_error') {
  //         setIsLoading(false);
  //       } else {
  //         router.push('./login');
  //       }
  //     }
  //   }
  //   protectRoute();
  // }, []);

  // useEffect(() => {
  //   const handleComplete = () => {
  //     setIsLoading(false);
  //   };

  //   router.events.on('routeChangeComplete', handleComplete);
  //   router.events.on('routeChangeError', handleComplete);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleComplete);
  //     router.events.off('routeChangeError', handleComplete);
  //   };
  // }, [router]);

  // return isLoading ? <Loading /> : <Component {...pageProps} />;
  return <Component {...pageProps} />;
}

export default MyApp;

// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import { magic } from '../lib/magic-client';
// import '../styles/globals.css';
// import Loading from '../components/loading/loading';

// function MyApp({ Component, pageProps }) {
//   const router = useRouter();
//   console.log(router);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function protectRoute() {
//       const loggedIn = await magic.user.isLoggedIn();
//       console.log(loggedIn);
//       if (loggedIn) {
//         router.push('./');
//       } else {
//         if (router.pathname === '/login' || router.pathname === '/_error') {
//           setIsLoading(false);
//         } else {
//           router.push('./login');
//         }
//       }
//     }
//     protectRoute();
//   }, []);

//   useEffect(() => {
//     const handleComplete = () => {
//       setIsLoading(false);
//     };

//     router.events.on('routeChangeComplete', handleComplete);
//     router.events.on('routeChangeError', handleComplete);

//     return () => {
//       router.events.off('routeChangeComplete', handleComplete);
//       router.events.off('routeChangeError', handleComplete);
//     };
//   }, [router]);

//   return isLoading ? <Loading /> : <Component {...pageProps} />;
// }

// export default MyApp;
