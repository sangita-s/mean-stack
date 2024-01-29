import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();
  private mode = 'create';
  private postId: string;
  post: Post; //66
  isLoading = false; //70

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //Spinner show
        this.isLoading = true
        // this.post = this.postsService.getPost(this.postId); //66
        this.postsService.getPost(this.postId).subscribe(postdata => {
          //Spinner hide
          this.isLoading = false; 
          this.post = {id: postdata._id, title: postdata.title, content: postdata.content};
        }) //68 , no need to unsub
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); //sub to paramMap. No need to unsub.
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true; 
    if (this.mode === 'create') {
      // const post: Post = {
      //   title: form.value.title,
      //   content: form.value.content
      // };
      // this.postCreated.emit(post);
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
