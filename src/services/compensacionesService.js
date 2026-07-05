import { get, post, put, del } from './httpClient';

export function getPersonal() {
    return get('/compensaciones/personal');
}

export function getPersonalActivo() {
    return get('/compensaciones/personal/activo');
}

export function crearPersonal(data) {
    return post('/compensaciones/personal', data);
}

export function actualizarPersonal(data) {
    return put('/compensaciones/personal', data);
}

export function eliminarPersonal(id) {
    return del('/compensaciones/personal', { id });
}

export function buscarRegistro(data) {
    return post('/compensaciones/registro/buscar', data);
}

export function guardarRegistro(data) {
    return post('/compensaciones/registro', data);
}

export function eliminarRegistro(data) {
    return del('/compensaciones/registro', data);
}

export function getRegistrosPorPersonaAnho(data) {
    return post('/compensaciones/persona-anho', data);
}

export function getResumenMultiAnho(anhos) {
    return post('/compensaciones/resumen-multi-anho', { anhos });
}

export function getSaldoPendientePorGestion(personalId) {
    return post('/compensaciones/saldo-pendiente', { personal_id: personalId });
}

export function registrarDescuento(data) {
    return post('/compensaciones/descuento', data);
}

export function getDescuentosPorPersona(personalId) {
    return post('/compensaciones/descuentos', { personal_id: personalId });
}

export function eliminarDescuento(id) {
    return del('/compensaciones/descuento', { id });
}
