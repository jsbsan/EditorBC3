/**
 * PROYECTO: Visor Profesional FIEBDC-3 (BC3)
 * VERSION: 3.86 (Macros Buscar y Reemplazar)
 * DESCRIPCION: 
 * - [MEJORA] Gestión inteligente de nombres de archivo al Guardar.
 * - [LOGICA] Al abrir, se conserva el nombre original.
 * - [LOGICA] Al guardar, se usa el nombre original (o el de la raíz si es nuevo) + Fecha/Hora.
 * - [NUEVO] Funciones para gestionar el modal "Acerca de".
 * - [NUEVO] Funcionalidad pasteMeasurements.
 * - [CORRECCION] Macro applyIndirectCosts ahora excluye partidas auxiliares.
 * - [NUEVO] Macro replaceTextInDescriptions para buscar y reemplazar en pliegos.
 */

class BC3Engine {
    constructor() {
        this.db = new Map();
        this.measurementsMap = new Map();
        this.parentMap = new Map(); 
        this.metadata = { 
            owner: '', software: 'BC3 Pro Analyzer', version: 'FIEBDC-3/2016', currency: '€', 
            dn: 2, dd: 2, ds: 2, dr: 3, di: 2, dp: 2, dc: 2, dm: 2 
        };
        this.rootCode = null;
        this.fileName = null; // [NUEVO] Almacena el nombre del fichero original
    }

    reset() {
        this.db.clear();
        this.measurementsMap.clear();
        this.parentMap.clear();
        this.rootCode = null;
        this.fileName = null;
        this.metadata.currency = '€';
    }

    createNew(projectName) {
        this.reset();
        
        let rootCode = projectName.trim();
        if (!rootCode) rootCode = "PROYECTO";
        if (!rootCode.endsWith('#')) rootCode += '##';
        
        this.rootCode = rootCode;
        this.fileName = null; // Es nuevo, no tiene fichero origen
        
        this.db.set(rootCode, {
            code: rootCode,
            unit: '',
            summary: projectName,
            price: 0,
            type: '0', 
            description: 'Proyecto creado con BC3 Pro Analyzer',
            children: []
        });
        
        this.metadata.owner = 'Usuario';
        this.metadata.software = 'BC3 Pro Analyzer';
    }

    async importPartial(content) {
        const lines = content.split(/\r\n|\n|\r/);
        let importedCount = 0;
        const newCodes = new Set();

        for (let line of lines) {
            if (!line.startsWith('~C')) continue;
            const p = line.split('|');
            const code = p[1]?.trim();
            if (!code) continue;

            if (this.db.has(code)) continue;

            const data = this.initConcept(code);
            data.unit = p[2] || '';
            data.summary = p[3] || '';
            const rawPrice = (p[4] || '0').split('\\')[0].replace(',', '.');
            data.price = parseFloat(rawPrice) || 0;
            data.type = p[6] || '0';
            
            newCodes.add(code);
            importedCount++;
        }

        for (let line of lines) {
            if (!line.startsWith('~D')) continue;
            const parts = line.split('|');
            const parentCode = parts[1]?.trim();
            
            if (!newCodes.has(parentCode)) continue; 

            const parent = this.resolveConcept(parentCode);
            if (!parent) continue;

            for (let i = 2; i < parts.length; i++) {
                const tokens = parts[i].split('\\');
                let j = 0;
                while (j < tokens.length) {
                    const childCode = tokens[j]?.trim();
                    if (childCode) {
                        const rawFactor = tokens[j+1] || '';
                        const rawYield = tokens[j+2] || '';
                        
                        const valFactor = parseFloat(rawFactor.replace(',', '.'));
                        const valYield = parseFloat(rawYield.replace(',', '.'));

                        parent.children.push({
                            code: childCode,
                            factor: isNaN(valFactor) ? 1 : valFactor,
                            yield: isNaN(valYield) ? 1 : valYield 
                        });
                        
                        const normChild = this.normalizeCode(childCode);
                        this.parentMap.set(normChild, parent.code);
                    }
                    j += 3;
                }
            }
        }

        let currentTextConcept = null;
        for (let line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('~T')) {
                const parts = line.split('|');
                const code = parts[1]?.trim();
                if (newCodes.has(code)) {
                    const concept = this.resolveConcept(code);
                    if (concept) {
                        let textPart = parts.slice(2).filter(t => t.trim() !== "").join('\n');
                        concept.description = textPart;
                        currentTextConcept = concept;
                    }
                } else {
                    currentTextConcept = null;
                }
            } else if (trimmedLine.startsWith('~')) {
                currentTextConcept = null; 
            } else if (currentTextConcept) {
                currentTextConcept.description += '\n' + line;
            }
        }
        
