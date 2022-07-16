import Link from 'next/link';
import React from 'react';
import Card from './Card';
import styles from './section-cards.module.css';

function SectionCards(props) {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;
  console.log(videos);
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={[styles.cardWrapper, shouldWrap && styles.wrap].join(' ')}
      >
        {videos.map((el, i) => {
          return (
            <Link href={`./video/${el.id}`} key={el.id}>
              <a>
                <Card imgUrl={el.imgUrl} size={size} id={i} />;
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default SectionCards;
