# Dockerfile para frontend-empresa, frontend-personal, admin-empresa, admin-personal
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo package.json
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]