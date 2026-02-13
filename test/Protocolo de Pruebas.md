### Protocolo de Pruebas Paso a Paso para EditorBC3

Este protocolo está diseñado para probar **solo las funcionalidades confirmadas** en el código actual del repositorio (basado en commits hasta la fecha actual, febrero 2026). Asume que tienes un navegador moderno (Chrome, Firefox, etc.) y Git instalado para clonar el repo. Cada sección prueba una funcionalidad específica, con pasos secuenciales, lo que esperas ver (criterios de éxito) y posibles fallos comunes a notar.

#### Preparación General (Antes de cualquier prueba)
1. Clona el repositorio: Abre una terminal y ejecuta `git clone https://github.com/jsbsan/EditorBC3.git`.
2. Navega a la carpeta: `cd EditorBC3`.
3. Abre el archivo principal: En tu navegador, abre `index.html` (doble-clic o arrastrar al navegador). Deberías ver la interfaz básica: barra de herramientas, área para el árbol/listado, paneles de detalles y posiblemente botones como "Abrir", "Reportes", etc.
4. Descarga el archivo de ejemplo: El repo incluye `CENZANO.bc3` en la raíz o en una subcarpeta; asegúrate de que esté disponible para cargar.

**Criterio de éxito**: La página carga sin errores en consola (presiona F12 para ver la consola del navegador). Si hay errores de JS, nota el mensaje (e.g., problemas con paths de archivos).

#### 1. Prueba de Carga y Lectura de Archivos BC3
   - **Objetivo**: Verificar que carga y procesa un archivo .bc3 correctamente.
1. En la interfaz, busca y haz clic en el botón o input para "Abrir" o "Cargar" archivo (probablemente un `<input type="file">` en la barra superior).
2. Selecciona el archivo `CENZANO.bc3` desde tu disco local.
3. Confirma la carga (puede haber un botón "Aceptar" o se carga automáticamente).
4. Observa si el árbol/listado principal se popula con datos (e.g., capítulos como "Obra Civil", códigos como "CAP01").
5. Verifica en consola (F12) si hay logs de parsing (e.g., "Archivo cargado exitosamente").
6. Intenta cargar un archivo no-BC3 (e.g., un .txt vacío) para ver manejo de errores (debería mostrar alerta o ignorar).

**Criterio de éxito**: El archivo se carga, el árbol muestra la estructura jerárquica (e.g., nodos con códigos y descripciones). No hay crashes; errores se manejan con mensajes.
**Fallos comunes**: Si el archivo es grande, podría tardar; nota si hay timeout o freeze.

#### 2. Prueba de Visualización Jerárquica del Contenido
   - **Objetivo**: Confirmar que muestra y navega la estructura en árbol.
