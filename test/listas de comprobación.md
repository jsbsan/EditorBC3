## Carga y lectura de archivos BC3 
- [] Permite al usuario seleccionar y cargar un archivo con extensión .bc3 desde el navegador (usando input file o similar en index.html).  
- []Procesa correctamente archivos en formato FIEBDC-3 (estándar para bienes culturales/patrimonio en España).  
- [] Incluye un archivo de ejemplo funcional: CENZANO.bc3 (se puede cargar directamente para probar).  
- [] Interpreta los registros y estructura del formato BC3 (basado en la documentación incluida: 
        - []Formato-FIEBDC-3-2024.pdf y descripcion formato bc3.txt).  
		- [] Muestra el contenido cargado en la interfaz una vez parseado.

## Visualización jerárquica del contenido del archivo BC3  
- [] Muestra la estructura de datos del archivo en forma de árbol o listado jerárquico (capítulos, subcapítulos, partidas o elementos equivalentes en BC3).  
- [] Permite expandir y colapsar nodos para navegar por la jerarquía.  
- [] Al seleccionar un elemento del árbol, muestra sus detalles en paneles o secciones dedicadas (código, descripción, atributos, etc.).

## Edición de los datos del archivo BC3  
- [] Permite modificar el contenido de los elementos cargados (edición de campos como descripciones, códigos, valores, etc.).  
- [] Los cambios se aplican en memoria (se editan los datos parseados).  
- [] La interfaz refleja visualmente las modificaciones realizadas (actualiza el árbol y paneles en tiempo real o tras confirmación).

## Generación de reportes y listados mejorados  
- [] Genera listados y resúmenes del contenido del presupuesto/catalogo BC3.  
- [] Usa el archivo reports.js para crear estos reportes.  
- [] Incluye mejoras específicas en listados (commit explícito: "MEJORAS EN LISTADO").  
- [] Muestra los reportes en ventanas flotantes no modales (no bloquean la interfaz principal, permitiendo seguir editando mientras se visualiza el reporte).

## Uso de ventanas flotantes (no modales y posiblemente modales)  
- [] Abre ventanas emergentes flotantes para mostrar:
    - Reportes generados.  
    - Detalles ampliados de elementos.  
    - Posiblemente formularios de edición o confirmaciones.

- [] Estas ventanas son no modales en muchos casos (commit: "MEJORAS EN LISTADO Y VENTANAS NO MODALES"), lo que significa que el usuario puede interactuar con el resto de la app mientras están abiertas.  
- [] Estilizadas con CSS moderno (sombras, posicionamiento, etc., gracias a style.css con commit "modo ventanas flotantes").

## Botón "Acerca de..."
- [] Existe un botón o enlace en la interfaz que abre información sobre el programa.  
- [] Muestra datos como:
	- Nombre del proyecto (Editor de fichero BC3).  
	- Autor (jsbsan).  
	- Versión actual.  
	- Licencia (GNU GPL-3.0).  
	- Posiblemente créditos o enlaces.

- [] Implementado recientemente (commit en app.js e index.html: "añadido botón acerca de...").

## Interfaz gráfica completa basada en web  
- [] Se ejecuta directamente en cualquier navegador moderno abriendo index.html (no requiere servidor).  
- [] Usa HTML + CSS + JavaScript puro (sin frameworks pesados).  
- [] Distribución de lenguajes: ~73% JavaScript, ~26% HTML, ~1% CSS.  
- [] Estilos personalizados en style.css (incluye modo ventanas flotantes y mejoras visuales).  
- [] Interfaz dividida en secciones: barra superior/herramientas, árbol/listado principal, paneles de detalles, área para reportes/ventanas.

## Acceso a documentación integrada  
- [] Incluye dentro del repositorio (y accesible desde el proyecto):  
	- Formato-FIEBDC-3-2024.pdf → estándar oficial.  
	- descripcion formato bc3.txt → explicación textual del formato.

- [] El programa está diseñado para trabajar estrictamente con este estándar.

## Licencia y distribución
- [] Todo el código está bajo GNU GPL v3 (archivo LICENSE completo).  
- [] Permite uso, modificación y redistribución libre (con las obligaciones de GPL).


