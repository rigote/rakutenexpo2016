import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Fire} from '../../utils/fire';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Fire]
})
export class HomePage {

  public item: any = {
    sobreimagem: '',
    sobre: '',
    senha: ''
  };
  public data: any;
  public _fire: Fire;

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    this._fire.getInformacao("-KReft9hR7LoM-KkR3xg").on('value', (data) => {
      root.data = data.val();
      root.initializeItems();
    });
  }

  private initializeItems() {
    this.item = this.data;
  }

}
