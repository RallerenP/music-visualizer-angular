import { Component, OnInit } from '@angular/core';
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {StageService} from "../stage/stage.service";

@Component({
  selector: 'app-dancer-bar',
  templateUrl: './dancer-bar.component.html',
  styleUrls: ['./dancer-bar.component.css']
})
export class DancerBarComponent implements OnInit {

  faCircle = faCircle;

  constructor(private stageService: StageService) { }

  ngOnInit(): void {
  }

  spawn(kind: 'CIRCLE') {
    switch (kind) {
      case "CIRCLE":
        this.stageService.Circle(Math.random() * 200, Math.random() * 200)
    }
  }

}
