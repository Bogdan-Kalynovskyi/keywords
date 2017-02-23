/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AllQueriesDataComponent } from './all-queries-data.component';

describe('AllQueriesDataComponent', () => {
  let component: AllQueriesDataComponent;
  let fixture: ComponentFixture<AllQueriesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllQueriesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQueriesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
