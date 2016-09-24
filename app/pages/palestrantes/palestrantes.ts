import { Component, Input } from '@angular/core';
import { NavController, Storage, LocalStorage } from 'ionic-angular';
import {Device} from 'ionic-native';
import * as $ from "jquery";

import {Fire} from '../../utils/fire';

declare var tabsFunction: any;
declare var _: any;

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
  public itemsAgendamento: any = [];
  public data: any;
  public dataPalestra: any;
  public dataTrilha: any;
  public dataAgendamento: any;
  public _fire: Fire;
  private _uuID: any;
  public favoriteFilterSelected: boolean = false;
  public storage: Storage = new Storage(LocalStorage);

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;    

    this._fire = fire;
    this._uuID = typeof Device.device.uuid == 'undefined' ? '123456' : Device.device.uuid;

    //Carregar loading
    setTimeout(function() {
        $('#overlayD').addClass('loaded');      
    }, 2000);

    // this.storage.get('palestrantes').then((value) => {
    //   if (value != null)
    //     root.items = JSON.parse(value);
    // });

    // this.storage.get('palestras').then((value) => {
    //   if (value != null)
    //     root.itemsPalestra = JSON.parse(value);
    // });

    // this.storage.get('trilhas').then((value) => {
    //   if (value != null)
    //     root.itemsTrilha = JSON.parse(value);
    // });

    // this.storage.get('agendamentos').then((value) => {
    //   if (value != null)
    //     root.itemsAgendamento = JSON.parse(value);
    // });

    this._fire.getAllPalestrantes().on('value', (data) => {
      root.data = data.val();
      root.initializeItems(1);
    });

    this._fire.getAllPalestras().on('value', (data) => {
      root.dataPalestra = data.val();
      root.initializeItems(2);
    });

    this._fire.getAllTrilhas().on('value', (data) => {
      root.dataTrilha = data.val();
      root.initializeItems(3);
    });

    this._fire.getAgendamentoByUUID(root._uuID).on('value', (data) => {
      root.dataAgendamento = data.val();
      root.initializeItems(4);
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

        //this.storage.setJson('palestrantes', result);
        this.items = result;
        break;
      case 2:
        for (var item in this.dataPalestra) {        
          result.push({
            key: item,
            index: this.dataPalestra[item].index,
            titulo: this.dataPalestra[item].titulo,
            descricao: this.dataPalestra[item].descricao,
            horario: this.dataPalestra[item].horario,
            trilhaID: this.dataPalestra[item].trilhaID,
            palestranteIDs: this.dataPalestra[item].palestranteIDs
          });        
        }

        //this.storage.setJson('palestras', result);
        this.itemsPalestra = _.sortBy(result, function(obj){ return Math.min(obj.index); });
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

        //this.storage.setJson('trilhas', result);
        this.itemsTrilha = result;
        tabsFunction.createTabs('ul.tabs');

        break;
      case 4:
        for (var item in this.dataAgendamento) {        
          result.push({
            key: item,
            deviceID: this.dataAgendamento[item].deviceID,
            palestraID: this.dataAgendamento[item].palestraID //palestranteID
          });        
        }

        //this.storage.setJson('agendamentos', result);
        this.itemsAgendamento = result;
        break;
    }
    
  }

  public getItems(ev: any) {  
    this.favoriteFilterSelected = false;  
    this.initializeItems(1);
    this.initializeItems(2);
    this.initializeItems(3);
    this.initializeItems(4);
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                  (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
                    (item.ocupacao.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  public toggleFilterFavorite() {
    if (this.favoriteFilterSelected) {
      this.favoriteFilterSelected = false;
      this.initializeItems(1);
      this.initializeItems(2);
      this.initializeItems(3);
      this.initializeItems(4);
    } else {      
      let _items: Array<any> = this.items;      
      
      this.favoriteFilterSelected = true;
      this.items = [];

      for (var i in this.itemsAgendamento) {
        for (var j in _items) {
          if (this.itemsAgendamento[i].palestraID == _items[j].key) {
            this.items.push(_items[j]);
          }
        }
      }
    }
  }

  public toggleLecture(item: any) {

    let palestraIDs: Array<any> = [];

    for (var i in this.itemsPalestra) {  
      if (typeof this.itemsPalestra[i].palestranteIDs != 'undefined' && this.itemsPalestra[i].palestranteIDs.indexOf(item.key) > -1) {
        for (var j in this.itemsPalestra[i].palestranteIDs) {
          palestraIDs.push(this.itemsPalestra[i].palestranteIDs[j]);
        }        
      }
    }

    let scheduled: boolean = false;
    let key: any;

    for (var i in this.itemsAgendamento) {
      if (this.itemsAgendamento[i].deviceID == this._uuID && this.itemsAgendamento[i].palestraID == palestraIDs[0]) {
        scheduled = true;
        key = this.itemsAgendamento[i].key;
        break;
      }
    }

    if (scheduled) {
      this._fire.removeAgendamento(key);
    }
    else {
      this._fire.addAgendamento({
        deviceID: this._uuID,
        palestraID: palestraIDs[0]
      });
    }
    

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

  public getLecture(key): any {
    let result: string = "";

    for (var item in this.itemsPalestra) {  
      if (typeof this.itemsPalestra[item].palestranteIDs != 'undefined' && this.itemsPalestra[item].palestranteIDs.indexOf(key) > -1) {
        result = this.itemsPalestra[item].titulo;
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
            result = this.itemsTrilha[itemTrilha].canal;
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
        for (let j: number = 0; j < this.itemsPalestra[i].palestranteIDs.length; j++) {
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

  public isScheduled(item) {
    let result: boolean = false;
    let palestraIDs: Array<any> = [];

    for (var i in this.itemsPalestra) {  
      if (typeof this.itemsPalestra[i].palestranteIDs != 'undefined' && this.itemsPalestra[i].palestranteIDs.indexOf(item.key) > -1) {
        for (var j in this.itemsPalestra[i].palestranteIDs) {
          palestraIDs.push(this.itemsPalestra[i].palestranteIDs[j]);
        }        
      }
    }

    for (let i: number = 0; i < this.itemsAgendamento.length; i++) {
      if (palestraIDs.indexOf(this.itemsAgendamento[i].palestraID) > -1 && this._uuID) {
        result = true;
        break;
      }
    }
    
    
    return result;
  }

  public hide(alias) {
    tabsFunction.hide(alias);
  }

  ionViewLoaded() {    
    //Habilita ou desabilita busca palestrantes e agenda
    $("#iconSearch").click(function(){
        $("ion-searchbar").toggle(300);
    });
  }

}