1. Carga `CENZANO.bc3` como en la prueba 1.
2. En el área del árbol (probablemente #tree o similar), haz clic en un nodo raíz (e.g., un capítulo principal).
3. Expande el nodo: Debería mostrar subnodos (subcapítulos o partidas).
4. Colapsa el nodo: Los subnodos desaparecen.
5. Selecciona un nodo hoja (e.g., una partida específica con código como "P01.01").
6. Verifica que los paneles laterales/derechos se actualicen: Muestra código, unidad (e.g., "m²"), resumen (descripción corta), precio, descompuestos (si aplica), y texto descriptivo (~T).
7. Navega a diferentes niveles: Expande/colapsa múltiples nodos y selecciona varios.

**Criterio de éxito**: El árbol responde a clics, expande/colapsa sin lag, y la selección actualiza paneles con datos precisos del BC3 (verifica contra el contenido manual del archivo .bc3 abriéndolo en un editor de texto).
**Fallos comunes**: Si hay muchos niveles, nota si el scroll funciona; verifica iconos (si los hay) para tipos de nodos.

#### 3. Prueba de Edición de los Datos del Archivo BC3
   - **Objetivo**: Verificar que permite modificar datos y refleja cambios.
1. Carga `CENZANO.bc3`.
2. Selecciona un nodo en el árbol (e.g., una partida editable).
3. En los paneles de detalles, busca campos editables (e.g., input para resumen, descripción, valores numéricos).
4. Modifica un campo simple: Cambia el resumen de "Pavimento de hormigón" a "Pavimento de hormigón MODIFICADO".
5. Confirma el cambio (puede haber un botón "Guardar" o se aplica en enter).
6. Verifica que el árbol se actualice: El nodo muestra el nuevo resumen.
7. Modifica un descompuesto (si visible): Cambia una cantidad o precio en la lista de descompuestos.
8. Navega a otro nodo y regresa: El cambio debe persistir en memoria.
9. Intenta editar un campo no editable (e.g., código raíz) para ver si lo permite o bloquea.

**Criterio de éxito**: Cambios se aplican y se ven en el árbol/paneles. No hay pérdida de datos al navegar.
**Fallos comunes**: Nota si hay validaciones (e.g., no permite números negativos en precios); si no guarda en archivo, confirma que es solo en memoria.

#### 4. Prueba de Generación de Reportes y Listados Mejorados
   - **Objetivo**: Confirmar que genera y muestra reportes.
1. Carga `CENZANO.bc3`.
2. Busca y haz clic en el botón "Reportes" o "Generar Listado" (probablemente en la barra de herramientas).
3. Selecciona un tipo de reporte (si hay opciones; basado en commits, incluye "MEJORAS EN LISTADO").
4. Espera a que se genere: Debería abrir una ventana flotante con el reporte (e.g., tabla con códigos, descripciones, precios).
5. Verifica contenido: Compara con datos del árbol (e.g., suma de importes, descompuestos agrupados).
6. Cierra la ventana y genera otro reporte para ver si se acumulan o reemplazan.

**Criterio de éxito**: Reporte se muestra en ventana flotante, con datos precisos y formateados (e.g., tablas HTML). Incluye mejoras como listados detallados.
**Fallos comunes**: Si el reporte es grande, nota si scrolla bien; verifica si incluye todos los registros (~C, ~D, etc.).

#### 5. Prueba de Uso de Ventanas Flotantes (No Modales)
   - **Objetivo**: Verificar que las ventanas son flotantes y no bloquean.
1. Genera un reporte como en la prueba 4: Abre la ventana flotante.
2. Mientras la ventana está abierta, interactúa con la interfaz principal: Selecciona otro nodo en el árbol, edita un campo.
3. Mueve la ventana: Si es draggable (basado en CSS "modo ventanas flotantes"), arrástrala por la pantalla.
4. Abre múltiples ventanas: Genera otro reporte; deberían coexistir sin bloquearse.
5. Cierra una ventana: Haz clic en cerrar (X) y verifica que desaparece sin afectar el resto.

**Criterio de éxito**: Ventanas no modales (puedes editar mientras abiertas), flotantes (posicionables), y estilizadas (sombras, etc.).
**Fallos comunes**: Nota si se superponen mal o si cierran accidentalmente al clic fuera.

#### 6. Prueba del Botón "Acerca de..."
   - **Objetivo**: Confirmar que muestra info del programa.
1. En la interfaz, busca y haz clic en el botón "Acerca de..." (probablemente en la barra o menú).
2. Observa la ventana o modal que abre: Debería mostrar texto como "Editor de fichero BC3", autor "jsbsan", versión, licencia GPL-3.0.
3. Verifica enlaces (si hay): e.g., a GitHub o PDF de formato.
4. Cierra la ventana y reabre para consistencia.

**Criterio de éxito**: Muestra info correcta sin errores.
**Fallos comunes**: Si no abre, revisa consola por JS errors.

#### 7. Prueba de la Interfaz Gráfica Completa Basada en Web
   - **Objetivo**: Verificar usabilidad general.
1. Abre `index.html` en diferentes navegadores (Chrome, Firefox).
2. Redimensiona la ventana: Verifica si layout se adapta (CSS debería manejar flex/grid).
3. Prueba en modo oscuro/claro (si el navegador lo fuerza; CSS tiene estilos básicos).
4. Verifica distribución: Barra superior, árbol izquierdo, paneles derechos.
5. Interactúa globalmente: Combina carga, edición, reportes.

**Criterio de éxito**: Interfaz responsive básica, sin crashes en resize.
**Fallos comunes**: Errores en mobile (prueba en vista móvil del navegador).

#### 8. Prueba de Acceso a Documentación Integrada
   - **Objetivo**: Confirmar acceso a docs.
1. En el repo local, abre `Formato-FIEBDC-3-2024.pdf` y `descripcion formato bc3.txt`.
2. En la app (si integrada), busca enlaces o botones que referencien estos (e.g., en "Acerca de...").
3. Verifica que la app parsea BC3 conforme a estos docs (cruza con prueba 1).

**Criterio de éxito**: Docs accesibles; parsing coincide con formato descrito.
**Fallos comunes**: PDF no abre si no tienes lector.

#### 9. Prueba de Licencia y Distribución
   - **Objetivo**: Verificar cumplimiento GPL.
1. Abre `LICENSE` en el repo: Confirma texto GPL-3.0.
2. Modifica código (e.g., añade log en `app.js`) y recarga `index.html`: Verifica que funciona (permite mods).
3. Nota: No hay releases; prueba clonando y usando directamente.

**Criterio de éxito**: Licencia visible y app modifiable.
**Fallos comunes**: N/A, es estática.

**Notas finales del protocolo**: Registra resultados en una tabla (e.g., Prueba #, Pasó/Falló, Notas). Si encuentras bugs, reporta en GitHub issues. Prueba en diferentes OS/navegadores para robustez. Tiempo estimado: 30-60 min. Si necesitas ajustes, dime.
