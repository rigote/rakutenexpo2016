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

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    //var storage = new Storage(LocalStorage);
    //this.item = storage.get('home') != null ? storage.get('home') : this.item;

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
    //var storage = new Storage(LocalStorage);
    //storage.set('home', this.data);

    this.item = this.data;
  }

}
