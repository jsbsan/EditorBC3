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


---------
PROMPT: Nombre del fichero
---------
Nueva mejora:
Cuando abres un fichero bc3, quiero que almacenes en memoria el nombre. 
Cuando lo guardes pon el mismo nombre y le añadas la fecha y hora al nombre, añadiendo la extensión bc3
Si has creado un presupuesto nuevo, usa el nombre del concepto raiz ##, para ponerle nombre al fichero.

---------
PROMPT: botón de ayuda e imagen lince
---------
Puedes añadir una boton de "ayuda" que abra un formulario donde se explique que hace el programa. Crea un texto explicativo de cada función y tareas posibles a realizar por el programa.

---------
PROMPT: letra de texto largo mas grande y sin cursiva.
---------
Modifica los listado para que el texto largo lo muestre sin cursiva y con la letra un poco más grande.

---------
PROMPT: Redondeo y partes del reporte Cuadro de Precios nº 2
---------
Necesito que  explique como haces el "listado de cuadro de precios nº 2". No hagas nada, solo explicarmelo
Quiero que modifiques el calculo del algoritmo de calculo en dos puntos: 
Punto 1) Si el descompuesto contiene una partida auxiliar (tipo 0) que extraiga que parte es mano de obra, maquinaria y otro. Ademas multiplique cada cantidad por el rendimiento  mas 0.00001 redondeando a 2 decimales y lo sume a lo que le corresponda (al totalMO, totalMQ  y totalResto.  
Punto 2) Redondear a 2 decimales el costes parcial añadiendole 0.0001 antes de redondear: Redondear( factor x rendimiento x precio de hijo +0.0001, 2 decimales)  

---------
PROMPT: MACROS: añadir %CI a todos los precios descompuestos (que no sean auxiliares)
---------
Vamos a añadir una nueva opción llamada "Macros" EN LA BARRA SUPERIOR, cuando pulses sobre el abriras un formulario modal. En este formulario vamos a añadir varias macros
La primera macro se llama "Añadir %CI a todos los descompuestos", si pulsas sobre ella, preguntas por el coeficiente de costes indirectos al usuario y añade a todos las partidas con descompuestos (que no sean partidas auxiliares ni capitulo "#" ni raiz "##"), un concepto del tipo "%", con codigo "%CI", y con precio el indicado por el usuario.
Modificar la lógica de "applyIndirectCosts" no debe inyectar a las partidas auxiliares el concepto %CI

--------- 
PROMPT: MACROS: renombrar código de partida.
---------  
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.
Añadir una nueva macro llamada "Renombrar codigos de partidas", que haga lo siguientes:
- Pida al usuario un fichero .csv que con el siguiente texto: "El fichero csv tiene que tener dos columnas: la primera con el codigo actual, la segunda con el codigo nuevo"
- Lea el fichero csv. En la primera columna tiene el codigo actual y en la segunda columna tiene el codigo a nuevo a renombrar.
- Procese todas las partidas,  y todas las filas del fichero csv, en el caso de que el codigo que tenga coincida con el de la primera columna lo renombra con el de la segunda.
- Indica con un mensaje final que ha terminado de renombrar los códigos.
- No quiero que unifiques los archivos de codigo en uno solo. Dejalo separados añadiendo el código necesario de la nueva mejora.

--------- 
PROMPT: listado de codigos, unidad y partidad
---------  
Quiero que añadas un nuevo informe dentro del apartado "Listados de recursos básicos", llamado "Solo Partidas", que genere un listado con el código, unidad de medida y nombre corto de las partidas.


--------- 
PROMPT: linea de descompuesto con medición pero no hay linea de medición
---------  
Mejora: Cuando el programa lea un archivo bc3, que compruebe en el caso de que no existir lineas de dimensiones, quiero que la cree para que sea esa MEDICIÓN_TOTAL

