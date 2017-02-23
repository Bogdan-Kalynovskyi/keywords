/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NonBrandedComponent } from './non-branded.component';

describe('NonBrandedComponent', () => {
  let component: NonBrandedComponent;
  let fixture: ComponentFixture<NonBrandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonBrandedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonBrandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
