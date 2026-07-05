import { getServicios, getEspecialidades } from '@/services/catalogosService';

let serviciosCache = null;
let especialidadesCache = null;

export function fetchServicios() {
    if (!serviciosCache) {
        serviciosCache = getServicios();
    }
    return serviciosCache;
}

export function fetchEspecialidades() {
    if (!especialidadesCache) {
        especialidadesCache = getEspecialidades();
    }
    return especialidadesCache;
}
