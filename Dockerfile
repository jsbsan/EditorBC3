# Usamos una imagen oficial y muy ligera de Nginx
FROM nginx:alpine

# Copiamos todos los archivos de tu directorio actual al directorio que Nginx usa para servir webs
COPY . /usr/share/nginx/html

# Exponemos el puerto 80 (el puerto por defecto de HTTP)
EXPOSE 80