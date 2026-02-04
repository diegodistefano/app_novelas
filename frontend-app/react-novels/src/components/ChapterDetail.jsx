import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChapter } from "../api/api"; 

export default function ChapterDetail() {
  const { NovelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await getChapter(NovelId, chapterId);
        setChapter(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [NovelId, chapterId]);

  if (loading) return <p>Cargando capítulo...</p>;
  if (!chapter) return <p>Capítulo no disponible.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{chapter.name}</h2>
      <p className="mt-2">{chapter.text}</p>
      {chapter.audio_url && (
        <audio controls className="mt-4">
          <source src={chapter.audio_url} type="audio/mpeg" />
          Tu navegador no soporta audio.
        </audio>
      )}
    </div>
  );
}
