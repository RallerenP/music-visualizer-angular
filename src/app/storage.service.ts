import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private readonly cached: {[index: string]: BehaviorSubject<any>} = {};

  getItem<T>(key: string): Observable<T> | undefined {
    if (this.cached[key] !== undefined) {
      return this.cached[key].asObservable();
    }

    const itemRepresentation = sessionStorage.getItem(key);

    if (!itemRepresentation) return undefined;

    const item = JSON.parse(itemRepresentation);

    this.cached[key] = new BehaviorSubject<T>(item);

    return this.cached[key].asObservable();
  }

  getOnce<T>(key: string): T | undefined {
    const itemRepresentation = sessionStorage.getItem(key);

    if (!itemRepresentation) return undefined;

    return JSON.parse(itemRepresentation);
  }

  setItem<T>(key: string, value: T) {
    if (this.cached[key] !== undefined) {
      this.cached[key].next(value);
    }

    sessionStorage.setItem(key, JSON.stringify(value));

    // Run getitem to cache this
    this.getItem(key);
  }

  removeItem(key: string) {
    if (this.cached[key] !== undefined) {
      delete this.cached[key];
    }

    return sessionStorage.removeItem(key);
  }


}
