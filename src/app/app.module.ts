import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from "@angular/router";
import { MusicPlayerComponent } from './music-player/music-player.component';

// Dirty hack to make p5 work
import * as _p5 from 'p5';
// @ts-ignore
window.p5 = _p5;
import "p5/lib/addons/p5.sound";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DancerBarComponent } from './dancer-bar/dancer-bar.component';
import { StageComponent } from './stage/stage.component';
import {DancerModule} from "./dancer/dancer.module";
import {ReactiveFormsModule} from "@angular/forms";


const routes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MusicPlayerComponent,
    DancerBarComponent,
    StageComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FontAwesomeModule,
    DancerModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
