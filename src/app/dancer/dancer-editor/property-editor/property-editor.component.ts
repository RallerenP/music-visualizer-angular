import {Component, Input, OnInit} from '@angular/core';
import {MutableDancerProp} from "../../dancer.interface";
import {Observable} from "rxjs";
import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.css']
})
export class PropertyEditorComponent implements OnInit {

  @Input() prop!: MutableDancerProp;
  @Input() nest!: number
  input = new FormControl();

  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;

  open: boolean = false;

  propType: any;

  constructor() {

  }

  ngOnInit(): void {
    if (this.prop.type !== 'color') this.input.setValue(this.prop.value)
    //this.propType = typeof this.prop.value;
    this.input.setValue(this.prop.value);
  }

  asArray(val: any): MutableDancerProp[] {
    return val;
  }

  asObservable(val: any): Observable<any> {
    return val;
  }

  hover(e: Event) {
    (e.target as HTMLInputElement).focus();
  }

  set() {
    // @ts-ignore
    this.prop?.set!(this.input.value);
  }

}
