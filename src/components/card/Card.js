import Image from 'next/image';
import React, { useState } from 'react';
import styles from './card.module.css';
import { motion } from 'framer-motion';

function Card(props) {
  const {
    imgUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80',
    size = 'medium',
    id,
  } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  //btsht8l lw e src mwgod feh 7aga bs msh sh8ala, fhena ana 3aml 2sln imgUrl  7aga default lw md5lnash prop l component , bs lw ele md5lo fedault dah msh hs8al kaman hyro7 3aml handleOnError
  const handleOnError = () => {
    console.log('err');
    setImgSrc(
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80'
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div className={styles.container}>
      <motion.div
        className={[styles.imgMotionWrapper, classMap[size]].join(' ')}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgSrc}
          layout="fill"
          alt="test img"
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
}

export default Card;
