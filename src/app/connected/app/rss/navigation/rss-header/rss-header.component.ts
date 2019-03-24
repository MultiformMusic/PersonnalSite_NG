import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rss-header',
  templateUrl: './rss-header.component.html',
  styleUrls: ['./rss-header.component.css']
})
export class RssHeaderComponent implements OnInit {

  toggle: boolean = false;

  constructor() { }

  ngOnInit() {
  }
}
