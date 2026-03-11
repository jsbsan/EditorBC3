### 1. Prepara tu nuevo código

Asegúrate de que los cambios en tu aplicación estén listos y que el `Dockerfile` esté actualizado si has añadido nuevas dependencias.

### 2. Construye la imagen con un "Tag" de versión

Es una mala práctica usar siempre `latest`. Lo ideal es usar un sistema de versiones (como 1.1, 2.0, etc.).

Ejecuta el siguiente comando en la terminal (dentro de la carpeta de tu proyecto):

`docker build -t tu_usuario/nombre_app:v2 .`

> **Nota:** Sustituye `tu_usuario` por tu nombre en Docker Hub y `v2` por el número de versión que prefieras.

### 3. (Opcional) Actualiza el tag `latest`

Si quieres que esta nueva versión sea la que la gente descargue por defecto, debes ponerle también la etiqueta `latest`:

`docker tag tu_usuario/nombre_app:v2 tu_usuario/nombre_app:latest`

### 4. Inicia sesión en Docker Hub

Si no lo has hecho ya en esta sesión de terminal:

`docker login`

### 5. Sube tus cambios (Push)

Ahora, envía ambas etiquetas a la nube:

* `docker push tu_usuario/nombre_app:v2`
* `docker push tu_usuario/nombre_app:latest`

---

### Resumen del flujo de trabajo

| Paso | Acción | Comando sugerido |
| --- | --- | --- |
| **1** | Build | `docker build -t usuario/app:v2 .` |
| **2** | Re-tag | `docker tag usuario/app:v2 usuario/app:latest` |
| **3** | Push | `docker push usuario/app --all-tags` |

---

