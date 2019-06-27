import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Album } from '../models/album';
import { Observable } from 'rxjs';
import { AlbumService } from './album/album.service';

@Injectable()
export class AlbumResolver implements Resolve<Album> {
    constructor(private albumService: AlbumService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const id = route.paramMap.get('albumUid');
        const album = this.albumService.getAlbumFromUid(id);
        return album;
    }
}
