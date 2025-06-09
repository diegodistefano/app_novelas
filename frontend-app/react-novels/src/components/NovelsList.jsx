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
        <h1 className="text-3xl font-extrabold text-cyan-900 mb-6">
          Novelas disponibles
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {novels.map((novel) => (
            <div
              key={novel.id}
              className="bg-cyan-700 rounded-lg shadow-lg p-6 flex flex-col "
            >
              <div>
                <p className="text-cyan-300 text-sm mb-1">ID: {novel.id}</p>
                <p className="text-white font-semibold text-lg">
                  Novela:<br/> <span className="font-bold">{novel.name}</span>
                </p>
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
