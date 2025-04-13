import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';

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
export class AppComponent implements OnInit {
  title = 'Asejo';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  // storedPosts: Post[] = [];
  // onPostAdded(post: any): void {
  //   this.storedPosts.push(post);
  // }
}
