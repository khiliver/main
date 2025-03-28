import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { Router } from "@angular/router";
import { mimetype } from "./mime-type.validator";  // ✅ Import the validator

@Component({
  selector: "app-post-create",
  templateUrl: "./post.create.component.html",
  styleUrls: ["./post.create.component.css"],
})
export class PostCreateComponent implements OnInit {
  form!: FormGroup;
  mode: "create" | "edit" = "create";
  postId: string | null = null;
  post!: Post;
  isLoading = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }), 
      content: new FormControl(null, {  validators: [Validators.required, Validators.minLength(3)] }),
      image: new FormControl(null, { validators: [Validators.required] }) // 🛑 Ensure the image is required
  });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId")!;
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });

          this.imagePreview = this.post.imagePath;
          this.isLoading = false;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (!file) return;

    this.form.patchValue({ image: file });
    this.form.get("image")!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) return;

    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId!,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }
}
