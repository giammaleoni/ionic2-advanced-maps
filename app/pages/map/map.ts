import {Page, NavController} from 'ionic-angular';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

/*
  Generated class for the MapPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/map/map.html',
})
export class MapPage {
  connectivity: any;
  map: any;
  mapInitialised: boolean;
  apiKey: string;
  
  constructor(public nav: NavController, public connectivityService: ConnectivityService) {

    this.nav = nav;
    this.connectivity = connectivityService;

    this.map = null;
    this.mapInitialised = false;
    this.apiKey = null;

    this.loadGoogleMaps();
  }

  loadGoogleMaps() {

    var me = this;

    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivity.isOnline()) {
        console.log("online, loading map");

        //Load the SDK
        window.mapInit = function () {
          me.initMap();
          me.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);

      }
    }
    else {

      if (this.connectivity.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }

    }

  }

  initMap() {

    this.mapInitialised = true;

    navigator.geolocation.getCurrentPosition((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }, (error) => {
      console.log(error);
    });

  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {
    var me = this;

    var onOnline = function () {
      setTimeout(function () {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          me.loadGoogleMaps();
        } else {
          if (!me.mapInitialised) {
            me.initMap();
          }

          me.enableMap();
        }
      }, 2000);
    };

    var onOffline = function () {
      me.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }
}
