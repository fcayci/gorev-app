import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { OE, Zaman } from '../../../schemas';
import { UserDataService } from '../../services/userdata.service';

@Component({
  selector: 'kisi',
  templateUrl: './kisi.component.html',
  styleUrls: ['./kisi.component.css']
})

export class KisiComponent implements OnInit {

  // Current values of kisi
  kisi: OE;
  // Keep the original to reset values
  kisi_orig: OE;
  // Allow/Disallow edits, defailt disallow
  edit = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userDataService:UserDataService
    ) {}

  ngOnInit(): void {
    // Decide who to get based on the passed argument
    var username = this.route.snapshot.paramMap.get('username');
    this.userDataService.getKisi(username)
      .subscribe(kisi => {
        this.kisi = kisi;
        this.kisi_orig = JSON.parse(JSON.stringify(kisi));
    });
  }

  updateKisi(): void {
    // res will return {n: 1, nModified: 1, ok: 1}
    // TODO: Show an alert based on the modified/non-modified value
    this.userDataService.updateKisi(this.kisi)
      .subscribe(res => {
        // Update original with the new changes.
        this.kisi_orig = JSON.parse(JSON.stringify(this.kisi));
      });
    this.toggleEdit();
  }

  deleteKisi(): void {
    this.userDataService.deleteKisi(this.kisi)
        .subscribe(res => {
          console.log(res)
        });
    setTimeout(() => this.router.navigate(['/kadro']), 800);
  }

  // go back to original form when hit cancel.
  resetKisi(): void {
    // FIXME: check if this is the proper way.
    // hard copy the original.
    this.kisi = JSON.parse(JSON.stringify(this.kisi_orig));
    this.toggleEdit();
  }

  handleMessage(e){
    console.log(e);
    if (e.target.name == "save"){
      this.updateKisi();
      console.log('save');
    } else if(e.target.name == "cancel"){
      this.resetKisi();
    }
  }

  toggleEdit(){
    this.edit = !this.edit;
  }

  get diagnostic() { return JSON.stringify(this.kisi); }

}
