import React from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Finder = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/search-novels/?q=${encodeURIComponent(query)}`)
            setResults(response.data);
        } catch (error) {
            console.error("Error searching: ", error);
        }
    };

  return (
    <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar novela..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-l-lg border border-cyan-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleSearch}
            className="bg-cyan-600 text-white px-4 py-2 rounded-r-lg hover:bg-cyan-700"
          >
            <FaSearch />
          </button>
              {/* Mostrar resultados */}
      <ul className="mt-4 space-y-2">
        {results.map((novel_list, i) => (
          <li key={i} className="bg-cyan-900 text-white p-3 rounded">
            {novel_list.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Finder