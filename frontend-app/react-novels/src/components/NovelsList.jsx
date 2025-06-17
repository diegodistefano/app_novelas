import React, { useEffect, useState } from "react";
import { getAllNovels } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import NovelCarousel from "./NovelCarousel";

export default function NovelsList() {
  const [novels, setNovels] = useState([]);

  const navigate = useNavigate();

  const loadNovels = async () => {
    const response = await getAllNovels();
    setNovels(response.data);
  };

  useEffect(() => {
    loadNovels();
  }, []);

  return (
    <div className="mt-8 px-6 sm:px-6 max-w-md mx-auto">
      <NovelCarousel />
      <h1 className="my-10 text-3xl font-extrabold text-cyan-500">
        Novelas disponibles
      </h1>
      <div className="grid grid-cols-2 gap-6">
        {novels.map((novel) => (
          <div
            key={novel.id}
            className="bg-cyan-950 rounded-lg shadow-lg p-4 flex flex-col ">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p
                  className="font-bold text-md text-cyan-200 rounded-md overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    background:
                      "linear-gradient(to right, rgba(10, 25, 40, 0) 0%, rgba(10, 25, 40, 1) 100%)",
                  }}
                >
                  {novel.name}
                </p>
              </div>

              <div className="flex flex-col items-center mt-auto space-y-4">
                <img
                  src={novel.image_url}
                  alt={`Imagen de ${novel.name}`}
                  className="mt-2 w-38 h-52 object-cover rounded-2xl shadow-lg"
                />
                <button
                  onClick={() => navigate(`novels/${novel.id}/`)}
                  className="bg-cyan-900 hover:bg-cyan-600 active:bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-300 w-full"
                  aria-label={`Ver lista de capítulos de la novela ${novel.name}`}
                >
                  Capítulos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
