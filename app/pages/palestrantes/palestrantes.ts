import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Device} from 'ionic-native';
import * as $ from "jquery";

import {Fire} from '../../utils/fire';

declare var tabsFunction: any;

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
  public itemsPalestra: any = [];
  public itemsTrilha: any = [];
  public data: any;
  public dataPalestra: any;
  public dataTrilha: any;
  public _fire: Fire;

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;

    tabsFunction.createTabs('ul.tabs');

    this._fire = fire;

    this._fire.connection.on("value", function(snap) { 
      debugger;     
        if (snap.val() === true) {
          root._fire.getAllPalestrantes().on('value', (data) => {
            root.data = data.val();
            root.initializeItems(1);
          });

          root._fire.getAllPalestras().on('value', (data) => {
            root.dataPalestra = data.val();
            root.initializeItems(2);
          });

          root._fire.getAllTrilhas().on('value', (data) => {
            root.dataTrilha = data.val();
            root.initializeItems(3);
          });
        }
        else {
            console.log("Dispositivo offline");
        }
    });
  }

  private initializeItems(type: number) {
    var result = [];

    switch (type) {
      case 1:
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
        break;
      case 2:
        for (var item in this.dataPalestra) {        
          result.push({
            key: item,
            titulo: this.dataPalestra[item].titulo,
            descricao: this.dataPalestra[item].descricao,
            horario: this.dataPalestra[item].horario,
            trilhaID: this.dataPalestra[item].trilhaID,
            palestranteIDs: this.dataPalestra[item].palestranteIDs,
            agendado: false
          });        
        }

        this.itemsPalestra = result;
        break;
      case 3:
        for (var item in this.dataTrilha) {        
          result.push({
            key: item,
            canal: this.dataTrilha[item].canal,
            nome: this.dataTrilha[item].nome,
            alias: this.dataTrilha[item].alias
          });        
        }

        this.itemsTrilha = result;
        break;
    }
    
  }

  public getItems(ev: any) {    
    this.initializeItems(1);
    this.initializeItems(2);
    this.initializeItems(3);
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                  (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.ocupacao.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  public toggleLecture(item: any) {
    console.log(Device.device.uuid);
  }

  public getLectureTime(key): any {
    let result: string = "";

    for (var item in this.itemsPalestra) {  
      if (typeof this.itemsPalestra[item].palestranteIDs != 'undefined' && this.itemsPalestra[item].palestranteIDs.indexOf(key) > -1) {
        result = this.itemsPalestra[item].horario;
        break;
      }
    }

    return result;
  }

  public getChannel(key): any {
    let result: string = "";

    for (var item in this.itemsPalestra) {  
      if (typeof this.itemsPalestra[item].palestranteIDs != 'undefined' && this.itemsPalestra[item].palestranteIDs.indexOf(key) > -1) {
        for (var itemTrilha in this.itemsTrilha) {
          if (this.itemsTrilha[itemTrilha].key == this.itemsPalestra[item].trilhaID) {
            result = this.itemsPalestra[item].canal;
            break;
          }            
        }        
        break;
      }
    }

    return result;
  }

  public getPalestrantes(trilhaID: any): Array<any> {
    let palestrantes: Array<any> = [];
    let result: Array<any> = [];

    for(let i: number = 0; i < this.itemsPalestra.length; i++) {
      if (this.itemsPalestra[i].trilhaID == trilhaID) {
        for (let j: number = 0; j < this.itemsPalestra[i].palestranteIDs; j++) {
          if (palestrantes.indexOf(this.itemsPalestra[i].palestranteIDs[j]) == -1) {
            palestrantes.push(this.itemsPalestra[i].palestranteIDs[j]);
          }
        }        
      }
    }

    for(let i: number = 0; i < this.items.length; i++) {
      for (let j: number = 0; j < palestrantes.length; j++) {
        if (this.items[i].key == palestrantes[j]) {
          result.push(this.items[i]);
          break;
        }
      }      
    }

    return result;    
  }

  ionViewLoaded() {
      //Habilita ou desabilita busca palestrantes e agenda
      $("#iconSearch").click(function(){
          $("ion-searchbar").toggle(300);
      });
  }

}
