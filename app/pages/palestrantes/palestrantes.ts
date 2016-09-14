import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from "jquery";

import {Fire} from '../../utils/fire';

/*
  Generated class for the PalestrantesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/palestrantes/palestrantes.html',
  providers: [Fire]
})
export class PalestrantesPage {
  
  public items: any = [];
  public data: any;
  public _fire: Fire;

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    this._fire.getAllPalestrantes().on('value', (data) => {
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
        ocupacao: this.data[item].ocupacao,
        descricao: this.data[item].descricao,
        foto: this.data[item].foto
      });        
    }

    this.items = result;
  }

  public getItems(ev: any) {    
    this.initializeItems();
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                  (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.ocupacao.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  ionViewLoaded() {
      //Habilita ou desabilita busca palestrantes e agenda
      $("#iconSearch").click(function(){
          $("ion-searchbar").toggle(300);
      });
  }

}
