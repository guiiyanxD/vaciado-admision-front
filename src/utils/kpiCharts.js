import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Paleta validada con scripts/validate_palette.js de la skill dataviz (todos los checks PASS).
const COLOR_DIRECTO = '#428f55';   // --color-primary
const COLOR_TRASLADO = '#b98900';  // --color-warning
const COLOR_GRID = '#dde3e0';      // --color-border
const COLOR_TEXTO_MUTED = '#5b6a62'; // --color-text-muted

/**
 * Gráfico de barras horizontales de un solo tono, para comparar una magnitud
 * (ocupación, % bloqueadas, índice de dependencia, días de aislamiento) entre
 * servicios. Una sola serie: sin leyenda, un tooltip por barra al pasar el mouse.
 */
export function crearBarraMagnitud(ctx, { servicios, valores, sufijo = '%' }) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: servicios,
            datasets: [{
                data: valores,
                backgroundColor: COLOR_DIRECTO,
                borderRadius: 4,
                maxBarThickness: 24,
                categoryPercentage: 0.7,
                barPercentage: 0.7
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (item) => `${item.formattedValue}${sufijo}`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: COLOR_GRID },
                    ticks: {
                        color: COLOR_TEXTO_MUTED,
                        callback: (v) => `${v}${sufijo}`
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: COLOR_TEXTO_MUTED }
                }
            }
        }
    });
}

/**
 * Barra horizontal apilada al 100%, para comparar la composición de dos
 * categorías (Directo/Traslado) por servicio. Dos series: lleva leyenda.
 */
export function crearBarraComposicion(ctx, { servicios, directos, traslados }) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: servicios,
            datasets: [
                {
                    label: 'Directo',
                    data: directos,
                    backgroundColor: COLOR_DIRECTO,
                    borderRadius: 4,
                    maxBarThickness: 24
                },
                {
                    label: 'Traslado',
                    data: traslados,
                    backgroundColor: COLOR_TRASLADO,
                    borderRadius: 4,
                    maxBarThickness: 24
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: COLOR_TEXTO_MUTED }
                },
                tooltip: {
                    callbacks: {
                        label: (item) => `${item.dataset.label}: ${item.formattedValue}%`
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    grid: { color: COLOR_GRID },
                    ticks: {
                        color: COLOR_TEXTO_MUTED,
                        callback: (v) => `${v}%`
                    }
                },
                y: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { color: COLOR_TEXTO_MUTED }
                }
            }
        }
    });
}
