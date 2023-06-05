import request from '@/utils/request.js'

export const getUserChannelAPI = (data = {}) => {
  data = { projection: { channels: 1, _id: 0 }, collection: 'user' }
  return request.post('/action/findOne', data)
}

export const getArtListAPI = page => {
  const data = { skip: 0 + page * 10, limit: 10, sort: { art_id: 1 }, projection: { _id: 0 }, collection: 'articles' }
  return request.post('/action/find', data)
}

export const getAllChannelAPI = (data = {}) => {
  data = { projection: { _id: 0 }, collection: 'channels' }
  return request.post('/action/find', data)
}

export const updateUserChannelAPI = (data = {}) => {
  data = { update: { $set: { channels: data } }, collection: 'user' }
  return request.post('/action/updateOne', data)
}
