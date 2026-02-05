-------
prompt inicial
-------

Analiza la documentación que te adjunto sobre el formato BC3
ROL: INGENIERO PROGRAMADOR
Crear una aplicación lectora de fichero bc3.
- Centrate en los registros tipo:
	- ~V.  REGISTRO TIPO PROPIEDAD Y VERSIÓN.
	- ~C.  REGISTRO TIPO CONCEPTO.
	- ~D.  REGISTRO TIPO DESCOMPOSICIÓN. 
	- ~T.  REGISTRO TIPO TEXTO.
	- ~M.  REGISTRO TIPO MEDICIONES. 


Ultiliza la plantilla division.html para:
- En el panel "arbol", que muestre el arbol de conceptos y permita seleccionarlo y bajar o subir por el arbol de conceptos.
- En el panel "descompuesto", muestre los registros de descompuestos del concepto seleccionado en el panel "arbol"
- En el panel "textodescriptivo" muestre el regitro tipo texto del concepto seleccionado del panel "arbol"
- En el panel "mediciones", muestre los registros de mediciones del concepto seleccionado en el panel "arbol"

El programa debe de permitir que el usuario selecciones un fichero bc3

-------
prompt
-------
Necesito que cuando le hagas click a una partida del arbol de conceptos muestre los precios que lo descomponen , y actualice el resto de paneles.

-------
prompt
-------

Ten encuenta que: El concepto raiz es el que tenga de parte del codigo es ##, el que esta debajo justo de el en el arbol es el que contenga en el código #


-------
prompt
-------
El concepto que tiene en el código  los caractes "##", tiene información del titulo del presupuesto. Ponlo en un panel arriba de los otros. Los conceptos de lectura iniciales son los que tienen el caracter "#" en el código. Actualiza el código teniendo encuenta lo anterior.


-------
prompt
-------
Cuando seleciono el archivo bc3, el arbol de capitulo no se rellena


-------
prompt
-------
Rol: eres analista en programación y especializado en sistemas para realizar  presupuestos. Analiza la información que te adjunto, para hacer mejoras en el fichero index.html
El concepto que tiene en el código  los caractes "##", tiene información del titulo del presupuesto. Los conceptos de capitulos son los que tienen el caracter "#" en el código. Actualiza el código teniendo encuenta lo anterior. Los otros conceptos serán hijos de los anteriores (conceptos capitulos)



-------
prompt
-------
No consigo ver el arbol. El concepto que tiene en el código los caractes "##", tiene información del titulo del presupuesto. Los conceptos de capitulos son los que tienen el caracter "#" en el código. Actualiza el código teniendo encuenta lo anterior. Los otros conceptos serán hijos de los anteriores (conceptos capitulos). Modifica el código para ver el arbol completo de la esctructura de la obra

-------
prompt
-------
He actualizado el fichero "descripcion formato bc3.txt", para que lo vuelvas a analizar. Analiza la el ~K. REGISTRO TIPO COEFICIENTES para interpretarlo. 

-------
prompt
-------
El desglose de mediciones, no se muestra, revisalo y comprueba el código

-------
prompt (le adjunto el bc3 de centano.bc3)
------- 
Te paso un bc3 más completo para que veas como es. 

-------
prompt
-------

En el precio unitario y en el total de lineas, además del valor,  añades los datos de coeficientes y moneda, no pongas los coeficientes

Le paso una imagen subrayando los valores que no quiero que aparezcan y le digo:
Me refiero a que no deben de aparecen lo subrayado en rojo

-------
prompt
-------
No sale el total de la obra ni el total de los capitulos. (te lo marco subrayado en la imagen adjunta)

-------
prompt (cargo archivos y activo modo "pro")
-------
Rol: eres ingeniero programador especializado en programs para presupuestos de obra. Analiza el código de lector_bc3, el fichero de descripción del formato bc3 y el fichero centano.bc3 que es un ejemplo completo del formato  bc3. Cuando estes listo me lo dices para añadir corregir algunos bugs que he visto.

(detecta varios bug, y le digo que los corrija)

-------
prompt (cargo archivos y activo modo "pro")
-------
En lo que muestras del listado de mediciones, debe aparecer los valores de Subtotal como en la imagen que te adjunto. 

Vamos a revisar los textos largo, parece que solo se muestra una linea, cuando el texto largo son varias. Por ejemplo de la imagen que te adjunto, solo sale el texto que te he subrayado, el resto no se muestra. ¿puedes analizar que pasa?

Otro detalle, el texto que muestras siempre le pones al final el caracter "|", este no deberia de salir.

Otro detalle. En las mediciones. Parece que faltan columnas, deberían de ser las que te adjunto en el imagen. Revisalo 

Para interpretar la fórmula ten tambien en cuenta lo siguiente: Correspondencia de Columnas
a = Columna N 
b = Columna Longitud
c = Columna Anchura
d = Columna Altura

vaya, parece que el comentario de la mediciones algunas veces no lo muestras. Fijate en la imagen adjunta, los subrayados son los que faltan, el resto esta correcto. -> me doy cuenta que el bc3 original no lo ha exportado esa información, con lo cual es imposible que la muestre.


-------
prompt
-------
Otro detalle de diseño web, quiero que salga de mayor tamaño el texto del código. Te adjunto pantallazo indicando con una flecha a lo que me refiero.

