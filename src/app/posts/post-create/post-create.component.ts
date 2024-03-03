import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();
  post: Post; //66
  isLoading = false; //70
  form: FormGroup; //74
  imagePreview: string; //76
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription; //128

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService // 128
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => (this.isLoading = false)); //128 - every time there is a change
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    }); //74
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //Spinner show
        this.isLoading = true;
        // this.post = this.postsService.getPost(this.postId); //66
        this.postsService.getPost(this.postId).subscribe((postdata) => {
          //Spinner hide
          this.isLoading = false;
          this.post = {
            id: postdata._id,
            title: postdata.title,
            content: postdata.content,
            imagePath: postdata.imagePath,
            creator: postdata.creator,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath, //84
          }); //74
        }); //68 , no need to unsub
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); //sub to paramMap. No need to unsub.
  }

  //75
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); //file object
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);

    //convert to data url 76
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }; //async call so using callback
    reader.readAsDataURL(file);
  }

  // onSavePost(form: NgForm) {
  onSavePost() {
    //74
    // if (form.invalid) {
    if (this.form.invalid) {
      //74
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image //80
      ); //74
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title, //74 changed
        this.form.value.content, //74 changed
        this.form.value.image //84
      );
    }
    // form.resetForm();
    this.form.reset(); //74
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
