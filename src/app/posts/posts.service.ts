import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // JS , arrays are ref variables.
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    //True copy of the post. Spread operator.
    //[]for new array. ...to takes elements of another array and add here.
    return [...this.posts];
    // return this.posts;
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
