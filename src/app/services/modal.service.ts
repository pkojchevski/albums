import { EventEmitter, Injectable, Output, Input } from '@angular/core';
import { getViewData } from '@angular/core/src/render3/instructions';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  @Output() modal = new EventEmitter();


  constructor() { }

  modalShow(modalContent) {
    this.modal.emit(modalContent);
  }


  closeModal() {
    this.modal.emit({ modalShow: false });
  }
}
