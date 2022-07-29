import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { magic } from '../lib/magic-client';

import styles from '../styles/Login.module.css';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //handle loading state while routing
  useEffect(() => {
    //el fkra hena lma bn3ml router.push('./') bya5od wa2t shwia w moomkn tro7 3lamt el loading(lw 7att setIsLoading(false) direct b3d ma el token yrg3) b3d ma ykon 5alas el token rg3 w bd2 y3ml redirect, la2n 3mlyt el redirect bta5od wa2t seka, fafdl ene 27ot loading b false lma 2t2kd eno el redirect 5alas 5els
    const handleComplete = () => {
      setIsLoading(false);
      setUserMsg('');
    };
    const handleStart = () => {
      setUserMsg('redirecting');
    };
    const handleRouteChangeError = (err) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`);
        setUserMsg(`Route to ${url} was cancelled!`);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setUserMsg('');
      }
    };
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  async function handleLoginWithEmail(e) {
    e.preventDefault();

    if (email) {
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({
          email: email,
        });
        console.log(didToken);
        if (didToken) {
          // create user in our hasura database

          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${didToken}`,
              'Content-Type': 'application/json',
            },
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push('./');
          } else {
            setIsLoading(false);
            setUserMsg('Something went wrong logging in');
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Something went wrong logging in', error);
      }
    } else {
      // show user message
      setIsLoading(false);
      setUserMsg('Required');
    }
  }

  function handleEmailInput(e) {
    if (userMsg) {
      setUserMsg('');
    }

    setEmail(e.target.value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128px"
                height="34px"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleEmailInput}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
