/**
 * PROYECTO: Visor Profesional FIEBDC-3 (BC3)
 * MODULO: Generador de Listados Jerárquicos
 * VERSION: 3.86 (Format Restoration)
 * DESCRIPCION: 
 * - [CORRECCION] Restaurado el formato legible del código (indentación y saltos de línea).
 * - [LOGICA] Mantiene el algoritmo de cálculo modificado para CP2.
 * - [VISUAL] Mantiene los estilos de texto mejorados (sin cursiva).
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
                        output = output.trim().replace('E', 'I') + units[n % 10]; 
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
            result += ' CON ' + decimalWords + ' CÉNTIMOS';
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
                    th { background-color: #f1f5f9; text-align: left; padding: 8px 8px; font-weight: bold; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
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
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | ${engine.metadata.software}</div>`;
        
        const processNode = (concept, parentCode, level, isChapter) => {
            if (isChapter) {
                const indentClass = `indent-${Math.min(level, 5)}`;
                content += `
                    <div class="no-break" style="margin-top: 15px; margin-bottom: 5px; border-bottom: 1px solid #333;">
                        <div class="${indentClass} chapter-row" style="padding: 5px;">
                            <span class="font-mono font-bold" style="margin-right:10px;">${concept.code}</span>
                            <span class="chapter-title">${concept.summary}</span>
                        </div>
                    </div>
                `;
            } 
            else {
                const indentClass = `indent-${Math.min(level, 5)}`;
                const measData = reports.findMeasurementData(concept.code);
                const hasMeasurements = measData && measData.lines && measData.lines.length > 0;
                const totalStr = measData ? reports.fmtTwoDecimals(measData.total) : '';

                content += `
                    <div class="no-break" style="margin-top: 10px;">
                        <table style="margin-bottom: 0;">
                            <tr class="meas-header-row">
                                <td width="15%" class="${indentClass} font-mono font-bold">${concept.code}</td>
                                <td width="70%">
                                    <span class="font-bold">${concept.summary}</span>
                                    ${concept.description ? `<br><span style="font-size: 10px; font-style: normal; color: #334155;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>` : ''}
                                </td>
                                <td width="15%" class="text-right font-bold bg-white" style="vertical-align: middle;">
                                    ${totalStr ? `<span class="header-total">${totalStr}</span>` : ''}
                                    ${concept.unit || ''}
                                </td>
                            </tr>
                        </table>
                `;

                if (hasMeasurements) {
                    content += `
                        <table class="subtable">
                            <thead>
                                <tr>
                                    <th width="15%">Tipo</th>
                                    <th width="35%">Comentario</th>
                                    <th width="10%" class="text-center">Ud</th>
                                    <th width="10%" class="text-center">Largo</th>
                                    <th width="10%" class="text-center">Ancho</th>
                                    <th width="10%" class="text-center">Alto</th>
                                    <th width="10%" class="text-right">Parcial</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    let subtotal = 0;
                    measData.lines.forEach(m => {
                        let parcial = 0;
                        if (m.type === '1') { 
                             content += `<tr style="background-color: #fff7ed; font-weight:bold; font-style:italic;"><td colspan="6" class="text-right">${m.comment || 'Subtotal'}:</td><td class="text-right">${reports.fmtTwoDecimals(subtotal)}</td></tr>`;
                             subtotal = 0; 
                             return;
                        }
                        if (m.type === '2') return; 

                        if (m.type === '3' && m.comment) {
                            parcial = engine.evaluateFormula(m.comment, m.units, m.length, m.width, m.height);
                        } else if (m.units !== 0 || m.length !== 0 || m.width !== 0 || m.height !== 0) {
                            const val = (v) => v === 0 ? 1 : v;
                            parcial = m.units * val(m.length) * val(m.width) * val(m.height);
                        }
                        
                        parcial = engine.round(parcial);
                        subtotal += parcial;

                        content += `
                            <tr>
                                <td>${m.type}</td>
                                <td>${m.comment}</td>
                                <td class="text-center">${m.units !== 0 ? reports.format(m.units, 'DN') : ''}</td>
                                <td class="text-center">${m.length !== 0 ? reports.format(m.length, 'DD') : ''}</td>
                                <td class="text-center">${m.width !== 0 ? reports.format(m.width, 'DD') : ''}</td>
                                <td class="text-center">${m.height !== 0 ? reports.format(m.height, 'DD') : ''}</td>
                                <td class="text-right">${reports.fmtTwoDecimals(parcial)}</td>
                            </tr>
                        `;
                    });

                    content += `
                            </tbody>
                            <tfoot>
                                <tr class="meas-total-row">
                                    <td colspan="6" class="text-right text-xs uppercase tracking-wide">Total Medición ${concept.code}:</td>
                                    <td class="text-right font-black">${reports.fmtTwoDecimals(measData.total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    `;
                } else {
                    if (measData && measData.total !== 0) {
                         content += `
                            <div class="subtable text-right italic text-xs" style="padding:5px; border:none;">
                                (Sin desglose de líneas)
                            </div>`;
                    }
                }
                content += `</div>`;
            }
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
        }

        reports.printHTML(content, "Listado de Mediciones");
    },

    // REPORTE 2: PRESUPUESTO
    generateBudgetReport: () => {
        let content = `<h1>Presupuesto General</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <table>
                <thead>
                    <tr>
                        <th width="12%">Código</th>
                        <th width="48%">Descripción</th>
                        <th width="5%" class="text-center">Ud</th>
                        <th width="12%" class="text-right">Cantidad</th>
                        <th width="10%" class="text-right">Precio</th>
                        <th width="13%" class="text-right">Importe</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const processNode = (concept, parentCode, level, isChapter) => {
            // Excluir raíz del listado
            if (concept.code === engine.rootCode) return;

            const indentClass = `indent-${Math.min(level, 5)}`;
            let cantidad = 0;
            let importe = 0;

            if (parentCode) {
                const parent = engine.resolveConcept(parentCode);
                const childRef = parent.children.find(c => engine.normalizeCode(c.code) === engine.normalizeCode(concept.code));
                if (childRef) {
                    cantidad = childRef.factor * childRef.yield;
                }
            } else {
                cantidad = 1; 
            }

            importe = engine.round(concept.price * cantidad);

            const rowClass = isChapter ? 'chapter-row' : 'item-row';
            const fontClass = isChapter ? 'font-bold' : '';
            
            let descText = concept.summary;
            let descExtra = "";
            
            if (!isChapter && concept.description) {
                descExtra = `<br><span style="font-size: 10px; font-style: normal; color:#334155; font-weight:normal;">${reports.escapeHtml(concept.description).replace(/\n/g, ' ')}</span>`;
            }

            content += `
                <tr class="${rowClass}">
                    <td class="font-mono ${fontClass} ${indentClass}">${concept.code}</td>
                    <td class="${fontClass}">
                        ${descText}
                        ${descExtra}
                    </td>
                    <td class="text-center text-xs">${concept.unit || ''}</td>
                    <td class="text-right ${fontClass}">${reports.format(cantidad, 'DN')}</td>
                    <td class="text-right">${reports.format(concept.price, 'DC')}</td>
                    <td class="text-right font-bold">${reports.format(importe, 'DI')}</td>
                </tr>
            `;
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
            
            const rootConcept = engine.db.get(engine.rootCode);
            content += `
                </tbody>
                <tfoot>
                    <tr style="background-color: #1e3a8a; color: white;">
                        <td colspan="5" class="text-right" style="padding: 10px; font-size:12px;">TOTAL PRESUPUESTO DE EJECUCIÓN MATERIAL:</td>
                        <td class="text-right" style="padding: 10px; font-size:12px; font-weight:bold;">${reports.formatCurrency(rootConcept.price, 'DI')}</td>
                    </tr>
                </tfoot>
            </table>
            `;
        }

        reports.printHTML(content, "Listado de Presupuesto");
    },

    // REPORTE 3: RESUMEN CAPÍTULOS
    generateChapterSummaryReport: () => {
        let content = `<h1>Resumen por Capítulos</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <table>
                <thead>
                    <tr>
                        <th width="15%">Código</th>
                        <th width="65%">Descripción</th>
                        <th width="20%" class="text-right">Importe</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const processNode = (concept, parentCode, level, isChapter) => {
            if (!isChapter) return;
            
            // Excluir raíz del listado
            if (concept.code === engine.rootCode) return;

            const indentClass = `indent-${Math.min(level, 5)}`;
            let cantidad = 0;
            let importe = 0;

            if (parentCode) {
                const parent = engine.resolveConcept(parentCode);
                const childRef = parent.children.find(c => engine.normalizeCode(c.code) === engine.normalizeCode(concept.code));
                if (childRef) {
                    cantidad = childRef.factor * childRef.yield;
                }
            } else {
                cantidad = 1; 
            }

            importe = engine.round(concept.price * cantidad);
            
            content += `
                <tr class="chapter-row">
                    <td class="font-mono font-bold ${indentClass}">${concept.code}</td>
                    <td class="font-bold">${concept.summary}</td>
                    <td class="text-right font-bold">${reports.format(importe, 'DI')}</td>
                </tr>
            `;
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
            
            const rootConcept = engine.db.get(engine.rootCode);
            content += `
                </tbody>
                <tfoot>
                    <tr style="background-color: #1e3a8a; color: white;">
                        <td colspan="2" class="text-right" style="padding: 10px; font-size:12px;">TOTAL PRESUPUESTO DE EJECUCIÓN MATERIAL:</td>
                        <td class="text-right" style="padding: 10px; font-size:12px; font-weight:bold;">${reports.formatCurrency(rootConcept.price, 'DI')}</td>
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
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <table>
                <thead>
                    <tr>
                        <th width="5%" class="text-center">Nº</th>
                        <th width="15%">Código</th>
                        <th width="60%">Designación de las Obras</th>
                        <th width="20%" class="text-right">Precio</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let counter = 1;

        const processNode = (concept, parentCode, level, isChapter) => {
            if (isChapter) return; 

            const nString = counter.toString().padStart(2, '0');
            
            let itemText = "";
            if (concept.description) {
                itemText = `<span style="font-weight:normal;">${reports.escapeHtml(concept.description).replace(/\n/g, '<br>')}</span>`;
            } else {
                itemText = `<span>${concept.summary}</span>`;
            }
            
            const priceText = reports.numberToText(concept.price);

            content += `
                <tr class="no-break">
                    <td class="text-center font-bold text-xs" style="vertical-align:top; padding-top:8px;">${nString}</td>
                    <td class="font-mono font-bold" style="vertical-align:top; padding-top:8px;">${concept.code}</td>
                    <td>
                        ${itemText}
                        <span class="price-letter">Asciende el precio unitario a la expresada cantidad de ${priceText}</span>
                    </td>
                    <td class="text-right" style="vertical-align:top; padding-top:8px;">
                        <span class="price-number">${reports.formatCurrency(concept.price, 'DC')}</span>
                    </td>
                </tr>
            `;
            counter++;
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
        }

        content += `
                </tbody>
            </table>
        `;

        reports.printHTML(content, "Cuadro de Precios Nº 1");
    },

    // REPORTE 5: CUADRO DE PRECIOS Nº 2 [CON NUEVO ALGORITMO]
    generatePriceTable2Report: () => {
        let content = `<h1>Cuadro de Precios Nº 2</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
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
            </style>
        `;

        let counter = 1;

        const processNode = (concept, parentCode, level, isChapter) => {
            if (isChapter) return; 

            const nString = counter.toString().padStart(4, '0');
            
            let itemText = concept.description 
                ? reports.escapeHtml(concept.description).replace(/\n/g, '<br>')
                : concept.summary;

            let totalMO = 0; 
            let totalMQ = 0; 
            let totalResto = 0; 

            // Redondeo estándar (2 decimales)
            const round2 = (v) => Math.round(v * 100) / 100;

            if (concept.children && concept.children.length > 0) {
                concept.children.forEach(child => {
                    const childConcept = engine.resolveConcept(child.code);
                    if (childConcept) {
                        const qty = round2((child.factor * child.yield)+0.0001);
                        const type = childConcept.type;

                        // REGLA 1: Si es Auxiliar (Tipo 0) o tiene hijos, se desglosa recursivamente
                        if (type === '0' || (childConcept.children && childConcept.children.length > 0)) {
                            // Extraer composición unitaria (recursive)
                            const breakdown = reports.getExplodedUnitCost(child.code);
                            
                            // Aplicar fórmula y acumular
                            totalMO    += round2((breakdown.mo * qty) + 0.00001);
                            totalMQ    += round2((breakdown.mq * qty) + 0.00001);
                            totalResto += round2((breakdown.resto * qty) + 0.00001);

                        } 
                        // REGLA 2: Recurso Simple (Tipos 1, 2, 3)
                        else {
                            const lineCost = round2((qty * childConcept.price) + 0.0001);
                            
                            if (type === '1') totalMO += lineCost;
                            else if (type === '2') totalMQ += lineCost;
                            else totalResto += lineCost;
                        }
                    }
                });
            } else {
                // Caso extremo: Partida sin descomposición (precio directo)
                if (concept.type === '1') totalMO = concept.price;
                else if (concept.type === '2') totalMQ = concept.price;
                else totalResto = concept.price;
            }

            const fmt = (n) => reports.fmtTwoDecimals(n);

            content += `
                <div class="cp2-row">
                    <div class="cp2-col-idx">${nString}</div>
                    <div class="cp2-col-code">${concept.code}</div>
                    <div class="cp2-col-unit">${concept.unit || ''}</div>
                    <div class="cp2-col-body">
                        <div class="cp2-desc">${itemText}</div>
                        
                        <div class="cp2-breakdown">
                            ${totalMO > 0 ? `
                            <div class="cp2-line">
                                <span class="cp2-label">Mano de obra</span>
                                <span class="cp2-dots"></span>
                                <span class="cp2-val">${fmt(totalMO)}</span>
                            </div>` : ''}
                            
                            ${totalMQ > 0 ? `
                            <div class="cp2-line">
                                <span class="cp2-label">Maquinaria</span>
                                <span class="cp2-dots"></span>
                                <span class="cp2-val">${fmt(totalMQ)}</span>
                            </div>` : ''}
                            
                            ${totalResto > 0 ? `
                            <div class="cp2-line">
                                <span class="cp2-label">Resto de obra y materiales</span>
                                <span class="cp2-dots"></span>
                                <span class="cp2-val">${fmt(totalResto)}</span>
                            </div>` : ''}

                            <div class="cp2-sep"></div>

                            <div class="cp2-line cp2-total-line">
                                <span class="cp2-label">TOTAL PARTIDA</span>
                                <span class="cp2-dots"></span>
                                <span class="cp2-val">${fmt(concept.price)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            counter++;
        };

        if(engine.rootCode) {
            reports.traverseTree(engine.rootCode, null, 0, processNode);
        }

        reports.printHTML(content, "Cuadro de Precios Nº 2");
    },

    // --- LISTADOS DE ELEMENTALES ---

    generateBasicResourceReport: (type, typeName) => {
        let content = `<h1>Listado de ${typeName}</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
        content += `
            <table>
                <thead>
                    <tr>
                        <th width="15%">Código</th>
                        <th width="65%">Descripción</th>
                        <th width="20%" class="text-right">Precio</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const resources = Array.from(engine.db.values())
            .filter(c => c.type === type)
            .sort((a, b) => a.code.localeCompare(b.code));

        if (resources.length === 0) {
             content += `<tr><td colspan="3" class="text-center italic" style="padding:20px;">No se encontraron elementos de tipo ${typeName}</td></tr>`;
        }

        resources.forEach(res => {
             content += `
                <tr>
                    <td class="font-mono font-bold">${res.code}</td>
                    <td>${res.summary}</td>
                    <td class="text-right font-bold">${reports.formatCurrency(res.price, 'DC')}</td>
                </tr>
            `;
        });

        content += `</tbody></table>`;
        reports.printHTML(content, `Listado de ${typeName}`);
    },

    generateLaborReport: () => reports.generateBasicResourceReport('1', 'Mano de Obra'),
    generateMachineryReport: () => reports.generateBasicResourceReport('2', 'Maquinaria'),
    generateMaterialsReport: () => reports.generateBasicResourceReport('3', 'Materiales'),

    // --- LISTADO DE NECESIDADES ---
    generateNeedsReport: () => {
        let content = `<h1>Listado de Necesidades</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;

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
        const typeOrder = { '1': 1, '3': 2, '2': 3 };
        const getOrder = (type) => typeOrder[type] || 4;

        list.sort((a, b) => {
            const orderA = getOrder(a.concept.type);
            const orderB = getOrder(b.concept.type);
            if (orderA !== orderB) return orderA - orderB;
            return a.concept.code.localeCompare(b.concept.code);
        });

        content += `
            <table>
                <thead>
                    <tr>
                        <th width="12%">Código</th>
                        <th width="40%">Descripción</th>
                        <th width="8%" class="text-center">Tipo</th>
                        <th width="13%" class="text-right">Precio Unit.</th>
                        <th width="12%" class="text-right">Total Ud.</th>
                        <th width="15%" class="text-right">Importe Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let currentTypeGroup = -1;
        let groupSubtotal = 0; 
        let grandTotal = 0;    
        const typeNames = { 1: 'Mano de Obra', 3: 'Materiales', 2: 'Maquinaria', 4: 'Otros' };

        list.forEach(item => {
            const orderGroup = getOrder(item.concept.type);
            const totalCost = item.totalQty * item.concept.price;
            
            if (orderGroup !== currentTypeGroup) {
                if (currentTypeGroup !== -1) {
                     content += `
                        <tr style="background-color: #f1f5f9; font-weight: bold; font-size: 10px; border-top: 1px solid #cbd5e1;">
                            <td colspan="5" class="text-right" style="padding: 6px 8px; text-transform: uppercase; color: #475569;">Subtotal ${typeNames[currentTypeGroup]}:</td>
                            <td class="text-right" style="padding: 6px 8px; color: #1e3a8a;">${reports.formatCurrency(groupSubtotal, 'DI')}</td>
                        </tr>
                    `;
                    grandTotal += groupSubtotal;
                    groupSubtotal = 0;
                }

                currentTypeGroup = orderGroup;
                content += `
                    <tr style="background-color: #e2e8f0; font-weight: bold; text-transform: uppercase; font-size: 10px;">
                        <td colspan="6" style="padding: 6px 8px; border-top: 2px solid #cbd5e1; color: #334155;">${typeNames[orderGroup]}</td>
                    </tr>
                `;
            }

            groupSubtotal += totalCost;

            content += `
                <tr>
                    <td class="font-mono text-xs">${item.concept.code}</td>
                    <td class="text-xs">${item.concept.summary}</td>
                    <td class="text-center text-xs text-slate-400">${item.concept.type}</td>
                    <td class="text-right text-xs">${reports.formatCurrency(item.concept.price, 'DC')}</td>
                    <td class="text-right text-xs font-bold">${reports.fmtThreeDecimals(item.totalQty)} ${item.concept.unit}</td>
                    <td class="text-right text-xs font-black">${reports.formatCurrency(totalCost, 'DI')}</td>
                </tr>
            `;
        });

        if (currentTypeGroup !== -1) {
             content += `
                <tr style="background-color: #f1f5f9; font-weight: bold; font-size: 10px; border-top: 1px solid #cbd5e1;">
                    <td colspan="5" class="text-right" style="padding: 6px 8px; text-transform: uppercase; color: #475569;">Subtotal ${typeNames[currentTypeGroup]}:</td>
                    <td class="text-right" style="padding: 6px 8px; color: #1e3a8a;">${reports.formatCurrency(groupSubtotal, 'DI')}</td>
                </tr>
            `;
            grandTotal += groupSubtotal;
        }

        content += `
            <tr style="background-color: #1e3a8a; color: white; font-weight: bold; font-size: 12px; border-top: 3px double white;">
                <td colspan="5" class="text-right" style="padding: 10px; text-transform: uppercase;">TOTAL NECESIDADES DE OBRA:</td>
                <td class="text-right" style="padding: 10px;">${reports.formatCurrency(grandTotal, 'DI')}</td>
            </tr>
        `;

        content += `</tbody></table>`;
        reports.printHTML(content, "Necesidades del Proyecto");
    },

    // --- LISTADO DE NECESIDADES DE AUXILIARES ---
    generateAuxiliaryNeedsReport: () => {
        let content = `<h1>Necesidades de Partidas Auxiliares</h1>`;
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;

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
                const totalCost = item.totalQty * item.concept.price;
                grandTotal += totalCost;

                content += `
                    <tr>
                        <td class="font-mono text-xs font-bold">${item.concept.code}</td>
                        <td class="text-xs">${item.concept.summary}</td>
                        <td class="text-center text-xs text-slate-500">${item.concept.unit}</td>
                        <td class="text-right text-xs">${reports.formatCurrency(item.concept.price, 'DC')}</td>
                        <td class="text-right text-xs font-bold bg-yellow-50">${reports.fmtThreeDecimals(item.totalQty)}</td>
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
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;

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
            auxiliaryItems.forEach(parent => {
                 let descriptionHtml = '';
                 if (parent.description && parent.description.trim().length > 0) {
                     const safeText = reports.escapeHtml(parent.description).replace(/\n/g, '<br>');
                     descriptionHtml = `
                        <div style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #cbd5e1; color: #475569; font-size: 1em; font-family: sans-serif; font-style: normal; margin-bottom: 5px;">
                            ${safeText}
                        </div>
                     `;
                 }
    
                 content += `
                    <div class="no-break" style="margin-top: 20px; border: 1px solid #e2e8f0; padding: 0; border-radius: 4px; overflow:hidden;">
                        <div style="background-color: #f1f5f9; padding: 10px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <span style="color:#1e40af; font-weight:bold; font-family:monospace; font-size:1.1em; margin-right:10px;">${parent.code}</span>
                                <span style="font-weight:bold;">${parent.summary}</span>
                            </div>
                            <span style="font-weight:black; font-size:1.1em;">${reports.formatCurrency(parent.price, 'DC')}</span>
                        </div>
                        
                        ${descriptionHtml}
    
                        <table style="width:100%; font-size: 0.9em; margin-bottom:0; border:none;">
                            <thead style="background:white;">
                                <tr style="color:#64748b; font-size:0.8em; text-transform:uppercase;">
                                    <th width="15%" style="border-bottom:1px solid #eee;">Código</th>
                                    <th width="40%" style="border-bottom:1px solid #eee;">Descripción Recurso</th>
                                    <th width="10%" class="text-center" style="border-bottom:1px solid #eee;">Ud</th>
                                    <th width="10%" class="text-right" style="border-bottom:1px solid #eee;">Rend.</th>
                                    <th width="10%" class="text-right" style="border-bottom:1px solid #eee;">Precio</th>
                                    <th width="15%" class="text-right" style="border-bottom:1px solid #eee;">Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                parent.children.forEach(child => {
                    const childConcept = engine.resolveConcept(child.code);
                    const quantity = child.factor * child.yield;
                    const unitPrice = childConcept ? childConcept.price : 0;
                    const cost = quantity * unitPrice;
                    
                    content += `
                        <tr>
                            <td class="font-mono text-xs" style="border-bottom:1px dashed #f1f5f9;">${childConcept ? childConcept.code : child.code}</td>
                            <td class="text-xs" style="border-bottom:1px dashed #f1f5f9;">${childConcept ? childConcept.summary : '<span style="color:red">No encontrado</span>'}</td>
                            <td class="text-center text-xs" style="border-bottom:1px dashed #f1f5f9; color:#94a3b8;">${childConcept ? childConcept.unit : ''}</td>
                            <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.fmtThreeDecimals(quantity)}</td>
                            <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.formatCurrency(unitPrice, 'DC')}</td>
                            <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.formatCurrency(cost, 'DI')}</td>
                        </tr>
                    `;
                });
                
                content += `</tbody></table></div>`;
            });
        }

        reports.printHTML(content, "Precios Auxiliares");
    },

    // --- LISTADO DE DESCOMPUESTOS ---
    generateDecompositionReport: () => {
        let content = `<h1>Descompuestos</h1>`; 
        content += `<div class="meta">PROYECTO: ${engine.rootCode} | DIVISA: ${engine.metadata.currency}</div>`;
        
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
        }

        complexItems.forEach(parent => {
             let descriptionHtml = '';
             if (parent.description && parent.description.trim().length > 0) {
                 const safeText = reports.escapeHtml(parent.description).replace(/\n/g, '<br>');
                 descriptionHtml = `
                    <div style="padding: 10px 15px; background-color: #ffffff; border-bottom: 1px solid #cbd5e1; color: #475569; font-size: 1em; font-family: sans-serif; font-style: normal; margin-bottom: 5px;">
                        ${safeText}
                    </div>
                 `;
             }

             content += `
                <div class="no-break" style="margin-top: 20px; border: 1px solid #e2e8f0; padding: 0; border-radius: 4px; overflow:hidden;">
                    <div style="background-color: #f1f5f9; padding: 10px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="color:#1e40af; font-weight:bold; font-family:monospace; font-size:1.1em; margin-right:10px;">${parent.code}</span>
                            <span style="font-weight:bold;">${parent.summary}</span>
                        </div>
                        <span style="font-weight:black; font-size:1.1em;">${reports.formatCurrency(parent.price, 'DC')}</span>
                    </div>
                    
                    ${descriptionHtml}

                    <table style="width:100%; font-size: 0.9em; margin-bottom:0; border:none;">
                        <thead style="background:white;">
                            <tr style="color:#64748b; font-size:0.8em; text-transform:uppercase;">
                                <th width="15%" style="border-bottom:1px solid #eee;">Código</th>
                                <th width="40%" style="border-bottom:1px solid #eee;">Descripción Recurso</th>
                                <th width="10%" class="text-center" style="border-bottom:1px solid #eee;">Ud</th>
                                <th width="10%" class="text-right" style="border-bottom:1px solid #eee;">Rend.</th>
                                <th width="10%" class="text-right" style="border-bottom:1px solid #eee;">Precio</th>
                                <th width="15%" class="text-right" style="border-bottom:1px solid #eee;">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            parent.children.forEach(child => {
                const childConcept = engine.resolveConcept(child.code);
                const quantity = child.factor * child.yield;
                const unitPrice = childConcept ? childConcept.price : 0;
                const cost = quantity * unitPrice;
                
                content += `
                    <tr>
                        <td class="font-mono text-xs" style="border-bottom:1px dashed #f1f5f9;">${childConcept ? childConcept.code : child.code}</td>
                        <td class="text-xs" style="border-bottom:1px dashed #f1f5f9;">${childConcept ? childConcept.summary : '<span style="color:red">No encontrado</span>'}</td>
                        <td class="text-center text-xs" style="border-bottom:1px dashed #f1f5f9; color:#94a3b8;">${childConcept ? childConcept.unit : ''}</td>
                        <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.fmtThreeDecimals(quantity)}</td>
                        <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.formatCurrency(unitPrice, 'DC')}</td>
                        <td class="text-right text-xs" style="border-bottom:1px dashed #f1f5f9;">${reports.formatCurrency(cost, 'DI')}</td>
                    </tr>
                `;
            });
            
            content += `</tbody></table></div>`;
        });

        reports.printHTML(content, "Descompuestos");
    }
};