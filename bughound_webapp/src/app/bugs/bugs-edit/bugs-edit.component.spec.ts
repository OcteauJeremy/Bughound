import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsEditComponent } from './bugs-edit.component';

describe('BugsEditComponent', () => {
  let component: BugsEditComponent;
  let fixture: ComponentFixture<BugsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
