import { Component, OnInit } from '@angular/core';
import { faCircle, faCaretUp } from "@fortawesome/free-solid-svg-icons";;
import {StageService} from "../stage/stage.service";

@Component({
  selector: 'app-dancer-bar',
  templateUrl: './dancer-bar.component.html',
  styleUrls: ['./dancer-bar.component.css']
})
export class DancerBarComponent implements OnInit {

  faCircle = faCircle;
  faCaretUp = faCaretUp;

  constructor(private stageService: StageService) { }

  ngOnInit(): void {
  }

  spawn(kind: 'CIRCLE' | 'TRIANGLE') {
    switch (kind) {
      case "CIRCLE":
        this.stageService.Circle(Math.random() * 200, Math.random() * 200)
        break;
      case "TRIANGLE":
        this.stageService.Triangle(Math.random() * 1000, Math.random() * 500);
        break;
    }
  }

}