--------- 
PROMPT: formulas que indican numero
--------- 
¿como analizarias esta linea de un fichero bc3: "~M|2.1#\T-053|2\1\6\|52|3\0.2\1\1300\4\0.05\|"?
Respuesta:
	Para analizar esta línea, la desglosaremos campo por campo. A diferencia de tus ejemplos anteriores, esta línea **sí contiene un desglose de dimensiones físicas** y hace un uso muy particular del campo de fórmulas.
	Aquí tienes el análisis detallado de la línea:
	Como puedes ver, es un ejemplo excelente de cómo algunos programas de mediciones fuerzan o "hackean" el formato BC3 para meter factores multiplicadores utilizando el Tipo 3.
	El valor total inicial (52) se respeta perfectamente en tu código, aunque es un dato útil a tener en cuenta si alguna vez notas que los recálculos varían al pulsar el botón de recalcular en líneas que tienen este formato específico. ¡Dime si quieres que adaptemos el motor matemático para interceptar estos casos particulares!
Si, adapta el motor matemáticos para estos casos.



--------- 
PROMPT: bug al guardar la información y volver a leerla que el importe total varia.
--------- 
¿De los archivos que te adjunto,  deberian de ser iguales, ya que el programa lee el "D04_PPT SEVILLA ENCOMIENDA v0 ORIGINAL.bc3" y a continuación lo guardo con el nombre "MANTENIMIENTO Y CONSERVACION PRESAS ZONA SEVILLA_2026-03-07_20-22.bc3". Sin embargo cuando leo el "MANTENIMIENTO Y CONSERVACION PRESAS ZONA SEVILLA_2026-03-07_20-22.bc3" de nuevo, el calculo del presupuesto total es diferente, cuando deberia de ser igual. Analizalos y dime por que puede ser que esto ocurra al guardar y volver a leer la información.

