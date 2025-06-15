import React, { useEffect, useState } from "react";
import { getAllNovels } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";


export default function NovelsList() {

    const [novels, setNovels] = useState([])

    const navigate = useNavigate();

    const loadNovels = async() => {
        const response = await getAllNovels()
        setNovels(response.data)
    }

    useEffect(() => {
        loadNovels()
    }, [])


    return (
      <div className="mt-8 px-4 sm:px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-cyan-500 mb-6">
          Novelas disponibles
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {novels.map((novel) => (
            <div
              key={novel.id}
              className="bg-cyan-700 rounded-lg shadow-lg p-6 flex flex-col "
            >
              <div>
                <p className="font-bold text-xl text-cyan-200 w-full h-[4rem] overflow-hidden text-ellipsis whitespace-wrap">
                  <span>{novel.name}</span>
                </p>
                <img
                  src={novel.image_url}
                  alt={`Imagen de ${novel.name}`}
                  style={{ width: "300px", height: "200px", marginTop: "10px" }}
                />
              </div>

              <button
                onClick={() => navigate(`${novel.id}/`)}
                className="mt-6 bg-cyan-900 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-300 w-full"
                aria-label={`Ver lista de capítulos de la novela ${novel.name}`}
              >
                Ver lista de capítulos
              </button>
            </div>
          ))}
        </div>
      </div>
    )
}
