import React, { useEffect, useState } from "react";
import ReactAudioPlayer from 'react-audio-player';
import { getChapter } from "../api/api";
import { useParams } from "react-router-dom";

export default function ChapterAudio() {
  const [chapter, setChapter] = useState(null);  // Empieza como null porque es un objeto

  const { novelId, chapterId } = useParams();

  const loadChapter = async (novelId, chapterId) => {
    if (!chapterId) {
      console.error("ID del capítulo no está definido");
      return;
    }
    try {
      const response = await getChapter(novelId, chapterId);
      setChapter(response.data);
    } catch (error) {
      console.error("Error cargando el capítulo:", error);
    }
  };

  useEffect(() => {
    loadChapter(novelId, chapterId);
  }, [novelId, chapterId]);


  if (!chapter) return <p>Cargando capítulo...</p>;

  return (
<div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-6 bg-white">
  <h1 className="text-4xl font-extrabold text-cyan-700 mb-4 text-center tracking-wide">
    🎧 Audio
  </h1>
    {/* Reproductor de audio grande y centrado */}
    {chapter.audio_url && (
      <ReactAudioPlayer
        src={chapter.audio_url}
        controls
        className="mb-2"
      />
    )}

  <div className="text-center bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl shadow-lg p-6 text-white w-full max-w-md flex flex-col flex-grow overflow-hidden">
    
    {/* Título capítulo */}
    <h2 className="text-2xl font-semibold mb-2">{chapter.name}</h2>

    {/* Texto del capítulo con scroll vertical */}
    <div className="text-sm opacity-80 mb-4 overflow-y-auto leading-relaxed flex-grow pr-1">
      {chapter.text}
    </div>


    {/* ID u otra info pequeña debajo */}
    <p className="mt-2 text-xs text-cyan-300 text-center select-none">
      Capítulo: {chapter.id}
    </p>
  </div>
</div>


  );
}