Respuesta:
		He analizado detalladamente tanto el código de tu aplicación (`app.js`) como los dos archivos `.bc3` que has subido.

		El motivo por el cual el presupuesto total cambia al guardar y volver a leer el archivo se debe a una **pérdida de precisión (redondeo) en los rendimientos y factores de las líneas de descomposición (`~D`) durante el proceso de guardado**.

		Aquí tienes la explicación exacta de lo que está ocurriendo:

		### 1. El problema principal: Truncamiento a 3 decimales

		En el archivo original (`D04_PPT SEVILLA ENCOMIENDA v0 ORIGINAL.bc3`), existen partidas cuyos rendimientos tienen **4 decimales**.
		Por ejemplo, si observas la descomposición de la partida **Z-003**:

		* Original: `~D|Z-003|ZM0004\1\0.0833\|` (Rendimiento = **0.0833**)

		Sin embargo, en tu archivo `app.js`, la función encargada de exportar a BC3 (`exportToBC3()`) tiene programado un formateo estricto que fuerza los rendimientos y factores a tener exactamente **3 decimales**:

		```javascript
		const fNumYield = (n) => (n === undefined || n === null) ? '' : n.toFixed(3);

		```

		Al guardar, el programa redondea `0.0833` y lo guarda como `0.083`. Puedes comprobarlo en el archivo nuevo:

		* Guardado: `~D|Z-003|ZM0004\1.000\0.083|`

		### 2. Cómo afecta esto a las matemáticas (Propagación del error)

		Cuando la aplicación vuelve a abrir el archivo guardado, ejecuta automáticamente la macro `engine.recalculateProject()`. Al usar el valor redondeado, el cálculo cambia:

		* **Cálculo Original:** 1 (factor) × 0.0833 (rendimiento) × 2311.27 € (precio de ZM0004) = **192.53 €**
		* **Nuevo Cálculo:** 1 (factor) × 0.083 (rendimiento) × 2311.27 € = **191.84 €**

		Esa diferencia de **-0.69 €** en la partida `Z-003` se multiplica por 7 cuando se usa en su capítulo padre (`1.1#`), y así sucesivamente hacia arriba, modificando el total general del presupuesto.

		Este mismo caso ocurre en otras partidas del archivo original que usaban 4 decimales, como por ejemplo la partida **I09040**, donde rendimientos originales como `0.2818`, `0.0554` y `0.0776` se han guardado como `0.282`, `0.055` y `0.078`.

		### 3. Otras diferencias en el archivo guardado (que NO afectan al cálculo)

		Al comparar los archivos, he detectado otros cambios que tu exportador hace, pero te confirmo que **no son los culpables de la diferencia económica**, aunque hacen que los textos de los archivos sean distintos:

		* **Campos vacíos en mediciones (`~M`):** En el original, si una dimensión estaba vacía se representaba sin nada (ej. `\2\\0.5\`). Al guardar, tu programa inyecta un `"0"` por la función `fNum(l.units)` (ej. `\2\0\0.5\0`). A nivel de cálculo no afecta porque en tu motor tienes programado `const val = (v) => v === 0 ? 1 : v;`, lo que compensa perfectamente el cero al multiplicar.
		* **Omisión de la fecha en `~C`:** El archivo original guardaba la fecha de actualización del precio (ej. `|180219|`). El exportador de `app.js` lo deja vacío intencionadamente (`||`).
		* **Posición omitida en `~M`:** El segundo bloque de los registros de medición (ej. el `2\1\3\` original) se exporta en blanco.

		**En conclusión:** El recálculo arroja cifras diferentes porque tu motor de exportación altera los datos subyacentes (pasa de 4 decimales a 3 decimales en `~D`). Cuando el programa los lee de nuevo y recalcula de abajo hacia arriba basándose en estas nuevas cantidades menos precisas, el sumatorio de los Costes Directos diverge del original.

Solución:
Modifico la linea "const fNumYield = (n) => (n === undefined || n === null) ? '' : n.toFixed(3);" a "const fNumYield = (n) => (n === undefined || n === null) ? '' : n.toFixed(4);" y ya lo calcula bien

--------- 
PROMPT: ~k: revisión de como se guardan los valores que se leen
--------- 
Habia modificadores de coe que "eliminaban" el valor original, por ejemplo:

this.metadata.dr = 3; // Fuerza los Decimales de Rendimiento a 3
Lo he quitado (dejandolo como si fueran comentarios), para que se guarde con el valor leido.



--------- 
PROMPT: caracteres especiales
--------- 
veo que al guardar el texto en bc3 las comillas  las convierte en caracter "?" ¿por que puede ser?
Respuesta:
	El problema se debe a que el texto que estás intentando guardar seguramente contiene **"comillas tipográficas" o "curvas"** (las que se ven inclinadas así `“` `”` o simples `‘` `’`), que son muy comunes cuando copias y pegas texto desde programas como Microsoft Word o PDFs.

	### ¿Qué está pasando en el código?

	En la línea 818 de tu archivo `app.js`, la función `saveFile` convierte el texto a formato **ANSI** (Windows-1252) para que los programas antiguos de presupuestos puedan leerlo correctamente.

	Hace un bucle carácter por carácter:

	1. Si el carácter es un símbolo ASCII normal (código menor a 128, como la comilla recta `"`, letras sin tilde, números), lo deja pasar.
	2. Si es mayor a 128, lo busca en una "lista blanca" (un `switch` que tienes en la línea 824) donde tienes añadidas las letras con tilde (`á`, `é`), la `ñ`, el símbolo `€`, etc.
	3. Si el carácter **no está en esa lista blanca**, ejecuta la instrucción `default: tempBuf[i] = 63;`, que fuerza a escribir el código 63... **¡que es exactamente el símbolo de interrogación `?`!**

	Como las comillas curvas tienen códigos muy altos (8220 y 8221), no están en la lista y se convierten en un `?`. Lo mismo te pasará con los guiones largos (`—`).

	### La solución

	Para solucionarlo, simplemente tenemos que añadir estos caracteres especiales a tu "lista blanca" (el bloque `switch`) y decirle que los convierta a su equivalente en ASCII normal (las comillas rectas `"` y `'` o el guion normal `-`).

	Aquí tienes el código para actualizar tu `app.js`:

	// ... existing code ...
	                    case 252: tempBuf[i] = 252; break; // ü
	                    case 220: tempBuf[i] = 220; break; // Ü
	                    case 191: tempBuf[i] = 191; break; // ¿
	                    case 161: tempBuf[i] = 161; break; // ¡
	                    
	                    // --- NUEVOS CARACTERES: Comillas y Guiones tipográficos ---
	                    case 8220: // “ (Comilla doble curva apertura)
	                    case 8221: // ” (Comilla doble curva cierre)
	                        tempBuf[i] = 34; break; // Se convierte a comilla doble recta (")
	                    case 8216: // ‘ (Comilla simple curva apertura)
	                    case 8217: // ’ (Comilla simple curva cierre)
	                        tempBuf[i] = 39; break; // Se convierte a comilla simple recta (')
	                    case 8211: // – (Guion corto)
	                    case 8212: // — (Guion largo)
	                        tempBuf[i] = 45; break; // Se convierte a guion normal (-)
	                        
	                    default: tempBuf[i] = 63; // ? 
	                }
	            }
	        }

	        const blob = new Blob([tempBuf], { type: 'application/octet-stream' });
	// ... existing code ...



	Con este cambio, si el programa detecta comillas de Word o guiones largos, los aplanará automáticamente a su versión básica de teclado y se exportarán perfectamente en el archivo BC3, eliminando los molestos signos de interrogación.


