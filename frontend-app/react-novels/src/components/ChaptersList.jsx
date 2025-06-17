import React, { useEffect, useState } from "react";
import { getChaptersByNovel, getNovel, postChapterURL } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function ChaptersList() {
  const [novel, setNovel] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id: novelId } = useParams();
  const navigate = useNavigate();

  const loadNovel = async (novelId) => {
    const response = await getNovel(novelId);
    setNovel(response.data);
  };

  const loadChapters = async () => {
    const response = await getChaptersByNovel(novelId);
    setChapters(response.data);
  };

  useEffect(() => {
    loadChapters();
    loadNovel(novelId);
  }, [novelId]);

  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-6 bg-001425">
        <button
          onClick={() => navigate("/")}
          className="absolute mt-4 ml-2 top-4 left-4 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 active:text-cyan-500 text-lg font-semibold transition-colors"
        >
          <BiArrowBack className="text-2xl" />
          Listado de novelas
        </button>

        <div className="flex justify-center mt-16">
          <img
            src={novel.image_url}
            alt={`Portada de ${novel.name}`}
            className="w-60 h-90 object-cover rounded-2xl shadow-lg"
          />
        </div>

        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-cyan-500 mb-4">
            {novel.name}
          </h1>
          <p className="text-md font-medium text-neutral-300 whitespace-pre-line">
            {novel.synopsis}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => navigate(`chapters/${chapter.id}/`)}
              className="bg-cyan-900 rounded-lg shadow-lg p-3 flex items-center justify-between hover:bg-cyan-800 active:bg-cyan-600 transition-colors duration-300 w-full"
              aria-label={`Escuchar capítulo ${chapter.name}`}
            >
              <div>
                <p className="text-white font-semibold text-md">
                  Cap.<span className="font-bold">{chapter.number}</span>
                </p>
                <p className="text-white font-semibold text-lg truncate max-w-xs">
                  {chapter.name}
                </p>
              </div>
              {/* Podrías poner un icono de "play" aquí si quieres, opcional */}
              <svg
                className="w-10 h-10 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-6.518-3.75v7.5l6.518-3.75z"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
