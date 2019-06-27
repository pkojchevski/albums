import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, catchError } from 'rxjs/operators';
import { Image } from 'src/app/models/image';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { ImageService } from 'src/app/services/image/image.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
  styleUrls: ['./dropbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropboxComponent implements OnInit {

  @ViewChild('dropzone') dropzone: ElementRef;
  @ViewChild('addImageForm') form: NgForm;

  private _data = new BehaviorSubject<boolean>(false);

  @Output() imageDropped = new EventEmitter<any>();
  @Input()
  get albumIsAdded() {
    return this._data.getValue();
  }

  set albumIsAdded(value: boolean) {
    this._data.next(value);
  }

  file;
  percentage$: Observable<number>;
  image = {} as Image;
  imageIsDropped: boolean;
  isHovering: boolean;

  constructor(private toast: ToastService,
    private renderer: Renderer2) { }

  ngOnInit() {
    this._data.subscribe(() => {
      this.renderer.removeStyle(
        this.dropzone.nativeElement,
        'backgroundImage'
      );
      this.imageIsDropped = false;
    });
  }


  getFile(event: FileList) {
    const reader = new FileReader();
    this.file = event.item(0);
    if (this.file.type.split('/')[0] !== 'image') {
      this.toast.newToast({
        content: 'File type is unsuported',
        style: 'warning',
      });
      this.file = null;
      return;
    }
    // file
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.renderer.setStyle(
        this.dropzone.nativeElement,
        'backgroundImage',
        `url(${reader.result})`
      );
      this.imageIsDropped = true;
      this.imageDropped.emit({ dropped: true, file: this.file });
    };
  }

  formReset() {
    this.form.form.reset();
    this.imageIsDropped = false;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

}
