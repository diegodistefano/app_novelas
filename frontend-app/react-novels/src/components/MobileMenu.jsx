import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; 
import Finder from "./Finder";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-cyan-950 text-white px-4 py-3 flex justify-between items-center md:hidden">
      <h1 className="text-xl font-bold">
        <Link to={`novels/`} >Novelas App</Link>
      </h1>

      <button onClick={toggleMenu} className="text-white focus:outline-none">
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-cyan-900 shadow-lg z-10">
          <ul className="flex flex-col space-y-3 p-4 text-base font-medium">
            <li className="p-6">
              <Finder />
            </li>
            <li>
              <Link to={`novels/`}>📚 Lista de Novelas</Link>
            </li>
            <li>
              <Link to={`scrap/`} onClick={toggleMenu}>🎧 Cargar novela</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