--------- 
PROMPT: reportes: el rendimiento debe de ir con los decimales que indique el "dr" de ~k
---------  
Necesito que los reportes que se hagan, en la columna de rendimiento ponga el numero de caracteres indicado por el parametro 'dr'.
Verifica que el archivo reports.js esta completo y no se ha olvidado ninguna funcionalidad del original, al modificarlo.


¿como hago que esta linea de codigo tenga en cuenta el numero de decimales definidos por DC, DR y Di? la linea de codigo es esta: const totalCost = item.totalQty * item.concept.price;
Respuesta:
	Para que esa línea de código calcule el resultado de forma matemáticamente exacta según la normativa BC3, debes redondear primero la **cantidad** a los decimales de rendimiento (`DR`), el **precio** a los decimales de coste (`DC`), y finalmente redondear el **resultado** de la multiplicación a los decimales de importe (`DI`).

	Como esta línea aparece en dos funciones diferentes (`generateNeedsReport` y `generateAuxiliaryNeedsReport`), te he preparado la modificación exacta para ambas.

	Aquí tienes la actualización en el archivo aplicando el redondeo matemático correcto mediante la lectura de los metadatos del proyecto:

	**¿Qué hace exactamente este cambio?**

	1. Crea una pequeña función matemática `roundTo(val, dec)` que evita los clásicos fallos de coma flotante de JavaScript (añadiendo `0.00001` antes de redondear).
	2. Lee en tiempo real cuántos decimales exige tu archivo `.bc3` (desde `engine.metadata`).
	3. Obliga a que cantidad y precio estén truncados a su precisión exacta antes de ejecutar la operación de coste total (`totalCost`), y vuelve a truncar este último a la precisión exigida para importes finales (`DI`).
implementa el codigo en el fichero reports.js para esas lineas
	¡Claro que sí! He aplicado exactamente tu lógica de redondeo matemático a las dos funciones correspondientes (`generateNeedsReport` y `generateAuxiliaryNeedsReport`) dentro del archivo `reports.js`.

	Aquí tienes el archivo completo con la actualización integrada para que el cálculo del importe total (`totalCost`) utilice el número exacto de decimales (`DR`, `DC` y `DI`) antes y después de la multiplicación:



--------- 
PROMPT: MACROS: reemplazar textos   
---------  
- Quiero añadir una nueva "macro" en el formulario. Se llama "Buscar y Reemplazar".  Hará lo siguiente: 1. pedira el texto a buscar y el texto a reemplazar. 2. En los textos largos de los conceptos, buscara el texto y lo reemplazará.
- Añade una nueva macro llamada "Informar sobre descompuestos sin textos largos", creará un informe con las partidas descompuestas que no tengan textos largos (no mostrará los capitulos o subcapitulos o el concepto raiz "##")  


