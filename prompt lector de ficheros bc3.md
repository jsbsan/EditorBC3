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


-----------------------------------------------------------------------------------------------------
## PORCENTAJES
-----------------------------------------------------------------------------------------------------

--------
PROMPT:
--------
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.

Confíame que has recibido y comprendido el código haciendo un breve resumen de la estructura del proyecto. Una vez hecho esto, esperaré a que yo te haga preguntas específicas o te pida optimizaciones. ¿Entendido?


-------
Resumen técnico estructurado para entregárselo a tu programador. Está enfocado en la **lógica de negocio** y la **manipulación de datos** necesaria para replicar el comportamiento de BC3.
------

### Especificación Funcional: Cálculo de Porcentajes en Presupuestos 

#### 1. Detección del Concepto (Parsing)
*Si la unidad contiene "%", tratar como porcentaje calculado.*

#### 2. Mapeo de Variables (La inversión de roles)
En una línea de presupuesto estándar (`Cantidad x Precio = Importe`), los roles cambian cuando es un porcentaje:
* **Input `Cantidad` (Factor en BC3):** No lo introduce el usuario. Es una **variable calculada** automáticamente por el programa.
* **Input `Precio`:** Almacena el valor del porcentaje.
* **Output `Importe`:** El resultado monetario real.
* *Fórmula:* `Importe = (Precio_Calculado * Cantidad_Input) / 100`

#### 3. Algoritmo de "Doble Pasada" (Orden de ejecución)
No se puede calcular el factor de una partida en un solo ciclo `forEach`.
* **Paso 1 (Sumatorio):** Recorrer todos los hijos que **NO** son porcentajes (Materiales, Mano de obra, Maquinaria). Calcular sus importes y sumarlos acumulándolos por "Naturaleza" (Tipo).
* **Paso 2 (Cálculo %):** Recorrer las líneas que **SÍ** son porcentajes. Aplicar el % sobre la suma acumulada en el Paso 1.
* **Paso 3 (Total):** Sumar el resultado del Paso 1 + Paso 2 para obtener el factor total de la partida.

#### 4. Lógica de la "Base Imponible"
El programador debe implementar un `switch` o `if/else` para decidir sobre qué se aplica el porcentaje:
* **Caso `%MO` (MANO DE OBRA):** Se aplica **exclusivamente** sobre la suma de los conceptos tipo 1 (MANO DE OBRA).
* **Caso `%MQ` (MAQUINARIA):** Se aplica **exclusivamente** sobre la suma de los conceptos tipo 2 (MAQUINARIA).
* **Caso `%MT` (MATERIALES):** Se aplica **exclusivamente** sobre la suma de los conceptos tipo 3 (MATERIALES).
* **Caso `%CI` ó `%GG` (Costos Indirectos):** Se aplica sobre la suma **total** de los costes directos (Mano de Obra + Materiales + Maquinaria) del descompuesto.


#### 5. Gestión de "Naturalezas" (Tipos de Insumo)
Para que el punto 4 funcione, el sistema debe saber qué es cada línea.
* **En BC3:** Leer el registro `~T` (Tipos). 

#### 6. Precisión y Redondeo (Floating Point)
* **Regla:** Cada multiplicación (`Cantidad x Precio`) debe redondearse a **2 decimales** inmediatamente antes de sumarse al total.
* *Función sugerida:* `Math.round((valor + Number.EPSILON) * 100) / 100`.


---
Prompt: recalculo cuando abra
---
Mejora: despues de abrir un  fichero bc3,  debe de recalcularlo


---
Prompt: exportación de precio y no de rendimiento en lineas %
---
Mejora: al exportar el BC3, en la linea de Descompuesto, si el concepto hijo tiene en su código un porcentaje pon el precio dividido entre 100

