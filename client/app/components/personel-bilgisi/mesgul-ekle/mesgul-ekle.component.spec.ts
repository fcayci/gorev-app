import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesgulEkleComponent } from './mesgul-ekle.component';

describe('MesgulEkleComponent', () => {
  let component: MesgulEkleComponent;
  let fixture: ComponentFixture<MesgulEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesgulEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesgulEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
