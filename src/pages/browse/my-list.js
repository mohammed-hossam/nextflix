import Head from 'next/head';
import SectionCards from '../../components/card/SectionCards';
import Navbar from '../../components/navbar/Navbar';
import { verifyToken } from '../../lib/utils';
import { getMyListVideos } from '../../lib/videos';
import styles from '../../styles/MyList.module.css';

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;

export async function getServerSideProps(context) {
  const token = context.req ? context.req?.cookies.token : null;
  const userId = await verifyToken(token);

  //this is commented because we use the same logic for all of the pages in the middleware, so w dont need it anymore
  if (!userId) {
    //this is from the docs of the getServerSideProps
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const videos = await getMyListVideos(token, userId);
  console.log({ videos });
  return {
    props: {
      myListVideos: videos,
    },
  };
}
