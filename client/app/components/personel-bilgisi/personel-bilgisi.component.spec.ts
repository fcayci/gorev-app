import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelBilgisiComponent } from './personel-bilgisi.component';

describe('PersonelBilgisiComponent', () => {
  let component: PersonelBilgisiComponent;
  let fixture: ComponentFixture<PersonelBilgisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonelBilgisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonelBilgisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
