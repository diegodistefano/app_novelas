import logging
import requests
import re

logging.basicConfig(
    filename='novela.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

URL = "http://localhost:5000/translate"
GLOSSARY = {
    # "tapping": "golpeteo",
    # "soldering iron": "soldador de estaño",
    # añade aquí cuantos términos técnicos o modismos quieras fijar…
}


def chunk_text(text, max_chars=500):
    """
    Divide el texto en trozos de ≤ max_chars sin cortar oraciones.
    """
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks, current = [], ""
    for s in sentences:
        if len(current) + len(s) + 1 <= max_chars:
            current += (" " if current else "") + s
        else:
            chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks


def translate_chunk(chunk, model="m2m100_1.2B"):
    """
    Traduce un solo fragmento, incluyendo todos los parámetros extra.
    """
    payload = {
        "q": chunk,
        "source": "en",
        "target": "es",
        "format": "text",
        "model": model,                 # prueba "opus_mt" o "m2m100_418M" o "m2m100_1.2B"
        "preserve_formatting": True,    # mantiene saltos de línea, negritas…
        "glossary": GLOSSARY
    }
    params = {
        "beam_size": 8,         # mejora fluidez
        "length_penalty": 0.6,  # favorece reordenaciones más libres
        "split_sentences": False
    }
    try:
        logging.info(
            "Enviando chunk a LibreTranslate (len=%d): %s", len(chunk), chunk)
        resp = requests.post(URL, json=payload, params=params, timeout=30)
        logging.info("Respuesta %s: %s", resp.status_code, resp.text)
        resp.raise_for_status()
        data = resp.json()
        return data.get("translatedText", chunk)
    except Exception:
        logging.exception("Error al traducir el chunk")
        return chunk


def translate_txt_file(input_path, output_path):
    try:
        # 1) Leemos el texto completo
        with open(input_path, 'r', encoding='utf-8') as f:
            text = f.read()

        # 2) Lo troceamos para mejor coherencia
        chunks = chunk_text(text, max_chars=500)

        # 3) Traducimos cada chunk y los unimos
        translated_chunks = [translate_chunk(c) for c in chunks]
        full_translated = "\n\n".join(translated_chunks)

        # 4) Guardamos el resultado
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_translated)

        return full_translated

    except Exception:
        logging.exception("Error al traducir el archivo completo")
        return None


if __name__ == "__main__":
    res = translate_txt_file('prueba-libre-translate/text.txt',
                             'prueba-libre-translate/trad_text_12b.txt')
    if res:
        print("✅ Traducción completada y guardada.")
    else:
        print("❌ Hubo un error; revisa novela.log.")
