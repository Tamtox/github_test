import mongoose from "mongoose";

interface IRepo {
    id: string;
    name: string;
    full_name: string;
    html_url: string;
    created_at: string;
    stargazers_count: number;
    watchers_count: number;
    language: string;
}

const repoSchema = new mongoose.Schema<IRepo>({
    id: { type: String },
    name: { type: String },
    full_name: { type: String },
    html_url: { type: String },
    created_at: { type: String },
    stargazers_count: { type: Number },
    watchers_count: { type: Number },
    language: { type: String },
})

interface IRepoList {
    name: string;
    page: number,
    repoList: IRepoList[]
}

const repoListSchema = new mongoose.Schema<IRepoList>({
    name: { type: String, required: true },
    page: { type: Number, required: true },
    repoList: [repoSchema]
})

const Repo = mongoose.model<IRepo>('Repo', repoSchema);

const RepoList = mongoose.model<IRepoList>('RepoList', repoListSchema);

export { IRepo, Repo, RepoList };
