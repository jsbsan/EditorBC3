/**
 * PROYECTO: Visor Profesional FIEBDC-3 (BC3)
 * MODULO: Generador de Listados Jerárquicos
 * VERSION: 3.93 (Listado de Auxiliares rediseñado)
 * DESCRIPCION: 
 * - [CORRECCION] Restaurado el formato legible del código (indentación y saltos de línea).
 * - [LOGICA] Mantiene el algoritmo de cálculo modificado para CP2.
 * - [VISUAL] Mantiene los estilos de texto mejorados (sin cursiva).
 * - [NUEVO] Macro generateMissingTextReport añadida.
 * - [NUEVO] Informe generatePartidasReport añadido (Solo Partidas).
 * - [MEJORA] Los listados ahora usan el parámetro 'DR' del registro ~K para los decimales de rendimiento.
 * - [MEJORA] Cálculo estricto de totalCost en listados de Necesidades basando el producto en factores pre-redondeados.
 * - [MEJORA] Eliminación visual del carácter interno '#' en todos los códigos al generar los informes.
 * - [MEJORA] Rediseño de Listado de Necesidades (lista plana ordenada por código sin subtotales de grupo, y cabecera unida CANTIDAD UD).
 * - [MEJORA] Rediseño de Listado de Auxiliares imitando formato clásico en tabla continua con subtotales e importe.
 */

