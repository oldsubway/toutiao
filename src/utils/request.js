import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

const mongoDBConfig = {
  database: 'toutiao',
  dataSource: 'oldsubway'
}

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'api-key': 'DRUUIQaJGPfI007vZ57uczcRhio5Y3NGoK0OFHt7dOxApbdoaMJh56jMo3jLQR3S'
  }
})

instance.interceptors.request.use(
  config => {
    Toast.loading({
      message: '加载中....',
      duration: 0
    })

    const token = store.state.tokenInfo.token
    if (token && config.data.collection === 'user') {
      config.data.filter = { token }
    }
    config.data = { ...config.data, ...mongoDBConfig }
    return config
  },
  error => {
    Toast.clear()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    Toast.clear()
    return response
  },
  error => {
    Toast.clear()
    return Promise.reject(error)
  }
)

export default instance