--------- 
PROMPT: listado de descompuesto "clasico"
---------  
Quiero que el reporte de precios descompuestos sea similar a la imagen que te adjunto.
(le pongo una captura de imagen de un listado de descompuestos generado por presto)


Quiero que el reporte de presupuestos sea similar a la imagen que te adjunto. Añada el código del capitulo y subcapitulo quitandole el caracter #

**pendiente**
LISTADOS "CLASICOS":
- MANO DE OBRA -> OK
- MAQUINARIA -> OK
- MATERIALES -> OK
- NECESIDADES (mano de obra, materiales, maquinaria, otros) -> OK
- DESCOMPUESTOS -> OK
- MEDICIONES -> OK
- CUADROS DE PRECIOS Nº 1 -> OK
- CUADROS DE PRECIOS Nº 2 -> OK
- PRESUPUESTO PARCIALES -> OK
- RESUMEN DE PRESUPUESTOS -> OK


---------
## prompt: Mejora para cuando se cierre accidentamente te avise.
---------
Mejora: como la aplicación se usa en un navegador (chrome, firefox, etc), quiero que cuando se cierre la ventana o se cierre el navegador, informe al usuario, para que pueda cancelarlo.
 
---------
## prompt: Suelta de archivos para abrir soltando bc3 en al aplicación
---------
Mejora: Quiero que cuando suelte un fichero .bc3 en la aplicación, si no tiene ya otro bc3 abierto, que lo cargue.



--------- 
PROMPT: temas oscuro/claro/azul/verde
--------- 
-> Actúa como un diseñador de UI/UX experto. Necesito crear un sistema de colores escalable para mi aplicación web. Quiero implementar varios estilos visuales y necesito que me generes las paletas de colores para los siguientes temas: Claro, Oscuro, Azul y Verde.
Para CADA uno de los temas, proporciona una paleta coherente y armoniosa que incluya los siguientes tokens o roles de diseño:

Background: Fondo principal de la aplicación.
Surface: Fondo para tarjetas, barras de navegación o modales.
Primary: Color principal para la marca, botones principales y acciones clave.
Secondary: Color para botones secundarios o elementos de soporte.
Text Primary: Color para el texto principal (debe tener altísimo contraste con Background y Surface).
Text Secondary: Color para subtítulos o texto de menor jerarquía.
Accent: Un color que resalte para notificaciones o detalles interactivos.
Feedback: 3 colores universales adaptados al tema (Éxito, Advertencia y Error).
Requisitos técnicos y de diseño:

Armonía visual: Utiliza la teoría del color para asegurarte de que los tonos elegidos para cada tema se vean profesionales y modernos juntos.
Accesibilidad (WCAG): Es obligatorio que el contraste entre los colores de texto y los de fondo/superficie cumplan con el estándar AA o AAA.
Formato de salida: Entrégame el resultado directamente escrito en variables de CSS (ej. --bg-primary: #HEX;), agrupadas por su respectivo atributo de tema, por ejemplo: [data-theme="dark"] { ... }. Añade al boton para seleccionar el tema.

-> Añade la selección del tema en  mi index.html de mi proyecto 
-> Me cuesta trabajo seleccionar el tema en el menu que sale al pulsar, desaparece y no me deja elegir el tema.

**pendiente**
- añadir al listado de necesidades % del proyecto que representan y ordenarlas según estas.  
- Poner solo textos largos en listados   

---------
## NOTA:
---------
Prompt Para cargar el proyecto que ya tenemos:
Voy a subir varios archivos de un proyecto web (HTML, CSS y JavaScript). Por ahora, solo quiero que los proceses y los mantengas en tu memoria de contexto. No realices ningún cambio, no reescribas el código ni propongas mejoras todavía.

