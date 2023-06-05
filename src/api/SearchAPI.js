import request from '@/utils/request.js'

// 获取所有文章,自己做筛选
export const getSuggestListAPI = kw => {
  const data = { projection: { title: 1, _id: 0 }, sort: { art_id: 1 }, collection: 'articles' }
  return request.post('/action/find', data).then(res => {
    const newRes = res.data.documents.filter(item => item.title.toUpperCase().includes(kw.toUpperCase()))
    return newRes.map(item => item.title)
  })
}

export const getSearchResultAPI = (kw, page) => {
  const data = { skip: 0 + page * 10, limit: 10, sort: { art_id: 1 }, projection: { _id: 0 }, collection: 'articles' }
  return request.post('/action/find', data)
}
