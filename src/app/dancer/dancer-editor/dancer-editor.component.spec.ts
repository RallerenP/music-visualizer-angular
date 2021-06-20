import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DancerEditorComponent } from './dancer-editor.component';

describe('DancerEditorComponent', () => {
  let component: DancerEditorComponent;
  let fixture: ComponentFixture<DancerEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DancerEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DancerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
