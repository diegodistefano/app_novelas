import React from 'react'
import { Link } from 'react-router'
import { useParams } from "react-router-dom";
import Finder from './Finder'
import MobileMenu from './MobileMenu'

export default function Header() {
  const { id: novelId } = useParams();
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-cyan-900 bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900">
      <MobileMenu />
      <nav className="py-4 mb-6 bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900 shadow-md md:flex hidden">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 max-w-md">
          <Link
            to={`/`}
            className="text-3xl font-extrabold text-cyan-400 tracking-wide hover:text-cyan-200 transition-colors duration-300"
          >
            Novelas App
          </Link>
          <Finder />
        </div>
      </nav>
    </header>
  )
}
