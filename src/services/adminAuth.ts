const TOKEN_KEY = 'admin_token'

export function isAdminAuthenticated(): boolean {
    console.log("authenticated")
    return sessionStorage.getItem(TOKEN_KEY) !== null
}

export async function loginAdmin(username: string, password: string) {
    const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })

    if (!res.ok) throw new Error('Invalid credentials')

    const {token} = await res.json()
    sessionStorage.setItem(TOKEN_KEY, token)
}

export function logoutAdmin() {
    sessionStorage.removeItem(TOKEN_KEY)
}

export function adminAuthHeader() {
    return {
        Authorization: sessionStorage.getItem(TOKEN_KEY) ?? ''
    }
}
