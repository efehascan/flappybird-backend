    // src/server.ts
    import express from "express";
    import dotenv from "dotenv";
    import mySQLUtils from "./utils/MySQLUtils.js";

    dotenv.config();

    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    app.use(express.json());

    // basit kontrol endpointi
    app.get("/health", async (_req, res) => {
        const dbOk = await mySQLUtils.testConnection();
        res.json({ ok: true, db: dbOk ? "connected" : "failed" });
    });


    // Routes

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
