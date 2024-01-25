import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // JS , arrays are ref variables.
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    //True copy of the post. Spread operator.
    //[]for new array. ...to takes elements of another array and add here.
    // return [...this.posts];

    // return this.posts;

    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return{
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    //for http, unsubscribe not needed. Only for ngrx
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        const postId = responseData.postId; //59
        post.id = postId; //59 - rewriting the above null id.
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Service: Deleted record with Id: ' + postId);
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
