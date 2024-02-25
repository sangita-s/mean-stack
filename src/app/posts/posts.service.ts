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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  //You can simply inject authService to get token and add it to header in required paths like post / delete.
  //But another way is to use http interceptors! - they run on any outgoing http requests and manipulate them!

  //router for post add/update navigation
  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, crtPage: number) {
    //True copy of the post. Spread operator.
    //[]for new array. ...to takes elements of another array and add here.
    // return [...this.posts];

    const queryParams = `?pagesize=${postsPerPage}&page=${crtPage}`; //90
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts});
      });
    //for http, unsubscribe not needed. Only for ngrx
  }

  getPost(id: string) {
    console.log(
      'Post Service: Get One Post. Calling http://localhost:3000/api/posts/getpost/' +
        id
    );
    //Changing from local post return to server post return. Async problem from inside subscribe.. Need to call sync. So send Observable itself
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/getpost/' + id);
    //Subscribe in post create component..
  }

  addPost(title: string, content: string, image: File) {
    console.log('Post Service: Add Post');
    //Instead of json, formData
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts/createpost',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    console.log(
      'Post Service: Update Post. Calling http://localhost:3000/api/posts/editpost/' +
        id
    );

    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/editpost/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    console.log(
      'Post service: Calling http://localhost:3000/api/posts/deletepost/' +
        postId
    );
    return this.http
      .delete('http://localhost:3000/api/posts/deletepost/' + postId)
  }
}
