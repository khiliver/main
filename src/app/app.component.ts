import { Component } from '@angular/core';

interface Post {
  id: number;
  title: any;
  content: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'my-app';

  isLoading = true;

  constructor() {
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 3000); // Spinner disappears after 3 seconds
  }

 // storedPosts: Post[] = [];
 // onPostAdded(post: any): void{
 //   this.storedPosts.push(post);
 // }
}