function formatearFecha(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
}

/**
 * Calcula el rango de fechas editable según la regla de cierre de mes:
 * el mes en curso siempre es editable, y el mes anterior solo durante
 * el período de gracia (día 1 al 5 del mes en curso).
 *
 * @returns {{min: string, max: string}} Fechas en formato YYYY-MM-DD
 */
export function calcularRangoFechasEditable() {
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const mesActual = hoy.getMonth();

    let anioInicio = anioActual;
    let mesInicio = mesActual;

    if (hoy.getDate() <= 5) {
        mesInicio -= 1;
        if (mesInicio < 0) {
            mesInicio = 11;
            anioInicio -= 1;
        }
    }

    const min = new Date(anioInicio, mesInicio, 1);
    const max = new Date(anioActual, mesActual + 1, 0);

    return {
        min: formatearFecha(min),
        max: formatearFecha(max)
    };
}
