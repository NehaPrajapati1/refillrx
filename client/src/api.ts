export async function apiFetch<T>(path: string, userEmail: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "x-demo-user": userEmail
        }
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${response.status})`);
    }

    if (response.status === 204) {
        return undefined as T;
    }
    return response.json() as Promise<T>;

}