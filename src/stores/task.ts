import { defineStore } from 'pinia'
import axios from '../utils/axios'

export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  tags: tags[]
  project: number
  start_time?: string
  end_time?: string
  completed_at?: string
  created_at: string
  updated_at: string
}
export interface tags {
  id: number
  name: string
  color: string
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    tags: [] as tags[],
    total: 0,
    day_total: 0,
    day_completed: 0,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getTaskById: (state) => (id: number) => {
      return state.tasks.find((task) => task.id === id)
    },
    getTasksByStatus: (state) => (status: Task['status']) => {
      return state.tasks.filter((task) => task.status === status)
    },
  },

  actions: {
    async fetchTasks(search: string, priority: string, status: string) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/v1/tasks', {
          params: {
            search,
            priority,
            status,
          },
        })
        this.tasks = response.data.data.tasks
        this.total = response.data.data.total
        this.day_total = response.data.data.day_total
        this.day_completed = response.data.data.day_completed
      } catch (error) {
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
      } finally {
        this.loading = false
      }
    },

    async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null
      try {
        await axios.post('/v1/tasks', task)
      } catch (error) {
        console.log(error)
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
      } finally {
        this.loading = false
      }
    },

    async updateTask(id: number, updates: Partial<Task>) {
      this.error = null
      try {
        await axios.put(`/v1/tasks/${id}`, updates)
      } catch (error) {
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
      }
    },

    async deleteTask(id: number) {
      this.error = null
      try {
        await axios.delete(`/v1/tasks/${id}`)
        this.tasks = this.tasks.filter((task) => task.id !== id)
      } catch (error) {
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
        throw error
      }
    },

    // computedStatus
    async computedStatus(id: number) {
      this.error = null
      try {
        const response = await axios.put(`/v1/tasks/complete/${id}`)
        return response.data
      } catch (error) {
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
        throw error
      }
    },

    //restoreTask
    async restoreTask(id: number) {
      this.error = null
      try {
        const response = await axios.put(`/v1/tasks/restore/${id}`)
        return response.data
      } catch (error) {
        this.error =
          (error as Error & { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'An error occurred'
        throw error
      }
    },

    async getTags() {
      const response = await axios.get('/tags')
      return response.data
    },

    clearTasks() {
      this.tasks = []
      this.total = 0
      this.loading = false
      this.error = null
    },
  },
})
