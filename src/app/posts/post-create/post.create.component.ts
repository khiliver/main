import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { Router } from "@angular/router";  // ✅ Import Router

@Component({
  selector: 'post-create',
  templateUrl: './post.create.component.html',
  styleUrls: ['./post.create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  public mode = 'create';
  private postId: string | null = null;
  public post: Post = { id: '', title: '', content: '' };
  isLoading = false;

  constructor(
    public postsService: PostsService, 
    public route: ActivatedRoute,
    private router: Router  // ✅ Inject Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        this.isLoading = true;

        this.postsService.getPost(this.postId!).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };

          this.enteredTitle = postData.title;
          this.enteredContent = postData.content;

          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true; // ✅ Show spinner when saving

    if (this.mode === "create") {
      this.postsService.addPost(form.value.title, form.value.content)
        .subscribe(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(["/"]); // ✅ Navigate to post list
          }, 1000);
        });
    } else {
      this.postsService.updatePost(this.postId!, form.value.title, form.value.content)
        .subscribe(() => {
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(["/"]); // ✅ Navigate to post list
          }, 1000);
        });
    }

    form.resetForm();
  }
}
