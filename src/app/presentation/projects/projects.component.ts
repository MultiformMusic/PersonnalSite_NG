import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: ElementRef;

  constructor() { }

  ngOnInit() {
    
    setTimeout( () => {
      this.videoplayer.nativeElement.play();
    }, 300)
  }

}
