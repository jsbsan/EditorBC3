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