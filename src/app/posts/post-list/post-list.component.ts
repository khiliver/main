import { Input, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;
  isLoading = true; // Initially set to true

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true; // Start loading before fetching data
    this.postsService.getPosts();

    this.postsSub = this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
      setTimeout(() => {
        this.posts = posts;
        this.isLoading = false; // Stop loading after delay
      }, 1000); // Ensuring spinner is visible for at least 1 second
    });
  }

  onDelete(postId: string) {
    this.isLoading = true; // Show spinner while deleting
  
    this.postsService.deletePost(postId).subscribe(() => { // ✅ Wait for delete response
      setTimeout(() => {
        this.postsService.getPosts(); // ✅ Refresh posts list after deletion
        this.isLoading = false; // ✅ Stop spinner
      }, 1000); // Small delay to show spinner
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}