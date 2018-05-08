import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { OE } from '../../../ogretimelemani';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'kadro',
  templateUrl: './kadro.component.html',
  styleUrls: ['./kadro.component.css']
})

export class KadroComponent implements OnInit {
  @Input() kadro: OE[];

  model = {};
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private dataService:DataService,
    private location: Location) {}

  ngOnInit(): void {
    // TODO: remove this for production
    console.log('[kadro.component] kadro grabbed from db');
    this.getKadro();
  }

  getKadro() : void {
    this.dataService.getKadro()
      .subscribe(kadro => {
        this.kadro = kadro;
      });
  }

  onSubmit() {
    this.submitted = true;
  }

  aSuccess = false;
  aFail = false;

  success(): void {
    this.aSuccess = true;
    setTimeout(() => this.aSuccess = false, 800);
  }

  fail(): void {
    this.aFail = true;
    setTimeout(() => this.aFail = false, 800);
  }

  // Fancy stuff for modal view inside kadro component
  visible = false;
  visibleAnimate = false;

  show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  //TODO: remove this for production
  //get diagnostic() { return JSON.stringify(this.model); }
}
