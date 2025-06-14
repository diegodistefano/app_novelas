import React, { useEffect, useState } from "react";
import ReactAudioPlayer from 'react-audio-player';
import { getOrCreateChapter } from "../api/api";
import { useParams } from "react-router-dom";

export default function ChapterAudio() {
  const [chapter, setChapter] = useState(null);  
  const [loading, setLoading] = useState(true);
  const { novelId, chapterId } = useParams();

  // const loadChapter = async (novelId, chapterId) => {
  //   if (!chapterId) {
  //     console.error("ID del capítulo no está definido");
  //     return;
  //   }
  //   try {
  //     const response = await getChapter(novelId, chapterId);
  //     setChapter(response.data);
  //   } catch (error) {
  //     console.error("Error cargando el capítulo:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const loadChapter = async (novelId, chapterId) => {
    if (!chapterId) {
      console.error("ID del capítulo no está definido");
      return;
    }
    try {
      const response = await getOrCreateChapter(novelId, chapterId);  // ← CAMBIO
      setChapter(response.data);
    } catch (error) {
      console.error("Error cargando el capítulo:", error);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    loadChapter(novelId, chapterId);
  }, [novelId, chapterId]);

  if (loading) return <p>Cargando capítulo...</p>;
  if (!chapter) return <p>Capítulo no disponible.</p>;

  return (
<div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-6 bg-white">
  <h1 className="text-4xl font-extrabold text-cyan-700 mb-4 text-center tracking-wide">
    🎧 Audio
  </h1>
    {chapter.audio_url && (
      <ReactAudioPlayer
        src={chapter.audio_url}
        controls
        className="mb-2"
      />
    )}

  <div className="text-center bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl shadow-lg p-6 text-white w-full max-w-md flex flex-col flex-grow overflow-hidden">
    <h2 className="text-2xl font-semibold mb-2">{chapter.name}</h2>
    <div className="text-sm opacity-80 mb-4 overflow-y-auto leading-relaxed flex-grow pr-1">
      {chapter.text}
    </div>
    <p className="mt-2 text-xs text-cyan-300 text-center select-none">
      Capítulo: {chapter.id}
    </p>
  </div>
</div>
  );
}
