import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

export const getAllNovels = () => api.get('novels/');
export const getNovel = (id) => api.get(`novels/${id}/`);
export const getChaptersByNovel = (novelId) => api.get(`novels/${novelId}/chapters/`);
export const getOrCreateChapter = (novelId, chapterId) => api.get(`novels/${novelId}/chapters/${chapterId}/audio/`);

// Función para obtener el token CSRF desde la cookie del navegador
function getCSRFToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// Enviar URL para scrapear
export const postScrapeURL = (url) =>
  api.post(
    "scrap/",
    { url },
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );


  // Enviar URL para scrapear
export const postChapterURL = (novelId, chapterId, chapter_url) =>
  api.post(
    `scrap/novels/${novelId}/chapters/${chapterId}/`,
    { chapter_url },
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );

// Extra: obtener el token al iniciar la app
export const fetchCSRFToken = () => api.get("csrf/");  // ← opcional si querés pedirlo explícitamente