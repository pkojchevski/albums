import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { RandomAlbumsComponent } from './components/random-albums/random-albums.component';
import { ModalComponent } from './components/modal/modal.component';
import { AuthComponent } from './components/auth/auth.component';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { InteractiveAlbumComponent } from './components/interactive-album/interactive-album.component';
import { AlbumPreviewComponent } from './components/album-preview/album-preview.component';
import { AlbumSingleComponent } from './pages/album-single/album-single.component';
import { ScrollToModule } from 'ng2-scroll-to';
import { FinishRegistrationComponent } from './pages/finish-registration/finish-registration.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { HelpComponent } from './pages/help/help.component';
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmRegistrationComponent } from './pages/confirm-registration/confirm-registration.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { AlbumsListComponent } from './admin/albums-list/albums-list.component';
import { NewAlbumComponent } from './admin/new-album/new-album.component';
import { QuestionsComponent } from './admin/questions/questions.component';
import { AddImagesComponent } from './admin/add-images/add-images.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ImageListComponent } from './admin/image-list/image-list.component';
import { ImgPreloaderDirective } from './directives/img-preloader.directive';
import { TableModule } from 'primeng/table';

import { AgGridModule } from 'ag-grid-angular';
import { ManageImagesComponent } from './admin/manage-images/manage-images.component';
import { CardRendererComponent } from './admin/manage-images/card-renderer.component';
import { QuestionsListComponent } from './admin/questions-list/questions-list.component';
import { LevelComponent } from './admin/configuration/levels/level/level.component';
import { LevelListComponent } from './admin/configuration/levels/level-list/level-list.component';
import { LanguageComponent } from './admin/configuration/languages/language/language.component';
import { LanguageListComponent } from './admin/configuration/languages/language-list/language-list.component';
import { CollectionComponent } from './admin/configuration/collections/collection/collection.component';
import { CollectionListComponent } from './admin/configuration/collections/collection-list/collection-list.component';
import { ConfigurationComponent } from './admin/configuration/configuration/configuration.component';
import { CheckboxComponent } from './admin/checkbox/checkbox.component';
import { MyGroupsComponent } from './components/my-groups/my-groups.component';
import { ItemComponent } from './components/item/item.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { TriviaFirstComponent } from './components/trivia-first/trivia-first.component';
import { TriviaSecondComponent } from './components/trivia-second/trivia-second.component';
import { CardsExchangeComponent } from './pages/cards-exchange/cards-exchange.component';
import { ExchangeProposalComponent } from './pages/exchange-proposal/exchange-proposal.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AlbumOverviewComponent } from './pages/album-overview/album-overview.component';
import { CardComponent } from './components/card/card.component';
import { AlbumSubscriptionComponent } from './components/album-subscription/album-subscription.component';
import { CardsDirective } from './directives/cards.directive';
import { OpenAlbumComponent } from './components/open-album/open-album.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgDragDropModule } from 'ng-drag-drop';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NguCarouselModule } from '@ngu/carousel';
import { SwiperModule } from 'angular2-useful-swiper';
import { ChooseExchangePlayerComponent } from './pages/choose-exchange-player/choose-exchange-player.component';
import { CarouselChckboxComponent } from './components/carousel-chckbox/carousel-chckbox.component';


const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:id', component: AlbumSingleComponent },
  { path: 'cards-exchange', component: CardsExchangeComponent },
  { path: 'exchange-proposal', component: ExchangeProposalComponent },
  { path: 'choose-exchange-player', component: ChooseExchangePlayerComponent },
  { path: 'album-overview', component: AlbumOverviewComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'registration-success', component: FinishRegistrationComponent },
  { path: 'confirm-registration', component: ConfirmRegistrationComponent },
  { path: 'verification', component: EmailVerificationComponent },
  { path: 'help', component: HelpComponent },
  { path: 'admin-albums', component: NewAlbumComponent },
  { path: 'admin-users', component: UsersListComponent },
  { path: 'admin-questions', component: QuestionsComponent },
  { path: 'admin-add-image', component: AddImagesComponent },
  { path: 'admin-manage-image', component: ManageImagesComponent },
  { path: 'configuration', component: ConfigurationComponent },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AlbumsComponent,
    PageNotFoundComponent,
    ContactsComponent,
    CollectionsComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    ContactFormComponent,
    RandomAlbumsComponent,
    ModalComponent,
    AuthComponent,
    InteractiveAlbumComponent,
    AlbumPreviewComponent,
    AlbumSingleComponent,
    FinishRegistrationComponent,
    CreateGroupComponent,
    HelpComponent,
    ConfirmRegistrationComponent,
    EmailVerificationComponent,
    UsersListComponent,
    AlbumsListComponent,
    NewAlbumComponent,
    QuestionsComponent,
    AddImagesComponent,
    ToastMessageComponent,
    LoaderComponent,
    DropZoneDirective,
    FileSizePipe,
    ImageListComponent,
    ImgPreloaderDirective,
    ManageImagesComponent,
    CardRendererComponent,
    QuestionsListComponent,
    LevelComponent,
    LevelListComponent,
    LanguageComponent,
    LanguageListComponent,
    CollectionComponent,
    CollectionListComponent,
    ConfigurationComponent,
    CheckboxComponent,
    MyGroupsComponent,
    ItemComponent,
    ItemInfoComponent,
    TriviaFirstComponent,
    TriviaSecondComponent,
    CardsExchangeComponent,
    ExchangeProposalComponent,
    RankingComponent,
    AlbumOverviewComponent,
    CardComponent,
    AlbumSubscriptionComponent,
    CardsDirective,
    OpenAlbumComponent,
    CarouselComponent,
    ChooseExchangePlayerComponent,
    CarouselChckboxComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
    Ng2CarouselamosModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    ScrollToModule.forRoot(),
    HttpClientModule,
    AngularFireStorageModule,
    TableModule,
    OverlayModule,
    AgGridModule.withComponents([CardRendererComponent]),
    NgDragDropModule.forRoot(),
    NguCarouselModule,
    SwiperModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }
