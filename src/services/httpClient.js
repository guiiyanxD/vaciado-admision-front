import API_BASE_URL from '@/components/config/api';

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    return response.json();
}

export function get(path) {
    return request(path, { method: 'GET' });
}

export function post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export function put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function del(path, body) {
    return request(path, { method: 'DELETE', body: body !== undefined ? JSON.stringify(body) : undefined });
}
