import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'bcmodal.html'
})
export class ModalPage {
  public entity;
  public isCreateEntity;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.info("modalNavParams",this.navParams.data);
    this.entity = this.navParams.data;
    this.isCreateEntity = this.navParams.data && this.navParams.data.isCreate;

  }

  createOrUpdateEntity(){
    this.navCtrl.pop();
  }

  doCancel(){
    this.navCtrl.pop();
  }

}
