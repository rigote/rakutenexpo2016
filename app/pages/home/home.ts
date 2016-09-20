import { Component } from '@angular/core';
import { NavController, Storage, LocalStorage } from 'ionic-angular';

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
  public storage: Storage = new Storage(LocalStorage);

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    this.storage.get('home').then((value) => {
      root.item = JSON.parse(value);
    });

    this._fire.connection.on("value", function(snap) {
        if (snap.val() === true) {
            root._fire.getInformacao("-KReft9hR7LoM-KkR3xg").on('value', (data) => {
              root.data = data.val();
              root.initializeItems();
            });
        }
        else {
            console.log("Dispositivo offline");
        }
    });
      
  }

  private initializeItems() {
    this.storage.setJson('home', this.data);

    this.item = this.data;
  }

}
