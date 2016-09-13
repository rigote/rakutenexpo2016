import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import {TabsPage} from './pages/tabs/tabs';
import {HomePage} from './pages/home/home';
import {PalestrantesPage} from './pages/palestrantes/palestrantes';
import {AgendaPage} from './pages/agenda/agenda';
import {ComoChegarPage} from './pages/como-chegar/como-chegar';
import {NotificacoesPage} from './pages/notificacoes/notificacoes';

import {Fire} from './utils/fire';

declare var firebase: any;

@Component({
  templateUrl: 'build/app.html',
})

class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    firebase.initializeApp({
            apiKey: "AIzaSyB6Eaac9Vgs0HO1QcT7XLkghceapTYYcXI",
            authDomain: "rakuten-expo-2016.firebaseapp.com",
            databaseURL: "https://rakuten-expo-2016.firebaseio.com",
            storageBucket: "rakuten-expo-2016.appspot.com",
        });

    /*firebase.auth().signInAnonymously().catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });*/

    this.rootPage = TabsPage;

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Palestrantes', component: PalestrantesPage },
      { title: 'Agenda', component: AgendaPage },
      { title: 'Como chegar', component: ComoChegarPage },
      { title: 'Notificações', component: NotificacoesPage }
    ];

  }

  initializeApp() {    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });    
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [Fire]);
