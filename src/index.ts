import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import 'dotenv/config';
process.env.TZ = 'Etc/Universal';
const { PORT, MONGO_ATLAS_USERNAME, MONGO_ATLAS_PASS } = process.env;
const app = express();
const mongoAtlasPass = encodeURIComponent(`${MONGO_ATLAS_PASS}`);

// CORS Headers config
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

// Encoders
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const repoRoutes = require('./routes/repo');
app.search('/repos', repoRoutes);

// Unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).send("Route doesn't exist");
})

async function appStart() {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_ATLAS_USERNAME}:${mongoAtlasPass}@cluster0.rqrzn.mongodb.net/momentum?retryWrites=true&w=majority`);
        app.listen(PORT || 8080);
        console.log(`Server up at port ${PORT || 8080}`);
    } catch (error) {
        console.log("Database connection failed. exiting now...");
        console.error(error);
    }
}

appStart();