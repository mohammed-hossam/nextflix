import { JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken } from '../../lib/utils';
import {
  findVideoIdByUser,
  insertVideoStats,
  updateVideoStats,
} from '../../lib/hasura';
export default async function stats(req, res) {
  const token = req.cookies.token;
  try {
    if (!token) {
      res.status(403).send({});
    } else {
      let inputParams;
      if (req.method === 'POST') {
        inputParams = req.body;
      } else if (req.method === 'GET') {
        inputParams = req.query;
      }
      const { videoId } = inputParams;
      if (videoId) {
        const userId = await verifyToken(token);
        const videoStats = await findVideoIdByUser(token, userId, videoId);
        const VideoStatsnotFound = !videoStats?.length > 0;
        //handle POST request
        if (req.method === 'POST') {
          const { favourited, watched = true } = req.body;
          if (VideoStatsnotFound) {
            //add
            const response = await insertVideoStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            res.send({ data: response });
          } else {
            // update
            const response = await updateVideoStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            res.send({ data: response });
          }
        }
        //handle GET request
        else if (req.method === 'GET') {
          if (!VideoStatsnotFound) {
            res.send(videoStats);
          } else {
            // res.status(404);
            res.send({
              user: null,
              msg: '404 Video not found in the stats hasura database',
            });
          }
        }
      } else {
        res.status(500).send({ done: false, msg: 'videoId is Required' });
      }
    }
    res.send({ done: true });
  } catch (error) {
    console.error('Error occurred /stats', error);
    res.status(500).send({ done: false, error: error?.message });
  }
}
