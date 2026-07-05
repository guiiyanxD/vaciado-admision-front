export function formatHoras(v) {
    if (v === null || v === undefined) return '—';
    return parseFloat(v).toFixed(2);
}

export function getSaldoClass(v) {
    if (v === null || v === undefined) return '';
    return parseFloat(v) >= 0 ? 'text-success' : 'text-danger';
}
