import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { getOrCreateChapter, getNovel, getChaptersByNovel } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { HiMiniPause } from "react-icons/hi2";
import { BiArrowBack } from "react-icons/bi";
import { useRef } from "react";

export default function ChapterAudio() {
  const navigate = useNavigate();

  const { novelId, chapterId } = useParams();
  const audioRef = useRef(null);

  const [chapter, setChapter] = useState(null);
  const [chaptersList, setChaptersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [novel, setNovel] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);

  const loadNovel = async (novelId) => {
    const response = await getNovel(novelId);
    setNovel(response.data);
  };

  const loadChaptersList = async (novelId) => {
    const response = await getChaptersByNovel(novelId);
    setChaptersList(response.data);
  };

  useEffect(() => {
    loadNovel(novelId);
    loadChaptersList(novelId);
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

  const handleNextChapter = async () => {
    if (!chaptersList.length) return;
    const currentIndex = chaptersList.findIndex(
      (c) => c.id.toString() === chapterId.toString()
    );
    if (currentIndex < chaptersList.length - 1) {
      const nextChapter = chaptersList[currentIndex + 1];
      setIsLoadingNext(true);
      setShowExtendedMessage(false);

      const timeout = setTimeout(() => {
        setShowExtendedMessage(true);
      }, 5000);

      try {
        await getOrCreateChapter(novelId, nextChapter.id);
        navigate(`/novels/${novelId}/chapters/${nextChapter.id}`);
        setIsPlaying(false);
      } catch (error) {
        console.error("Error cargando el siguiente capítulo:", error);
      } finally {
        setIsLoadingNext(false);
        setShowExtendedMessage(false);
      }
    }
  };

  const handlePreviousChapter = () => {
    if (!chaptersList.length) return;

    const currentIndex = chaptersList.findIndex(
      (c) => c.id.toString() === chapterId.toString()
    );
    if (currentIndex > 0) {
      const prevChapter = chaptersList[currentIndex - 1];
      navigate(`/novels/${novelId}/chapters/${prevChapter.id}`);
      setIsPlaying(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-cyan-500"></div>
        <p className="text-cyan-400 font-bold text-3xl w-4/5 text-center">
          Cargando capítulo...
          <br />
          {showExtendedMessage && (
            <>
              <br />
              ¡Felicidades, sos la primera persona en escuchar este capítulo!
              <br />
              Tené un poco de paciencia, porque va a valer la pena.
              <br />
              Una vez que esperás por un capítulo nuevo,
              <br />
              el siguiente se carga más rápido.
            </>
          )}
        </p>
      </div>
    );
  }
  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <p className="text-cyan-400 font-bold text-3xl w-4/5 text-center">
          Capítulo no disponible.
        </p>
      </div>
    );
  }

  if (isLoadingNext) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-cyan-500"></div>
        <p className="text-cyan-400 font-bold text-2xl w-4/5 text-center leading-relaxed">
          Cargando un nuevo capítulo...
          <br />
          {showExtendedMessage && (
            <>
              <br />
              ¡Felicidades, sos la primera persona en escuchar este capítulo!
              <br />
              Tené un poco de paciencia, porque va a valer la pena.
              <br />
              Una vez que esperás por un capítulo nuevo,
              <br />
              el siguiente se carga más rápido.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-6 bg-001425">
      <button
        onClick={() => navigate(`/novels/${novelId}/`)}
        className="absolute mt-4 ml-2 top-4 left-4 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 active:text-cyan-500 text-lg font-semibold transition-colors"
      >
        <BiArrowBack className="text-2xl" />
        {`${novel.name}`}
      </button>
      {chapter.audio_url && (
        <ReactAudioPlayer
          src={chapter.audio_url}
          ref={audioRef}
          onListen={handleTimeUpdate}
          listenInterval={500}
          className="mb-2 hidden"
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-800 rounded-3xl shadow-2xl p-3 w-72 h-[420px] space-y-6">
        <img
  src={novel.image_url}
  alt={`Portada de ${novel.name}`}
  className="w-36 h-52 object-cover rounded-2xl shadow-lg animate-spinY"
/>

        <div className="flex flex-col items-center justify-center text-xl text-neutral-400">
          <div className="flex items-center gap-4">
            <div
              className="text-4xl hover:text-neutral-100 active:text-cyan-500 font-semibold transition-colors"
              onClick={handlePreviousChapter}
            >
              <BiSkipPrevious />
            </div>
            <button
              onClick={togglePlay}
              className="bg-cyan-700 text-white active:text-cyan-950 p-4 rounded-full text-5xl hover:scale-110 transition"
            >
              {isPlaying ? <HiMiniPause /> : <BsFillPlayFill />}
            </button>

            <div
              className="text-4xl hover:text-neutral-100 active:text-cyan-500 font-semibold transition-colors"
              onClick={handleNextChapter}
            >
              <BiSkipNext />
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

      <div className={`my-10 text-center ${
            showFullText ? "bg-04161b" : "bg-cyan-900"
          } rounded-xl shadow-lg p-6 text-white w-full max-w-md flex flex-col`}>
        <h2 className="text-2xl font-semibold mb-2">{chapter.name}</h2>
        <div
          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed transition-all duration-300 ease-in-out text-left text-white font-sans ${
            showFullText ? "" : "line-clamp-3 max-h-24"
          } overflow-hidden mb-4`}
        >
          {chapter.text}
        </div>

        <button
          onClick={() => setShowFullText(!showFullText)}
          className="text-lg text-cyan-400 hover:text-cyan-200 transition font-medium"
        >
          {showFullText ? "Ocultar texto ▲" : "Leer más ▼"}
        </button>
      </div>
    </div>
  );
}