-------
prompt
-------
Añade una pestaña donde se muestren todos los conceptos (codigo, texto) y que tenga un buscador 

-------
prompt versión de calculador
-------
Quiero que añadas un opción de calculo: recalcule todas las lineas de mediciones, recalcule todas las lineas de precios y actualice los valores del presupuesto.
Vaya, parece que el total del presupuesto no lo calcula, muestra 0 euros
Añade un boton para poder copiar al portapapeles el contenido del panel de descompuestos

-------
prompt-> editor
-------
Quiero que se pueda editar las lineas del descompuesto y las lineas de medición. Pon un boton de editar en cada fila y muestra un formulario para editar los datos.


------
prompt a partir de la v3.30: recarga de archivos
------
Actúa como un Senior Full Stack Developer y experto en UX/UI. Analiza de forma integral mi aplicación web compuesta por HTML, CSS y JavaScript que te adjunto a continuación.
Por favor, realiza lo siguiente:
Arquitectura y Lógica: Explica cómo interactúan los tres archivos y si la manipulación del DOM en el JS es eficiente.
Revisión de Estilo: Evalúa el CSS en términos de responsividad, uso de variables y buenas prácticas (como Flexbox o Grid).
Detección de Errores y Mejoras: Identifica posibles bugs, cuellos de botella en el rendimiento o redundancias en el código.


Vamos a hacer una gran mejora al programa: crear listados.
Pon un nuevo botón de "Listados". 
El botón de Listados debe de mostrar varios tipos de listados:
1. Listado de Mediciones:
	- lista las partidas con el texto largo (si no tiene texto largo pon el texto corto), con la medicion total , y de cada una lista el detalle de las mediciones si las tiene.
2. Listado de Presupuesto.
       - lista las partidas con el texto largo (si no tiene texto largo pon el texto corto), con la medicion total , precio y presupuesto (medición por precio).
Quiero que el código que generes para esta opción este en otro fichero (por ejemplo si necesitas añadir nuevas funciones de javascript).

3. Quiero que añadas otro reporte llamado "Resumen Capítulos" donde se liste el capitulo y su importe sumando el total al final del informe

4. Quiero que añadas otro reporte llamado "Cuadro de Precios Nº 1", en el se listan las partidas (no los capítulos)
- Contador (empezando por 01)
- Codigo de la partida 
- Su texto largo
- Precio 
- Precio en letra. 

Quiero modificar este ultimo listado. Si tiene texto largo no pongas el texto corto. 
Dos cosas a corregir en el listado de  "Cuadro de Precios Nº 1": 1.- El texto corto de resumen no lo pongas en negrita. 2.- El texto de precio en letra aumenta el tamaño, para que se vea del mismo tamaño que la descripción larga.

5. Quiero que añadas otro reporte llamado "Cuadro de Precios Nº 2", en el se listan las partidas (no los capitulos)
- Contador (empezando por 01)
- Codigo de la partida 
- Su texto largo
- Importe de mano de obra (suma los importes de los descompuestos que sean del tipo mano de obra  de la partida)
- Importe de maquinaria (suma los importes de los descompuestos que sean del tipo maquinaria de la partida)
- importe de materiales (suma los importes de los descompuestos que sean del tipo materiales  de la partida)
- Importe de otros (suma los importes de los descompuestos que sean del tipo otros  de la partida)
- Total precio  de la partida


------
prompt a partir de la v3.30: recarga de archivos
------
El boton de listados añadele los listados de "Cuadro de Precios nº 1" y "Cuadro de Precios nº 2", ya que estan definidos en el fichero report.js

Quiero que el formato del  listado del cuadro nº 2 sea como el que te adjunto. (formato como lo da presto en el cuadro de precios nº2)

------
prompt Nuevos listados
------
Quiero estos nuevos listados:
- listado de precio elemental tipo Mano de obra: donde aparezca el codigo, texto corto y precio
- listado de precio elemental tipo Maquinaria: donde aparezca el codigo, texto corto y precio
- listado de precio elemental tipo Materiales: donde aparezca el codigo, texto corto y precio
- listado de partidas con sus descompuestos.


-------
prompt-> ventana flotante
-------
1. Haz que la pestaña "LISTADO COMPLETO" se convierta en una ventana "No Modal".
2. El boton de buscar no funciona en la ventana flotante "Buscador/listado". Quiero que el comportamiento de hacer click en un elemento  del panel de "buscador/listado" sea dobleclick. Si se hace click que copie el codigo del elemento que se selecione en el "Buscador/Listado".

-------
prompt-> rendimeinto a 3 decimales.
-------
Mejora: La columna rendimiento se debe de mostrar en la interfaz con 3 decimales. Cuando se guarde la información (por ejemplo al formato bc3) tambien se tiene que guardar el rendimiento con 3 decimales.

-------
prompt-> bc3 desde 0.00
-------
Añade la opción de crear un bc3 desde cero, pidiendo el nombre del proyecto/obra (el que será elemento ##).
Añade tambien otra opción de cargar un fichero bc3 solo los conceptos y sus descompuestos y añadirlo a lo que tengamos ya definidos. Si hay elementos con el mismo código no se cargarán.