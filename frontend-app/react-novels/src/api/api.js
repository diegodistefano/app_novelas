import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const getAllNovels = () => api.get('novels/');
export const getNovel = (id) => api.get(`novels/${id}/`);
export const getChaptersByNovel = (novelId) => api.get(`novels/${novelId}/chapters/`);
export const getChapter = (novelId, chapterId) => api.get(`novels/${novelId}/chapters/${chapterId}/`);

