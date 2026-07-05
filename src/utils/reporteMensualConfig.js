export const MOVIMIENTOS = [
    { key: 'ingreso', label: 'Ingreso' },
    { key: 'ingreso_traslado', label: 'Ingreso por Traslado' },
    { key: 'egreso', label: 'Egreso' },
    { key: 'egreso_traslado', label: 'Egreso por Traslado' },
    { key: 'obito', label: 'Óbito' },
    { key: 'aislamiento', label: 'Aislamiento' },
    { key: 'bloqueada', label: 'Bloqueada' },
    { key: 'total', label: 'Total' }
];

const CAMPOS_SERVICIO = [
    'medicina_interna', 'medicina_cirugia', 'infectologia', 'pabellon', 'neuro_trauma',
    'ginecologia', 'neonatologia', 'pediatria', 'onco_pediatria', 'ucim', 'uti_pediatria',
    'uti_adultos', 'total'
];

function totalesVacios() {
    return CAMPOS_SERVICIO.reduce((totales, campo) => {
        totales[campo] = 0;
        return totales;
    }, {});
}

export function calcularTotales(datos) {
    if (!datos || datos.length === 0) {
        return totalesVacios();
    }

    return datos.reduce((totales, fila) => {
        CAMPOS_SERVICIO.forEach(campo => {
            totales[campo] += Number(fila[campo]) || 0;
        });
        return totales;
    }, totalesVacios());
}
