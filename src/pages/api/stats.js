import { JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken } from '../../lib/utils';
import { findVideoIdByUser } from '../../lib/hasura';
export default async function stats(req, res) {
  if (req.method === 'POST') {
    try {
      const token = req.cookies.token;
      if (!token) {
        resp.status(403).send({});
      } else {
        const inputParams = req.method === 'POST' ? req.body : req.query;
        const { videoId } = inputParams;
        if (videoId) {
          const userId = await verifyToken(token);
          const VideonotFound = await findVideoIdByUser(token, userId, videoId);
          // const doesStatsExist = findVideo?.length > 0;
          if (VideonotFound) {
            //add
            const response = await insertVideoStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            resp.send({ data: response });
          } else {
            // update
          }
          if (req.method === 'POST') {
            const { favourited, watched = true } = req.body;
            if (doesStatsExist) {
              // update it
              const response = await updateVideoStats(token, {
                watched,
                userId,
                videoId,
                favourited,
              });
              resp.send({ data: response });
            } else {
              // add it
              const response = await insertVideoStats(token, {
                watched,
                userId,
                videoId,
                favourited,
              });
              resp.send({ data: response });
            }
          } else {
            if (doesStatsExist) {
              resp.send(findVideo);
            } else {
              resp.status(404);
              resp.send({ user: null, msg: 'Video not found' });
            }
          }
        }
      }
      res.send({ done: true });
    } catch (error) {
      console.log('error', error);
    }
  }
}
