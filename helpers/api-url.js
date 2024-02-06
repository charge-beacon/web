export function apiUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://127.0.0.1:8000';
    } else {
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        return 'https://chargebeacon.com';
    }
}
