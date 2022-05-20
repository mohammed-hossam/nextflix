import videos from '../data/videos.json';
console.log(videos);
export const getVideos = () => {
  return videos.items.map((el) => {
    return {
      title: el.snippet.title,
      imgUrl: el.snippet.thumbnails.high.url,
      id: el.id.videoId,
    };
  });
};
