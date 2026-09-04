import { defineStore } from 'pinia'
import { api, apiFiles } from 'src/boot/axios'

export const useQuizStore = defineStore('quiz', {
  state: () => ({ programmes: [], current: null }),
  actions: {
    async list() { const { data } = await api.get('/teacher/quizzes'); this.programmes = data.data; return this.programmes },
    async get(id) { const { data } = await api.get(`/teacher/quizzes/${id}`); this.current = data.data; return this.current },
    async create(payload) { const { data } = await api.post('/teacher/quizzes', payload); return data.data },
    async update(id, payload) { const { data } = await api.put(`/teacher/quizzes/${id}`, payload); this.current = data.data; return this.current },
    async remove(id) { await api.delete(`/teacher/quizzes/${id}`) },
    async saveSession(id, payload) { await api.put(`/teacher/quizzes/${id}/session`, payload) },
    async uploadImage(file) { const form = new FormData(); form.append('file', file); const { data } = await apiFiles.post('/teacher/quizzes/images', form); return data.data.path },
  },
})
