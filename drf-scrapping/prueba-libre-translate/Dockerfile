FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# 1. Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    git-lfs \
    curl \
    python3 \
    python3-pip \
    python3-dev \
    build-essential

# 2. Inicializar git-lfs y clonar modelo
RUN git lfs install && \
    git clone https://huggingface.co/facebook/m2m100_1.2B /app/models/m2m100_1.2B

# 3. Instalar LibreTranslate
RUN pip install libretranslate==1.3.7

# 4. Copiar script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh

# 5. Exponer puerto
EXPOSE 5000

# 6. Comando al iniciar el contenedor
CMD ["/start.sh"]
