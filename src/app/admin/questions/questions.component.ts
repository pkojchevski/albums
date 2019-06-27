import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Question, Answer, InitialQuestion } from 'src/app/models/question';
import { QuestionService } from 'src/app/services/question/question.service';
import { AlbumService } from 'src/app/services/album/album.service';
import { COLLECTIONS, Collection } from 'src/app/models/collections';
import { Observable, of, throwError } from 'rxjs';
import {
  map,
  switchMap,
  tap,
  filter,
  finalize,
  catchError,
} from 'rxjs/operators';
import { Album } from 'src/app/models/album';
import { Level } from 'src/app/models/level';
import { Language } from 'src/app/models/language';
import { CollectionService } from 'src/app/services/collection.service';
import { LanguageService } from 'src/app/services/language.service';
import { LevelService } from 'src/app/services/level.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  collectionRef: AngularFirestoreCollection<Question>;
  collections$: Observable<Collection[]>;
  albumsByCollection: Album[];
  collection: string;
  question: Question = InitialQuestion;
  answers: Answer[];
  Levels: Level[];
  languages$: Observable<Language[]>;
  levels$: Observable<Level[]>;
  isHovering: boolean;
  file;
  imageIsDropped: boolean;
  percentage;
  imageIsAdded: boolean;

  @ViewChild('dropzone') dropzone: ElementRef;
  @ViewChild('addQuestionForm') form: NgForm;

  constructor(
    private questionService: QuestionService,
    private collectionService: CollectionService,
    private languagesService: LanguageService,
    private levelService: LevelService,
    private toast: ToastService,
    private afStorage: AngularFireStorage,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.languages$ = this.languagesService.getAllLanguages();
    this.levels$ = this.levelService.getAllLevels();
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  getImageUrl(event) {
    this.file = event.file;
    this.imageIsDropped = event.dropped;
  }

  addImage() {
    if (!this.imageIsDropped) {
      this.toast.newToast({
        content: `Please upload image!`,
        style: 'warning',
      });
      this.imageIsAdded = false;
      return;
    }

    this.questionService.addNewQuestion(this.question, this.file)
      .then(() => {
        this.toast.newToast({
          content: 'Question is added',
          style: 'success',
        });
        this.imageIsAdded = true;
        this.formReset();
      })
      .catch(err =>
        this.toast.newToast({
          content: `Error${err.name}`,
          style: 'warning',
        })
      );
  }

  formReset() {
    this.form.form.reset();
  }
}
