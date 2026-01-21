import {adminAuthHeader, logoutAdmin} from "./adminAuth";

export interface AdminBugReport {
    id: string
    description: string | null
    scenario_id: string
    production_curve_id: string
    tiles: any[]
    tasks: string[]
    navigator: {
        userAgent: string
        platform: string
        language: string
    }
    created_at: string
}

export async function fetchBugReports() {
    const res = await fetch('http://localhost:3000/api/admin/bug-reports', {
        headers: adminAuthHeader()
    })

    if (res.status === 401) {
        logoutAdmin()
        window.location.href = '/admin/login'
        return []
    }

    if (!res.ok) throw new Error(await res.text())
    return res.json()
}

export function screenshotUrl(id: string): string {
    return `http://localhost:3000/api/admin/bug-reports/${id}/screenshot`
}

export async function deleteBugReport(id: string): Promise<void> {
    const res = await fetch(
        `http://localhost:3000/api/admin/bug-reports/${id}`,
        {
            headers: adminAuthHeader(),
            method: 'DELETE'
        }
    )
    if (!res.ok) {
        throw new Error(await res.text())
    }
}

export async function fetchScreenshot(id: string): Promise<string> {
    const res = await fetch(`/api/admin/bug-reports/${id}/screenshot`, {
        headers: {
            Authorization: 'ADMIN_SESSION_OK'
        }
    })

    if (!res.ok) {
        throw new Error('Failed to load screenshot')
    }

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
