import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Like from '../../components/icons/like-icon';
import DisLike from '../../components/icons/dislike-icon';
import Navbar from '../../components/navbar/Navbar';
import { getYoutubeVideoById } from '../../lib/videos';
import styles from '../../styles/Video.module.css';

function Video({ video }) {
  const router = useRouter();
  const videoId = router.query.videoId;
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);
  console.log(router.query.videoId);
  console.log(video);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    async function getVideoStats() {
      const res = await fetch(`/api/stats?videoId=${videoId}`);
      const data = await res.json();
      console.log(data);
      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDisLike(true);
        }
      }
    }
    getVideoStats();
  }, [videoId]);

  async function runRatingService(favourited) {
    return await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async function handleToggleLike() {
    console.log('welcome from toggle like');

    //23ml check lw 2sln el like button mtdas 3leh
    if (!toggleLike) {
      setToggleLike(true);
      setToggleDisLike(false);
      const res = await runRatingService(1);
      console.log(await res.json());
    }
  }

  async function handleToggleDislike() {
    //23ml check lw 2sln el dilike button mtdas 3leh
    console.log('welcome from toggle dislike');
    if (!toggleDisLike) {
      setToggleLike(false);
      setToggleDisLike(true);
      const res = await runRatingService(0);
      console.log(await res.json());
    }
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.modal}>
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          // frameborder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={[styles.subText, styles.subTextWrapper].join(' ')}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={[styles.subText, styles.subTextWrapper].join(' ')}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;

export async function getStaticProps(context) {
  const params = context.params;
  console.log(params);
  const video = await getYoutubeVideoById(params.videoId);
  console.log(video);
  return {
    props: {
      video: video.length > 0 ? video[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  //deh mgmo3t el videos ele 3ayz 23mlha prebuild
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];
  const paths = listOfVideos.map((videoId) => {
    return {
      params: {
        videoId: videoId,
        //this name should bs the same as paramter name of the page
      },
    };
  });

  return {
    // paths: [
    //   { params: { id: 0 } },
    //   { params: { id: 1 } },
    //   { params: { id: 2 } },
    // ],
    paths,
    fallback: 'blocking',
  };
}
