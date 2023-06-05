import request from '@/utils/request.js'

export const loginAPI = () => {
  const data = { projection: { token: 1, refresh_token: 1, _id: 0 }, collection: 'user' }
  return request.post('/action/findOne', data)
}

export const getUserInfoAPI = () => {
  const data = { projection: { name: 1, art_count: 1, photo: 1, follow_count: 1, fans_count: 1, _id: 0 }, collection: 'user' }
  return request.post('/action/findOne', data)
}

export const getUserProfileAPI = () => {
  const data = { projection: { name: 1, birthday: 1, photo: 1, _id: 0 }, collection: 'user' }
  return request.post('/action/findOne', data)
}

// 更新用户名或生日 参数为对象{name:xxx}或{birthday:xxxx}
export const updateUserProfileAPI = obj => {
  const data = { update: { $set: obj }, collection: 'user' }
  return request.post('/action/updateOne', data)
}

export const updateAvatarAPI = obj => {
  const data = { update: { $set: obj }, collection: 'user' }
  return request.post('/action/updateOne', data)
}
