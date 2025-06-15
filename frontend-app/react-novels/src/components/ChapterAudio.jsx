import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { getOrCreateChapter } from "../api/api";
import { getNovel } from "../api/api";
import { useParams } from "react-router-dom";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { PiRepeatFill, PiShuffle } from "react-icons/pi";
import { HiMiniPause } from "react-icons/hi2";
import { useRef } from "react";

export default function ChapterAudio() {
  const [chapter, setChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { novelId, chapterId } = useParams();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [novel, setNovel] = useState([]);
  const [showFullText, setShowFullText] = useState(false);

  const loadNovel = async (novelId) => {
    const response = await getNovel(novelId);
    setNovel(response.data);
  };

  useEffect(() => {
    loadNovel(novelId);
  }, [novelId]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.audioEl.current.pause();
    } else {
      audioRef.current.audioEl.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const loadChapter = async (novelId, chapterId) => {
    if (!chapterId) {
      console.error("ID del capítulo no está definido");
      return;
    }
    try {
      const response = await getOrCreateChapter(novelId, chapterId);
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
      const response = await getOrCreateChapter(novelId, chapterId);
      setChapter(response.data);
    } catch (error) {
      console.error("Error cargando el capítulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const audio = audioRef.current.audioEl.current;
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

  useEffect(() => {
    loadChapter(novelId, chapterId);
  }, [novelId, chapterId]);

  if (loading) return <p>Cargando capítulo...</p>;
  if (!chapter) return <p>Capítulo no disponible.</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-6 bg-001425">
      {chapter.audio_url && (
        <ReactAudioPlayer
          src={chapter.audio_url}
          ref={audioRef}
          onListen={handleTimeUpdate}
          listenInterval={500} // actualiza cada 500ms
          className="mb-2 hidden"
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <div className="flex flex-col items-center justify-center bg-cyan-950 rounded-3xl shadow-2xl p-6 w-72 h-[420px] space-y-4">
        <img
          src={novel.image_url}
          alt={`Portada de ${novel.name}`}
          className="w-34 h-48 object-cover rounded-2xl border-4 border-cyan-700 shadow-lg"
        />

        <div className="flex flex-col items-center justify-center text-xl text-neutral-400">
          <div className="flex items-center gap-4">
            <div className="hover:text-neutral-100">
              <PiShuffle />
            </div>
            <div className="text-4xl hover:text-neutral-100">
              <BiSkipPrevious />
            </div>
            <button
              onClick={togglePlay}
              className="bg-cyan-700 text-white p-4 rounded-full text-5xl hover:scale-110 transition"
            >
              {isPlaying ? <HiMiniPause /> : <BsFillPlayFill />}
            </button>

            <div className="text-4xl hover:text-neutral-100">
              <BiSkipNext />
            </div>
            <div className="hover:text-neutral-100">
              <PiRepeatFill />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 w-full px-4">
            <span className="text-xs text-neutral-400 w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                if (audioRef.current) {
                  audioRef.current.audioEl.current.currentTime = newTime;
                }
                setCurrentTime(newTime);
              }}
              className="flex-grow accent-cyan-700"
            />
            <span className="text-xs text-neutral-400 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
      <div className="my-10 text-center bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-800 rounded-xl shadow-lg p-6 text-white w-full max-w-md flex flex-col flex-grow overflow-hidden">
        <h2 className="text-2xl font-semibold mb-2">{chapter.name}</h2>
        <div className="text-sm opacity-80 mb-4 overflow-y-auto leading-relaxed flex-grow pr-1">
          {chapter.text}
        </div>

        <div className="my-10 text-center bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-800 rounded-xl shadow-lg p-6 text-white w-full max-w-md flex flex-col flex-grow">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 font-sans">
            {chapter.name}
          </h2>

          <div
            className={`text-base sm:text-lg font-light leading-relaxed transition-all duration-300 ease-in-out text-left text-white font-sans ${
              showFullText
                ? "line-clamp-none max-h-[1000px]"
                : "line-clamp-3 max-h-24"
            } overflow-hidden mb-4`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {chapter.text}
          </div>

          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-sm text-cyan-300 hover:text-cyan-100 transition font-medium"
          >
            {showFullText ? "Ocultar texto ▲" : "Leer más ▼"}
          </button>
        </div>
      </div>
    </div>
  );
}
