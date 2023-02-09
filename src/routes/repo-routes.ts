import express from "express";
const router = express.Router();
import { getAllRepos, getSingleRepo, syncRepos } from "../controllers/repo-controllers";

router.get("/getAllRepos", getAllRepos);

router.post("/getSingleRepo", getSingleRepo);

router.post("/syncRepos", syncRepos);

exports = router;