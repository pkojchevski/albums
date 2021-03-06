import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { Question } from 'src/app/models/question';
import { ToastService } from '../../services/toast/toast.service';
import { map, expand, tap, finalize, catchError } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { UtilityService } from '../utility.service';
import { maybeQueueResolutionOfComponentResources } from '@angular/core/src/metadata/resource_loading';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  question: AngularFirestoreCollection<Question>;

  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private utility: UtilityService,
    private afStorage: AngularFireStorage
  ) { }


  addNewQuestion(question: Question, file: any) {
    question.questionUid = this.afs.createId();
    const path = `questions/${file.name}`;
    const fileRef = this.afStorage.ref(path);
    const task = this.afStorage.upload(path, file);
    // this.percentage$ = task.percentageChanges();
    const albumTask$ = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            question.imageUrl = url;
            this.afs.collection('images').doc(question.questionUid).set(question)
              .then(() => {
                // this.percentage$ = of(null);
                // this.formReset();
                this.toast.newToast({
                  content: 'Image is added',
                  style: 'success',
                });
              })
              .catch(err => {
                this.toast.newToast({
                  content: `Error${err.name}`,
                  style: 'warning',
                });
              });
          });
        }),
        catchError(err => {
          this.toast.newToast({ content: `Error${err.name}`, style: 'warning' });
          return throwError(err);
        })
      );
    return albumTask$.toPromise();
  }

  getAllQuestions() {
    return this.afs.collection<Question>('questions').valueChanges();
  }

  convertQuestionFormat(question) {
    // tslint:disable-next-line:curly
    if (!question) return;
    return (question = {
      collection: question.collection,
      question: question.question,
      questionUid: question.questionUid,
      answers: [
        { answer: question.answers0, correct: true },
        { answer: question.answers1, correct: false },
        { answer: question.answers2, correct: false },
        { answer: question.answers3, correct: false },
      ],
    });
  }

  updateQuestion(question) {
    return this.afs
      .collection('questions')
      .doc(question.questionUid)
      .update(this.convertQuestionFormat(question))
      .then(() =>
        this.toast.newToast({ content: 'Question is updated', style: 'success' })
      )
      .catch(err =>
        this.toast.newToast({ content: `Error:${err}`, style: 'warning' })
      );
  }

  deleteQuestion(uid) {
    return this.afs
      .collection('questions')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({ content: 'Question is deleted', style: 'success' })
      )
      .catch(err =>
        this.toast.newToast({ content: `Error:${err}`, style: 'warning' })
      );
  }

  // getRandomQuestionForAlbum(album) {
  //   let arr;
  //   this.afs.collection('questions', ref =>
  //   ref.where('collection', '==', album.collection)).valueChanges()
  //   .pipe(
  //     tap(questions => {
  //       const rnd = this.utility.getRndNumber(0, questions.length - 1);
  //       return arr = questions[rnd];
  //     })
  //   );
  // }

  getRandomQuestionForAlbum(album): Observable<any> {
    return this.getRandomQuestionForAlbumChild(album).pipe(
      expand((document: any) => {
        return document === null
          ? this.getRandomQuestionForAlbumChild(album)
          : EMPTY;
      })
    );
  }

  getRandomQuestionForAlbumChild(album) {
    const rnd = this.afs.createId();
    return this.afs
      .collection('questions', ref =>
        ref
          .where('collection', '==', album.collection)
          .where('questionUid', '>', rnd)
          .limit(1)
      )
      .valueChanges()
      .pipe(
        map(arr => {
          if (arr && arr.length) {
            return arr[0];
          } else {
            return null;
          }
        })
      );
  }
}
