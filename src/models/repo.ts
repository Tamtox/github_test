import mongoose from "mongoose";

interface IRepo {

}

const repoSchema = new mongoose.Schema<IRepo>({

})

const repo = mongoose.model<IRepo>('Repo', repoSchema);

export { IRepo, repo }