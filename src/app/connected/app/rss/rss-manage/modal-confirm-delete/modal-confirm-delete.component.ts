import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { RssUrl } from '../../models/rss-url';


@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.css']
})
export class ModalConfirmDeleteComponent implements OnInit {

  @ViewChild('modalConfirmDelete') modalConfirmDelete: any;
  @Output() confirmDeleteEvent = new EventEmitter<RssUrl>();

  rssUrlToDelete: RssUrl;

  screenHeight: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = (window.innerHeight / 2) - 100;
}
  constructor() { 
    this.getScreenSize();
  }

  ngOnInit() {
  }

  /**
   * 
   * Ouverture modal confirmation suppression avec RSS à supprimer
   * 
   * @param rssUrl 
   * 
   */
  openModal(rssUrl: RssUrl) {

    this.rssUrlToDelete = rssUrl;

    // affichage modal
    this.modalConfirmDelete.nativeElement.style.display = 'block';
    setTimeout( () => {
      this.modalConfirmDelete.nativeElement.className = 'modal fade show modal-transition-in';
    }, 100);

  }

  /**
   * 
   * Fermeture modal suppression RSS
   * 
   */
  closeModal() {

    this.modalConfirmDelete.nativeElement.className = 'modal fade modal-transition-in';
    setTimeout( () => {
      this.modalConfirmDelete.nativeElement.style.display = 'none';
    }, 200);

  }

  deleteRss() {
    this.closeModal();
    this.confirmDeleteEvent.emit(this.rssUrlToDelete);
  }
}
