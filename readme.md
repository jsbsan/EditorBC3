# 🏗️ EditorBC3

Editor y visor web de código abierto para archivos de presupuestos y bases de datos de la construcción en el formato estándar español **FIEBDC-3 (.bc3)**.

Esta herramienta está diseñada para ser ligera y ejecutarse íntegramente en el navegador del cliente (Frontend), lo que garantiza que los archivos de presupuestos privados nunca se suban a servidores externos.

## ✨ Características Principales

* **🌳 Visualización jerárquica:** Navegación fluida por el árbol del presupuesto (capítulos, subcapítulos y partidas).
* **📖 Lectura nativa del estándar:** Soporte para interpretar la estructura FIEBDC-3, basándose en las especificaciones más recientes (incluyendo la revisión 2024).
* **📄 Generación de informes:** Módulo integrado (`reports.js`) para preparar vistas de impresión o exportación de datos de manera limpia y profesional.
* **🔒 Privacidad por diseño:** Procesamiento 100% local mediante JavaScript; tus datos no abandonan tu ordenador.
* **🚀 Despliegue ágil:** Preparado para ejecutarse como un simple archivo de texto o levantarse mediante contenedores Docker.

## 🛠️ Tecnologías Utilizadas

* 🌐 **HTML5**
* 🎨 **CSS3** (Estilos nativos en `style.css`)
* ⚡ **Vanilla JavaScript** (Lógica principal en `app.js` y `reports.js`)
* 🐳 **Docker y Docker Compose** (Para despliegue en servidores)

## ⚙️ Instalación y Despliegue

Puedes ejecutar este proyecto de dos maneras distintas, dependiendo de tus necesidades:

### 🏠 Opción A: Ejecución local (Uso rápido)

1. Clona este repositorio o descarga el código en formato `.zip`.
2. Descomprime los archivos en una carpeta local.
3. Haz doble clic sobre el archivo `index.html`.
4. La aplicación se abrirá directamente en tu navegador web predeterminado (Chrome, Firefox, Edge, Safari).

### 🐳 Opción B: Despliegue con Docker (Recomendado para servidores)

1. Asegúrate de tener Docker y Docker Compose instalados en tu máquina.
2. Abre una terminal y navega hasta la carpeta raíz del proyecto.
3. Ejecuta el comando `docker-compose up -d` para levantar el contenedor en segundo plano.
4. Accede a la aplicación abriendo tu navegador y visitando `http://localhost` (o el puerto que hayas configurado).

## 🧪 Datos de Prueba

Para que puedas comprobar el funcionamiento de la herramienta de inmediato, el repositorio incluye un archivo de presupuesto de ejemplo.

* 📂 Carga el archivo **`CENZANO.bc3`** desde la interfaz web de la aplicación para explorar la estructura de capítulos y partidas.

## 👤 Autor

* Julio Sánchez Berro - **jsbsan** - *Desarrollador principal* - [Perfil de GitHub](https://github.com/jsbsan)

## ⚖️ Licencia

Este proyecto está licenciado bajo los términos de la **GNU General Public License v3.0 (GPL-3.0)**.
Eres libre de usar, estudiar, compartir y modificar este software, siempre y cuando las versiones modificadas se distribuyan bajo esta misma licencia libre.
