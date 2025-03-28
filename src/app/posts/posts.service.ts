import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
            .pipe(
                map(postData => {
                    if (!postData.posts || !Array.isArray(postData.posts)) {
                        return [];
                    }
                    return postData.posts.map((post: any) => ({
                        id: post?._id ?? '',  // Safe check for undefined _id
                        title: post?.title ?? 'No Title',
                        content: post?.content ?? 'No Content',
                        imagePath: post?.imagePath ?? ''
                    }));
                })
            )
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            }, error => {
                console.error("Error fetching posts:", error);
            });
    }

    getPostUpdatedListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string): Observable<Post> {
        return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
            `http://localhost:3000/api/posts/${id}`
        ).pipe(
            map(postData => ({
                id: postData?._id ?? '',  // Safe check
                title: postData?.title ?? 'No Title',
                content: postData?.content ?? 'No Content',
                imagePath: postData?.imagePath ?? ''
            }))
        );
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image);

        this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
            .subscribe(responseData => {
                if (!responseData.post) {
                    console.error("Error: Response does not contain a valid post.");
                    return;
                }
                const post: Post = {
                    id: responseData.post.id,
                    title,
                    content,
                    imagePath: responseData.post.imagePath
                };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            }, error => {
                console.error("Error adding post:", error);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: FormData | Post;

        if (typeof image === "object") {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image);
        } else {
            postData = { id, title, content, imagePath: image };
        }

        this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
            .subscribe(() => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                if (oldPostIndex !== -1) {
                    updatedPosts[oldPostIndex] = {
                        id,
                        title,
                        content,
                        imagePath: typeof image === "string" ? image : ""
                    };
                    this.posts = updatedPosts;
                    this.postsUpdated.next([...this.posts]);
                }
            }, error => {
                console.error("Error updating post:", error);
            });
    }

    deletePost(postId: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/api/posts/${postId}`)
            .pipe(
                map(() => {
                    this.posts = this.posts.filter(post => post.id !== postId);
                    this.postsUpdated.next([...this.posts]);
                })
            );
    }
}
