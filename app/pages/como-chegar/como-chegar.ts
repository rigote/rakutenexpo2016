import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';

declare var launchnavigator: any;

/*
  Generated class for the ComoChegarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/como-chegar/como-chegar.html',
})
export class ComoChegarPage {

  constructor(private navCtrl: NavController) {

    //Carregar loading
    setTimeout(function() {
        $('#overlayB').addClass('loaded');      
    }, 2000);

  }

  public openMap() {    
    launchnavigator.isAppAvailable(launchnavigator.APP.UBER, function(isAvailable){
      var app;
      if(isAvailable){
          app = launchnavigator.APP.UBER;
      }else{
          console.warn("Google Maps not available - falling back to user selection");
          app = launchnavigator.APP.USER_SELECT;
      }
      LaunchNavigator.navigate([-23.6089975, -46.6991569], {
        app: app
      })
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
    });
  }

}
