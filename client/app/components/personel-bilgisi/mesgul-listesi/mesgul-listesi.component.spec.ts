import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesgulListesiComponent } from './mesgul-listesi.component';

describe('MesgulListesiComponent', () => {
  let component: MesgulListesiComponent;
  let fixture: ComponentFixture<MesgulListesiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesgulListesiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesgulListesiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
