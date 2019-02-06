import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {

  constructor(private app: AppComponent) {

    this.app.showLogoutBtn = true;
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.app.showLogoutBtn = false;
  }



}
