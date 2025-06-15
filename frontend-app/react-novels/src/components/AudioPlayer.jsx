import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { getOrCreateChapter } from "../api/api";
import { useParams } from "react-router-dom";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { PiRepeatFill, PiShuffle } from "react-icons/pi";
import { HiMiniPause } from "react-icons/hi2";

export default function AudioPlayer(novelId, chapterId) {
  const audioRef = useRef(null);
  const [chapter, setChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { novelId, chapterId } = useParams();

  const loadChapter = async (novelId, chapterId) => {
    if (!chapterId) {
      console.error("ID del capítulo no está definido");
      return;
    }
    try {
      const response = await getOrCreateChapter(novelId, chapterId); // ← CAMBIO
      setChapter(response.data);
    } catch (error) {
      console.error("Error cargando el capítulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNextChapter = async (novelId, chapterId) => {
    if (!chapterId) {
      console.error("ID del capítulo no está definido");
      return;
    }
    try {
      const response = await getOrCreateChapter(novelId, chapterId); // ← CAMBIO
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
    <div>
      {chapter.audio_url && (
        <ReactAudioPlayer src={chapter.audio_url} controls className="mb-2" />
      )}
      <p>Hola, {audioUrl} </p>
      <div className="flex flex-col items-center justify-center text-xl text-neutral-400">
        <div className="flex items-center gap-4">
          <div className="hover:text-neutral-100">
            <PiShuffle />
          </div>
          <div className="text-4xl hover:text-neutral-100">
            <BiSkipPrevious />
          </div>
          <div className="bg-neutral-100 text-neutral-900 p-2 rounded-full aspect-square text-2xl hover:scale-105">
            {chapter.audio_url && (
              <BsFillPlayFill
                src={chapter.audio_url}
                controls
                className="mb-2"
              />
            )}
          </div>
          <div className="text-4xl hover:text-neutral-100">
            <BiSkipNext />
          </div>
          <div className="hover:text-neutral-100">
            <PiRepeatFill />
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 w-4/5">
          <span className="text-xs text-neutral-400">1:00</span>
          <input type="range" defaultValue={25} />
          <span className="text-xs text-neutral-400">4:24</span>
        </div>
      </div>
    </div>
  );
}
