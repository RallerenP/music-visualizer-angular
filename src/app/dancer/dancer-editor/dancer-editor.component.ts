import { Component, OnInit } from '@angular/core';
import {StageService} from "../../stage/stage.service";
import {Dancer, MutableDancerProp} from "../dancer.interface";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-dancer-editor',
  templateUrl: './dancer-editor.component.html',
  styleUrls: ['./dancer-editor.component.css']
})
export class DancerEditorComponent implements OnInit {

  selected: Dancer | null = null;
  props?: MutableDancerProp[];
  faCaretLeft = faCaretLeft;

  constructor(public stageService: StageService) {
    this.stageService.selected.subscribe((sel: Dancer | null) => {

      this.selected = sel;

      if (sel === null) return

      this.props = sel.generateMutableProps();
    })
  }

  ngOnInit(): void {
  }

  select(dancer: Dancer) {
    this.stageService.selected.next(dancer);
  }

  unselect() {
    console.log("test")
    this.stageService.selected.next(null);
  }

}
