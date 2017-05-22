import {Component, ViewChild, ElementRef} from '@angular/core';

import {ConferenceData} from '../../providers/conference-data';

import {Platform} from 'ionic-angular';


declare var google: any;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    @ViewChild('mapCanvas') mapElement: ElementRef;

    constructor(public confData: ConferenceData, public platform: Platform) {

    }

    ionViewDidLoad() {

        if (this.confData.data) {
            this.confData.getMap().subscribe((mapData: any) => {
                let mapEle = this.mapElement.nativeElement;

                let map = new google.maps.Map(mapEle, {
                    center: mapData.find((d: any) => d.center),
                    zoom: 16
                });

                mapData.forEach((markerData: any) => {
                    let infoWindow = new google.maps.InfoWindow({
                        content: `<h5>${markerData.name}</h5>`
                    });

                    let marker = new google.maps.Marker({
                        position: markerData,
                        map: map,
                        title: markerData.name
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });

                google.maps.event.addListenerOnce(map, 'idle', () => {
                    mapEle.classList.add('show-map');
                });

            });
        } else {

            let mapEle = this.mapElement.nativeElement;

            let map = new google.maps.Map(mapEle, {
                center: {lat: 33.975811, lng: 35.612084},
                zoom: 16
            });


            let infoWindow = new google.maps.InfoWindow({
                content: `<h5>Smart Door App startup location</h5>`
            });


            let marker = new google.maps.Marker({
                    position: {
                        name: "Smart Doors Location",
                        lat: 33.975811,
                        lng: 35.612084,
                        center: true
                    },
                    map: map,
                    title: "Smart Door App startup location"
                })
            ;

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });


            google.maps.event.addListenerOnce(map, 'idle', () => {
                mapEle.classList.add('show-map');
            });


        }

    }
}
