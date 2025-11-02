# ====================================================================
# ETAPA 1: BUILDER
# Utiliza una imagen Node completa para instalar dependencias y compilar.
# ====================================================================
FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de dependencias para aprovechar el caché de Docker
COPY package.json package-lock.json ./

# Instala las dependencias. Usa --production para ignorar devDependencies (aunque el 'build' las necesita)
# Para Vue CLI, necesitamos las devDependencies para compilar:
RUN npm install

# Copia el resto del código fuente
COPY . .

# Ejecuta el comando de compilación (crea la carpeta 'dist')
# NOTA: La variable de entorno PORT es inyectada por Cloud Run (por defecto 8080).
RUN npm run build

# ====================================================================
# ETAPA 2: PRODUCCIÓN (Servicio estático)
# Utiliza una imagen Nginx ligera y segura para servir los archivos finales.
# ====================================================================
FROM nginx:stable-alpine

# Mantenemos el puerto 8080 como estándar para Cloud Run
ENV PORT 8080
EXPOSE 8080

# Copia la configuración personalizada de Nginx para manejar el modo historial de Vue Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los artefactos de compilación (la carpeta 'dist') desde la etapa 'builder'
# al directorio de archivos estáticos de Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# El comando de inicio predeterminado de Nginx está bien, pero lo ajustamos para escuchar el puerto 8080
CMD ["nginx", "-g", "daemon off;"]