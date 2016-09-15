import {Injectable} from '@angular/core';

declare var firebase: any;

@Injectable()
export class Fire {

    private _trilhas: any = null;
    private _palestrantes: any = null;
    private _palestras: any = null;
    private _agendamentos: any = null;
    private _patrocinadores: any = null;
    private _informacoes: any = null;

    constructor() {
        this._trilhas = firebase.database().ref('/data/trilhas');
        this._palestrantes = firebase.database().ref('/data/palestrantes');
        this._palestras = firebase.database().ref('/data/palestras');
        this._agendamentos = firebase.database().ref('/data/agendamentos');
        this._patrocinadores = firebase.database().ref('/data/patrocinadores');
        this._informacoes = firebase.database().ref('/data/informacoes');
    }

    public getPalestrante(id: any): any {
        return this._palestrantes.child(id);
    }

    public getAllPalestrantes(): any {
        return this._palestrantes;
    }

    public getPalestra(id: any): any {
        return this._palestras.child(id);
    }

    public getAllPalestras(): any {
        return this._palestras;
    }

    public getTrilha(id: any): any {
        return this._palestras.child(id);
    }

    public getAllTrilhas(): any {
        return this._palestras;
    }

    public addAgendamento(item: any) {
        var itemsRef = this._agendamentos;
        var newItemRef = itemsRef.push();

        newItemRef.set(item);
    }

    public updateAgendamento(id: any, item: any) {
        let currentItem: any = this._agendamentos.child(id);

        if (currentItem != null)
            currentItem.update(item)
    }

    public removeAgendamento(id: any) {
        this._agendamentos.child(id).set(null);
    }

    public getAgendamento(id: any): any {
        return this._agendamentos.child(id);
    }

    public getAllAgendamentos(): any {
        return this._agendamentos;
    }

    public getPatrocinador(id: any): any {
        return this._patrocinadores.child(id);
    }

    public getAllPatrocinadores(): any {
        return this._patrocinadores;
    }

    public getInformacao(id: any): any {
        return this._informacoes.child(id);
    }

    public getAllInformacoes(): any {
        return this._informacoes;
    }

}