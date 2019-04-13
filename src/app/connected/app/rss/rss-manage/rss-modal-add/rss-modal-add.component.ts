import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rss-modal-add',
  templateUrl: './rss-modal-add.component.html',
  styleUrls: ['./rss-modal-add.component.css']
})
export class RssModalAddComponent implements OnInit {

  @ViewChild('modalRssAdd') modalRssAdd: any;
  @ViewChild('modalContainer') modalContainer: any;

  modalAddRssForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

    /** Gestion MODAL */
    openModal() {

      this.modalRssAdd.nativeElement.style.display = 'block';
      setTimeout( () => {
        this.modalRssAdd.nativeElement.className = 'modal fade show modal-transition-in';
      }, 100)
    }
  
    closeModal() {
      
      this.modalRssAdd.nativeElement.className = 'modal fade modal-transition-in';
      setTimeout( () => {
        this.modalRssAdd.nativeElement.style.display = 'none';
      }, 200)
      
    }

    addRss() {
      
    }

}
