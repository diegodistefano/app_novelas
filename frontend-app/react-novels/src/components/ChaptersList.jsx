import React, { useEffect, useState } from "react";
import { getChaptersByNovel, postChapterURL} from "../api/api";
import { useParams, useNavigate } from "react-router-dom";




export default function ChaptersList() {

    const [chapters, setChapters] = useState([])
    const [status, setStatus] = useState([])
    const [loading, setLoading] = useState(false);
    const { id: novelId } = useParams();
    const navigate = useNavigate();

    const loadChapters = async() => {
        const response = await getChaptersByNovel(novelId)
        setChapters(response.data)
    }
    
    useEffect(() => {
        loadChapters()
    }, []);

    return (
        <div className="mt-8 px-4 sm:px-6 max-w-md mx-auto">
            <h1 className="text-3xl font-extrabold text-cyan-900 mb-6">
                Capítulos disponibles
            </h1>

            <div className="grid grid-cols-1 gap-6">
                {chapters.map((chapter) => (
                <div
                    key={chapter.id}
                    className="bg-cyan-900 rounded-lg shadow-lg p-6 flex flex-col justify-between"
                >
                    <div>
                    <p className="text-cyan-300 text-sm mb-1">ID: {chapter.id}</p>
                    <p className="text-white font-semibold text-lg">
                        Capítulo: <span className="font-bold">{chapter.name}</span>
                    </p>
                    </div>

                    <button
                        onClick={() => navigate(`chapters/${chapter.id}/`)}
                        // onClick={() => handleChapterClick(chapter.id, chapter.chapter_url)}
                        className="mt-6 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-300 w-full"
                        aria-label={`Escuchar capítulo ${chapter.name}`}
                    >
                        Escuchar capítulo
                    </button>
                </div>
                ))}
            </div>
        </div>

    )
}