const reports = {
    
    openListadosModal: () => {
        if (!engine.rootCode) {
            alert("No hay ningún proyecto cargado.");
            return;
        }
        document.getElementById('modal-reports').classList.add('active');
    },

    closeListadosModal: () => {
        document.getElementById('modal-reports').classList.remove('active');
    },

    // Limpia el carácter # de los códigos para su visualización
    cleanCode: (code) => {
        if (!code) return "";
        return code.replace(/#+$/, '');
    },

    // Formateador numérico estricto (Coma decimal, Punto millares)
    format: (val, type = 'DC') => {
        if (val === undefined || val === null || isNaN(val)) return '-';
        const decimals = engine.metadata[type.toLowerCase()] || 2;
        return val.toLocaleString('es-ES', { 
            minimumFractionDigits: decimals, 
            maximumFractionDigits: decimals,
            useGrouping: true 
        });
    },

    formatCurrency: (val, type = 'DC') => {
        return reports.format(val, type) + ' ' + engine.metadata.currency;
    },

    fmtTwoDecimals: (val) => {
        if (val === undefined || val === null || isNaN(val)) return '-';
        return val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
    },

    fmtThreeDecimals: (val) => {
        if (val === undefined || val === null || isNaN(val)) return '-';
        return val.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: true });
    },

    escapeHtml: (text) => {
        if (!text) return "";
        return text.replace(/[&<>"'`]/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;', '`': '&#96;' }[m];
        });
    },

    numberToText: (amount) => {
        if (isNaN(amount)) return "";
        
        const units = ['', 'UN ', 'DOS ', 'TRES ', 'CUATRO ', 'CINCO ', 'SEIS ', 'SIETE ', 'OCHO ', 'NUEVE '];
        const teens = ['DIEZ ', 'ONCE ', 'DOCE ', 'TRECE ', 'CATORCE ', 'QUINCE ', 'DIECISEIS ', 'DIECISIETE ', 'DIECIOCHO ', 'DIECINUEVE '];
        const tens = ['', '', 'VEINTE ', 'TREINTA ', 'CUARENTA ', 'CINCUENTA ', 'SESENTA ', 'SETENTA ', 'OCHENTA ', 'NOVENTA '];
        const hundreds = ['', 'CIENTO ', 'DOSCIENTOS ', 'TRESCIENTOS ', 'CUATROCIENTOS ', 'QUINIENTOS ', 'SEISCIENTOS ', 'SETECIENTOS ', 'OCHOCIENTOS ', 'NOVECIENTOS '];

        const convertGroup = (n) => {
            let output = '';
            if (n === 100) return 'CIEN ';
            if (n > 99) {
                output += hundreds[Math.floor(n / 100)];
                n %= 100;
            }
            if (n < 10) {
                output += units[n];
            } else if (n < 20) {
                output += teens[n - 10];
            } else {
                output += tens[Math.floor(n / 10)];
                if (n % 10 > 0) {
                    if (Math.floor(n / 10) === 2) {
                        output = output.slice(0,-2)+ "I" + units[n % 10]; 
                    } else {
                        output += 'Y ' + units[n % 10];
                    }
                }
            }
            return output;
        };

        const integerPart = Math.floor(amount);
        const decimalPart = Math.round((amount - integerPart) * 100);

        let words = '';
        if (integerPart === 0) words = 'CERO ';
        
        if (integerPart >= 1000000) {
            const millions = Math.floor(integerPart / 1000000);
            const remainder = integerPart % 1000000;
            if (millions === 1) words += 'UN MILLÓN ';
            else words += convertGroup(millions) + 'MILLONES ';
            
            if (remainder > 0) {
                if (remainder >= 1000) {
                     const thousands = Math.floor(remainder / 1000);
                     if (thousands === 1) words += 'MIL ';
                     else words += convertGroup(thousands) + 'MIL ';
                     words += convertGroup(remainder % 1000);
                } else {
                     words += convertGroup(remainder);
                }
            }
        } 
        else if (integerPart >= 1000) {
            const thousands = Math.floor(integerPart / 1000);
            if (thousands === 1) words += 'MIL ';
            else words += convertGroup(thousands) + 'MIL ';
            words += convertGroup(integerPart % 1000);
        } 
        else {
            words += convertGroup(integerPart);
        }

        words = words.replace(/UN $/, 'UNO '); 

        let result = words.trim() + ' EUROS';
        
        if (decimalPart > 0) {
            let decimalWords = convertGroup(decimalPart).trim();
            decimalWords = decimalWords.replace(/UN $/, 'UNO '); 
            result += ' con ' + decimalWords + ' CÉNTIMOS';
        }

        return result;
    },

    printHTML: (htmlContent, title) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; font-size: 11px; color: #333; }
                    h1 { text-align: center; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 5px; text-transform: uppercase; }
                    .meta { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    th { background-color: #f1f5f9; text-align: left; padding: 8px 8px; font-weight: bold; border-bottom: 2px solid #cbd5e1; font-size: 10px;  }
                    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; text-align: justify;}
                    
                    .text-right { text-align: right !important; }
                    .text-center { text-align: center !important; }
                    .font-mono { font-family: 'Consolas', 'Monaco', monospace; font-size: 10px; }
                    .font-bold { font-weight: bold; }
                    .italic { font-style: italic; }
                    .text-xs { font-size: 9px; color: #64748b; }
                    
                    .chapter-row { background-color: #f8fafc; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; }
                    .chapter-title { font-weight: bold; font-size: 12px; }
                    .item-row:hover { background-color: #fefce8; }
                    
                    .indent-0 { padding-left: 8px; }
                    .indent-1 { padding-left: 20px; }
                    .indent-2 { padding-left: 35px; }
                    .indent-3 { padding-left: 50px; }
                    .indent-4 { padding-left: 65px; }
                    .indent-5 { padding-left: 80px; }

                    .meas-header-row { background-color: #e0f2fe; border-top: 1px solid #3b82f6; }
                    .subtable { width: 96%; margin-left: 4%; margin-top: 5px; margin-bottom: 15px; border: 1px solid #e2e8f0; }
                    .subtable th { background-color: #f1f5f9; font-weight: normal; font-size: 9px; color: #475569; border-bottom: 1px solid #cbd5e1; }
                    .subtable td { font-size: 10px; color: #334155; border-bottom: 1px dashed #e2e8f0; text-align: left; }
                    .meas-total-row { background-color: #f0f9ff; font-weight: bold; border-top: 2px solid #bae6fd; }

                    .header-total { color: #333; font-size: 1em; font-weight: bold; margin-right: 8px; }
                    
                    .price-letter { font-style: italic; color: #475569; font-size: 11px; margin-top: 4px; display: block; border-top: 1px dashed #e2e8f0; padding-top: 2px;}
                    .price-number { font-size: 12px; font-weight: bold; }

                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        .no-break { page-break-inside: avoid; }
                    }

                    /* CP2 Styles */
                    .cp2-container { width: 100%; font-family: 'Arial', sans-serif; font-size: 11px; }
                    .cp2-row { display: flex; margin-bottom: 25px; page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                    .cp2-col-idx { width: 40px; text-align: center; font-weight: bold; padding-top: 2px; }
                    .cp2-col-code { width: 90px; font-weight: bold; font-family: 'Consolas', monospace; padding-top: 2px; }
                    .cp2-col-unit { width: 40px; text-align: center; font-style: italic; padding-top: 2px; }
                    .cp2-col-body { flex: 1; padding-left: 15px; }
                    .cp2-desc { text-align: justify; margin-bottom: 15px; line-height: 1.5; color: #111; }
                    
                    .cp2-breakdown { width: 100%; max-width: 380px; margin-left: auto; font-size: 11px; }
                    .cp2-line { display: flex; align-items: baseline; margin-bottom: 4px; }
                    .cp2-label { flex: 0 0 auto; }
                    /* Puntos suspensivos usando flex-grow y borde inferior */
                    .cp2-dots { flex: 1 1 auto; border-bottom: 1px dotted #000; margin: 0 4px; position: relative; top: -4px; opacity: 0.5; }
                    .cp2-val { flex: 0 0 auto; text-align: right; width: 70px; }
                    
                    .cp2-sep { border-top: 1px solid #000; margin-top: 5px; margin-bottom: 5px; margin-left: auto; width: 100%; }
                    
                    .cp2-total-line { margin-top: 5px; font-weight: bold; font-size: 12px; }
                </style>
            </head>
            <body>
                ${htmlContent}
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        reports.closeListadosModal();
    },

    findMeasurementData: (conceptCode) => {
        if (engine.measurementsMap.has(conceptCode)) {
            return engine.measurementsMap.get(conceptCode);
        }
        const normCode = engine.normalizeCode(conceptCode);
        for (const [key, val] of engine.measurementsMap) {
            const parts = key.split('|');
            const childPart = parts[parts.length - 1]; 
            if (engine.normalizeCode(childPart) === normCode) {
                return val;
            }
        }
        return null;
    },

    traverseTree: (code, parentCode, level, callback) => {
        const concept = engine.resolveConcept(code);
        if (!concept) return;

        const hasUnit = concept.unit && concept.unit.trim() !== '';
        const isChapterMarker = concept.code.endsWith('#');
        const isChapter = isChapterMarker || (!hasUnit && concept.children.length > 0);

        callback(concept, parentCode, level, isChapter);

        if (isChapter && concept.children && concept.children.length > 0) {
            concept.children.forEach(child => {
                reports.traverseTree(child.code, code, level + 1, callback);
            });
        }
    },

    // --- HELPER PARA DESGLOSE RECURSIVO DE AUXILIARES (CP2) ---
    getExplodedUnitCost: (code, visited = new Set()) => {
        if (visited.has(code)) return { mo: 0, mq: 0, resto: 0 };
        visited.add(code);

        const concept = engine.resolveConcept(code);
        if (!concept) return { mo: 0, mq: 0, resto: 0 };

        // Si es hoja (no tiene hijos), clasificar directamente
        if (!concept.children || concept.children.length === 0) {
            if (concept.type === '1') return { mo: concept.price, mq: 0, resto: 0 };
            if (concept.type === '2') return { mo: 0, mq: concept.price, resto: 0 };
            return { mo: 0, mq: 0, resto: concept.price };
        }

        // Si tiene hijos, calcular suma ponderada de componentes
        let mo = 0, mq = 0, resto = 0;
        concept.children.forEach(child => {
            const childQ = child.factor * child.yield;
            // Llamada recursiva para obtener la composición unitaria del hijo
            const childCosts = reports.getExplodedUnitCost(child.code, new Set(visited)); 
            
            mo += Math.round((childCosts.mo * childQ+0.0001)*100)/100;
            mq += Math.round((childCosts.mq * childQ+0.0001)*100)/100;
            resto += Math.round((childCosts.resto * childQ+0.0001)*100)/100;
        });

        return { mo, mq, resto };
    },

    // REPORTE 1: MEDICIONES
    generateMeasurementsReport: () => {
        let content = `<h1>Listado de Mediciones</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | ${engine.metadata.software}</div>`;
        
        content += `
            <style>
                .meas-rep-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .meas-rep-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                .meas-rep-table td { padding: 3px 4px; vertical-align: top; border-bottom: none; color: #000; }
                .chapter-bg { background-color: #cffafe; font-weight: bold; color: #000; }
                .indent-meas { padding-left: 20px; }
            </style>
            <table class="meas-rep-table">
                <thead>
                    <tr>
                        <th width="10%">CÓDIGO</th>
                        <th width="42%">RESUMEN</th>
                        <th width="8%" class="text-right">UDS</th>
                        <th width="8%" class="text-right">LONGITUD</th>
                        <th width="8%" class="text-right">ANCHURA</th>
                        <th width="8%" class="text-right">ALTURA</th>
                        <th width="8%" class="text-right">PARCIALES</th>
                        <th width="8%" class="text-right">CANTIDAD</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const processNode = (concept, parentCode, level, isChapter) => {
            if (concept.code === engine.rootCode) return; // Omitimos la raíz como fila normal

            if (isChapter) {
                content += `
                    <tr class="chapter-bg" style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 6px; padding-bottom: 6px;">${reports.cleanCode(concept.code)}</td>
                        <td colspan="7" style="padding-top: 6px; padding-bottom: 6px;">${concept.summary}</td>
                    </tr>
                `;
            } else {
                const measData = reports.findMeasurementData(concept.code);
                const hasMeasurements = measData && measData.lines && measData.lines.length > 0;
                
                let descHtml = '';
                if (concept.description && concept.description.trim().length > 0) {
                    descHtml = `<br><span style="font-weight: normal; margin-top: 4px; display: inline-block;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>`;
                }

                // Cabecera de la Partida (Ud y Descripción integradas)
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 15px;">${reports.cleanCode(concept.code)}</td>
                        <td colspan="7" style="padding-top: 15px;">
                            <table style="width:100%; border:none; margin:0; padding:0; background:transparent;">
                                <tr>
                                    <td style="width: 30px; padding:0; vertical-align:top;">${concept.unit || ''}</td>
                                    <td style="padding:0; vertical-align:top; text-align:justify;">
                                        <span style="font-weight:normal;">${concept.summary}</span>${descHtml}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;

                if (hasMeasurements) {
                    let subtotal = 0;
                    measData.lines.forEach(m => {
                        let parcial = 0;
                        if (m.type === '1') { 
                             content += `<tr style="page-break-inside: avoid;"><td colspan="6" class="text-right" style="font-weight:bold; font-style:italic;">${m.comment || 'Subtotal'}:</td><td class="text-right font-bold">${reports.format(subtotal, 'DS')}</td><td></td></tr>`;
                             subtotal = 0; 
                             return;
                        }
                        if (m.type === '2') return; 

                        if (m.type === '3' && m.comment) {
                            parcial = engine.evaluateFormula(m.comment, m.units, m.length, m.width, m.height);
                            if (!/[abcd]/i.test(m.comment) && (m.units !== 0 || m.length !== 0 || m.width !== 0 || m.height !== 0)) {
                                const val = (v) => v === 0 ? 1 : v;
                                parcial = parcial * m.units * val(m.length) * val(m.width) * val(m.height);
                            }
                        } else if (m.units !== 0 || m.length !== 0 || m.width !== 0 || m.height !== 0) {
                            const val = (v) => v === 0 ? 1 : v;
                            parcial = m.units * val(m.length) * val(m.width) * val(m.height);
                        }
                        
                        parcial = engine.round(parcial);
                        subtotal += parcial;

                        content += `
                            <tr style="page-break-inside: avoid;">
                                <td></td>
                                <td class="indent-meas">${m.comment || ''}</td>
                                <td class="text-right">${m.units !== 0 ? reports.format(m.units, 'DN') : ''}</td>
                                <td class="text-right">${m.length !== 0 ? reports.format(m.length, 'DD') : ''}</td>
                                <td class="text-right">${m.width !== 0 ? reports.format(m.width, 'DD') : ''}</td>
                                <td class="text-right">${m.height !== 0 ? reports.format(m.height, 'DD') : ''}</td>
                                <td class="text-right">${parcial !== 0 ? reports.format(parcial, 'DS') : ''}</td>
                                <td></td>
                            </tr>
                        `;
                    });

                    // Total Row
                    content += `
                        <tr style="page-break-inside: avoid;">
                            <td colspan="6"></td>
                            <td style="border-top: 1px solid #000; padding-top: 4px;"></td>
                            <td class="text-right" style="border-top: 1px solid #000; padding-top: 4px;">${reports.format(measData.total, 'DS')}</td>
                        </tr>
                    `;
                } else {
                    if (measData && measData.total !== 0) {
                         content += `
                            <tr style="page-break-inside: avoid;">
                                <td></td>
                                <td class="indent-meas italic text-xs text-slate-500">(Medición directa)</td>
                                <td colspan="4"></td>
                                <td style="border-top: 1px solid #000; padding-top: 4px;"></td>
                                <td class="text-right" style="border-top: 1px solid #000; padding-top: 4px;">${reports.format(measData.total, 'DS')}</td>
                            </tr>`;
                    }
                }
            }
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
        }

        content += `</tbody></table>`;
        reports.printHTML(content, "Listado de Mediciones");
    },

    // REPORTE 2: PRESUPUESTO
    generateBudgetReport: () => {
        let content = `<h1>Presupuesto General</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <style>
                .budget-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .budget-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                .budget-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
                .chapter-bg { background-color: #cffafe; font-weight: bold; color: #000; }
            </style>
            <table class="budget-table">
                <thead>
                    <tr>
                        <th width="12%">CÓDIGO</th>
                        <th width="50%" colspan="2">RESUMEN</th>
                        <th width="12%" class="text-right">CANTIDAD</th>
                        <th width="12%" class="text-right">PRECIO</th>
                        <th width="14%" class="text-right">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const renderNode = (code, parentCode, currentQty) => {
            const concept = engine.resolveConcept(code);
            if (!concept) return;

            const isRoot = code === engine.rootCode;
            const isChapter = concept.code.endsWith('#') || (!concept.unit && concept.children.length > 0);
            
            let importe = engine.round(concept.price * currentQty);

            if (isRoot) {
                // Renderizar los hijos del proyecto
                concept.children.forEach(child => {
                    const qty = child.factor * child.yield;
                    renderNode(child.code, code, qty);
                });
                
                // Imprimir el Total Final
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="5" style="padding-top: 20px; padding-bottom: 15px;">
                            <div style="display: flex; align-items: baseline;">
                                <span style="font-weight: bold; font-size: 12px; text-transform: uppercase;">TOTAL PRESUPUESTO DE EJECUCIÓN MATERIAL</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right font-bold" style="font-size: 12px; padding-top: 20px; padding-bottom: 15px; border-bottom: 2px solid #000; border-top: 2px solid #000;">${reports.formatCurrency(concept.price, 'DI')}</td>
                    </tr>
                `;
                return;
            }

            if (isChapter) {
                // Imprimir Cabecera del Capítulo/Subcapítulo
                content += `
                    <tr class="chapter-bg" style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 6px; padding-bottom: 6px;">${reports.cleanCode(concept.code)}</td>
                        <td colspan="5" style="padding-top: 6px; padding-bottom: 6px; font-weight: bold;">${concept.summary}</td>
                    </tr>
                `;
                
                // Renderizar los hijos del Capítulo
                concept.children.forEach(child => {
                    const qty = child.factor * child.yield;
                    renderNode(child.code, code, qty);
                });

                // Imprimir Total del Capítulo/Subcapítulo
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="5" style="padding-top: 10px; padding-bottom: 15px;">
                            <div style="display: flex; align-items: baseline; padding-left: 5%;">
                                <span style="font-weight: bold;">TOTAL ${reports.cleanCode(concept.code)} ${concept.summary}</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right font-bold" style="padding-top: 10px; padding-bottom: 15px; border-bottom: 1px solid #000;">${reports.format(importe, 'DI')}</td>
                    </tr>
                `;
            } else {
                // Imprimir Partida Simple o Descompuesta (Fila de Presupuesto)
                let descHtml = '';
                if (concept.description && concept.description.trim().length > 0) {
                    descHtml = `<br><span style="font-weight: normal; margin-top: 4px; display: inline-block; text-align: justify;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>`;
                }
                
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 8px; padding-bottom: 8px;">${reports.cleanCode(concept.code)}</td>
                        <td width="3%" style="padding-top: 8px; padding-bottom: 8px;">${concept.unit || ''}</td>
                        <td width="47%" style="padding-top: 8px; padding-bottom: 8px;">
                            <span style="font-weight: normal;">${concept.summary}</span>${descHtml}
                        </td>
                        <td class="text-right" style="padding-top: 8px; padding-bottom: 8px;">${reports.format(currentQty, 'DN')}</td>
                        <td class="text-right" style="padding-top: 8px; padding-bottom: 8px;">${reports.format(concept.price, 'DC')}</td>
                        <td class="text-right font-bold" style="padding-top: 8px; padding-bottom: 8px;">${reports.format(importe, 'DI')}</td>
                    </tr>
                `;
            }
        };

        if (engine.rootCode) {
            renderNode(engine.rootCode, null, 1);
        }

        content += `</tbody></table>`;
        reports.printHTML(content, "Listado de Presupuesto");
    },

    // REPORTE 3: RESUMEN CAPÍTULOS
    generateChapterSummaryReport: () => {
        // Preguntar al usuario hasta qué nivel desea generar el resumen
        const levelInput = prompt("¿Hasta qué nivel de capítulos desea generar el resumen?\n(El Nivel 1 es el de los capítulos principales)", "1");
        if (levelInput === null) return; // Operación cancelada por el usuario
        
        const maxLevel = parseInt(levelInput, 10) || 1; // Si no introduce un número válido, por defecto 1

        let content = `<h1>Resumen por Capítulos</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        let currencyLabel = engine.metadata.currency;
        if (currencyLabel.toLowerCase() === '€' || currencyLabel.toLowerCase() === 'euros') {
            currencyLabel = 'EUROS';
        } else {
            currencyLabel = currencyLabel.toUpperCase();
        }

        content += `
            <style>
                .summary-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .summary-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                .summary-table td { padding: 4px 4px; vertical-align: bottom; border-bottom: none; color: #000; }
            </style>
            <table class="summary-table">
                <thead>
                    <tr>
                        <th width="15%">CAPITULO</th>
                        <th width="65%">RESUMEN</th>
                        <th width="20%" class="text-right">${currencyLabel}</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const processNode = (concept, parentCode, level, isChapter) => {
            if (!isChapter) return;
            
            // Excluir raíz del listado y limitar según el nivel introducido por el usuario
            if (concept.code === engine.rootCode || level > maxLevel) return;

            let cantidad = 1;
            if (parentCode) {
                const parent = engine.resolveConcept(parentCode);
                const childRef = parent.children.find(c => engine.normalizeCode(c.code) === engine.normalizeCode(concept.code));
                if (childRef) {
                    cantidad = childRef.factor * childRef.yield;
                }
            }

            let importe = engine.round(concept.price * cantidad);

            // Calcular sangría visual en función del nivel para mantener el formato de la imagen original
            const isSub = level > 1;
            const padCode = isSub ? (level - 1) * 15 : 0;
            const prefixCode = isSub ? '-' : '';
            const padSum = isSub ? (level - 1) * 20 : 0;
            const prefixSum = isSub ? '-' : '';

            content += `
                <tr style="page-break-inside: avoid;">
                    <td style="padding-left: ${padCode}px;">
                        ${prefixCode}${reports.cleanCode(concept.code)}
                    </td>
                    <td>
                        <div style="display: flex; align-items: baseline; padding-left: ${padSum}px;">
                            <span>${prefixSum}${concept.summary}</span>
                            <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                        </div>
                    </td>
                    <td class="text-right">${reports.format(importe, 'DI')}</td>
                </tr>
            `;
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
            
            const rootConcept = engine.db.get(engine.rootCode);
            content += `
                </tbody>
                <tfoot>
                    <tr style="page-break-inside: avoid;">
                        <td colspan="2" class="text-right" style="padding-top: 15px; padding-bottom: 15px; padding-right: 15px; font-weight: bold; font-size: 12px;">
                            TOTAL EJECUCIÓN MATERIAL
                        </td>
                        <td class="text-right font-bold" style="font-size: 12px; padding-top: 15px; padding-bottom: 15px; border-top: 1px solid #000;">
                            ${reports.format(rootConcept.price, 'DI')}
                        </td>
                    </tr>
                </tfoot>
            </table>
            `;
        }

        reports.printHTML(content, "Resumen por Capítulos");
    },

    // REPORTE 4: CUADRO DE PRECIOS Nº 1
    generatePriceTable1Report: () => {
        let content = `<h1>Cuadro de Precios Nº 1</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <style>
                .price1-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .price1-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                .price1-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
            </style>
            <table class="price1-table">
                <thead>
                    <tr>
                        <th width="5%" class="text-center">Nº</th>
                        <th width="12%">CÓDIGO</th>
                        <th width="5%">UD</th>
                        <th width="48%">RESUMEN</th>
                        <th width="20%">PRECIO EN LETRA</th>
                        <th width="10%" class="text-right">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const uniqueItems = new Map();

        const collectNodes = (concept, parentCode, level, isChapter) => {
            if (isChapter) return; 
            if (!uniqueItems.has(concept.code)) {
                uniqueItems.set(concept.code, concept);
            }
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, collectNodes);
        }

        // Ordenar las partidas por código
        const sortedItems = Array.from(uniqueItems.values()).sort((a, b) => a.code.localeCompare(b.code));

        let counter = 1;

        sortedItems.forEach(concept => {
            const nString = counter.toString().padStart(4, '0');
            
            let itemText = "";
            if (concept.description && concept.description.trim().length > 0) {
                itemText = `<span style="font-weight:normal;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>`;
            } else {
                itemText = `<span>${concept.summary}</span>`;
            }
            
            const priceText = reports.numberToText(concept.price);

            content += `
                <tr style="page-break-inside: avoid;">
                    <td class="text-center" style="padding-top: 12px;">${nString}</td>
                    <td style="padding-top: 12px;">${reports.cleanCode(concept.code)}</td>
                    <td style="padding-top: 12px;">${concept.unit || ''}</td>
                    <td style="padding-top: 12px; text-align: justify;">${itemText}</td>
                    <td style="padding-top: 12px;"></td>
                    <td class="text-right" style="padding-top: 12px;">${reports.format(concept.price, 'DC')}</td>
                </tr>
                <tr style="page-break-inside: avoid;">
                    <td colspan="3"></td>
                    <td colspan="2" class="text-right" style="padding-bottom: 12px;  font-size: 11px;">
                        ${priceText}
                    </td>
                    <td></td>
                </tr>
            `;
            counter++;
        });

        content += `
                </tbody>
            </table>
        `;

        reports.printHTML(content, "Cuadro de Precios Nº 1");
    },

    // REPORTE 5: CUADRO DE PRECIOS Nº 2 [CON NUEVO ALGORITMO]
    generatePriceTable2Report: () => {
        let content = `<h1>Cuadro de Precios Nº 2</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <style>
                .cp2-container { width: 100%; font-family: 'Arial', sans-serif; font-size: 11px; }
                .cp2-row { display: flex; margin-bottom: 25px; page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                .cp2-col-idx { width: 40px; text-align: center; font-weight: bold; padding-top: 2px; }
                .cp2-col-code { width: 90px; font-weight: bold; font-family: 'Consolas', monospace; padding-top: 2px; }
                .cp2-col-unit { width: 40px; text-align: center; font-style: italic; padding-top: 2px; }
                .cp2-col-body { flex: 1; padding-left: 15px; }
                .cp2-desc { text-align: justify; margin-bottom: 15px; line-height: 1.5; color: #111; }
                
                .cp2-breakdown { width: 100%; max-width: 380px; margin-left: auto; font-size: 11px; }
                .cp2-line { display: flex; align-items: baseline; margin-bottom: 4px; }
                .cp2-label { flex: 0 0 auto; }
                /* Puntos suspensivos usando flex-grow y borde inferior */
                .cp2-dots { flex: 1 1 auto; border-bottom: 1px dotted #000; margin: 0 4px; position: relative; top: -4px; opacity: 0.5; }
                .cp2-val { flex: 0 0 auto; text-align: right; width: 70px; }
                
                .cp2-sep { border-top: 1px solid #000; margin-top: 5px; margin-bottom: 5px; margin-left: auto; width: 100%; }
                
                .cp2-total-line { margin-top: 5px; font-weight: bold; font-size: 12px; }
                .price2-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .price2-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                .price2-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
            </style>
            <table class="price2-table">
                <thead>
                    <tr>
                        <th width="5%" class="text-center">Nº</th>
                        <th width="12%">CÓDIGO</th>
                        <th width="5%">UD</th>
                        <th width="63%">RESUMEN</th>
                        <th width="15%" class="text-right">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const uniqueItems = new Map();

        const collectNodes = (concept, parentCode, level, isChapter) => {
            if (isChapter) return; 
            if (!uniqueItems.has(concept.code)) {
                uniqueItems.set(concept.code, concept);
            }
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, collectNodes);
        }

        // Ordenar las partidas por código
        const sortedItems = Array.from(uniqueItems.values()).sort((a, b) => a.code.localeCompare(b.code));

        let counter = 1;

        sortedItems.forEach(concept => {
            const nString = counter.toString().padStart(4, '0');
            
            let itemText = "";
            if (concept.description && concept.description.trim().length > 0) {
                itemText = `<span style="font-weight:normal;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>`;
            } else {
                itemText = `<span>${concept.summary}</span>`;
            }

            let totalMO = 0; 
            let totalMQ = 0; 
            let totalResto = 0; 

            // Redondeo estándar (4 decimales)
           const round4 = (v) => Math.round((v +0.0000001)* 10000) / 10000;
           const round2 = (v) => Math.round((v +0.0000001)* 100) / 100;
            if (concept.children && concept.children.length > 0) {
                concept.children.forEach(child => {
                    const childConcept = engine.resolveConcept(child.code);
                    if (childConcept) {
                        const qty = round4((child.factor * child.yield));
                        const type = childConcept.type;

                        // REGLA 1: Si es Auxiliar (Tipo 0) o tiene hijos, se desglosa recursivamente
                        if (type === '0' || (childConcept.children && childConcept.children.length > 0)) {
                            // Extraer composición unitaria (recursive)
                            const breakdown = reports.getExplodedUnitCost(child.code);
                            
                            // Aplicar fórmula y acumular
                            totalMO += round4((breakdown.mo * qty));
                            totalMQ += round4((breakdown.mq * qty));
                            totalResto += round4((breakdown.resto * qty));
                        } 
                        // REGLA 2: Recurso Simple (Tipos 1, 2, 3)
                        else {
                            const lineCost = round4((qty * childConcept.price ));
                            if (type === '1') totalMO += round2(lineCost);
                            else if (type === '2') totalMQ += round2(lineCost);
                            else totalResto += round2(lineCost);
                        }
                    }
                });
            } else {
                // Caso extremo: Partida sin descomposición (precio directo)
                if (concept.type === '1') totalMO = concept.price;
                else if (concept.type === '2') totalMQ = concept.price;
                else totalResto = concept.price;
            }

            const fmt = (n) => reports.format(n, 'DI');

            content += `
                <tr style="page-break-inside: avoid;">
                    <td class="text-center" style="padding-top: 15px;">${nString}</td>
                    <td style="padding-top: 15px;">${reports.cleanCode(concept.code)}</td>
                    <td style="padding-top: 15px;">${concept.unit || ''}</td>
                    <td style="padding-top: 15px; text-align: justify; padding-bottom: 10px;">${itemText}</td>
                    <td style="padding-top: 15px;"></td>
                </tr>
            `;

            if (totalMO > 0) {
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td>
                            <div style="display: flex; align-items: baseline; padding-left: 50%;">
                                <span>Mano de obra</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right">${fmt(totalMO)}</td>
                    </tr>
                `;
            }

            if (totalMQ > 0) {
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td>
                            <div style="display: flex; align-items: baseline; padding-left: 50%;">
                                <span>Maquinaria</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right">${fmt(totalMQ)}</td>
                    </tr>
                `;
            }

            if (totalResto > 0) {
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td>
                            <div style="display: flex; align-items: baseline; padding-left: 50%;">
                                <span>Resto de obra y materiales</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right">${fmt(totalResto)}</td>
                    </tr>
                `;
            }

            content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td style="padding-top: 5px; padding-bottom: 15px;">
                            <div style="display: flex; align-items: baseline; padding-left: 50%;">
                                <span style="font-weight: bold;">TOTAL PARTIDA</span>
                                <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                            </div>
                        </td>
                        <td class="text-right font-bold" style="padding-top: 5px; padding-bottom: 15px; border-top: 1px solid #000;">${reports.format(concept.price, 'DI')}</td>
                    </tr>
            `;
            counter++;
        });

        content += `
                </tbody>
            </table>
        `;

        reports.printHTML(content, "Cuadro de Precios Nº 2");
    },

    // --- LISTADOS DE ELEMENTALES ---

    generateBasicResourceReport: (type, typeName) => {
        let content = `<h1>Listado de ${typeName}</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <style>
                .basic-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .basic-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold; }
                .basic-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
            </style>
            <table class="basic-table">
                <thead>
                    <tr>
                        <th width="12%">CÓDIGO</th>
                        <th width="5%" class="text-center">UD</th>
                        <th width="71%">RESUMEN</th>
                        <th width="12%" class="text-right">PRECIO</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const resources = Array.from(engine.db.values())
            .filter(c => c.type === type)
            .sort((a, b) => a.code.localeCompare(b.code));

        if (resources.length === 0) {
             content += `<tr><td colspan="4" class="text-center italic" style="padding:20px;">No se encontraron elementos de tipo ${typeName}</td></tr>`;
        }

        resources.forEach(res => {
             content += `
                <tr style="page-break-inside: avoid;">
                    <td class="font-bold">${reports.cleanCode(res.code)}</td>
                    <td class="text-center">${res.unit || ''}</td>
                    <td>${res.summary}</td>
                    <td class="text-right">${reports.format(res.price, 'DC')}</td>
                </tr>
            `;
        });

        content += `</tbody></table>`;
        reports.printHTML(content, `Listado de ${typeName}`);
    },

    // generateLaborReport: () => reports.generateBasicResourceReport('1', 'Mano de Obra'),
    generateLaborReport: () => reports.generateBasicResourceReport('1', 'Mano de Obra'),
    generateMachineryReport: () => reports.generateBasicResourceReport('2', 'Maquinaria'),
    generateMaterialsReport: () => reports.generateBasicResourceReport('3', 'Materiales'),

    // --- LISTADO DE NECESIDADES ---
    generateNeedsReport: () => {
        let content = `<h1>Listado de Necesidades</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;

        const needsMap = new Map();

        const calculateNeedsRecursively = (code, qtyMultiplier, visited) => {
            const concept = engine.resolveConcept(code);
            if (!concept) return;
            if (visited.has(code)) return;

            const hasChildren = concept.children && concept.children.length > 0;

            if (!hasChildren) {
                if (!needsMap.has(code)) {
                    needsMap.set(code, { concept: concept, totalQty: 0 });
                }
                const entry = needsMap.get(code);
                entry.totalQty += qtyMultiplier;
                return; 
            }

            const newVisited = new Set(visited);
            newVisited.add(code);

            concept.children.forEach(child => {
                const childTotalQty = qtyMultiplier * child.factor * child.yield;
                calculateNeedsRecursively(child.code, childTotalQty, newVisited);
            });
        };

        if (engine.rootCode) {
            calculateNeedsRecursively(engine.rootCode, 1, new Set());
        }

        const list = Array.from(needsMap.values()).filter(item => Math.abs(item.totalQty) > 0.0001);

        // En lugar de ordenar por tipo o agrupar, la imagen muestra una lista plana ordenada por CÓDIGO.
        list.sort((a, b) => a.concept.code.localeCompare(b.concept.code));

        content += `
            <style>
                .needs-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                .needs-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold; }
                .needs-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
            </style>
            <table class="needs-table">
                <thead>
                    <tr>
                        <th width="12%">CÓDIGO</th>
                        <th width="12%" colspan="2">CANTIDAD UD</th>
                        <th width="56%">RESUMEN</th>
                        <th width="10%" class="text-right">PRECIO</th>
                        <th width="10%" class="text-right">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let grandTotal = 0;    

        list.forEach(item => {
            // Extraer configuración de decimales desde los metadatos del BC3
            const dr = engine.metadata.dr || 2;
            const dc = engine.metadata.dc || 2;
            const di = engine.metadata.di || 2;
            
            // Redondear matemáticamente cada factor a su respectiva precisión antes de multiplicar
            const roundTo = (val, dec) => Math.round((val + 0.00001) * Math.pow(10, dec)) / Math.pow(10, dec);
            const roundedQty = roundTo(item.totalQty, dr);
            const roundedPrice = roundTo(item.concept.price, dc);
            
            const totalCost = roundTo(roundedQty * roundedPrice, di);
            grandTotal += totalCost;

            content += `
                <tr style="page-break-inside: avoid;">
                    <td>${reports.cleanCode(item.concept.code)}</td>
                    <td class="text-right" width="8%">${reports.format(item.totalQty, 'DR')}</td>
                    <td width="4%" style="padding-left: 4px;">${item.concept.unit || ''}</td>
                    <td>${item.concept.summary}</td>
                    <td class="text-right">${reports.format(item.concept.price, 'DC')}</td>
                    <td class="text-right">${reports.format(totalCost, 'DI')}</td>
                </tr>
            `;
        });

        content += `
            <tr style="page-break-inside: avoid;">
                <td colspan="4"></td>
                <td class="text-right" style="padding-top: 15px; padding-bottom: 15px; font-weight: bold; font-size: 12px; border-top: 1px solid #000;">
                    TOTAL NECESIDADES
                </td>
                <td class="text-right font-bold" style="padding-top: 15px; padding-bottom: 15px; font-size: 12px; border-top: 1px solid #000;">
                    ${reports.format(grandTotal, 'DI')}
                </td>
            </tr>
        `;

        content += `</tbody></table>`;
        reports.printHTML(content, "Necesidades del Proyecto");
    },

    // --- LISTADO DE NECESIDADES DE AUXILIARES ---
    generateAuxiliaryNeedsReport: () => {
        let content = `<h1>Necesidades de Partidas Auxiliares</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;

        const hierarchyMemberCodes = new Set();
        if(engine.rootCode) hierarchyMemberCodes.add(engine.rootCode);
        
        for (const [code, concept] of engine.db) {
            if (code.endsWith('#')) {
                concept.children.forEach(child => {
                    hierarchyMemberCodes.add(child.code);
                });
            }
        }

        const totalsMap = new Map(); 

        const traverse = (code, qtyMultiplier, stack) => {
            if (stack.has(code)) return; 
            
            const currentTotal = totalsMap.get(code) || 0;
            totalsMap.set(code, currentTotal + qtyMultiplier);

            const concept = engine.resolveConcept(code);
            if (!concept) return;

            if (concept.children && concept.children.length > 0) {
                const newStack = new Set(stack);
                newStack.add(code);
                
                concept.children.forEach(child => {
                    const childQty = qtyMultiplier * child.factor * child.yield;
                    traverse(child.code, childQty, newStack);
                });
            }
        };

        if (engine.rootCode) {
            traverse(engine.rootCode, 1, new Set());
        }

        const list = [];
        
        for (const [code, totalQty] of totalsMap) {
            if (Math.abs(totalQty) < 0.0001) continue;

            const concept = engine.resolveConcept(code);
            if (!concept) continue;

            const isContainer = code.endsWith('#');
            const hasChildren = concept.children && concept.children.length > 0;
            const isDirectHierarchy = hierarchyMemberCodes.has(code);
            const isRoot = (code === engine.rootCode);

            if (hasChildren && !isContainer && !isDirectHierarchy && !isRoot) {
                list.push({ concept, totalQty });
            }
        }

        list.sort((a, b) => a.concept.code.localeCompare(b.concept.code));

        if (list.length === 0) {
            content += `<p class="text-center italic" style="padding:20px;">No se encontraron partidas auxiliares necesarias.</p>`;
        } else {
             content += `
                <table>
                    <thead>
                        <tr>
                            <th width="15%">Código</th>
                            <th width="55%">Descripción</th>
                            <th width="10%" class="text-center">Ud</th>
                            <th width="10%" class="text-right">Precio</th>
                            <th width="10%" class="text-right">Cantidad Total</th>
                            <th width="15%" class="text-right">Importe Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            let grandTotal = 0;

            list.forEach(item => {
                // Extraer configuración de decimales desde los metadatos del BC3
                const dr = engine.metadata.dr || 2;
                const dc = engine.metadata.dc || 2;
                const di = engine.metadata.di || 2;
                
                // Redondear matemáticamente cada factor a su respectiva precisión antes de multiplicar
                const roundTo = (val, dec) => Math.round((val + 0.00001) * Math.pow(10, dec)) / Math.pow(10, dec);
                const roundedQty = roundTo(item.totalQty, dr);
                const roundedPrice = roundTo(item.concept.price, dc);
                
                const totalCost = roundTo(roundedQty * roundedPrice, di);
                
                grandTotal += totalCost;

                content += `
                    <tr>
                        <td class="font-mono text-xs font-bold">${reports.cleanCode(item.concept.code)}</td>
                        <td class="text-xs">${item.concept.summary}</td>
                        <td class="text-center text-xs text-slate-500">${item.concept.unit}</td>
                        <td class="text-right text-xs">${reports.formatCurrency(item.concept.price, 'DC')}</td>
                        <td class="text-right text-xs font-bold bg-yellow-50">${reports.format(item.totalQty, 'DR')}</td>
                        <td class="text-right text-xs font-black">${reports.formatCurrency(totalCost, 'DI')}</td>
                    </tr>
                `;
            });

            content += `
                    <tr style="background-color: #1e3a8a; color: white; font-weight: bold; font-size: 12px; border-top: 3px double white;">
                        <td colspan="5" class="text-right" style="padding: 10px; text-transform: uppercase;">IMPORTE TOTAL AUXILIARES:</td>
                        <td class="text-right" style="padding: 10px;">${reports.formatCurrency(grandTotal, 'DI')}</td>
                    </tr>
                </tbody></table>
            `;
        }
        
        reports.printHTML(content, "Necesidades de Auxiliares");
    },

    // --- LISTADO DE AUXILIARES ---
    generateAuxiliaryReport: () => {
        let content = `<h1>Partidas de Precios Auxiliares</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;

        const hierarchyMemberCodes = new Set();
        
        for (const [code, concept] of engine.db) {
            if (code.endsWith('#')) {
                concept.children.forEach(child => {
                    hierarchyMemberCodes.add(child.code);
                });
            }
        }

        const auxiliaryItems = Array.from(engine.db.values())
            .filter(c => {
                const isContainer = c.code.endsWith('#'); 
                const hasChildren = c.children && c.children.length > 0;
                const isDirectHierarchy = hierarchyMemberCodes.has(c.code);

                return hasChildren && !isContainer && !isDirectHierarchy;
            })
            .sort((a, b) => a.code.localeCompare(b.code));

        if (auxiliaryItems.length === 0) {
             content += `<p class="text-center italic" style="padding:20px;">No se encontraron partidas auxiliares.</p>`;
        } else {
             content += `
                <style>
                    .aux-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                    .aux-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                    .aux-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
                </style>
                <table class="aux-table">
                    <thead>
                        <tr>
                            <th width="15%">CÓDIGO</th>
                            <th width="12%" colspan="2">CANTIDAD UD</th>
                            <th width="43%">RESUMEN</th>
                            <th width="10%" class="text-right">PRECIO</th>
                            <th width="10%" class="text-right">SUBTOTAL</th>
                            <th width="10%" class="text-right">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            auxiliaryItems.forEach(parent => {
                 let descHtml = '';
                 if (parent.description && parent.description.trim().length > 0) {
                     descHtml = `<br><span style="font-weight: normal; margin-top: 4px; display: inline-block; text-align: justify;">${reports.escapeHtml(parent.description).replace(/\n/g, '<br>')}</span>`;
                 }
                 
                 content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 15px;">${reports.cleanCode(parent.code)}</td>
                        <td style="padding-top: 15px; width: 8%;"></td>
                        <td class="font-bold" style="padding-top: 15px; padding-left: 4px; width: 4%;">${parent.unit || ''}</td>
                        <td class="font-bold" style="padding-top: 15px;">${parent.summary}${descHtml}</td>
                        <td style="padding-top: 15px;"></td>
                        <td style="padding-top: 15px;"></td>
                        <td style="padding-top: 15px;"></td>
                    </tr>
                 `;

                 parent.children.forEach(child => {
                    const childConcept = engine.resolveConcept(child.code);
                    
                    const dr = engine.metadata.dr || 2;
                    const dc = engine.metadata.dc || 2;
                    const di = engine.metadata.di || 2;
                    
                    const roundTo = (val, dec) => Math.round((val + 0.00001) * Math.pow(10, dec)) / Math.pow(10, dec);
                    
                    const quantity = roundTo(child.factor * child.yield, dr);
                    const unitPrice = childConcept ? roundTo(childConcept.price, dc) : 0;
                    const cost = roundTo(quantity * unitPrice, di);
                    
                    const cCode = childConcept ? childConcept.code : child.code;
                    const cSum = childConcept ? childConcept.summary : '<span style="color:red">No encontrado</span>';
                    const cUnit = childConcept ? childConcept.unit : '';
                    
                    content += `
                        <tr style="page-break-inside: avoid;">
                            <td>${reports.cleanCode(cCode)}</td>
                            <td class="text-right">${reports.format(quantity, 'DR')}</td>
                            <td style="padding-left: 4px;">${cUnit}</td>
                            <td>${cSum}</td>
                            <td class="text-right">${reports.format(unitPrice, 'DC')}</td>
                            <td class="text-right">${reports.format(cost, 'DI')}</td>
                            <td></td>
                        </tr>
                    `;
                 });

                 // Fila espaciadora con el borde superior para PRECIO, SUBTOTAL e IMPORTE
                 content += `
                    <tr style="page-break-inside: avoid; height: 5px;">
                        <td colspan="4"></td>
                        <td style="border-top: 1px solid #000;"></td>
                        <td style="border-top: 1px solid #000;"></td>
                        <td style="border-top: 1px solid #000;"></td>
                    </tr>
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td colspan="3" style="padding-top: 2px; padding-bottom: 20px;">
                             <div style="display: flex; align-items: baseline; padding-left: 20%;">
                                 <span style="font-weight: bold; margin-right: 5px;">TOTAL PARTIDA</span>
                                 <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                             </div>
                        </td>
                        <td class="text-right font-bold" style="padding-top: 2px; padding-bottom: 20px;">${reports.format(parent.price, 'DI')}</td>
                    </tr>
                 `;
            });

            content += `</tbody></table>`;
        }

        reports.printHTML(content, "Precios Auxiliares");
    },

    // --- LISTADO DE DESCOMPUESTOS ---
    generateDecompositionReport: () => {
        let content = `<h1>Cuadro de Precios Descompuestos</h1>`; 
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        const hierarchyMemberCodes = new Set();
        for (const [code, concept] of engine.db) {
            if (code.endsWith('#')) { 
                concept.children.forEach(child => {
                    hierarchyMemberCodes.add(child.code);
                });
            }
        }

        const complexItems = Array.from(engine.db.values())
            .filter(c => {
                const isContainer = c.code.endsWith('#');
                const hasChildren = c.children && c.children.length > 0;
                const isDirectHierarchy = hierarchyMemberCodes.has(c.code);
                
                return hasChildren && !isContainer && isDirectHierarchy;
            })
            .sort((a, b) => a.code.localeCompare(b.code));

        if (complexItems.length === 0) {
             content += `<p class="text-center italic">No se encontraron partidas con descomposición en la estructura principal.</p>`;
        } else {
            content += `
                <style>
                    .decomp-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                    .decomp-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; }
                    .decomp-table td { padding: 2px 4px; vertical-align: top; border-bottom: none; color: #000; }
                </style>
                <table class="decomp-table">
                    <thead>
                        <tr>
                            <th width="12%">CÓDIGO</th>
                            <th width="10%" class="text-right">CANTIDAD</th>
                            <th width="5%" style="padding-left: 8px;">UD</th>
                            <th width="43%">RESUMEN</th>
                            <th width="10%" class="text-right">PRECIO</th>
                            <th width="10%" class="text-right">SUBTOTAL</th>
                            <th width="10%" class="text-right">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            complexItems.forEach(parent => {
                let descHtml = '';
                if (parent.description && parent.description.trim().length > 0) {
                    descHtml = `<br><span style="font-weight: normal; margin-top: 4px; display: inline-block;">${reports.escapeHtml(parent.description).replace(/\n/g, '<br>')}</span>`;
                }

                // Fila Padre
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold" style="padding-top: 15px;">${reports.cleanCode(parent.code)}</td>
                        <td style="padding-top: 15px;"></td>
                        <td class="font-bold" style="padding-top: 15px; padding-left: 8px;">${parent.unit || ''}</td>
                        <td class="font-bold" style="padding-top: 15px;">${parent.summary}${descHtml}</td>
                        <td style="padding-top: 15px;"></td>
                        <td style="padding-top: 15px;"></td>
                        <td style="padding-top: 15px;"></td>
                    </tr>
                `;
                
                // Filas Hijos
                parent.children.forEach(child => {
                    const childConcept = engine.resolveConcept(child.code);
                    
                    const dr = engine.metadata.dr || 2;
                    const dc = engine.metadata.dc || 2;
                    const di = engine.metadata.di || 2;
                    
                    const roundTo = (val, dec) => Math.round((val + 0.00001) * Math.pow(10, dec)) / Math.pow(10, dec);
                    
                    const quantity = roundTo(child.factor * child.yield, dr);
                    const unitPrice = childConcept ? roundTo(childConcept.price, dc) : 0;
                    const cost = roundTo(quantity * unitPrice, di);
                    
                    const cCode = childConcept ? childConcept.code : child.code;
                    const cSum = childConcept ? childConcept.summary : '<span style="color:red">No encontrado</span>';
                    const cUnit = childConcept ? childConcept.unit : '';
                    
                    content += `
                        <tr style="page-break-inside: avoid;">
                            <td>${reports.cleanCode(cCode)}</td>
                            <td class="text-right">${reports.format(quantity, 'DR')}</td>
                            <td style="padding-left: 8px;">${cUnit}</td>
                            <td>${cSum}</td>
                            <td class="text-right">${reports.format(unitPrice, 'DC')}</td>
                            <td class="text-right">${reports.format(cost, 'DI')}</td>
                            <td></td>
                        </tr>
                    `;
                });

                // Fila Total y Letra
                const priceText = reports.numberToText(parent.price);
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td colspan="3"></td>
                        <td>
                             <div style="display: flex; align-items: baseline; padding-left: 20%;">
                                 <span style="font-weight: bold;">TOTAL PARTIDA</span>
                                 <span style="flex-grow: 1; border-bottom: 1px dotted #000; margin-left: 5px;"></span>
                             </div>
                        </td>
                        <td></td>
                        <td style="border-top: 1px solid #000;"></td>
                        <td class="text-right font-bold" style="border-top: 1px solid #000;">${reports.format(parent.price, 'DI')}</td>
                    </tr>
                    <tr style="page-break-inside: avoid;">
                        <td colspan="7" style="padding-top: 5px; padding-bottom: 15px; font-size: 11px;">
                            Asciende el precio total de la partida a la mencionada cantidad de ${priceText}
                        </td>
                    </tr>
                `;
            });

            content += `</tbody></table>`;
        }

        reports.printHTML(content, "Precios Descompuestos");
    },

    // --- MACRO: INFORME DE DESCOMPUESTOS SIN TEXTO LARGO ---
    generateMissingTextReport: () => {
        let content = `<h1>Partidas Descompuestas sin Texto Largo</h1>`; 
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;
        
        const missingTextItems = Array.from(engine.db.values())
            .filter(c => {
                // Descartar contenedores (Capítulos y Raíz)
                const isContainer = c.code.endsWith('#') || c.code.endsWith('##') || c.code === engine.rootCode;
                // Partida descompuesta = tiene hijos
                const hasChildren = c.children && c.children.length > 0;
                // No tiene texto largo
                const hasNoText = !c.description || c.description.trim() === '';
                
                return hasChildren && !isContainer && hasNoText;
            })
            .sort((a, b) => a.code.localeCompare(b.code));

        if (missingTextItems.length === 0) {
            content += `<p class="text-center italic" style="padding:20px;">No se encontraron partidas descompuestas sin texto largo.</p>`;
        } else {
            content += `
                <style>
                    .basic-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                    .basic-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                    .basic-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
                </style>
                <table class="basic-table">
                    <thead>
                        <tr>
                            <th width="20%">CÓDIGO</th>
                            <th width="80%">RESUMEN (NOMBRE CORTO)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            missingTextItems.forEach(item => {
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold">${reports.cleanCode(item.code)}</td>
                        <td>${item.summary}</td>
                    </tr>
                `;
            });
            
            content += `</tbody></table>`;
        }

        reports.printHTML(content, "Partidas sin texto largo");
    },

    // --- NUEVO INFORME: SOLO PARTIDAS ---
    generatePartidasReport: () => {
        let content = `<h1>Listado de Partidas</h1>`;
        content += `<div class="meta">PROYECTO: ${reports.cleanCode(engine.rootCode)} | DIVISA: ${engine.metadata.currency}</div>`;

        const items = Array.from(engine.db.values())
            .filter(c => {
                // Excluir la raíz y los capítulos
                const isContainer = c.code.endsWith('#') || c.code.endsWith('##') || c.code === engine.rootCode;
                return !isContainer;
            })
            .sort((a, b) => a.code.localeCompare(b.code));

        if (items.length === 0) {
             content += `<p class="text-center italic" style="padding:20px;">No se encontraron partidas.</p>`;
        } else {
             content += `
                <style>
                    .basic-table { width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 11px; margin-bottom: 20px; }
                    .basic-table th { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 4px; text-align: left; background: transparent; color: #000; font-size: 10px; font-weight: bold;  }
                    .basic-table td { padding: 4px 4px; vertical-align: top; border-bottom: none; color: #000; }
                </style>
                <table class="basic-table">
                    <thead>
                        <tr>
                            <th width="12%">CÓDIGO</th>
                            <th width="5%" class="text-center">UD</th>
                            <th width="71%">RESUMEN</th>
                            <th width="12%" class="text-right">PRECIO</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            items.forEach(item => {
                content += `
                    <tr style="page-break-inside: avoid;">
                        <td class="font-bold">${reports.cleanCode(item.code)}</td>
                        <td class="text-center">${item.unit || ''}</td>
                        <td>${item.summary}</td>
                        <td class="text-right">${reports.format(item.price, 'DC')}</td>
                    </tr>
                `;
            });

            content += `</tbody></table>`;
        }

        reports.printHTML(content, "Solo Partidas");
    }
};