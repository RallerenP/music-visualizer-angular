import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DancerEditorComponent } from './dancer-editor/dancer-editor.component';
import { PropertyEditorComponent } from './dancer-editor/property-editor/property-editor.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    DancerEditorComponent,
    PropertyEditorComponent
  ],
  exports: [
    DancerEditorComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class DancerModule { }