        return importedCount;
    }

    round(num) {
       // [MODIFICADO] Opción B: Aumentar margen de error para redondeo aritmético (Half Up)
        return Math.round((num + 0.0001) * 100) / 100;
    }

    normalizeCode(code) {
        return code ? code.replace(/#+$/, '') : '';
    }

    getParent(code) {
        let parentCode = this.parentMap.get(code);
        if (!parentCode) {
            const cleanCode = this.normalizeCode(code);
            parentCode = this.parentMap.get(cleanCode);
        }
        if (parentCode) return this.resolveConcept(parentCode);
        return null;
    }

    getBreadcrumbPath(code) {
        const path = [];
        let current = this.getParent(code); 

        while (current) {
            path.unshift(current.summary);
            current = this.getParent(current.code);
        }
        return path.join(" / ");
    }
    
    getTypeIcon(type) {
        switch(type) {
            case '1': return '👷';
            case '2': return '🚜';
            case '3': return '🧱';
            default: return '📄';
        }
    }
    
    recalculateProject() {
        console.time("Recalculate");
        this.recalculateAllMeasurements();
        this.updateQuantitiesFromMeasurements();
        if (this.rootCode) {
            this.calculateConceptPriceRecursively(this.rootCode, new Set());
        }
        console.timeEnd("Recalculate");
    }

    recalculateAllMeasurements() {
        for (const [key, measData] of this.measurementsMap) {
            let total = 0;
            measData.lines.forEach(m => {
                if (m.type === '1' || m.type === '2') return;
                let parcial = 0;
                const isFormula = m.type === '3';
                const formula = isFormula ? (m.comment || '') : '';
                if (isFormula && formula) {
                    parcial = this.evaluateFormula(formula, m.units, m.length, m.width, m.height);
                } else if (m.units !== 0 || m.length !== 0 || m.width !== 0 || m.height !== 0) {
                    const val = (v) => v === 0 ? 1 : v;
                    parcial = m.units * val(m.length) * val(m.width) * val(m.height);
                }
                parcial = this.round(parcial);
                total += parcial;
            });
            measData.total = this.round(total);
        }
    }

    updateQuantitiesFromMeasurements() {
        for (const [parentCode, parentConcept] of this.db) {
            parentConcept.children.forEach(child => {
                const measKey = `${parentCode}|${child.code}`;
                if (this.measurementsMap.has(measKey)) {
                    const mData = this.measurementsMap.get(measKey);
                    child.yield = mData.total;
                    child.factor = 1; 
                }
            });
        }
    }

    /**
     * Calcula el precio compuesto de un concepto.
     * Implementa ALGORITMO DE DOBLE PASADA para porcentajes.
     */
    calculateConceptPriceRecursively(code, visited) {
        const concept = this.resolveConcept(code);
        if (!concept) return 0;
        const realCode = concept.code;
        
        // Evitar ciclos infinitos
        if (visited.has(realCode)) return 0;
        visited.add(realCode);

        // Si es un concepto simple (sin hijos), devolver su precio directo
        if (concept.children.length === 0) {
            visited.delete(realCode);
            return concept.price;
        }

        // --- ALGORITMO DE DOBLE PASADA ---
        
        // Separar hijos en Normales y Porcentajes
        const normalChildren = [];
        const percentChildren = [];

        concept.children.forEach(child => {
            if (child.code.includes('%')) {
                percentChildren.push(child);
            } else {
                normalChildren.push(child);
            }
        });

        let totalPrice = 0;
        
        // Acumuladores por Naturaleza (Base Imponible)
        let sumMO = 0; // Tipo 1: Mano de Obra
        let sumMQ = 0; // Tipo 2: Maquinaria
        let sumMT = 0; // Tipo 3: Materiales
        let sumResto = 0; // Tipo 0 u otros

        // PASO 1: Calcular hijos NORMALES y acumular bases
        normalChildren.forEach(child => {
            const childPrice = this.calculateConceptPriceRecursively(child.code, visited);
            
            // Cálculo estándar: Importe = Precio * Factor * Rendimiento
            const cantidad = child.factor * child.yield;
            const lineCost = this.round(childPrice * cantidad);
            
            totalPrice += lineCost;

            // Clasificar importe según naturaleza para las bases imponibles
            const childConcept = this.resolveConcept(child.code);
            if (childConcept) {
                const type = childConcept.type;
                if (type === '1') sumMO += lineCost;
                else if (type === '2') sumMQ += lineCost;
                else if (type === '3') sumMT += lineCost;
                else sumResto += lineCost;
            } else {
                sumResto += lineCost;
            }
        });

        // PASO 2: Calcular hijos PORCENTAJE
        // Se aplican sobre los acumulados del Paso 1
        percentChildren.forEach(child => {
            // El "Precio" del concepto porcentaje actúa como el valor del porcentaje (ej. 13.00)
            const percentValue = this.calculateConceptPriceRecursively(child.code, visited);
            
            let baseImponible = 0;
            const uCode = child.code.toUpperCase();

            // Lógica de Selección de Base Imponible
            if (uCode.includes('%MO')) {
                baseImponible = sumMO;
            } else if (uCode.includes('%MQ')) {
                baseImponible = sumMQ;
            } else if (uCode.includes('%MT')) {
                baseImponible = sumMT;
            } else if (uCode.includes('%CI') || uCode.includes('%GG')) {
                // Costes Indirectos / Gastos Generales: Sobre el total de Costes Directos acumulados
                baseImponible = sumMO + sumMQ + sumMT + sumResto;
            } else {
                // Por defecto, asumimos aplicación sobre el total de Costes Directos
                baseImponible = sumMO + sumMQ + sumMT + sumResto;
            }

            // Actualización de la variable calculada (Cantidad)
            // Fórmula requerida: Importe = (Precio_Percent * Base) / 100
            // Para mantener compatibilidad con el cálculo estándar del motor (Precio * Cantidad),
            // establecemos la Cantidad (Yield) como Base / 100.
            const cantidadCalculada = baseImponible / 100;
            
            // Actualizamos los datos del hijo en memoria para que UI y Exportación sean consistentes
            child.yield = cantidadCalculada;
            child.factor = 1;

            // Cálculo del importe con redondeo a 2 decimales
            const lineCost = this.round(percentValue * cantidadCalculada);
            totalPrice += lineCost;
        });

        // PASO 3: Total Final
        concept.price = this.round(totalPrice);
        
        visited.delete(realCode);
        return concept.price;
    }

    async parse(content) {
        this.reset();
        const lines = content.split(/\r\n|\n|\r/);
        
        for (let line of lines) {
            if (!line.startsWith('~C')) continue;
            const p = line.split('|');
            const code = p[1]?.trim();
            if (!code) continue;
            const data = this.initConcept(code);
            data.unit = p[2] || '';
            data.summary = p[3] || '';
            const rawPrice = (p[4] || '0').split('\\')[0].replace(',', '.');
            data.price = parseFloat(rawPrice) || 0;
            data.type = p[6] || '0';
        }

        for (let line of lines) {
            const p = line.split('|');
            const t = p[0].replace('~', '').toUpperCase();
            if (t === 'V') { 
                this.metadata.owner = p[1] || '';
                this.metadata.version = p[2] || 'FIEBDC-3/2016';
                this.metadata.software = p[3] || 'BC3 Pro Analyzer';
            }
            if (t === 'K') { this.parseK(p); }
        }

        let currentTextConcept = null; 

        for (let line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('~')) {
                if (currentTextConcept && currentTextConcept.description && currentTextConcept.description.endsWith('|')) {
                    currentTextConcept.description = currentTextConcept.description.slice(0, -1);
                }
                currentTextConcept = null; 

                const parts = line.split('|');
                const tag = parts[0].replace('~', '').toUpperCase();
                let identifier = parts[1]?.trim();
                
                if (!identifier && tag !== 'T') continue;

                if (tag === 'D') {
                    const parent = this.resolveConcept(identifier);
                    if (!parent) continue;
                    
                    for (let i = 2; i < parts.length; i++) {
                        const tokens = parts[i].split('\\');
                        let j = 0;
                        while (j < tokens.length) {
                            const childCode = tokens[j]?.trim();
                            if (childCode) {
                                const rawFactor = tokens[j+1] || '';
                                const rawYield = tokens[j+2] || '';
                                
                                const valFactor = parseFloat(rawFactor.replace(',', '.'));
                                const valYield = parseFloat(rawYield.replace(',', '.'));

                                parent.children.push({
                                    code: childCode,
                                    factor: isNaN(valFactor) ? 1 : valFactor,
                                    yield: isNaN(valYield) ? 1 : valYield 
                                });
                                
                                this.parentMap.set(this.normalizeCode(childCode), parent.code);
                                if (childCode !== this.normalizeCode(childCode)) {
                                    this.parentMap.set(childCode, parent.code);
                                }
                            }
                            j += 3;
                        }
                    }
                } else if (tag === 'T') {
                    const concept = this.resolveConcept(identifier);
                    if (concept) {
                        let textPart = parts.slice(2).filter(t => t.trim() !== "").join('\n');
                        concept.description = textPart;
                        currentTextConcept = concept; 
                    }
                } else if (tag === 'M') {
                    this.processMeasurementRecord(parts);
                }
            } else if (currentTextConcept) {
                currentTextConcept.description += '\n' + line;
            }
        }
        
        this.metadata.dr = 3;
        
        this.identifyRoot();
    }

    parseK(parts) {
        const subK = parts[1] || '';
        const tokens = subK.split('\\').map(t => t.trim()).filter(t => t !== "");
        let numericCount = 0;
        const keys = ['dn','dd','ds','dr','di','dp','dc','dm'];
        for (let token of tokens) {
            if (!isNaN(token) && numericCount < 8) {
                this.metadata[keys[numericCount]] = Math.abs(parseInt(token)) || 2;
                numericCount++;
            } else if (isNaN(token)) {
                this.metadata.currency = token;
                break; 
            }
        }
    }

    processMeasurementRecord(parts) {
        let identifier = parts[1]?.trim();
        let rawParent = "";
        let rawChild = identifier;
        if (identifier.includes('\\')) {
            const parts_id = identifier.split('\\');
            rawChild = parts_id.pop();
            rawParent = parts_id.join('\\');
        }
        const parentConcept = this.resolveConcept(rawParent);
        const childConcept = this.resolveConcept(rawChild);
        const pKey = parentConcept ? parentConcept.code : rawParent;
        const cKey = childConcept ? childConcept.code : rawChild;
        const mKey = `${pKey}|${cKey}`;

        if (!this.measurementsMap.has(mKey)) {
            this.measurementsMap.set(mKey, { total: 0, lines: [] });
        }
        const mData = this.measurementsMap.get(mKey);
        
        mData.total = parseFloat((parts[3] || '0').replace(',', '.')) || 0;

        let detailTokens = [];
        for (let i = 4; i < parts.length; i++) {
            detailTokens = detailTokens.concat(parts[i].split('\\'));
        }
        for (let i = 0; i < detailTokens.length; i += 6) {
            if (i + 1 >= detailTokens.length) break;
            const type = detailTokens[i] || '';
            const comment = detailTokens[i+1] || '';
            const u = parseFloat((detailTokens[i+2] || '0').replace(',', '.')) || 0;
            const l = parseFloat((detailTokens[i+3] || '0').replace(',', '.')) || 0;
            const w = parseFloat((detailTokens[i+4] || '0').replace(',', '.')) || 0;
            const h = parseFloat((detailTokens[i+5] || '0').replace(',', '.')) || 0;
            if (type === '' && comment === '' && u === 0 && l === 0 && w === 0 && h === 0) continue;
            mData.lines.push({ type, comment, units: u, length: l, width: w, height: h });
        }
    }

    initConcept(code) {
        if (!this.db.has(code)) {
            this.db.set(code, {
                code, unit: '', summary: '', price: 0, 
                type: '0', description: '', children: []
            });
        }
        return this.db.get(code);
    }

    resolveConcept(code) {
        if (!code) return null;
        if (this.db.has(code)) return this.db.get(code);
        const base = code.replace(/#+$/, '');
        if (this.db.has(base + '##')) return this.db.get(base + '##');
        if (this.db.has(base + '#')) return this.db.get(base + '#');
        if (this.db.has(base)) return this.db.get(base);
        return null;
    }

    identifyRoot() {
        let root = Array.from(this.db.keys()).find(k => k.endsWith('##'));
        if (!root) root = Array.from(this.db.keys()).find(k => k.endsWith('#'));
        this.rootCode = root || Array.from(this.db.keys())[0];
        console.log("Root detected:", this.rootCode);
    }

    num(val, type) {
        const dec = this.metadata[type.toLowerCase()] || 2;
        if (isNaN(val)) return '-';
        // [MODIFICADO] Forzar agrupación de miles (punto) y decimales (coma)
        return val.toLocaleString('es-ES', { 
            minimumFractionDigits: dec, 
            maximumFractionDigits: dec, 
            useGrouping: true 
        });
    }

    formatCurrency(val, type = 'DC') {
        return this.num(val, type) + ' ' + this.metadata.currency;
    }
    
    evaluateFormula(expression, u, l, w, h) {
        try {
            const allowedChars = /^[0-9+\-*/().\s^abcdp,]+$/i;
            if (!allowedChars.test(expression)) {
                return 0;
            }
            let expr = expression.toLowerCase().replace(/,/g, '.').replace(/\^/g, '**');
            const a = u || 0;
            const b = l || 0;
            const c = w || 0;
            const d = h || 0;
            const p = Math.PI;
            const f = new Function('a', 'b', 'c', 'd', 'p', `return ${expr};`);
            return f(a, b, c, d, p);
        } catch (err) {
            return 0;
        }
    }

    // --- NUEVO: MACRO PARA APLICAR COSTES INDIRECTOS ---
    applyIndirectCosts(percentageVal) {
        if (!this.rootCode) return 0;

        // 1. Asegurar que existe el concepto %CI
        const ciCode = '%CI';
        if (!this.db.has(ciCode)) {
            this.db.set(ciCode, {
                code: ciCode,
                unit: '%',
                summary: 'Costes Indirectos',
                price: percentageVal,
                type: '0', 
                description: 'Porcentaje de Costes Indirectos aplicados a la ejecución material.',
                children: []
            });
        } else {
            // Actualizar precio si ya existe
            const ciConcept = this.db.get(ciCode);
            ciConcept.price = percentageVal;
        }

        // 2. Identificar partidas de la jerarquía principal (direct children of chapters)
        const hierarchyMemberCodes = new Set();
        for (const [code, concept] of this.db) {
            if (code.endsWith('#')) { // Chapters and Root often end in #
                concept.children.forEach(child => {
                    hierarchyMemberCodes.add(child.code);
                });
            }
        }

        let modifiedCount = 0;

        // 3. Iterar sobre todos los conceptos de la BD
        for (const [code, concept] of this.db) {
            // Filtrar: No Raíz (##), No Capítulo (#)
            if (code.endsWith('##') || code.endsWith('#')) continue;

            // Filtrar: Solo partidas con descomposición (hijos > 0)
            if (!concept.children || concept.children.length === 0) continue;

            // Filtrar: Debe pertenecer a la jerarquía principal (Partida de Obra)
            // Si no está en hierarchyMemberCodes, se considera auxiliar o descomposición de otro nivel
            if (!hierarchyMemberCodes.has(code)) continue;
            
            // Verificar si ya tiene el %CI añadido
            const hasCI = concept.children.some(child => child.code === ciCode);
            
            if (!hasCI) {
                concept.children.push({
                    code: ciCode,
                    factor: 1,
                    yield: 0 // Se calculará dinámicamente en calculateConceptPriceRecursively
                });
                modifiedCount++;
            }
        }

        return modifiedCount;
    }

    // --- NUEVO: MACRO BUSCAR Y REEMPLAZAR EN PLIEGOS ---
    replaceTextInDescriptions(searchText, replaceText) {
        if (!searchText) return 0;
        let modifiedCount = 0;
        
        for (const [code, concept] of this.db) {
            if (concept.description && concept.description.includes(searchText)) {
                // Usamos split y join para reemplazar todas las ocurrencias sin problemas de inyección regex
                concept.description = concept.description.split(searchText).join(replaceText);
                modifiedCount++;
            }
        }
        
        return modifiedCount;
    }

    exportToBC3() {
        const lines = [];
        
        // [MODIFICADO] Función para precios (2 decimales fijos) - USA PUNTO DECIMAL
        const fNumPrice = (n) => (n === undefined || n === null) ? '' : n.toFixed(2);
        
        // [MODIFICADO] Función para rendimientos y factores (3 decimales fijos) - USA PUNTO DECIMAL
        const fNumYield = (n) => (n === undefined || n === null) ? '' : n.toFixed(3);
        
        // [MODIFICADO] Función general (para mediciones y otros) - USA PUNTO DECIMAL
        const fNum = (n) => (n === undefined || n === null) ? '' : n.toString();
        // Modifico linea V para añadir sistema de caracteres ANSI
        lines.push(`~V|JSBSAN|${this.metadata.version}|BC3 Pro Analyzer||ANSI|`);
        
        // Sincronizamos metadatos para asegurar que el receptor sepa los decimales
        this.metadata.dr = 3; // Decimales de Rendimiento
        this.metadata.dc = 2; // Decimales de Coste (Precio)

        const kVals = [
            this.metadata.dn, this.metadata.dd, this.metadata.ds, 
            this.metadata.dr, this.metadata.di, this.metadata.dp, 
            this.metadata.dc, this.metadata.dm
        ].join('\\');
        lines.push(`~K|${kVals}\\${this.metadata.currency}|`);

        for (const [code, c] of this.db) {
            lines.push(`~C|${c.code}|${c.unit}|${c.summary}|${fNumPrice(c.price)}||${c.type}|`);
        }

        for (const [code, c] of this.db) {
            if (c.children && c.children.length > 0) {
                let dLine = `~D|${c.code}|`;
                const childParts = [];
                c.children.forEach(child => {
                    let exportYield = child.yield;
                    // [NUEVO] Si es porcentaje, exportar (Precio / 100) en lugar del rendimiento calculado
                    if (child.code.includes('%')) {
                        const childC = this.resolveConcept(child.code);
                        if (childC) {
                            exportYield = childC.price / 100;
                        }
                    }
                    childParts.push(`${child.code}\\${fNumYield(child.factor)}\\${fNumYield(exportYield)}`);
                });
                dLine += childParts.join('\\') + '|';
                lines.push(dLine);
            }
        }

        for (const [code, c] of this.db) {
            if (c.description) {
                const cleanDesc = c.description.replace(/\r\n|\r|\n/g, '|');
                lines.push(`~T|${c.code}|${cleanDesc}|`);
            }
        }

        for (const [key, mData] of this.measurementsMap) {
            const bc3Key = key.replace('|', '\\');
            let mLine = `~M|${bc3Key}||${fNum(mData.total)}|`;
            
            const lineParts = [];
            mData.lines.forEach(l => {
                lineParts.push(`${l.type}\\${l.comment}\\${fNum(l.units)}\\${fNum(l.length)}\\${fNum(l.width)}\\${fNum(l.height)}`);
            });
            
            if (lineParts.length > 0) {
                mLine += lineParts.join('\\') + '|';
                lines.push(mLine);
            }
        }

        return lines.join('\r\n');
    }
}

