import { RequestHandler } from "express";
import { IRepo, Repo, RepoList } from "../models/repo";
const { GITHUB_TOKEN } = process.env;
import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: `${GITHUB_TOKEN}`,
});

// Load repos and upload them to mongoDB
const loadData = async (page: number, deleteOld: boolean) => {
  let result: any[] = [];
  try {
    if (deleteOld) {
      await RepoList.updateMany({ name: "123" }, { $pull: { repoList: {} } }, { "multi": true });
    }
    const repos = await octokit.request('GET /search/repositories', {
      q: "stars:>=100",
      sort: "stars",
      order: "desc",
      per_page: 30,
      page: Number(page),
    });
    const repoList: any[] = [];
    repos.data.items.forEach((repo) => {
      const repoItem = new Repo({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        created_at: repo.created_at,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        language: repo.language,
      });
      repoList.push(repoItem);
    });
    await RepoList.updateMany({ name: "123" }, { $push: { repoList: { $each: repoList } } });
    result = repos.data.items;
  } catch (error) {
    result.push(false)
  }
  return result;
}

const getAllRepos: RequestHandler = async (req, res, next) => {
  const { page } = req.body;
  let repoList: any[] = [];
  let repos;
  try {
    const repoCluster = await RepoList.find({ name: "123" });
    if (repoCluster[0].repoList.length < 1 || Number(page) !== repoCluster[0].page) {
      const res = await loadData(page, false);
      if (res[0] !== false) {
        repoList = res;
      } else {
        throw new Error("Failed");
      }
    } else {
      repoList = [...repoCluster[0].repoList];
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve repos.' })
  }
  res.status(200).json({ repoList });
}

const getSingleRepo: RequestHandler = async (req, res, next) => {
  const { query, queryType, page } = req.body;
  let repoList;
  try {
    repoList = await octokit.request('GET /search/repositories', {
      q: `${query} in:${queryType}`,
      sort: "stars",
      order: "desc",
      per_page: 100,
      page: Number(page),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to find repo.' })
  }
  res.status(200).json({ repoList: repoList.data.items });
}


// Initial interval for every 20 minutes.
let checkGithubInterval = setInterval(() => { loadData(1, true) }, 1200000);

const syncRepos: RequestHandler = async (req, res, next) => {
  let repoList: any[] = [];
  try {
    const res = await loadData(1, true);
    if (res[0] !== false) {
      repoList = res;
    } else {
      throw new Error("Failed");
    }
    // Reset interval every 20 minutes.
    clearInterval(checkGithubInterval);
    checkGithubInterval = setInterval(() => { loadData(1, true) }, 1200000);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve repos.' })
  }
  res.status(200).json({ repoList });
}

export { getAllRepos, getSingleRepo, syncRepos };