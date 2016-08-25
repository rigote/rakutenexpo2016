//Import Components
import {Component} from '@angular/core';

//Import pages
import {HomePage} from '../home/home';
import {PalestrantesPage} from '../palestrantes/palestrantes';
import {AgendaPage} from '../agenda/agenda';
import {ComoChegarPage} from '../como-chegar/como-chegar';
import {NotificacoesPage} from '../notificacoes/notificacoes';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;
  private tab5Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = PalestrantesPage;
    this.tab3Root = AgendaPage;
    this.tab4Root = ComoChegarPage;
    this.tab5Root = NotificacoesPage;
  }
}
