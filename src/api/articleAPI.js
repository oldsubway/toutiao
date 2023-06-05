import request from '@/utils/request.js'
import dayjs from 'dayjs'

export const getArticleDetailAPI = artId => {
  const data = {
    pipeline: [
      { $match: { art_id: artId } },
      {
        $lookup: {
          from: 'user',
          let: { autId: '$aut_id', artId: '$art_id' },
          pipeline: [{ $addFields: { attitude: { $in: ['$$artId', '$attitudes'] } } }, { $addFields: { is_followed: { $in: ['$$autId', '$followings'] } } }, { $project: { is_followed: 1, attitude: 1, _id: 0 } }],
          as: 'is_followings'
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$is_followings', 0] }, '$$ROOT'] } } },
      { $project: { is_followings: 0, _id: 0 } }
    ],
    collection: 'articles'
  }
  return request.post('/action/aggregate', data)
}

export const followUserAPI = autId => {
  const data = { update: { $push: { followings: autId } }, collection: 'user' }
  return request.post('/action/updateOne', data)
}

export const unfollowUserAPI = autId => {
  const data = { update: { $pull: { followings: autId } }, collection: 'user' }
  return request.post('/action/updateOne', data)
}

export const addLikeAPI = artId => {
  const data = { update: { $push: { attitudes: artId } }, collection: 'user' }
  return request.post('/action/updateOne', data)
}

export const delLikeAPI = artId => {
  const data = { update: { $pull: { attitudes: artId } }, collection: 'user' }
  return request.post('/action/updateOne', data)
}

export const getCmtListAPI = (artId, page) => {
  const data = {
    pipeline: [{ $match: { art_id: '6268' } }, { $project: { comments: 1, comm_count: 1, _id: 0 } }, { $unwind: '$comments' }, { $replaceRoot: { newRoot: { $mergeObjects: ['$comments', '$$ROOT'] } } }, { $sort: { pubdate: -1 } }, { $skip: 0 + page * 5 }, { $limit: 5 }],
    collection: 'articles'
  }
  return request.post('/action/aggregate', data)
}

export const addCmtAPI = (artId, cmt) => {
  const comment = {
    com_id: Array(19)
      .fill('')
      .map(() => Math.floor(Math.random() * 10))
      .join(''),
    content: cmt,
    pubdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    aut_name: ['佟湘玉', '李大嘴', '郭芙蓉', '白展堂', '许秀才'][Math.floor(Math.random() * 5)],
    is_liking: Math.floor(Math.random() * 2)
  }
  console.log(comment)
  const data = { filter: { art_id: artId }, update: { $inc: { comm_count: 1 }, $push: { comments: comment } }, collection: 'articles' }
  return request.post('/action/updateOne', data).then(res => comment)
}
