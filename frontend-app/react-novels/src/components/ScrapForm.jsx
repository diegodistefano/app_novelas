import axios from "axios";
import { useState } from "react";
import { postScrapeURL } from "../api/api";


export default function ScrapForm() {

    const [url, setUrl] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus("Procesando...");

      try {
        // Limpiar la url almacenada en el estado (no el DOM directamente)
        let valor = url.replace(/https:\/\/www\.royalroad\.com/gi, "").trim();

        // Opcional: actualizar el input con el valor limpio
        setUrl(valor);

        // Usar el valor limpio para enviar la petición
        const response = await postScrapeURL(valor);

        setStatus(response.data.msg || "Scraping completado");
      } catch (err) {
        setStatus("Error: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-cyan-800">Ingresar URL de la novela</h2>
      
      <form id="scrap-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          id="scrap-input"
          type="text"
          placeholder="https://www.royalroad.com/fiction/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded p-2"
          required
        />

        <button
          type="submit"
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 flex justify-center items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading && (
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-60"></span>
          )}
          {loading ? "Procesando..." : "Cargar novela"}
        </button>
      </form>

      {status && (
        <p className={`text-sm mt-2 text-center ${status.startsWith("Error") ? "text-red-600" : "text-cyan-700"}`}>
          {status}
        </p>
      )}
    </div>
  );
}