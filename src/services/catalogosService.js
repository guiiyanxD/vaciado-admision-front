import { get } from './httpClient';

export function getServicios() {
    return get('/servicios');
}

export function getEspecialidades() {
    return get('/especialidades');
}
