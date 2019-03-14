import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsAddComponent } from './programs-add.component';

describe('ProgramsAddComponent', () => {
  let component: ProgramsAddComponent;
  let fixture: ComponentFixture<ProgramsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
