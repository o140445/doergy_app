import axios from 'axios'
import { ElNotification } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      // localStorage.removeItem('token')
      useAuthStore().logout()
      ElNotification({
        title: '登录过期',
        message: '请重新登录',
        type: 'error',
        duration: 3000,
      })
      router.push('/')
    } else {
      return Promise.reject(error)
    }
  },
)

export default instance
