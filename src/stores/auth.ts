import { defineStore } from 'pinia'
import axios from '../utils/axios'
import { ref } from 'vue'
import router from '@/router'
import { useTaskStore } from './task'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      email: localStorage.getItem('email') || '',
    },
    token: localStorage.getItem('token') || '',
  }),
  actions: {
    async login(email: string, password: string) {
      const res = await axios.post('/v1/login', { email, password })
      this.token = res.data.data.token
      localStorage.setItem('token', this.token)
      await this.fetchUser()
    },
    async register(email: string, password: string, password_confirmation: string) {
      const res = await axios.post('/v1/register', {
        email,
        password,
        password_confirmation,
      })
      this.token = res.data.data.token
      localStorage.setItem('token', this.token)
      await this.fetchUser()
    },
    async fetchUser() {
      const res = await axios.get('/v1/user')
      this.user = res.data.data
      localStorage.setItem('email', this.user.email)
    },
    logout() {
      this.token = ''
      this.user = {
        email: '',
      }
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      // 清空taskStore
      const taskStore = useTaskStore()
      taskStore.clearTasks()
      router.push('/')
    },
  },
})
