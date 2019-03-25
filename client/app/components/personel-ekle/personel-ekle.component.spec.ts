import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelEkleComponent } from './personel-ekle.component';

describe('PersonelEkleComponent', () => {
  let component: PersonelEkleComponent;
  let fixture: ComponentFixture<PersonelEkleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonelEkleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonelEkleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
