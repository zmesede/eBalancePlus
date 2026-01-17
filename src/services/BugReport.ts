import type {BugReport} from '../types/BugReport'
import {useScenarioStore} from '../stores/ScenarioStore'
import {useTaskStore} from '../stores/TaskStore'
import {useBoardStore} from '../stores/BoardStore'
import {useProductionStore} from '../stores/ProductionStore'
import type {Tile} from '../types/Board'

function cloneTiles(tiles: Tile[]): Tile[] {
    return tiles.map(t => ({...t}))
}

function base64ToBlob(base64: string): Blob {
    const [, data] = base64.split(',')
    const binary = atob(data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return new Blob([bytes], {type: 'image/png'})
}

async function uploadScreenshot(id: string, base64: string) {
    const blob = base64ToBlob(base64)
    const formData = new FormData()
    formData.append('screenshot', blob, `${id}.png`)

    const res = await fetch(
        `http://localhost:3000/api/bug-reports/${id}/screenshot`,
        {method: 'POST', body: formData}
    )

    if (!res.ok) throw new Error(await res.text())
}

async function sendBugReport(report: BugReport) {
    const res = await fetch('http://localhost:3000/api/bug-reports', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(report)
    })
    if (!res.ok) throw new Error(await res.text())
}

export async function createAndSendBugReport(
    description?: string,
    screenshot?: string
): Promise<BugReport> {
    const scenarioStore = useScenarioStore()
    const taskStore = useTaskStore()
    const boardStore = useBoardStore()
    const productionStore = useProductionStore()

    const report: BugReport = {
        id: crypto.randomUUID(),
        description,
        scenario_id: scenarioStore.clickedScenario?.id ?? 'UNKNOWN',
        productionCurve_id: productionStore.clickedProductionCurve?.id ?? 'UNKNOWN',
        tiles: cloneTiles(boardStore.board.consumptionTiles),
        tasks: [...taskStore.getCompletedTasks],
        navigator: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        },
        date: new Date().toISOString()
    }

    await sendBugReport(report)

    if (screenshot) {
        await uploadScreenshot(report.id, screenshot)
    }

    return report
}
