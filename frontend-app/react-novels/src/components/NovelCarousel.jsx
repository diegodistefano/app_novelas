import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNovels } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function NovelCarousel() {
  const [index, setIndex] = useState(0);
  const [novels, setNovels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const response = await getAllNovels();
        setNovels(response.data.sort((a, b) => a.id - b.id).slice(0, 5));
      } catch (error) {
        console.error("Error al cargar novelas:", error);
      }
    };
    loadNovels();
  }, []);

  useEffect(() => {
    if (novels.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % novels.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [novels]);

  const current = novels[index];

  if (!current) return null;

  return (
    <div className="h-[30vh] w-full overflow-hidden rounded-xl flex items-center justify-center transition-transform duration-700 ease-in-out">
      <AnimatePresence mode="wait">
        {novels.length > 0 && (
          <motion.div
            key={novels[index].id}
            className="grid grid-cols-2 w-full h-full gap-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            // style={{
            //   background:
            //     "linear-gradient(to right, rgba(4, 22, 27, 0) 0%, rgba(4, 22, 27, 1) 100%)",
            // }}
          >

            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg text-white p-0 m-0">
              <img
                src={novels[index].image_url}
                alt={novels[index].name}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            </div>

            <div className="flex flex-col justify-between text-white h-full text-left py-2 pr-2">
              <h2
                className="text-xl font-bold text-white"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {novels[index].name}
              </h2>

              <p className="text-sm py-1">
                Capítulos:{" "}
                <span className="font-semibold">
                  {novels[index].chapters.length}
                </span>
              </p>

              <div className="flex-grow overflow-hidden">
                <p
                  className="font-bold text-sm text-white overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 7,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {novels[index].synopsis}
                </p>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => navigate(`/novels/${novels[index].id}/`)}
                  className="text-lg font-bold text-cyan-200 hover:text-white transition"
                >
                  Ver más...
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
