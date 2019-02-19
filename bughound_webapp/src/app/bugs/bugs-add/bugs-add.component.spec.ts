import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsAddComponent } from './bugs-add.component';

describe('BugsAddComponent', () => {
  let component: BugsAddComponent;
  let fixture: ComponentFixture<BugsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
