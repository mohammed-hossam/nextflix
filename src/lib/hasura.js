//main function to call hasura
async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
     mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
       insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
         returning {
           email
           id
           issuer
         }
       }
     }
   `;

  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    'createNewUser',
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
     query isNewUser($issuer: String!) {
       users(where: {issuer: {_eq: $issuer}}) {
         id
         email
         issuer
       }
     }
   `;

  const response = await queryHasuraGQL(
    operationsDoc,
    'isNewUser',
    {
      issuer,
    },
    token
  );
  console.log(response);

  return response?.data?.users?.length === 0;
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
     query findVideoIdByUser($videoId: String!,$userId: String!) {
       stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
        id
        userId
        videoId
        favourited
        watched
       }
     }
   `;
  const response = await queryHasuraGQL(
    operationsDoc,
    'findVideoIdByUser',
    {
      userId,
      videoId,
    },
    token
  );

  console.log(response);

  return response?.data?.stats;
}

export async function insertVideoStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {
      favourited: $favourited, 
      userId: $userId, 
      watched: $watched, 
      videoId: $videoId
    }) {
        favourited
        userId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'insertStats',
    { favourited, userId, watched, videoId },
    token
  );

  return response;
}

export async function updateVideoStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favourited: $favourited}, 
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}
    }) {
    returning {
      favourited,
      userId,
      watched,
      videoId
    }
  }
}
`;

  return await queryHasuraGQL(
    operationsDoc,
    'updateStats',
    { favourited, userId, watched, videoId },
    token
  );
}

export async function getWatchedVideosFromStats(token, userId) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'watchedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function getLikedVideosFromStats(token, userId) {
  const operationsDoc = `
  query LikedVideos($userId: String!) {
    stats(where: {
      favourited: {_eq: 1}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'LikedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}
