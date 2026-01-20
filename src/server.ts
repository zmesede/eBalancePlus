import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import multer from 'multer'


const ADMIN_USER = 'admin'
const ADMIN_PASS = 'password123'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10 * 1024 * 1024}
})

async function startServer() {
    const app = express()
    const PORT = 3000

    app.use(cors())
    app.use(express.json({limit: '2mb'}))
    app.use(express.urlencoded({extended: true}))


    function requireAdmin(req: any, res: any, next: any) {
        const token = req.headers['authorization']
        if (token === 'ADMIN_SESSION_OK') return next()
        return res.status(401).json({error: 'Unauthorized'})
    }

    const rootConn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root'
    })

    await rootConn.execute(`
    CREATE DATABASE IF NOT EXISTS ebalance
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
  `)
    await rootConn.end()

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })


    await db.execute(`
        CREATE TABLE IF NOT EXISTS bug_reports
        (
            id
            VARCHAR
        (
            36
        ) PRIMARY KEY,
            description TEXT,
            scenario_id VARCHAR
        (
            255
        ),
            production_curve_id VARCHAR
        (
            255
        ),
            tiles JSON,
            tasks JSON,
            navigator JSON,
            created_at DATETIME,
            screenshot LONGBLOB
            )
    `)

    app.post('/api/bug-reports', async (req, res) => {
        try {
            const r = req.body

            const createdAt = new Date(r.date)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ')

            await db.execute(
                `
                    INSERT INTO bug_reports (id, description, scenario_id, production_curve_id,
                                             tiles, tasks, navigator, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    r.id,
                    r.description ?? null,
                    r.scenario_id,
                    r.productionCurve_id,
                    JSON.stringify(r.tiles),
                    JSON.stringify(r.tasks),
                    JSON.stringify(r.navigator),
                    createdAt
                ]
            )

            res.status(201).json({status: 'stored'})
        } catch (err: any) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    })

    app.post(
        '/api/bug-reports/:id/screenshot',
        upload.single('screenshot'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({error: 'No screenshot provided'})
                }

                await db.execute(
                    `
                        UPDATE bug_reports
                        SET screenshot = ?
                        WHERE id = ?
                    `,
                    [req.file.buffer, req.params.id]
                )

                res.json({status: 'screenshot stored'})
            } catch (err: any) {
                console.error(err)
                res.status(500).json({error: err.message})
            }
        }
    )

    app.listen(PORT, () => {
        console.log(`API running on http://localhost:${PORT}`)
    })

    app.get('/api/admin/bug-reports', requireAdmin, async (_req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT id,
                       description,
                       scenario_id,
                       production_curve_id,
                       tiles,
                       tasks,
                       navigator,
                       created_at
                FROM bug_reports
                ORDER BY created_at DESC
            `)

            res.json(rows)
        } catch (err: any) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    })


    app.get('/api/admin/bug-reports/:id/screenshot', requireAdmin, async (req, res) => {
        try {
            const [rows]: any = await db.execute(
                'SELECT screenshot FROM bug_reports WHERE id = ?',
                [req.params.id]
            )

            if (!rows[0]?.screenshot) {
                return res.status(404).end()
            }

            res.setHeader('Content-Type', 'image/png')
            res.send(rows[0].screenshot)
        } catch (err: any) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    })

    app.delete('/api/admin/bug-reports/:id', requireAdmin, async (req, res) => {
        try {
            const {id} = req.params

            const [result]: any = await db.execute(
                'DELETE FROM bug_reports WHERE id = ?',
                [id]
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({error: 'Bug report not found'})
            }

            res.json({status: 'deleted'})
        } catch (err: any) {
            console.error(err)
            res.status(500).json({error: err.message})
        }
    })

    app.post('/api/admin/login', (req, res) => {
        const {username, password} = req.body

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return res.json({token: 'ADMIN_SESSION_OK'})
        }

        res.status(401).json({error: 'Invalid credentials'})
    })

}

startServer().catch(err => {
    console.error('Server failed to start:', err)
})
