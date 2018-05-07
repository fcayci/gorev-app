import { Component } from '@angular/core';
import { Person, Kisi } from '../../../person';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})

export class PeopleComponent {

  people : Kisi[];
  model : Kisi = {...};

  submitted = false;

  constructor(private dataService:DataService){
    this.dataService.getPeople()
      .subscribe(people => {
        this.people = people;
      });
  }

  addPerson() {

    // TODO: remove this for production
    console.log('[adder.component.ts] addPerson() called...');

    var result = this.people.filter(p => p.fullname.toLowerCase() === this.model.fullname).length;
    if (result == 0) {

      // TODO: remove this for production
      console.log('[adder.component.ts] Adding person');
      this.dataService.addPerson(this.model)
        .subscribe(res => {
          this.people.push(res);
        });
    }
  }

  onSubmit() {
    this.submitted = true;
  }

  // Fancy stuff for modal view inside people component
  public visible = false;
  public visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  //TODO: remove this for production
  //get diagnostic() { return JSON.stringify(this.model); }
}
