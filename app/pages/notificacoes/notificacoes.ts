import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {Fire} from '../../utils/fire';

/*
  Generated class for the NotificacoesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/notificacoes/notificacoes.html',
  providers: [Fire]
})
export class NotificacoesPage {

  public items: any = [];
  public data: any;
  public _fire: Fire;

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    this._fire.getAllPatrocinadores().on('value', (data) => {
      root.data = data.val();
      root.initializeItems();
    });
  }

  private initializeItems() {
    var result = [];

    for (var item in this.data) {        
      result.push({
        key: item,
        nome: this.data[item].nome,
        tipo: this.data[item].tipo,
        logo: this.data[item].logo
      });        
    }

    this.items = result;
  }

  public getSponsorsByType(type: string): Array<any> {

    let result: any = [];

    for (let i: number = 0; i < this.items.length; i++) {
        if (type == this.items[i].tipo) {
          result.push({
            key: this.items[i].key,
            nome: this.items[i].nome,
            tipo: this.items[i].tipo,
            logo: this.items[i].logo            
          });
        }
    }

    return result;

  }

}
