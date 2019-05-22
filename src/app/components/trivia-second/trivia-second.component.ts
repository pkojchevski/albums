import {Component, OnInit} from '@angular/core';
import {ModalService} from 'src/app/services/modal.service';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {DataService} from 'src/app/services/data/data.service';
import {Question, Answer} from 'src/app/models/question';
import {QuestionService} from 'src/app/services/question/question.service';
import {UtilityService} from 'src/app/services/utility.service';
import {map, tap, take} from 'rxjs/operators';
import {TagPlaceholder} from '@angular/compiler/src/i18n/i18n_ast';
import {Router} from '@angular/router';
import {ImageService} from 'src/app/services/image/image.service';
import {UsersalbumsService} from 'src/app/services/usersalbums.service';

@Component({
  selector: 'app-trivia-second',
  templateUrl: './trivia-second.component.html',
  styleUrls: ['./trivia-second.component.scss'],
})
export class TriviaSecondComponent implements OnInit {
  album$: Observable<Album>;
  album: Album;
  question$: Observable<any>;
  clicked = [false, false, false, false];
  correctAnswer = false;
  wrongAnswer = false;
  cards;
  rndImage;
  answer: string;
  question: string;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private questionService: QuestionService,
    private utilityService: UtilityService,
    private router: Router,
    private imageService: ImageService,
    private usersAlbumsService: UsersalbumsService
  ) {}

  ngOnInit() {
    this.dataService.currentAlbum.subscribe(album => {
      this.album = album;
      this.imageService
        .getRandomImageFromAlbum(this.album)
        .pipe(map(item => item[0]))
        .subscribe(image => (this.rndImage = image));
      if (album.genericQuiz) {
        this.question$ = this.questionService
          .getRandomQuestionForAlbum(album)
          .pipe(
            map((question: Question) => {
              if (question) {
              this.question = question.question;
              return {
                answers: this.utilityService.shuffle(question.answers),
                collection: question.collection,
                question: question.question,
                language: question.language,
                level: question.level,
                imageUrl: question.imageUrl,
              };
            }
            })
          );
      } else {
        // to be done
      }
    });
  }

  answerClicked(answer: Answer, i) {
    this.clicked[i] = true;
    this.correctAnswer = this.clicked[i] && answer.correct;
    this.wrongAnswer = this.clicked[i] && !answer.correct;
    this.answer = answer.answer;
  }

  openModal(modalType) {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: modalType},
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  returnToAlbum() {
    if (this.correctAnswer) {
      this.dataService.currentAlbumCard
        .pipe(take(1))
        .subscribe(albumcards =>
          this.usersAlbumsService.addCardToUserAlbum(
            albumcards,
            this.answer,
            this.question
          )
        );
    }
    this.closeModal();
    this.router.navigateByUrl(`album/${this.album.name}`);
    this.dataService.changeAlbum(this.album);
    this.dataService.changeImage([this.rndImage]);
  }
}
