import {Injectable} from '@angular/core';

declare var firebase: any;

@Injectable()
export class Fire {

    private config: any;
    private _trilhas: any;
    private _palestrantes: any;
    private _palestras: any;
    private _agendamentos: any;

    constructor() {
        this.config = {
            apiKey: "AIzaSyB6Eaac9Vgs0HO1QcT7XLkghceapTYYcXI",
            authDomain: "rakuten-expo-2016.firebaseapp.com",
            databaseURL: "https://rakuten-expo-2016.firebaseio.com",
            storageBucket: "rakuten-expo-2016.appspot.com",
        };

        firebase.initializeApp(this.config);

        /*firebase.auth().signInAnonymously().catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });*/

        this._trilhas = firebase.database().ref('/data/trilhas');
        this._palestrantes = firebase.database().ref('/data/palestrantes');
        this._palestras = firebase.database().ref('/data/palestras');
        //this._agendamentos = firebase.database().ref('/data/agendamentos');
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

}