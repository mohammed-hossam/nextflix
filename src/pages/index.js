import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner/Banner';
import NavBar from '../components/navbar/Navbar';
import Card from '../components/card/Card';
import SectionCards from '../components/card/SectionCards';
import { getVideos } from '../lib/videos';

export default function Home() {
  const deisnyVideos = getVideos();
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta
          name="description"
          content="nextflix app to watch videos using next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar username="ankita@ank.com" />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <SectionCards title="Disney" size="large" videos={deisnyVideos} />
      </main>
    </div>
  );
}

export const getStaticProps = async (context) => {
  return {
    props: {},
  };
};
