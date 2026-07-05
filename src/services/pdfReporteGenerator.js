import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { calcularTotales } from '@/utils/reporteMensualConfig';

const ENCABEZADOS = [
    'Periodo', 'Medicina Interna', 'Medicina Cirugía', 'Infectología', 'Pabellón', 'Neuro Trauma',
    'Ginecología', 'Neonatología', 'Pediatría', 'Onco Pediatría', 'UCIM', 'UTI Pediatría', 'UTI Adultos', 'Total'
];

function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}

function agregarPaginaMovimiento(doc, movimiento, datos, fechaInicio, fechaFin, detalle, logoBase64) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = 140;
    const imgHeight = 45;

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.addImage(
        logoBase64,
        'PNG',
        (pageWidth - imgWidth) / 2,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
    );
    doc.restoreGraphicsState();

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporte Mensual - ${movimiento.label}`, 14, 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const modoTexto = detalle ? 'Detalle diario' : 'Resumen mensual';
    doc.text(`Período: ${fechaInicio} al ${fechaFin} — ${modoTexto}`, 14, 22);

    const tableData = datos.map(fila => [
        fila.periodo || '-',
        fila.medicina_interna || 0,
        fila.medicina_cirugia || 0,
        fila.infectologia || 0,
        fila.pabellon || 0,
        fila.neuro_trauma || 0,
        fila.ginecologia || 0,
        fila.neonatologia || 0,
        fila.pediatria || 0,
        fila.onco_pediatria || 0,
        fila.ucim || 0,
        fila.uti_pediatria || 0,
        fila.uti_adultos || 0,
        fila.total || 0
    ]);

    const totales = calcularTotales(datos);
    tableData.push([
        'TOTAL',
        totales.medicina_interna,
        totales.medicina_cirugia,
        totales.infectologia,
        totales.pabellon,
        totales.neuro_trauma,
        totales.ginecologia,
        totales.neonatologia,
        totales.pediatria,
        totales.onco_pediatria,
        totales.ucim,
        totales.uti_pediatria,
        totales.uti_adultos,
        totales.total
    ]);

    doc.autoTable({
        startY: 28,
        head: [ENCABEZADOS],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 1,
            overflow: 'linebreak',
            halign: 'center'
        },
        headStyles: {
            fillColor: [31, 74, 44],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 22 },
            13: { fontStyle: 'bold', fillColor: [236, 240, 241] }
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        didParseCell: function (data) {
            if (data.row.index === tableData.length - 1) {
                data.cell.styles.fillColor = [66, 143, 85];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fontSize = 8;
            }
        },
        margin: { top: 28, left: 14, right: 14 }
    });

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
        `Página ${pageCount} - Elaborado por Williams Alvarez Zabala, el ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
    );
}

export async function generarPdfReporte({ datosReporte, fechaInicio, fechaFin, detalle, movimientos, logoUrl }) {
    const logoBase64 = await getBase64ImageFromURL(logoUrl);
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });

    let esPrimeraPagina = true;

    movimientos.forEach((movimiento) => {
        const datos = datosReporte[movimiento.key];
        if (!datos || datos.length === 0) return;

        if (!esPrimeraPagina) {
            doc.addPage();
        }
        esPrimeraPagina = false;

        agregarPaginaMovimiento(doc, movimiento, datos, fechaInicio, fechaFin, detalle, logoBase64);
    });

    const nombreArchivo = `reporte_mensual_${fechaInicio}_${fechaFin}.pdf`;
    doc.save(nombreArchivo);
}

function agregarMarcaAgua(doc, logoBase64) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = 140;
    const imgHeight = 45;

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.addImage(
        logoBase64,
        'PNG',
        (pageWidth - imgWidth) / 2,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
    );
    doc.restoreGraphicsState();
}

