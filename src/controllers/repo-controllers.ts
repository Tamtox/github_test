import { RequestHandler } from "express";
import { IRepo, repo } from "../models/repo";
const { GITHUB_TOKEN } = process.env;
import { Octokit } from "octokit";
const octokit = new Octokit({
    auth: `${GITHUB_TOKEN}`,
});

const getAllRepos: RequestHandler = async (req, res, next) => {

}

const getSingleRepo: RequestHandler = async (req, res, next) => {

}

const syncRepos: RequestHandler = async (req, res, next) => {

}

export { getAllRepos, getSingleRepo, syncRepos };