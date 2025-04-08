import { Component, NgModule } from '@angular/core';  
import { RouterModule, Routes } from '@angular/router';  
import { PostCreateComponent } from './posts/post-create/post.create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './authentication/login/login.component';
import { path } from '@angular-devkit/core';
import { SignupComponent } from './authentication/signup/signup.component';
  
const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent},
    { path: 'edit/:postId', component: PostCreateComponent},
    {path:'login',component: LoginComponent},
    {path: 'signup', component: SignupComponent},
];

@NgModule({  
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]    
    
})  

export class AppRoutingModule{

}