function agregarPiePagina(doc) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
        `Elaborado el ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
    );
}

export async function generarPdfCamasPrestadas({ detalle, totales, filtros, logoUrl }) {
    const logoBase64 = await getBase64ImageFromURL(logoUrl);
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });

    agregarMarcaAgua(doc, logoBase64);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Camas Prestadas', 14, 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const servicioTexto = filtros.servicio === 'todos' ? 'Todos' : filtros.servicio;
    const especialidadTexto = filtros.especialidad === 'todas' ? 'Todas' : filtros.especialidad;
    const tipoIngresoTexto = filtros.tipoIngreso === 'AMBOS' ? 'Ambos' : filtros.tipoIngreso;
    doc.text(
        `Período: ${filtros.fechaInicio} al ${filtros.fechaFin} — Servicio: ${servicioTexto} — Especialidad: ${especialidadTexto} — Tipo de ingreso: ${tipoIngresoTexto}`,
        14,
        22
    );

    doc.autoTable({
        startY: 28,
        head: [['Especialidad', 'Tipo de ingreso', 'Total camas']],
        body: totales.map(t => [t.especialidad, t.tipo_ingreso, t.total]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
        headStyles: { fillColor: [31, 74, 44], textColor: 255, fontStyle: 'bold' },
        margin: { left: 14, right: 14 }
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle', 14, doc.lastAutoTable.finalY + 8);

    let acumulado = 0;
    const totalCantidad = detalle.reduce((suma, d) => suma + (Number(d.cantidad) || 0), 0);
    const filasDetalle = detalle.map(d => {
        acumulado += Number(d.cantidad) || 0;
        return [d.fecha, d.servicio, d.especialidad, d.cantidad, d.tipo_ingreso, acumulado];
    });

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 12,
        head: [['Fecha', 'Servicio', 'Especialidad', 'Cantidad', 'Tipo de ingreso', 'Total acumulado']],
        body: filasDetalle,
        foot: [['TOTAL', '', '', String(totalCantidad), '', '']],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5, halign: 'center' },
        headStyles: { fillColor: [66, 143, 85], textColor: 255, fontStyle: 'bold' },
        footStyles: { fillColor: [31, 74, 44], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        didDrawPage: () => agregarPiePagina(doc)
    });

    const nombreArchivo = `reporte_camas_prestadas_${filtros.fechaInicio}_${filtros.fechaFin}.pdf`;
    doc.save(nombreArchivo);
}

const MESES_CORTOS_COMPENSACIONES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export async function generarPdfCompensacionesPendientes({ resumenAgrupado, totalGeneral, anhosSeleccionados, detallePorPersona, logoUrl }) {
    const logoBase64 = await getBase64ImageFromURL(logoUrl);
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });

    agregarMarcaAgua(doc, logoBase64);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Compensación de Horas Extraordinarias Pendientes', 14, 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gestiones: ${anhosSeleccionados.join(', ')}`, 14, 22);

    const filasResumen = resumenAgrupado.map(f => [
        `${f.apellidos}, ${f.nombres}`,
        f.programadas.toFixed(2),
        f.pagadas.toFixed(2),
        f.impagas.toFixed(2),
        f.permisos.toFixed(2),
        f.saldo.toFixed(2)
    ]);

    const foot = resumenAgrupado.length > 1
        ? [['TOTAL', totalGeneral.programadas.toFixed(2), totalGeneral.pagadas.toFixed(2), totalGeneral.impagas.toFixed(2), totalGeneral.permisos.toFixed(2), totalGeneral.saldo.toFixed(2)]]
        : [];

    doc.autoTable({
        startY: 28,
        head: [['Funcionario', 'Programadas', 'Pagadas', 'Impagas', 'Permisos', 'Saldo Pendiente']],
        body: filasResumen,
        foot,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
        headStyles: { fillColor: [31, 74, 44], textColor: 255, fontStyle: 'bold' },
        footStyles: { fillColor: [66, 143, 85], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { halign: 'left' } },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        didDrawPage: () => agregarPiePagina(doc)
    });

    resumenAgrupado.forEach(fila => {
        const bloques = detallePorPersona[fila.personal_id] || [];
        const filasDetalle = [];
        bloques.forEach(bloque => {
            (bloque.datos || []).forEach(r => {
                filasDetalle.push([
                    bloque.anho,
                    MESES_CORTOS_COMPENSACIONES[parseInt(r.mes) - 1] || r.mes,
                    parseFloat(r.horas_programadas).toFixed(2),
                    parseFloat(r.horas_pagadas).toFixed(2),
                    parseFloat(r.permisos_horas).toFixed(2),
                    parseFloat(r.saldo_horas).toFixed(2)
                ]);
            });
        });

        if (filasDetalle.length === 0) return;

        doc.addPage();
        agregarMarcaAgua(doc, logoBase64);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Detalle mensual — ${fila.apellidos}, ${fila.nombres}`, 14, 15);

        doc.autoTable({
            startY: 22,
            head: [['Gestión', 'Mes', 'Programadas', 'Pagadas', 'Permisos', 'Saldo']],
            body: filasDetalle,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 1.5, halign: 'center' },
            headStyles: { fillColor: [66, 143, 85], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
            didDrawPage: () => agregarPiePagina(doc)
        });
    });

    const sufijoArchivo = resumenAgrupado.length === 1
        ? resumenAgrupado[0].apellidos.replace(/\s+/g, '_').toLowerCase()
        : anhosSeleccionados.join('-');
    const nombreArchivo = `reporte_compensaciones_pendientes_${sufijoArchivo}.pdf`;
    doc.save(nombreArchivo);
}
