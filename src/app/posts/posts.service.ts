import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // JS , arrays are ref variables.
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  //router for post add/update navigation
  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    //True copy of the post. Spread operator.
    //[]for new array. ...to takes elements of another array and add here.
    // return [...this.posts];

    // return this.posts;
    console.log('Post Service: Get Posts');
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

  getPost(id: string){
    console.log('Post Service: Get One Post. Calling http://localhost:3000/api/posts/getpost/' + id);
    // return {...this.posts.find(p => p.id === id)};
    //Changing from local post return to server post return. Async problem from inside subscribe.. Need to call sync. So send Observable itself
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/getpost/' + id);
    //Subscribe in post create component..
  }

  addPost(title: string, content: string) {
    console.log('Post Service: Add Post');
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts/createpost', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        const postId = responseData.postId; //59
        post.id = postId; //59 - rewriting the above null id.
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string){
    console.log('Post Service: Update Post. Calling http://localhost:3000/api/posts/editpost/'+id);
    const post: Post = { id: id, title: title, content: content}
    this.http.put('http://localhost:3000/api/posts/editpost/' + id, post)
      .subscribe(response => {
        console.log(response)
        //Redundant since posts only needed for list page.. but still..
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  deletePost(postId: string){
    console.log('Post service: Calling http://localhost:3000/api/posts/deletepost/' + postId);
    this.http.delete('http://localhost:3000/api/posts/deletepost/' + postId)
      .subscribe(() => {
        console.log('Service: Deleted record with Id: ' + postId);
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