-----------------------------------------------------------------------------------------------------
## LISTADO AUXILIARES
-----------------------------------------------------------------------------------------------------
-----
prompt: asignar capitulo
-----
- En el formulario de "Añadir Descompuesto" añade una casilla de verificación sin marcar con el texto "¿es un capítulo?". Cuando guarde los cambios, si la casilla de verificación esta marcada y si el código del recurso no termina en el caracter "#", añade al código de recurso el caracter "#"
- En el formulario de "Editar descompuesto" el checkbox tiene que estar desactivado
- ¿por que no se muestran los caracter "#" al leer un fichero bc3 en la columna de codigo en "Descomposición de costes"? (NO CAMBIES EL CÓDIGO, SOLO CONTESTA)

----
prompt: listado de auxiliares
----
Mejora: Nuevo Listado "Partidas de Precios Auxiliares".  Estas partidas tienen descompuestos pero  no cuelgan en el arbol de jerarquia de un capitulo o subcapitulo solo son hijos de otros descompuestos. Muestra el listado de estas partidas de la misma forma que se hace con el listado de "Descompuestos".

Modifica el listado de "Descompuestos" para que no aparezcan partidas auxiliares


----
prompt: listado de necesidades
----
Mejora: Nuevo listado "Listado de Necesidades". En este listado se listan:
- Columna 1º: los conceptos elementales (primero los del tipo de mano de obra, luego los del tipo de materiales, luego los del tipo de maquinaria, y finalmente los del tipo otros).
- Columna 2º: precio del concepto elemental.
- Columna 3º:  total de unidades necesarias (calculadas según el rendimiento por las mediciones de las partidas  presupuestos donde esten presentes).
- Columna 4º: con el calculo del precio por total de unidades calculadas.

-----
prompt: **en preparacion listados solo de auxiliares.**
-----
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.

Confírmame que has recibido y comprendido el código haciendo un breve resumen de la estructura del proyecto. Una vez hecho esto, esperaré a que yo te haga preguntas específicas o te pida optimizaciones. ¿Entendido?

- Haz un nuevo listado llamado "Listado de Necesidades Partidas Auxiliares", donde muestres el total de las mediciones de partidas auxiliares necesarias.

- Haz un nuevo listado llamado "Resumen por Capitulos", donde muestres los capitulos y subcapitulos con su valoración y suma final.


--------
PROMPT: Modo ventana NO MODALES. mejora en numeros en pantalla e informes
---------
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.

Confíame que has recibido y comprendido el código haciendo un breve resumen de la estructura del proyecto. Una vez hecho esto, esperaré a que yo te haga preguntas específicas o te pida optimizaciones. ¿Entendido?

- Haz que las ventanas de "añadir descompuesto", "Editar descompuesto","añadir medición","Editar medición" y "Editar Texto largo", sean ventanas No Modal (Modeless)
- El boton "Buscar/listado" no funciona (LO ARREGLA)
- A la ventana de "Buscador/Listado" añadele un botón, para que el  elemento seleccionado, se añada a la descomposición de costes de la unidad que se viendo en pantalla.
- En el listado de "Resumen de capítulos", no quiero que aparezca la partida del código "##"
- En el listado de "Presupuesto General", no quiero que aparezca la partida del código "##"
- Revisa todos los listados para que los números que aparezcan con coma decimal y separador de millares con punto 
- Quiero que en la pantalla de descomposición de costes, el precio y el importe también use coma como separador decimal y punto como separador de miles.
- Añade un botón de copiar al portapapeles, el contenido de los paneles ("Descomposición de costes","Mediciones" y "Pliego/Texto)


--------
PROMPT: Pegar listado de mediciones
---------
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.
Nueva mejora: Quiero pegar el contenido del portapapeles a las mediciones de la partida. Pon un botón en el panel "mediciones" para pegar. Si el portapapeles esta vacio, no hagas nada. Si el portapapeles contiene textos y numeros separados por tabulador, quiero la primera columna la asignes a comentario, y las siguientes a N,L,A,H,Formula. El portapapeles puede contener varias filas, añadelas a las mediciones. Si la primera fila todas las columnas contienen texto, no la añadas, sigue con las demas.

---------
PROMPT: Acerca de...
---------

Quiero añadir una ventana a modo de "Acerca de...", con la información del nombre del programa, autor (Julio Sánchez Berro) y tipo de licencia GPL 3.00

