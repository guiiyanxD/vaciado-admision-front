import { post } from './httpClient';

export function guardarCenso(data) {
    return post('/verificarYGuardar', data);
}

export function buscarCenso(data) {
    return post('/buscar', data);
}

export function reporteMensual(data) {
    return post('/reporte-mensual', data);
}

export function reporteCamasPrestadas(data) {
    return post('/reporte-camas-prestadas', data);
}

export function reporteKpis(data) {
    return post('/reporte-kpis', data);
}

export function getTotalAyer(data) {
    return post('/totalAyer2', data);
}
