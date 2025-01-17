import { PostClient } from './post.client';
import { AuthorClient } from './author.client';
import { CordXDatabase } from '../..'

/** Database client for CordX Blog Posts */
export class BlogClient {
    public db: CordXDatabase
    public posts: PostClient
    public authors: AuthorClient

    constructor(db: CordXDatabase) {
        this.db = db
        this.posts = new PostClient(this);
        this.authors = new AuthorClient(this);
    }
}
