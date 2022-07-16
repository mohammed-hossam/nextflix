// import videos from '../data/videos.json';

export const getCommonVideos = async (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}`;
  return getVideos(URL);
};
export const getPopularVideos = async () => {
  const URL =
    'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=eg';

  return getVideos(URL);
};

const getVideos = async (URL) => {
  try {
    const BASE_URL = 'youtube.googleapis.com/youtube/v3';

    const res = await fetch(
      `https://${BASE_URL}/${URL}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`
    );
    const videos = await res.json();

    if (videos?.error) {
      console.error('Youtube API error', videos.error);
      return [];
    }

    return videos?.items.map((el) => {
      const id = el.id?.videoId || el.id;
      return {
        title: el.snippet.title,
        imgUrl: el.snippet.thumbnails.high.url,
        id: id,
        description: el.snippet.description,
        publishTime: el.snippet.publishedAt,
        channelTitle: el.snippet.channelTitle,
        statistics: el.statistics ? el.statistics : { viewCount: 0 },
      };
    });
  } catch (err) {
    console.error('Something went wrong with video library', err);
    return [];
  }
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getVideos(URL);
};
