import { Component } from '@angular/core';
import { NavController, Storage, LocalStorage } from 'ionic-angular';

import {Fire} from '../../utils/fire';

declare var _: any;

/*
  Generated class for the AgendaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/agenda/agenda.html',
  providers: [Fire]
})
export class AgendaPage {

  public itemsPalestra: any = [];
  public dataPalestra: any;
  public itemsTrilha: any = [];
  public dataTrilha: any;
  public itemsPalestrante: any = [];
  public dataPalestrante: any;
  public _fire: Fire;
  public storage: Storage = new Storage(LocalStorage);

  constructor(private navCtrl: NavController, private fire: Fire) {
    var root = this;
    this._fire = fire;

    // this.storage.get('palestras').then((value) => {
    //   if (value != null)
    //     root.itemsPalestra = JSON.parse(value);
    // });
    
    // this.storage.get('trilhas').then((value) => {
    //   if (value != null)
    //     root.itemsTrilha = JSON.parse(value);
    // });

    // this.storage.get('palestrantes').then((value) => {
    //   if (value != null)
    //     root.itemsPalestrante = JSON.parse(value);
    // });

    this._fire.getAllPalestras().once('value', (data) => {
      root.dataPalestra = data.val();
      root.initializeItems(1);
    });

    this._fire.getAllPalestrantes().once('value', (data) => {
      root.dataPalestrante = data.val();
      root.initializeItems(2);
    });

    this._fire.getAllTrilhas().once('value', (data) => {
      root.dataTrilha = data.val();
      root.initializeItems(3);
    });
  }

  private initializeItems(type: number) {
    var result = [];
    
    switch (type) {
      case 1:
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
      case 2:
        for (var item in this.dataPalestrante) {        
          result.push({
            key: item,
            descricao: this.dataPalestrante[item].descricao,
            foto: this.dataPalestrante[item].foto,
            nome: this.dataPalestrante[item].nome,
            ocupacao: this.dataPalestrante[item].ocupacao
          });        
        }

        //this.storage.setJson('palestrantes', result);
        this.itemsPalestrante = result;
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
      break;
    }    

    
  }

  public getTimeList(): Array<string> {

    let result: any = [];

    for (let i: number = 0; i < this.itemsPalestra.length; i++) {
      let contains: boolean = false;

      for (let j: number = 0; j < result.length; j++) {
        if (result[j] == this.itemsPalestra[i].horario) {
          contains = true;
          break;
        }
      }

      if (!contains) {
        result.push(this.itemsPalestra[i].horario);
      }
    }

    return result;
  }

  public getLecturesByTime(hour: string): Array<any> {

    let result: any = [];

    for (let i: number = 0; i < this.itemsPalestra.length; i++) {
        if (hour == this.itemsPalestra[i].horario) {
          result.push({
            key: this.itemsPalestra[i].key,
            horario: this.itemsPalestra[i].horario,
            titulo: this.itemsPalestra[i].titulo,
            descricao: this.itemsPalestra[i].descricao,
            palestrantes: this.getPalestrantes(this.itemsPalestra[i].palestranteIDs),
            trilhaID: this.itemsPalestra[i].trilhaID
          });
        }
    }

    return result;

  }

  public getPalestrantesLabel(palestrantes: Array<any>): string {
    
    let result: string = '';

    for (let i: number = 0; i < palestrantes.length; i++) {
      if (i == 0) result = palestrantes[i].nome;
      else if (i == palestrantes.length - 1) result = result + ' e ' + palestrantes[i].nome;
      else result = result + ', ' + palestrantes[i].nome;
    }

    return result;

  }

  private getPalestrantes(palestranteIDs: Array<string>): Array<any> {
    
    let result: Array<any> = [];
    
    if (typeof palestranteIDs != 'undefined') {
      for (let i: number = 0; i < palestranteIDs.length; i++) {
        for (let j: number = 0; j < this.itemsPalestrante.length; j++) {
          if (palestranteIDs[i] == this.itemsPalestrante[j].key) {
            result.push(this.itemsPalestrante[j]);
            break;
          }
        }
      }
    }

    return result;

  }

  public getFotoPalestrantes(palestrantes: Array<any>): string {
    let foto: string = '';

    if (palestrantes.length > 0)
      foto = typeof palestrantes[0].foto != 'undefined' ? palestrantes[0].foto : foto;

    return foto;
  }

  public getTrilhaData(trilhaID: any, type: number): string {
    for (var index in this.itemsTrilha) {
      if (this.itemsTrilha[index].key == trilhaID) {
        switch (type) {
          case 1: //canal
            return this.itemsTrilha[index].canal;
          case 2: //alias
            return this.itemsTrilha[index].alias;
          case 3: //nome
            return this.itemsTrilha[index].nome;
        }
      }        
    }
    
    return '';
  }  

}
