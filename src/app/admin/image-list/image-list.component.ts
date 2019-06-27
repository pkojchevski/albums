import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Image } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { Album } from 'src/app/models/album';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { CardRendererComponent } from '../manage-images/card-renderer.component';
import { AlbumcardsService } from 'src/app/services/albumcards/albumcards.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AlbumService } from 'src/app/services/album/album.service';
import { InitialCard } from 'src/app/models/usersalbums';
import { InitialAlbumCard } from 'src/app/models/albumcards';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  album$: Observable<Album>;
  // @Input() imagesInput$: Observable<any>;
  @Input() album: Album;
  @Input() delete: boolean;
  @Input() addToAlbum: boolean;
  @Input() isImagesForAlbum: boolean;
  @Input() imagesInput: Image[];

  images: Image[];
  cols;
  images$;
  private api: GridApi;
  private columnApi: ColumnApi;
  frameworkComponents;
  context;

  constructor(
    public imageService: ImageService,
    private albumService: AlbumService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    if (!this.isImagesForAlbum) {
      this.cols = [
        {
          field: 'level',
          headerName: 'Level',
          width: 100,
        },
        {
          field: 'collection',
          headerName: 'Collection',
          width: 100,
        },
        {
          field: 'title',
          headerName: 'Title',
          cellStyle: { 'white-space': 'normal !important' },
          editable: true,
          width: 100,
        },
        {
          field: 'description',
          // cellClass: 'cell-wrap-text',
          cellStyle: { 'white-space': 'normal !important' },
          headerName: 'Description',
          autoHeight: true,
          editable: true,
          width: 350,
        },
        { field: 'language', headerName: 'Language', editable: true, width: 80 },
        {
          field: 'url',
          headerName: 'Photo',
          cellRendererFramework: CardRendererComponent,
          autoHeight: true,
          width: 80,
        },
        {
          checkboxSelection: true,
          width: 50,
        },
      ];
    } else {
      this.cols = [
        {
          field: 'nrOfCard',
          headerName: '#Card',
          autoHeight: true,
          editable: true,
          width: 100,
        },
        // {field: 'imgName', headerName: 'Name', editable: true, width: 80},
        {
          field: 'image.level',
          headerName: 'Level',
          width: 100,
        },
        {
          field: 'image.collection',
          headerName: 'Collection',
          width: 100,
        },
        {
          field: 'image.title',
          headerName: 'Title',
          cellStyle: { 'white-space': 'normal !important' },
          width: 100,
        },
        {
          field: 'image.description',
          // cellClass: 'cell-wrap-text',
          cellStyle: { 'white-space': 'normal !important' },
          headerName: 'Description',
          autoHeight: true,
          width: 350,
        },
        { field: 'image.language', headerName: 'Language', width: 80 },
        {
          field: 'image.url',
          headerName: 'Photo',
          cellRendererFramework: CardRendererComponent,
          autoHeight: true,
          width: 80,
        },
        {
          checkboxSelection: true,
          width: 50,
        },
      ];
    }
  }

  // click on button add image t album
  addImageToAlbum() {
    let img: Image;
    // tslint:disable-next-line:curly
    if (!this.album.albumUid) {
      this.toast.newToast({ content: 'Please choose album', style: 'warning' });
      return;
    }

    this.api.getSelectedRows().map(imageToSend => {
      img = imageToSend;
    });
    this.albumService.addImageToAlbum(this.album.albumUid, img);
  }

  onColumnResized(event) {
    if (event.finished) {
      this.api.resetRowHeights();
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
    this.api.resetRowHeights();
  }

  onCellValueChanged(event) {
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let albumcardUid: string;
    let albumUid: string;
    let imageUid: string;

    this.api.getSelectedRows().map(rowToDelete => {
      albumcardUid = rowToDelete.albumcardUid;
      albumUid = rowToDelete.albumUid;
      imageUid = rowToDelete.imageUid;
    });

    if (this.isImagesForAlbum) {
      this.albumService.removeImageFromAlbum(albumUid, albumcardUid);
    } else {
      window.alert('Development is ongoing');
      // this.imageService.deleteImage(imageUid);
    }
  }
}
