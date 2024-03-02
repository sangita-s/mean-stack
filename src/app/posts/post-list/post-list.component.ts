import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  //public creates new property
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Just trigger http request. Listen to resp
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //90
    this.userId = this.authService.getUserId(); //119
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        //this never tears down if we go to another screen. Memory leak
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    //Getting for initial load with post. w/o this, no edit or delete anytime
    this.userIsAuthenticated = this.authService.getIsAuth();
    //For edit delete setup + logout
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId(); //119
      });
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; //90
    this.postsPerPage = pageData.pageSize; //90
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //90
    // console.log(pageData);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    // console.log('Delete button clicked. Id: ' + postId);
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
