//77
import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

//async validator. So spl return type. Normally null for ok else error returned
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if(typeof(control.value) === "string") {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader(); //read file contents asynchronously
    // fileReader.onloadend = () => {}
    //create custom observable
    const frObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener("loadend", () => {
            //mimetype validation
            //Upon loading the file, the first 4 bytes are read as an Uint8Array and converted to hexadecimal.
            const arr= new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
            let header = "";
            let isValid = false;
            for(let i = 0; i < arr.length; i++){
                header += arr[i].toString(16);
            }
            //for png and jpegs
            //Depending on the validity of the MIME type, observer.next is called to emit either null (indicating no error) or an object with a key invalidMimeType set to true.
            switch (header) {
                case "89504e47":
                  isValid = true;
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                  isValid = true;
                  break;
                default:
                  isValid = false; // Or you can use the blob.type as fallback
                  break;
              }
              if (isValid) {
                //.next to emit 
                observer.next(null);
              } else {
                observer.next({ invalidMimeType: true });
              }
              observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObservable;
};