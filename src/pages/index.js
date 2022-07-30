import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner/Banner';
import NavBar from '../components/navbar/Navbar';
import Card from '../components/card/Card';
import SectionCards from '../components/card/SectionCards';
import {
  getCommonVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from '../lib/videos';
import { getLikedVideosFromStats } from '../lib/hasura';
import { verifyToken } from '../lib/utils';

export default function Home(props) {
  const {
    watchItAgainVideos,
    natureVideos,
    engineeringVideos,
    scienceVideos,
    popularVideos,
  } = props;
  console.log(watchItAgainVideos);
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
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Watch It Again"
            size="small"
            videos={watchItAgainVideos}
          />
          <SectionCards title="Nature" size="large" videos={natureVideos} />
          <SectionCards
            title="Engineering"
            size="large"
            videos={engineeringVideos}
          />
          <SectionCards title="Science" videos={scienceVideos} />
          <SectionCards title="Popular" size="small" videos={popularVideos} />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const token = context.req ? context.req?.cookies.token : null;
  const userId = await verifyToken(token);

  //this is commented because we use the same logic for all of the pages in the middleware, so w dont need it anymore
  // if (!userId) {
  //   //this is from the docs of the getServerSideProps
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }
  const watchItAgainVideos = await getWatchItAgainVideos(token, userId);
  console.log(watchItAgainVideos);
  const natureVideos = await getCommonVideos('nature');
  const engineeringVideos = await getCommonVideos('engineering cars');
  const scienceVideos = await getCommonVideos('science planets');
  const popularVideos = await getPopularVideos();
  return {
    props: {
      watchItAgainVideos,
      natureVideos,
      engineeringVideos,
      scienceVideos,
      popularVideos,
    },
  };
};
