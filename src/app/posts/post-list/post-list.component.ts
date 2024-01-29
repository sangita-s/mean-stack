import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  //   posts = [
  //     {title: 'First post', content: 'This is the first post'},
  //     {title: 'Second post', content: 'This is the second post'},
  //     {title: 'Third post', content: 'This is the third post'},
  //   ];
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  //public creates new property
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    // this.posts = this.postsService.getPosts();
    // Just trigger http request. Listen to resp
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((inputPosts: Post[]) => {
        //this never tears down if we go to another screen. Memory leak
        this.isLoading = false;
        this.posts = inputPosts;
      });
  }

  onDelete(postId: string) {
    console.log('Delete button clicked. Id: ' + postId);
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
