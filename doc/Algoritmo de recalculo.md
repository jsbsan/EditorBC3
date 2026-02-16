### Explicación Técnica de las Fases (según `app.js`)
El motor (`BC3Engine`) utiliza un enfoque en tres fases secuenciales, siendo la más compleja la **Fase 3 (Cálculo Recursivo de Precios)** debido al algoritmo de "Doble Pasada" necesario para calcular correctamente los porcentajes (Costes Indirectos, Beneficio Industrial, etc.) sobre las bases correctas.  


#### 1. Fase de Mediciones (`recalculateAllMeasurements`)

El programa no toma los precios directamente. Primero, recorre todas las tablas de mediciones (`~M`) almacenadas en memoria.  

* **Lógica:** Si una línea es tipo fórmula, evalúa la expresión matemática (ej. `a*b`). Si es normal, multiplica las dimensiones.  
* **Resultado:** Actualiza el valor `total` de cada bloque de medición.  

#### 2. Fase de Propagación (`updateQuantitiesFromMeasurements`)  

Aquí es donde la medición se convierte en presupuesto.

* **Lógica:** El motor busca si existe una relación entre una partida (Padre) y un recurso (Hijo) que tenga mediciones asociadas.  
* **Acción:** Si encuentra medición, **sobrescribe** el campo `yield` (Rendimiento/Cantidad) del hijo con el total de la medición calculada en la Fase 1 y fuerza el `factor` a 1.  

#### 3. Fase de Precio Recursivo (`calculateConceptPriceRecursively`)

Es la parte crítica ubicada en la línea 268 de `app.js`. Usa un algoritmo de **Doble Pasada** para resolver correctamente los porcentajes:  

1. **Pasada 1 (Normales):** Calcula el coste de todos los materiales, mano de obra y maquinaria "físicos". Mientras lo hace, va sumando los importes en cubos separados (`sumMO`, `sumMQ`, `sumMT`, `sumResto`) según el `type` del hijo.  
2. **Pasada 2 (Porcentajes):** Una vez tiene las sumas bases calculadas, recorre los hijos que son porcentajes (los que tienen `%` en el código).  
* Si es `%MO`, aplica el porcentaje solo sobre `sumMO`.  
* Si es `%CI` (Costes Indirectos) o `%GG` (Gastos Generales), aplica el porcentaje sobre la suma total de costes directos.  
* **Clave:** El programa calcula inversamente el rendimiento (`yield`) necesario para que el importe cuadre, permitiendo que la exportación BC3 posterior sea matemáticamente correcta.  

### Diagrama de Flujo (Mermaid)

``` mermaid
flowchart TD
    Start([Inicio: ui.recalculate]) --> Init[engine.recalculateProject]
    
    subgraph FASE_1 [Fase 1: Recálculo de Mediciones]
        direction TB
        M1[Iterar Mapa de Mediciones] --> M2{¿Tiene líneas?}
        M2 -- No --> M_Next
        M2 -- Sí --> M3[Iterar cada línea]
        M3 --> M4{¿Es Fórmula Tipo 3?}
        M4 -- Sí --> M5[Evaluar Expresión Matemática]
        M4 -- No --> M6[Cálculo Estándar: N x L x A x H]
        M5 --> M7[Redondear y Sumar al Total]
        M6 --> M7
        M7 --> M_Next{¿Más mediciones?}
        M_Next -- Sí --> M1
        M_Next -- No --> F2_Start
    end

    subgraph FASE_2 [Fase 2: Propagación a Rendimientos]
        direction TB
        F2_Start[Iterar Base de Datos DB] --> F2_1[Buscar Hijos del Concepto]
        F2_1 --> F2_2{¿Existe Medición Vinculada?}
        F2_2 -- Sí --> F2_3[Actualizar Rendimiento Hijo = Total Medición]
        F2_2 -- No --> F2_4[Mantener Rendimiento Original]
        F2_3 --> F2_5[Fijar Factor = 1]
        F2_5 --> F2_Next{¿Siguiente Concepto?}
        F2_4 --> F2_Next
        F2_Next -- Sí --> F2_Start
        F2_Next -- No --> F3_Start
    end

    subgraph FASE_3 [Fase 3: Cálculo Recursivo de Precios]
        direction TB
        F3_Start(Llamada Recursiva: Root) --> R1{¿Visitado?}
        R1 -- Sí --> R_Cycle[Retornar 0 - Ciclo]
        R1 -- No --> R2{¿Es Compuesto -Tiene Hijos-?}
        R2 -- No --> R_Leaf[Retornar Precio Simple]
        
        R2 -- Sí --> R_Pass1[<b>PASADA 1:</b> Hijos Normales]
        R_Pass1 --> R3[Calcular Precio Hijo Recursivo]
        R3 --> R4[Importe = Precio x Factor x Rendimiento]
        R4 --> R5[Acumular Bases: MO, MQ, MT, Resto]
        R5 --> R_Pass2[<b>PASADA 2:</b> Hijos Porcentaje %]
        
        R_Pass2 --> R6[Detectar Tipo: %MO, %CI, %GG...]
        R6 --> R7{Seleccionar Base Imponible}
        R7 -- %MO --> B1[Usar Suma Mano de Obra]
        R7 -- %MQ --> B2[Usar Suma Maquinaria]
        R7 -- %CI / %GG --> B3[Usar Suma Costes Directos]
        
        B1 & B2 & B3 --> R8[Calcular Importe Porcentaje]
        R8 --> R9[Actualizar Precio Total Concepto]
        R9 --> R_End[Retornar Precio Calculado]
    end

    M_Next --> F2_Start
    F2_Next --> F3_Start
    R_End --> UI_Update[Actualizar Interfaz Gráfica]
    UI_Update --> End([Fin])

    style FASE_3 fill:#e0f2fe,stroke:#2563eb,stroke-width:2px
    style R_Pass1 fill:#dcfce7,stroke:#166534
    style R_Pass2 fill:#fce7f3,stroke:#9d174d
```

