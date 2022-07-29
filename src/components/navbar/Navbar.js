/* eslint-disable react/jsx-no-comment-textnodes */
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './navbar.module.css';
import Link from 'next/link';
import { magic } from '../../lib/magic-client';
import { useRouter } from 'next/router';

function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [didToken, setDidToken] = useState('');

  useEffect(() => {
    async function getUser() {
      try {
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        console.log({ didToken });
        console.log({ issuer });
        console.log({ email });
        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.error('Error retrieving email', error);
      }
    }

    getUser();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push('/browse/my-list');
  };
  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      // await magic.user.logout();
      // console.log(await magic.user.isLoggedIn()); // => `false`
      // router.push('./login');
      console.log(didToken);
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${didToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response);
    } catch (err) {
      console.error('Error logging out', err);
      // router.push('./login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/** Expand more icon */}
              <Image
                src={'/static/expand_more.svg'}
                alt="Expand dropdown"
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
