import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter();
  // newPost = 'Starting text';

  // onAddPost(postInput: HTMLTextAreaElement){
  onAddPost() {
    // console.dir(postInput);
    // console.log(postInput);
    // this.newPost = postInput.value;
    // this.newPost = this.enteredValue;
    // alert('Post Added!');
    const post = { title: this.enteredTitle, content: this.enteredContent };
    this.postCreated.emit(post);
  }
}
