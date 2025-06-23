import { defineStore } from 'pinia'
import axios from '../utils/axios'
import { ElNotification } from 'element-plus'

export interface Project {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      try {
        const response = await axios.get('/v1/projects')
        this.projects = response.data
      } catch (error) {
        console.error('Error fetching projects:', error)
        this.error = error as string
      } finally {
        this.loading = false
      }
    },
    async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post('/v1/projects', project)
        this.projects.push(response.data)
      } catch (error) {
        console.error('Error creating project:', error)
        this.error = (error as any).response.data.message
      } finally {
        this.loading = false
      }
    },
    async updateProject(id: number, project: Project) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.put(`/v1/projects/${id}`, project)
        const index = this.projects.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.projects[index] = response.data
        }
      } catch (error) {
        console.error('Error updating project:', error)
        this.error = (error as any).response.data.message
      } finally {
        this.loading = false
      }
    },
    async deleteProject(id: number) {
      this.loading = true
      this.error = null

      try {
        await axios.delete(`/v1/projects/${id}`)
        this.projects = this.projects.filter((p) => p.id !== id)
      } catch (error) {
        console.error('Error deleting project:', error)
        this.error = (error as any).response.data.message
      } finally {
        this.loading = false
      }
    },
  },
})