const engine = new BC3Engine();

// --- HELPER PARA SEGURIDAD DEL DOM ---
const setTextSafe = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
};

const ui = {
    editingMode: null,
    editingMeasKey: null,
    currentMeasKey: null,
    currentNode: null,
    
    // [NUEVO] Gestión del Modal Acerca de...
    openAboutModal: () => {
        const modal = document.getElementById('modal-about');
        if (modal) modal.classList.add('active');
    },

    closeAboutModal: () => {
        const modal = document.getElementById('modal-about');
        if (modal) modal.classList.remove('active');
    },
    
    // [NUEVO] Gestión del Modal de Ayuda
    openHelpModal: () => {
        const modal = document.getElementById('modal-help');
        if (modal) modal.classList.add('active');
    },

    closeHelpModal: () => {
        const modal = document.getElementById('modal-help');
        if (modal) modal.classList.remove('active');
    },

    // [NUEVO] Gestión del Modal de Macros
    openMacrosModal: () => {
        if (!engine.rootCode) {
            alert("No hay ningún proyecto cargado.");
            return;
        }
        const modal = document.getElementById('modal-macros');
        if (modal) modal.classList.add('active');
    },

    closeMacrosModal: () => {
        const modal = document.getElementById('modal-macros');
        if (modal) modal.classList.remove('active');
    },

    // [NUEVO] Ejecutar Macro de Costes Indirectos
    runMacroCI: () => {
        ui.closeMacrosModal();
        
        // 1. Pedir valor al usuario
        const input = prompt("Introduzca el porcentaje de Costes Indirectos a aplicar (ej: 13 para un 13%):", "13");
        
        if (input === null) return; // Cancelado por usuario
        
        const val = parseFloat(input.replace(',', '.'));
        if (isNaN(val) || val < 0) {
            alert("Por favor, introduzca un número válido.");
            return;
        }

        // 2. Ejecutar lógica en Engine
        const loader = document.getElementById('loader');
        const loaderText = document.getElementById('loader-text');
        
        if (loaderText) loaderText.textContent = "Aplicando Costes Indirectos...";
        if (loader) loader.style.display = 'flex';

        setTimeout(() => {
            try {
                const affectedCount = engine.applyIndirectCosts(val);
                
                // 3. Recalcular todo el proyecto
                engine.recalculateProject();
                renderAll(false); // Refrescar UI sin perder foco si es posible

                // 4. Feedback
                ui.showToast(`Macro finalizada. Se añadieron CI a ${affectedCount} partidas.`);
                
            } catch (e) {
                console.error(e);
                alert("Error ejecutando la macro: " + e.message);
            } finally {
                if (loader) loader.style.display = 'none';
                if (loaderText) loaderText.textContent = "Procesando...";
            }
        }, 50);
    },

    // [NUEVO] Macro Buscar y Reemplazar Textos
    runMacroReplaceText: () => {
        ui.closeMacrosModal();
        
        const searchText = prompt("Introduzca el texto exacto que desea buscar en los pliegos (textos largos):");
        if (!searchText) return; // Cancelado o vacío
        
        const replaceText = prompt("Texto encontrado será reemplazado por:\n(Deje en blanco para simplemente eliminar el texto buscado)");
        if (replaceText === null) return; // Cancelado
        
        const loader = document.getElementById('loader');
        const loaderText = document.getElementById('loader-text');
        
        if (loaderText) loaderText.textContent = "Reemplazando textos...";
        if (loader) loader.style.display = 'flex';

        setTimeout(() => {
            try {
                const affectedCount = engine.replaceTextInDescriptions(searchText, replaceText);
                
                // Refrescar la vista por si el texto afectado era del nodo seleccionado actualmente
                if (ui.currentNode) {
                    selectNode(ui.currentNode.code, null);
                }

                // Feedback
                ui.showToast(`Macro finalizada. Textos modificados en ${affectedCount} conceptos.`);
                
            } catch (e) {
                console.error(e);
                alert("Error ejecutando la macro: " + e.message);
            } finally {
                if (loader) loader.style.display = 'none';
                if (loaderText) loaderText.textContent = "Procesando...";
            }
        }, 50);
    },

    createNewProject: () => {
        const name = prompt("Introduzca el nombre del nuevo proyecto (Raíz):", "NUEVO PROYECTO");
        if(name) {
            const loader = document.getElementById('loader');
            if(loader) loader.style.display = 'flex';
            setTimeout(() => {
                engine.createNew(name);
                renderAll();
                ui.showToast("Proyecto creado con éxito");
                if(loader) loader.style.display = 'none';
            }, 50);
        }
    },

    navigate(action) {
        if (!ui.currentNode) return;
        const currentCode = ui.currentNode.code;
        const parent = engine.getParent(currentCode);
        
        switch(action) {
            case 'up':
                if (parent) {
                    const grandParent = engine.getParent(parent.code);
                    selectNode(parent.code, grandParent ? grandParent.code : null);
                }
                break;
            case 'down':
                if (ui.currentNode.children.length > 0) {
                    const firstChild = ui.currentNode.children[0];
                    selectNode(firstChild.code, currentCode);
                }
                break;
            case 'next':
                if (parent) {
                    const normCurrent = engine.normalizeCode(currentCode);
                    const index = parent.children.findIndex(child => engine.normalizeCode(child.code) === normCurrent);
                    if (index !== -1 && index < parent.children.length - 1) {
                        const nextSibling = parent.children[index + 1];
                        selectNode(nextSibling.code, parent.code);
                    }
                }
                break;
            case 'prev':
                if (parent) {
                    const normCurrent = engine.normalizeCode(currentCode);
                    const index = parent.children.findIndex(child => engine.normalizeCode(child.code) === normCurrent);
                    if (index > 0) {
                        const prevSibling = parent.children[index - 1];
                        selectNode(prevSibling.code, parent.code);
                    }
                }
                break;
        }
    },

    recalculate: () => {
        const loader = document.getElementById('loader');
        const loaderText = document.getElementById('loader-text');
        const savedCode = ui.currentNode ? ui.currentNode.code : null;

        if (loaderText) loaderText.textContent = "Recalculando Mediciones y Precios...";
        if (loader) loader.style.display = 'flex';
        
        setTimeout(() => {
            try {
                engine.recalculateProject();
                renderAll(false); 
                if (savedCode) {
                    const parent = engine.getParent(savedCode);
                    selectNode(savedCode, parent ? parent.code : null);
                } else if (engine.rootCode) {
                    selectNode(engine.rootCode, null);
                }
            } catch (e) {
                console.error(e);
                alert("Error durante el recálculo: " + e.message);
            } finally {
                if (loader) loader.style.display = 'none';
                if (loaderText) loaderText.textContent = "Procesando...";
            }
        }, 50);
    },

    saveFile: () => {
        if (engine.db.size === 0) {
            alert("No hay proyecto cargado para guardar.");
            return;
        }

        const bc3Content = engine.exportToBC3();
        
        const buf = new Uint8Array(bc3Content.length);
        const tempBuf = new Uint8Array(bc3Content.length); 
        
        for (let i = 0; i < bc3Content.length; i++) {
            const code = bc3Content.charCodeAt(i);
            
            if (code < 128) {
                tempBuf[i] = code;
            } else {
                switch(code) {
                    case 8364: tempBuf[i] = 128; break; // €
                    case 241: tempBuf[i] = 241; break; // ñ
                    case 209: tempBuf[i] = 209; break; // Ñ
                    case 186: tempBuf[i] = 186; break; // º
                    case 170: tempBuf[i] = 170; break; // ª
                    case 225: tempBuf[i] = 225; break; // á
                    case 233: tempBuf[i] = 233; break; // é
                    case 237: tempBuf[i] = 237; break; // í
                    case 243: tempBuf[i] = 243; break; // ó
                    case 250: tempBuf[i] = 250; break; // ú
                    case 193: tempBuf[i] = 193; break; // Á
                    case 201: tempBuf[i] = 201; break; // É
                    case 205: tempBuf[i] = 205; break; // Í
                    case 211: tempBuf[i] = 211; break; // Ó
                    case 218: tempBuf[i] = 218; break; // Ú
                    case 252: tempBuf[i] = 252; break; // ü
                    case 220: tempBuf[i] = 220; break; // Ü
                    case 191: tempBuf[i] = 191; break; // ¿
                    case 161: tempBuf[i] = 161; break; // ¡
                    default: tempBuf[i] = 63; // ? 
                }
            }
        }

        const blob = new Blob([tempBuf], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        // [MEJORA] Lógica de nombre de fichero inteligente
        const now = new Date();
        const dateStr = now.toISOString().slice(0,10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0,5).replace(':','-'); // HH-MM
        
        let baseName = "proyecto";
        
        if (engine.fileName) {
            baseName = engine.fileName;
        } else if (engine.rootCode) {
            const root = engine.resolveConcept(engine.rootCode);
            if (root && root.summary) {
                // Sanitizar nombre para evitar caracteres inválidos en OS
                baseName = root.summary.replace(/[^a-z0-9áéíóúñ_\-\s]/gi, '').trim();
            }
        }
        
        const finalFileName = `${baseName}_${dateStr}_${timeStr}.bc3`;

        const a = document.createElement('a');
        a.href = url;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    copyDecomposition: () => { 
        const tbody = document.getElementById('decomposition-body');
        if (!tbody) return;
        let text = "Código\tDescripción\tUd\tRendimiento\tPrecio\tImporte\n";
        for (let row of tbody.rows) {
            // Check that row has enough cells. First cell is button, so we skip it.
            // But we need to make sure we don't pick up empty rows.
            if (row.cells.length > 1) { 
                const cells = Array.from(row.cells).slice(1).map(c => c.innerText.trim());
                text += cells.join("\t") + "\n";
            }
        }
        ui.copyToClipboard(text, 'btn-copy-decomp');
    },
    
    copyMeasurements: () => { 
        const tbody = document.getElementById('measurements-body');
        if (!tbody) return;
        let text = "Tipo\tFase\tComentario\tN\tLongitud\tAnchura\tAltura\tFórmula\tParcial\tSubtotal\n";
        for (let row of tbody.rows) {
             if (row.cells.length > 1) {
                 const cells = Array.from(row.cells).slice(1).map(c => c.innerText.trim());
                 text += cells.join("\t") + "\n";
             }
        }
        ui.copyToClipboard(text, 'btn-copy-meas');
    },

    // [NUEVO] Función para pegar mediciones desde portapapeles
    pasteMeasurements: async () => {
        if (!ui.currentMeasKey) {
            ui.showToast("Seleccione una partida primero.");
            return;
        }

        try {
            const text = await navigator.clipboard.readText();
            if (!text || !text.trim()) return;

            const rows = text.split(/\r\n|\n|\r/);
            const parsedRows = [];

            rows.forEach((row, index) => {
                if (!row.trim()) return;
                const cols = row.split('\t');
                
                // Mapeo solicitado:
                // Col 0: Comentario
                // Col 1: N (Unidades)
                // Col 2: L (Longitud)
                // Col 3: A (Anchura)
                // Col 4: H (Altura)
                // Col 5: Fórmula (si existe y tiene valor, sobrescribe comportamiento)
                
                const rawComment = cols[0] ? cols[0].trim() : "";
                const rawN = cols[1] ? cols[1].replace(',', '.').trim() : ""; // Sanitizar decimales
                const rawL = cols[2] ? cols[2].replace(',', '.').trim() : "";
                const rawA = cols[3] ? cols[3].replace(',', '.').trim() : "";
                const rawH = cols[4] ? cols[4].replace(',', '.').trim() : "";
                const rawF = cols[5] ? cols[5].trim() : "";

                const valN = parseFloat(rawN);
                const valL = parseFloat(rawL);
                const valA = parseFloat(rawA);
                const valH = parseFloat(rawH);

                // Detección de cabecera en la primera fila: Si alguna columna dimensional tiene texto
                if (index === 0) {
                    const isHeader = (rawN && isNaN(valN)) || (rawL && isNaN(valL)) || (rawA && isNaN(valA)) || (rawH && isNaN(valH));
                    if (isHeader) return; // Saltar esta fila
                }

                let type = "";
                let comment = rawComment;
                
                // Si hay fórmula en la columna 6, esto tiene prioridad
                if (rawF) {
                    type = "3";
                    comment = rawF; 
                }

                parsedRows.push({
                    type: type,
                    comment: comment,
                    units: isNaN(valN) ? 0 : valN,
                    length: isNaN(valL) ? 0 : valL,
                    width: isNaN(valA) ? 0 : valA,
                    height: isNaN(valH) ? 0 : valH
                });
            });

            if (parsedRows.length > 0) {
                let measData = engine.measurementsMap.get(ui.currentMeasKey);
                if (!measData) {
                    measData = { total: 0, lines: [] };
                    engine.measurementsMap.set(ui.currentMeasKey, measData);
                }
                
                // Añadir las nuevas filas
                measData.lines.push(...parsedRows);
                
                // Recalcular y refrescar UI
                ui.recalculate();
                ui.showToast(`Pegadas ${parsedRows.length} líneas de medición.`);
            } else {
                ui.showToast("No se encontraron líneas válidas para pegar.");
            }

        } catch (err) {
            console.error("Error al leer portapapeles:", err);
            alert("No se pudo acceder al portapapeles. Verifique los permisos del navegador.");
        }
    },
    
    copyText: () => { 
        const content = document.getElementById('long-text-content');
        if (!content) return;
        ui.copyToClipboard(content.innerText, 'btn-copy-text');
    },
    
    copyToClipboard: async (text, btnId) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                ui.showCopyFeedback(btnId);
                return;
            } catch (err) {
                console.warn('Fallo Clipboard API, usando fallback...', err);
            }
        }
        ui.fallbackCopyTextToClipboard(text, btnId);
    },

    fallbackCopyTextToClipboard: (text, btnId) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed'; 
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (btnId) ui.showCopyFeedback(btnId);
        } catch (err) {
            console.error('Error al copiar (Fallback)', err);
            alert("No se pudo copiar al portapapeles. Permisos denegados.");
        }
        document.body.removeChild(textArea);
    },

    showCopyFeedback: (btnId) => {
        const btn = document.getElementById(btnId);
        if(btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;
            setTimeout(() => btn.innerHTML = originalHTML, 1500);
        }
    },
    
    // --- NUEVO: SISTEMA TOAST ---
    showToast: (message) => {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-bold z-[3000] transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2 border border-slate-600';
            toast.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span id="toast-text"></span>
            `;
            document.body.appendChild(toast);
        }
        
        document.getElementById('toast-text').textContent = message;
        
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        if (ui.toastTimeout) clearTimeout(ui.toastTimeout);
        ui.toastTimeout = setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
        }, 2000);
    },

    setupAutocompleteListener: () => {
        const codeInput = document.getElementById('decomp-code');
        const summaryInput = document.getElementById('decomp-summary');
        const unitInput = document.getElementById('decomp-unit');
        const typeSelect = document.getElementById('decomp-type');
        
        if (codeInput) {
            codeInput.addEventListener('blur', (e) => {
                if(ui.editingMode !== 'decomp_add') return; 
                
                const code = e.target.value.trim();
                if(!code) return;
                
                const existing = engine.resolveConcept(code);
                if(existing) {
                    if(summaryInput) {
                        summaryInput.value = existing.summary;
                        summaryInput.setAttribute('readonly', 'true');
                        summaryInput.classList.add('bg-slate-50', 'text-slate-500');
                    }
                    if(unitInput) {
                        unitInput.value = existing.unit || '';
                        unitInput.setAttribute('readonly', 'true');
                        unitInput.classList.add('bg-slate-50', 'text-slate-500');
                    }
                    if(typeSelect) {
                        typeSelect.value = existing.type || '0';
                        typeSelect.setAttribute('disabled', 'true');
                        typeSelect.classList.add('bg-slate-50', 'text-slate-500');
                    }
                } else {
                    if(summaryInput) {
                        summaryInput.value = "";
                        summaryInput.removeAttribute('readonly');
                        summaryInput.classList.remove('bg-slate-50', 'text-slate-500');
                        summaryInput.focus();
                    }
                    if(unitInput) {
                        unitInput.value = "";
                        unitInput.removeAttribute('readonly');
                        unitInput.classList.remove('bg-slate-50', 'text-slate-500');
                    }
                    if(typeSelect) {
                        typeSelect.value = "0";
                        typeSelect.removeAttribute('disabled');
                        typeSelect.classList.remove('bg-slate-50', 'text-slate-500');
                    }
                }
            });
        }
    },

    openEditDecomp(index) {
        if (!ui.currentNode) return;
        const child = ui.currentNode.children[index];
        if (!child) return;
        
        ui.editingMode = 'decomp';
        setTextSafe('modal-title', "Editar Descompuesto");
        
        document.getElementById('form-decomp').classList.remove('hidden');
        document.getElementById('form-meas').classList.add('hidden');
        document.getElementById('form-text-edit').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        
        document.getElementById('decomp-index').value = index;
        
        const codeInput = document.getElementById('decomp-code');
        if(codeInput) {
            codeInput.value = child.code;
            codeInput.setAttribute('readonly', 'true');
            codeInput.classList.add('bg-slate-50', 'text-blue-600');
            codeInput.classList.remove('bg-white', 'text-slate-700');
        }

        // [NUEVO] Sincronizar estado del checkbox en edición y desactivarlo
        const chkChapter = document.getElementById('decomp-is-chapter');
        if(chkChapter) {
            chkChapter.checked = child.code.endsWith('#');
            chkChapter.disabled = true; // [CAMBIO] Desactivar checkbox en modo edición
        }

        const cData = engine.resolveConcept(child.code);
        
        const summaryInput = document.getElementById('decomp-summary');
        if(summaryInput) {
            summaryInput.value = cData ? cData.summary : '';
            summaryInput.removeAttribute('readonly');
        }

        const unitInput = document.getElementById('decomp-unit');
        if(unitInput) {
            unitInput.value = cData ? (cData.unit || '') : '';
            unitInput.removeAttribute('readonly');
            unitInput.classList.remove('bg-slate-50', 'text-slate-500');
        }

        const typeSelect = document.getElementById('decomp-type');
        if(typeSelect) {
            typeSelect.value = cData ? (cData.type || '0') : '0';
            typeSelect.removeAttribute('disabled');
            typeSelect.classList.remove('bg-slate-50', 'text-slate-500');
        }

        const fFactor = document.getElementById('decomp-factor');
        if(fFactor) fFactor.value = child.factor;
        
        const fYield = document.getElementById('decomp-yield');
        if(fYield) fYield.value = child.yield;

        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.remove('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openAddDecomp() {
        if (!ui.currentNode) return;
        ui.editingMode = 'decomp_add';
        setTextSafe('modal-title', "Añadir Descompuesto");
        
        document.getElementById('form-decomp').classList.remove('hidden');
        document.getElementById('form-meas').classList.add('hidden');
        document.getElementById('form-text-edit').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        document.getElementById('decomp-index').value = -1;
        
        const codeInput = document.getElementById('decomp-code');
        if(codeInput) {
            codeInput.removeAttribute('readonly');
            codeInput.classList.remove('bg-slate-50', 'text-blue-600'); 
            codeInput.classList.add('bg-white', 'text-slate-700'); 
            codeInput.value = "";
        }

        // [NUEVO] Resetear checkbox al abrir formulario de añadir y activarlo
        const chkChapter = document.getElementById('decomp-is-chapter');
        if(chkChapter) {
            chkChapter.checked = false;
            chkChapter.disabled = false; // [CAMBIO] Activar checkbox en modo añadir
        }

        const summaryInput = document.getElementById('decomp-summary');
        if(summaryInput) {
            summaryInput.removeAttribute('readonly');
            summaryInput.classList.remove('bg-slate-50', 'text-slate-500');
            summaryInput.value = "";
        }

        const unitInput = document.getElementById('decomp-unit');
        if(unitInput) {
            unitInput.removeAttribute('readonly');
            unitInput.classList.remove('bg-slate-50', 'text-slate-500');
            unitInput.value = "";
        }

        const typeSelect = document.getElementById('decomp-type');
        if(typeSelect) {
            typeSelect.removeAttribute('disabled');
            typeSelect.classList.remove('bg-slate-50', 'text-slate-500');
            typeSelect.value = "0";
        }

        const fFactor = document.getElementById('decomp-factor');
        if(fFactor) fFactor.value = "1";
        
        const fYield = document.getElementById('decomp-yield');
        if(fYield) fYield.value = "";
        
        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openEditMeas(measKey, index) {
        const measData = engine.measurementsMap.get(measKey);
        if (!measData || !measData.lines[index]) return;
        const line = measData.lines[index];
        ui.editingMode = 'meas';
        ui.editingMeasKey = measKey;
        setTextSafe('modal-title', "Editar Medición");
        
        document.getElementById('form-meas').classList.remove('hidden');
        document.getElementById('form-decomp').classList.add('hidden');
        document.getElementById('form-text-edit').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        document.getElementById('meas-index').value = index;
        
        const elType = document.getElementById('meas-type'); if(elType) elType.value = line.type || "";
        const elComm = document.getElementById('meas-comment'); if(elComm) elComm.value = line.comment || "";
        const elU = document.getElementById('meas-u'); if(elU) elU.value = line.units !== 0 ? line.units : "";
        const elL = document.getElementById('meas-l'); if(elL) elL.value = line.length !== 0 ? line.length : "";
        const elW = document.getElementById('meas-w'); if(elW) elW.value = line.width !== 0 ? line.width : "";
        const elH = document.getElementById('meas-h'); if(elH) elH.value = line.height !== 0 ? line.height : "";

        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.remove('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openAddMeas() {
        if (!ui.currentNode) return;
        
        ui.editingMeasKey = ui.currentMeasKey || ui.currentNode.code;
        
        ui.editingMode = 'meas_add';
        setTextSafe('modal-title', "Añadir Medición");
        
        document.getElementById('form-meas').classList.remove('hidden');
        document.getElementById('form-decomp').classList.add('hidden');
        document.getElementById('form-text-edit').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        
        document.getElementById('meas-index').value = -1; 
        const elType = document.getElementById('meas-type'); if(elType) elType.value = "";
        const elComm = document.getElementById('meas-comment'); if(elComm) elComm.value = "";
        const elU = document.getElementById('meas-u'); if(elU) elU.value = "";
        const elL = document.getElementById('meas-l'); if(elL) elL.value = "";
        const elW = document.getElementById('meas-w'); if(elW) elW.value = "";
        const elH = document.getElementById('meas-h'); if(elH) elH.value = "";
        
        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openEditSummary() {
        if (!ui.currentNode) return;
        ui.editingMode = 'summary';
        setTextSafe('modal-title', "Editar Resumen");
        
        document.getElementById('form-text-edit').classList.remove('hidden');
        document.getElementById('form-decomp').classList.add('hidden');
        document.getElementById('form-meas').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        setTextSafe('lbl-text-edit', "Resumen (Título Corto)");
        
        const input = document.getElementById('input-text-edit');
        if(input) {
            input.value = ui.currentNode.summary;
            input.rows = 2;
        }

        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openEditText() {
        if (!ui.currentNode) return;
        ui.editingMode = 'text';
        setTextSafe('modal-title', "Editar Texto Largo");
        
        document.getElementById('form-text-edit').classList.remove('hidden');
        document.getElementById('form-decomp').classList.add('hidden');
        document.getElementById('form-meas').classList.add('hidden');
        document.getElementById('form-price').classList.add('hidden');
        setTextSafe('lbl-text-edit', "Texto Descriptivo (~T)");
        
        const input = document.getElementById('input-text-edit');
        if(input) {
            input.value = ui.currentNode.description || "";
            input.rows = 10;
        }

        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    openEditPrice() {
        if (!ui.currentNode) return;
        ui.editingMode = 'price';
        setTextSafe('modal-title', "Editar Precio Simple");
        
        document.getElementById('form-price').classList.remove('hidden');
        document.getElementById('form-text-edit').classList.add('hidden');
        document.getElementById('form-decomp').classList.add('hidden');
        document.getElementById('form-meas').classList.add('hidden');
        
        const input = document.getElementById('input-price');
        if(input) input.value = ui.currentNode.price;

        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden');

        // [MODIFICADO] Mostrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.remove('hidden');
    },

    closeModal() {
        const btnDelete = document.getElementById('btn-delete-modal');
        if(btnDelete) btnDelete.classList.add('hidden'); 
        
        // [MODIFICADO] Cerrar Ventana Flotante (no modal)
        const win = document.getElementById('edit-window');
        if(win) win.classList.add('hidden');
    },

    toggleListWindow: () => {
        const win = document.getElementById('floating-list-window');
        if (win.classList.contains('hidden')) {
            win.classList.remove('hidden');
            // Refrescar lista al abrir por si hubo cambios
            renderList(document.getElementById('search-input').value);
        } else {
            win.classList.add('hidden');
        }
    },

    initDraggable: (elmnt) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(elmnt.id + "-header");
        
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },

    deleteEntry() {
        if (!confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) return;

        if (ui.editingMode === 'decomp') {
            const index = parseInt(document.getElementById('decomp-index').value);
            if (ui.currentNode && ui.currentNode.children) {
                ui.currentNode.children.splice(index, 1);
            }
        } else if (ui.editingMode === 'meas') {
            const index = parseInt(document.getElementById('meas-index').value);
            const measData = engine.measurementsMap.get(ui.editingMeasKey);
            if (measData && measData.lines) {
                measData.lines.splice(index, 1);
            }
        }

        ui.closeModal();
        ui.recalculate();
    },

    saveEdit() {
        if (ui.editingMode === 'decomp') {
            if (!ui.currentNode) return;
            const index = parseInt(document.getElementById('decomp-index').value);
            const factor = parseFloat(document.getElementById('decomp-factor').value) || 0;
            const yieldVal = parseFloat(document.getElementById('decomp-yield').value) || 0;
            const codeVal = document.getElementById('decomp-code').value;
            
            ui.currentNode.children[index].factor = factor;
            ui.currentNode.children[index].yield = yieldVal;

            const existing = engine.resolveConcept(codeVal);
            if (existing) {
                existing.summary = document.getElementById('decomp-summary').value.trim();
                existing.unit = document.getElementById('decomp-unit').value.trim();
                existing.type = document.getElementById('decomp-type').value;
            }

        } else if (ui.editingMode === 'decomp_add') {
             if (!ui.currentNode) return;
             let codeVal = document.getElementById('decomp-code').value.trim();
             const summaryVal = document.getElementById('decomp-summary').value.trim();
             const unitVal = document.getElementById('decomp-unit').value.trim();
             const typeVal = document.getElementById('decomp-type').value;
             
             // [NUEVO] Lógica para añadir '#' si el checkbox está marcado
             const chkChapter = document.getElementById('decomp-is-chapter');
             if (chkChapter && chkChapter.checked) {
                 if (codeVal && !codeVal.endsWith('#')) {
                     codeVal += '#';
                 }
             }
             
             if(codeVal) {
                 if (!engine.db.has(codeVal)) {
                     engine.db.set(codeVal, {
                         code: codeVal,
                         summary: summaryVal || "Nuevo concepto",
                         unit: unitVal || '',
                         price: 0,
                         type: typeVal,
                         children: [],
                         offers: [],
                         isRoot: false,
                         isChapter: false
                     });
                 }
                 
                 const newChild = {
                     code: codeVal,
                     factor: parseFloat(document.getElementById('decomp-factor').value) || 1,
                     yield: parseFloat(document.getElementById('decomp-yield').value) || 0
                 };
                 ui.currentNode.children.push(newChild);
                 
                 engine.parentMap.set(engine.normalizeCode(codeVal), ui.currentNode.code);
             }
        } else if (ui.editingMode === 'meas') {
            const index = parseInt(document.getElementById('meas-index').value);
            const measData = engine.measurementsMap.get(ui.editingMeasKey);
            if (measData) {
                measData.lines[index] = {
                    type: document.getElementById('meas-type').value,
                    comment: document.getElementById('meas-comment').value,
                    units: parseFloat(document.getElementById('meas-u').value) || 0,
                    length: parseFloat(document.getElementById('meas-l').value) || 0,
                    width: parseFloat(document.getElementById('meas-w').value) || 0,
                    height: parseFloat(document.getElementById('meas-h').value) || 0
                };
            }
        } else if (ui.editingMode === 'meas_add') {
            const newLine = {
                type: document.getElementById('meas-type').value,
                comment: document.getElementById('meas-comment').value,
                units: parseFloat(document.getElementById('meas-u').value) || 0,
                length: parseFloat(document.getElementById('meas-l').value) || 0,
                width: parseFloat(document.getElementById('meas-w').value) || 0,
                height: parseFloat(document.getElementById('meas-h').value) || 0
            };
            let measData = engine.measurementsMap.get(ui.editingMeasKey);
            if (!measData) {
                measData = { total: 0, lines: [] };
                engine.measurementsMap.set(ui.editingMeasKey, measData);
            }
            measData.lines.push(newLine);
        } else if (ui.editingMode === 'summary') {
            if (ui.currentNode) {
                ui.currentNode.summary = document.getElementById('input-text-edit').value;
                setTextSafe('detail-summary', ui.currentNode.summary);
                renderAll(false); 
            }
        } else if (ui.editingMode === 'text') {
            if (ui.currentNode) {
                ui.currentNode.description = document.getElementById('input-text-edit').value;
                const parent = engine.getParent(ui.currentNode.code);
                selectNode(ui.currentNode.code, parent ? parent.code : null);
            }
        } else if (ui.editingMode === 'price') {
            if (ui.currentNode) {
                ui.currentNode.price = parseFloat(document.getElementById('input-price').value) || 0;
            }
        }
        ui.closeModal();
        if (['decomp', 'decomp_add', 'meas', 'price', 'meas_add'].includes(ui.editingMode)) {
                ui.recalculate(); 
        }
    },

    // [NUEVO] Función para añadir el concepto seleccionado como hijo de la partida actual
    addConceptToCurrentNode: (childCode) => {
        if (!ui.currentNode) {
            ui.showToast("Seleccione primero una partida destino en el árbol.");
            return;
        }
        
        // Evitar auto-referencia
        if (ui.currentNode.code === childCode) {
            ui.showToast("No puedes añadir una partida a sí misma.");
            return;
        }

        // Crear la relación hijo
        const newChild = {
            code: childCode,
            factor: 1,
            yield: 1
        };
        
        // Añadir al modelo
        ui.currentNode.children.push(newChild);
        engine.parentMap.set(engine.normalizeCode(childCode), ui.currentNode.code);

        // Feedback y Recálculo
        ui.recalculate(); // Esto ya refresca la vista
        ui.showToast(`Añadido ${childCode} a ${ui.currentNode.code}`);
    }
};

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const handleSearch = debounce((e) => {
    renderList(e.target.value);
}, 300);

function renderList(filterText = '') {
    const container = document.getElementById('list-container');
    container.innerHTML = '';
    if (engine.db.size === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">No hay datos cargados.</div>';
        return;
    }
    const filter = filterText.toLowerCase();
    let count = 0;
    const maxItems = 500; 
    
    const fragment = document.createDocumentFragment();

    for (const [code, concept] of engine.db) {
        if (filter && !code.toLowerCase().includes(filter) && !concept.summary.toLowerCase().includes(filter)) {
            continue;
        }
        const div = document.createElement('div');
        // [MODIFICADO] Añadida clase 'group' y 'relative' para manejar el hover del botón
        div.className = "flex flex-col p-2 border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors relative group";
        div.title = "Click: Copiar Código | Doble Click: Ver Detalle";
        
        div.innerHTML = `
            <div class="flex justify-between items-baseline mb-1">
                <span class="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">${concept.code}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] text-slate-400">${concept.unit || '-'}</span>
                    <!-- [NUEVO] Botón de Añadir Rápido (visible solo en hover) -->
                    <button class="btn-add-to-decomp bg-green-100 hover:bg-green-200 text-green-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Añadir a la partida actual">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="text-xs text-slate-700 font-medium truncate">${concept.summary}</div>
            <div class="text-[10px] text-slate-400 text-right mt-1 font-mono">${engine.formatCurrency(concept.price, 'DC')}</div>
        `;
        
        // Manejador del botón Añadir
        const btnAdd = div.querySelector('.btn-add-to-decomp');
        if (btnAdd) {
            btnAdd.onclick = (e) => {
                e.stopPropagation(); // Evitar que se dispare el click del div (copiar)
                ui.addConceptToCurrentNode(code);
            };
        }

        let clickTimer = null;

        // Lógica Click (Copiar) vs Doble Click (Navegar)
        div.onclick = (e) => {
            // Si el click fue en el botón, ya se manejó con stopPropagation, esto no debería ejecutarse si burbujea correctamente, 
            // pero por seguridad verificamos target.
            if(e.target.closest('.btn-add-to-decomp')) return;

            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
            } else {
                clickTimer = setTimeout(() => {
                    // Acción Single Click: Copiar Código
                    clickTimer = null;
                    navigator.clipboard.writeText(concept.code)
                        .then(() => ui.showToast(`Copiado: ${concept.code}`))
                        .catch(err => console.error("Error copiando", err));
                    
                    // Feedback visual
                    const oldClass = div.className;
                    div.classList.add("bg-green-50");
                    setTimeout(() => div.className = oldClass, 200);

                }, 250); 
            }
        };

        div.ondblclick = (e) => {
             if(e.target.closest('.btn-add-to-decomp')) return;

            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
            }
            // Acción Doble Click: Navegar
            document.querySelectorAll('.list-item-selected').forEach(el => el.classList.remove('list-item-selected'));
            div.classList.add('list-item-selected');
            const parent = engine.getParent(code);
            selectNode(code, parent ? parent.code : null);
        };

        fragment.appendChild(div);
        count++;
        if (count >= maxItems) {
            const more = document.createElement('div');
            more.className = "p-2 text-center text-xs text-slate-400 italic bg-slate-50";
            more.innerText = `... y otros ${engine.db.size - count} resultados más. Refina la búsqueda.`;
            fragment.appendChild(more);
            break;
        }
    }

    if (count === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">No se encontraron resultados.</div>';
    } else {
        container.appendChild(fragment);
    }
}

function renderAll(autoSelect = true) {
    // [CORRECCIÓN CRÍTICA] Usar función segura para evitar crash si faltan IDs
    setTextSafe('status-version', `Formato: ${engine.metadata.version}`);
    setTextSafe('status-software', `Emisor: ${engine.metadata.software}`);
    setTextSafe('status-currency', `Divisa: ${engine.metadata.currency}`);
    setTextSafe('nodes-count', `${engine.db.size}`);
    
    const container = document.getElementById('tree-container');
    if (!container) return; // Evitar error si no existe el contenedor
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();

    if (engine.rootCode) {
        const rootNode = buildTreeNode(engine.rootCode, "");
        if (rootNode) {
            fragment.appendChild(rootNode);
        }
        
        if (autoSelect) {
            setTimeout(() => selectNode(engine.rootCode, ""), 0);
        }
    }

    container.appendChild(fragment);

    // Actualizar lista si está visible
    if (!document.getElementById('floating-list-window').classList.contains('hidden')) {
        renderList();
    }
}

function buildTreeNode(code, parentCode, level = 0, visited = new Set()) {
    const concept = engine.resolveConcept(code);
    if (!concept) return null;
    
    const visitKey = `${parentCode}->${code}`;
    if (visited.has(visitKey)) return null;
    visited.add(visitKey);

    const container = document.createElement('div');
    const isRoot = concept.code.endsWith('##');
    const isChapter = concept.code.endsWith('#');
    const hasChildren = concept.children.length > 0;

    let icon = engine.getTypeIcon(concept.type);
    if (isRoot) icon = '🏗️';
    else if (isChapter || hasChildren) icon = '📂';

    const row = document.createElement('div');
    row.className = `group flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent my-0.5 select-none`;
    row.setAttribute('data-node-code', code); 

    let labelClass = 'text-slate-600 font-medium';
    if (isRoot) { labelClass = 'text-blue-700 font-black text-xs uppercase'; row.classList.add('bg-blue-50/50'); }
    else if (isChapter || hasChildren) { labelClass = 'text-slate-800 font-bold'; }

    row.innerHTML = `
        <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center text-sm">${icon}</span>
        <div class="flex flex-col overflow-hidden">
            <span class="text-[9px] font-black font-mono text-slate-400 leading-none">${concept.code}</span>
            <span class="truncate text-[11px] ${labelClass} leading-tight mt-0.5">${concept.summary}</span>
        </div>
    `;

    row.onclick = (e) => {
        e.stopPropagation();
        selectNode(code, parentCode);
    };

    container.appendChild(row);

    if (hasChildren) {
        const childWrapper = document.createElement('div');
        childWrapper.className = "chapter-line";
        if (level > 2) { 
            childWrapper.style.display = 'none';
            row.innerHTML += `<span class="ml-auto text-xs text-slate-400">▼</span>`;
        }

        concept.children.forEach(child => {
            const childNode = buildTreeNode(child.code, concept.code, level + 1, visited);
            if (childNode) {
                childWrapper.appendChild(childNode);
            }
        });
        container.appendChild(childWrapper);

        row.ondblclick = (e) => {
            e.stopPropagation();
            const isHidden = childWrapper.style.display === 'none';
            childWrapper.style.display = isHidden ? 'block' : 'none';
        };
        if (level > 2) {
             row.onclick = (e) => {
                e.stopPropagation();
                selectNode(code, parentCode);
                childWrapper.style.display = 'block';
            };
        }
    }
    return container;
}

let currentSelectedCode = null;

function selectNode(code, parentPath) {
    const concept = engine.resolveConcept(code);
    if (!concept) return;

    ui.currentNode = concept; 
    currentSelectedCode = code;

    document.querySelectorAll('.tree-node-selected').forEach(el => el.classList.remove('tree-node-selected'));
    
    try {
        const treeNode = document.querySelector(`[data-node-code="${code}"]`);
        if (treeNode) {
            treeNode.classList.add('tree-node-selected');
            treeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch(e) { console.warn("Error seleccionando nodo visual", e); }

    const emptyState = document.getElementById('detail-empty'); if(emptyState) emptyState.classList.add('hidden');
    const breadHeader = document.getElementById('breadcrumb-header'); if(breadHeader) breadHeader.classList.remove('hidden'); 
    const selHeader = document.getElementById('selection-header'); if(selHeader) selHeader.classList.remove('hidden');
    const detContent = document.getElementById('detail-content'); if(detContent) detContent.classList.remove('hidden');

    setTextSafe('breadcrumb-text', engine.getBreadcrumbPath(code));
    setTextSafe('detail-code', concept.code);
    
    let btnWrapper = document.getElementById('btn-edit-price-wrapper');
    const summaryTitle = document.getElementById('detail-summary');

    if (!btnWrapper || !summaryTitle || (summaryTitle.parentNode && !summaryTitle.parentNode.classList.contains('group'))) {
            const headerTextContainer = document.querySelector('#selection-header .flex-1');
            if (headerTextContainer) {
                headerTextContainer.innerHTML = `
                <span id="detail-code" class="text-2xl font-black font-mono text-white bg-blue-600 px-4 py-2 rounded-lg uppercase tracking-widest inline-block mb-1 shadow-sm">${concept.code}</span>
                <div class="flex items-center gap-2 group cursor-pointer" onclick="ui.openEditSummary()">
                    <h2 id="detail-summary" class="text-xl font-extrabold text-slate-800 mt-2 leading-tight truncate group-hover:text-blue-700 transition-colors" title="Clic para editar">${concept.summary}</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
                <div class="flex items-center gap-4 mt-2">
                    <span id="detail-unit" class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded italic">Ud: ${concept.unit || 'n/a'}</span>
                    <div class="flex items-center gap-2">
                        <span id="detail-price" class="text-xs font-bold text-slate-500">Precio Unitario (DC): <span class="text-blue-600 font-black"></span></span>
                        <span id="btn-edit-price-wrapper"></span>
                    </div>
                </div>
                `;
                btnWrapper = document.getElementById('btn-edit-price-wrapper');
            }
    } else {
        setTextSafe('detail-summary', concept.summary);
        setTextSafe('detail-unit', `Ud: ${concept.unit || 'n/a'}`);
    }

    const priceSpan = document.querySelector('#detail-price span');
    if (priceSpan) priceSpan.innerText = engine.formatCurrency(concept.price, 'DC');
    
    if (btnWrapper) {
        const isSimple = concept.children.length === 0;
        if (isSimple) {
            btnWrapper.innerHTML = `<button onclick="ui.openEditPrice()" class="text-slate-300 hover:text-blue-600 transition-colors" title="Editar Precio"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>`;
        } else {
            btnWrapper.innerHTML = '';
        }
    }
    
    let measKey = concept.code;
    let parentCode = parentPath;
    
    if (!parentCode) {
        const parent = engine.getParent(concept.code);
        if (parent) parentCode = parent.code;
    }
    
    if (parentCode) {
        const parts = parentCode.split('\\');
        const directParent = parts[parts.length - 1];
        measKey = `${directParent}|${concept.code}`;
        if (!engine.measurementsMap.has(measKey)) {
             if (engine.measurementsMap.has(concept.code)) {
                 measKey = concept.code;
             } 
             else {
                 for (const k of engine.measurementsMap.keys()) {
                    if (k === concept.code || k.endsWith(`|${concept.code}`)) {
                        measKey = k;
                        break;
                    }
                }
             }
        }
    }

    ui.currentMeasKey = measKey; 
    const mData = engine.measurementsMap.get(measKey) || { total: 0, lines: [] };

    let totalVal = 0;
    if (concept.code.includes('#')) {
        totalVal = concept.price;
    } else {
        totalVal = concept.price * (mData.total || 0);
    }
    
    setTextSafe('detail-total', engine.formatCurrency(totalVal, 'DM'));

    const decBody = document.getElementById('decomposition-body');
    if(decBody) {
        decBody.innerHTML = '';
        
        if (concept.children.length === 0) {
            decBody.innerHTML = `<tr><td colspan="7" class="p-12 text-center text-slate-300 italic">Sin descomposición (Elemento Simple)</td></tr>`;
        } else {
            concept.children.forEach((child, index) => {
                const cData = engine.resolveConcept(child.code) || { summary: 'No definido', unit: '-', price: 0, type: '0' };
                const rend = child.factor * child.yield;
                const imp = rend * cData.price;
                
                const typeIcon = engine.getTypeIcon(cData.type);

                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100";
                tr.onclick = (e) => {
                    if (e.target.closest('button')) return; 
                    selectNode(child.code, code);
                };

                tr.innerHTML = `
                    <td class="px-2 py-3 text-center">
                        <button onclick="ui.openEditDecomp(${index})" class="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors" title="Editar línea">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </td>
                    <td class="px-6 py-3 font-mono text-[10px] text-blue-600 font-bold">
                        <span class="mr-1 text-sm">${typeIcon}</span>${cData.code || child.code}
                    </td>
                    <td class="px-6 py-3 text-slate-700">${cData.summary}</td>
                    <td class="px-6 py-3 text-center text-slate-400 font-bold">${cData.unit || '-'}</td>
                    <td class="px-6 py-3 text-right font-mono">${engine.num(rend, 'DR')}</td>
                    <td class="px-6 py-3 text-right">${engine.num(cData.price, 'DC')}</td>
                    <td class="px-6 py-3 text-right font-black text-slate-800">${engine.num(imp, 'DI')}</td>
                `;
                decBody.appendChild(tr);
            });
        }
    }

    const mBody = document.getElementById('measurements-body');
    if(mBody) {
        mBody.innerHTML = '';
        if (!mData.lines || mData.lines.length === 0) {
            mBody.innerHTML = `<tr><td colspan="10" class="p-10 text-center text-slate-300 italic font-sans">No hay mediciones para ${concept.code}</td></tr>`;
        } else {
            let subtotalParcial = 0;
            let subtotalAcumulado = 0;

            mData.lines.forEach((m, index) => {
                const isFormula = m.type === '3';
                const rawComment = m.comment || '';
                
                if (m.type === '1') {
                    const tr = document.createElement('tr');
                    tr.className = "bg-blue-50/50";
                    tr.innerHTML = `
                        <td class="px-2 py-1 text-center">
                            <button onclick="ui.openEditMeas('${measKey}', ${index})" class="text-blue-400 hover:text-blue-700 p-1 rounded transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </td>
                        <td class="text-center text-slate-400">1</td>
                        <td colspan="7" class="px-4 py-1 text-right font-black text-blue-600 uppercase text-[9px] border-b shadow-inner">${rawComment || 'Subtotal Parcial'}</td>
                        <td class="px-4 py-1 text-right font-bold text-blue-800">${engine.num(subtotalParcial, 'DS')}</td>
                    `;
                    mBody.appendChild(tr);
                    subtotalParcial = 0; 
                    return;
                }
                
                if (m.type === '2') {
                    const tr = document.createElement('tr');
                    tr.className = "bg-yellow-50/50";
                    tr.innerHTML = `
                        <td class="px-2 py-1 text-center">
                            <button onclick="ui.openEditMeas('${measKey}', ${index})" class="text-yellow-600 hover:text-yellow-800 p-1 rounded transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </td>
                        <td class="text-center text-slate-400">2</td>
                        <td colspan="7" class="px-4 py-1 text-right font-black text-yellow-600 uppercase text-[9px] border-b shadow-inner">${rawComment || 'Subtotal Acumulado'}</td>
                        <td class="px-4 py-1 text-right font-bold text-yellow-800">${engine.num(subtotalAcumulado, 'DS')}</td>
                    `;
                    mBody.appendChild(tr);
                    return;
                }

                const comentario = isFormula ? '' : rawComment;
                const formula = isFormula ? rawComment : '';

                let parcial = 0;
                
                if (isFormula && formula) {
                    parcial = engine.evaluateFormula(formula, m.units, m.length, m.width, m.height);
                } else if (m.units !== 0 || m.length !== 0 || m.width !== 0 || m.height !== 0) {
                    const val = (v) => v === 0 ? 1 : v;
                    parcial = m.units * val(m.length) * val(m.width) * val(m.height);
                }

                parcial = engine.round(parcial);
                subtotalParcial += parcial;
                subtotalAcumulado += parcial;

                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 transition-colors";
                tr.innerHTML = `
                    <td class="px-2 py-2 text-center">
                        <button onclick="ui.openEditMeas('${measKey}', ${index})" class="text-slate-300 hover:text-blue-500 p-1 rounded hover:bg-slate-100 transition-colors" title="Editar medición">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </td>
                    <td class="text-center text-slate-400">${m.type || ''}</td>
                    <td>${comentario}</td>
                    <td class="text-center font-bold text-slate-800">${m.units !== 0 ? engine.num(m.units, 'DN') : ''}</td>
                    <td class="text-center text-slate-500">${m.length !== 0 ? engine.num(m.length, 'DD') : ''}</td>
                    <td class="text-center text-slate-500">${m.width !== 0 ? engine.num(m.width, 'DD') : ''}</td>
                    <td class="text-center text-slate-500">${m.height !== 0 ? engine.num(m.height, 'DD') : ''}</td>
                    <td class="text-blue-600 font-medium italic text-[9px]">${formula}</td>
                    <td class="text-right font-bold text-blue-600 bg-blue-50/30">${parcial !== 0 ? engine.num(parcial, 'DS') : ''}</td>
                    <td class="text-right text-slate-300 bg-yellow-50/10">0.00</td>
                `;
                mBody.appendChild(tr);
            });
            
            const trFooter = document.createElement('tr');
            trFooter.className = "bg-slate-900 text-white shadow-xl relative z-10 border-t-2 border-blue-500 font-sans";
            trFooter.innerHTML = `
                    <td colspan="8" class="px-4 py-3 text-right font-black uppercase tracking-tighter text-[10px] text-blue-400 italic">Total Medición (${concept.unit}):</td>
                    <td colspan="2" class="px-4 py-3 text-right font-black text-sm tabular-nums">${engine.num(mData.total, 'DS')}</td>
            `;
            mBody.appendChild(trFooter);
        }
    }

    const hasDescription = !!concept.description;
    
    const btnCopyText = document.getElementById('btn-copy-text');
    const btnEditText = document.getElementById('btn-edit-text');
    const btnAddText = document.getElementById('btn-add-text');

    if (btnCopyText) btnCopyText.classList.toggle('hidden', !hasDescription);
    if (btnEditText) btnEditText.classList.toggle('hidden', !hasDescription);
    if (btnAddText) btnAddText.classList.toggle('hidden', hasDescription);

    const txtContent = document.getElementById('long-text-content');
    if(txtContent) {
        txtContent.innerHTML = hasDescription 
            ? concept.description.replace(/\n/g, '<br>') 
            : `<div class="flex flex-col items-center justify-center h-full text-center gap-3">
                 <p class="text-slate-300 italic font-normal">No existe información de pliego.</p>
                 <button onclick="ui.openEditText()" class="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 hover:border-blue-300 bg-blue-50 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md">
                    + Añadir Texto
                 </button>
               </div>`;
    }
}

// INICIALIZACIÓN DE EVENTOS AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Autocompletado (listeners internos de ui)
    ui.setupAutocompleteListener();
    
    // Draggable Window
    const floatWin = document.getElementById("floating-list-window");
    if(floatWin) ui.initDraggable(floatWin);
    
    // [NUEVO] Inicializar ventana flotante de edición
    const editWin = document.getElementById("edit-window");
    if(editWin) ui.initDraggable(editWin);

    // [MODIFICADO] File Input para ABRIR (Reemplaza proyecto actual)
    const fInput = document.getElementById('fileInput');
    if(fInput) {
        fInput.addEventListener('change', async (e) => {  
            const file = e.target.files[0];
            if (!file) return;
            // [NUEVO] Guardar nombre de archivo
            engine.fileName = file.name.replace(/\.[^/.]+$/, ""); // Quitar extensión
            
            const loader = document.getElementById('loader');
            if(loader) loader.style.display = 'flex';
            const reader = new FileReader();
            reader.onload = async (res) => {
                try {
                    await engine.parse(res.target.result);
                    
                    // [MEJORA] Recalcular proyecto automáticamente tras la carga
                    engine.recalculateProject();

                    renderAll();
                    if (!document.getElementById('floating-list-window').classList.contains('hidden')) {
                        renderList();
                    }
                } catch (error) {
                    console.error("Error al procesar el archivo BC3:", error);
                    alert("Ocurrió un error al procesar el archivo. " + error);
                } finally {
                    if(loader) loader.style.display = 'none';
                }
            };
            reader.onerror = (err) => {
                console.error("Error de lectura:", err);
                alert("Error al leer el archivo.");
                if(loader) loader.style.display = 'none';
            };
            reader.readAsText(file, 'windows-1252'); 
            // Reset value to allow re-importing same file
            e.target.value = '';
        });
    }

    // [NUEVO] File Input para IMPORTAR (Fusionar con proyecto actual)
    const impInput = document.getElementById('importInput');
    if(impInput) {
        impInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (engine.db.size === 0) {
                alert("No hay un proyecto activo donde importar. Use 'Abrir' o cree uno nuevo primero.");
                return;
            }
            
            const loader = document.getElementById('loader');
            if(loader) loader.style.display = 'flex';
            
            const reader = new FileReader();
            reader.onload = async (res) => {
                try {
                    const count = await engine.importPartial(res.target.result);
                    // No cambiamos la vista, solo actualizamos los datos y la lista
                    renderAll(false); 
                    if (!document.getElementById('floating-list-window').classList.contains('hidden')) {
                        renderList();
                    }
                    ui.showToast(`Importados ${count} conceptos nuevos.`);
                } catch (error) {
                    console.error("Error al importar el archivo BC3:", error);
                    alert("Ocurrió un error al importar. " + error);
                } finally {
                    if(loader) loader.style.display = 'none';
                }
            };
            reader.onerror = (err) => {
                alert("Error al leer el archivo.");
                if(loader) loader.style.display = 'none';
            };
            reader.readAsText(file, 'windows-1252');
            e.target.value = '';
        });
    }

    // Search Input
    const sInput = document.getElementById('search-input');
    if(sInput) {
        sInput.addEventListener('input', handleSearch);
        // Prevenir que el click en el input propague arrastre si fuera el caso
        sInput.addEventListener('mousedown', (e) => e.stopPropagation());
    }
});