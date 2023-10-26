import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';

import Swal from 'sweetalert2';
// declare var google;
import * as lodash from 'lodash'
import * as L from 'leaflet'
// import { LeadsDetailQuotationPage } from '../leads-detail-quotation/leads-detail-quotation.page';
// import { LeadsDetailReceiptPage } from '../leads-detail-receipt/leads-detail-receipt.page';
import { ShareServiceService } from '../share-service.service';
import { Socket } from 'ngx-socket-io';

import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';

@Component({
  selector: 'app-lead-appointment',
  templateUrl: './lead-appointment.page.html',
  styleUrls: ['./lead-appointment.page.scss'],
})
export class LeadAppointmentPage implements OnInit {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  uid = localStorage.getItem('nanogapp_uid') || ''

  address = '';
  latitude!: any;
  longitude!: any;
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap',
  };
  markers = [] as any;

  theList = ["test test", "test test test test test", "test test test test test test test test"]
  keywordServices = ''
  keywordChannel = ''
  keywordAds = ''
  keywordSalesAdmin = ''
  keywordSalesCoord = ''
  // keywordSalesExec = ''
  keywordCompany = ''
  keywordState = ''
  keywordCity = ''
  keywordTitle = ''
  selectionServices = false
  selectionChannel = false
  selectionAds = false
  selectionSalesAdmin = false
  selectionSalesCoord = false
  selectionSalesExec = false
  selectionCompany = false
  selectionState = false
  selectionCity = false
  selectionTitle = false
  issuesText = ''
  openPicture = false
  img = ''

  lead = [] as any
  appointment = [] as any
  tabs = 'details'
  schedule_date = ''
  sales_package = [] as any
  sales_exec = [] as any
  sales_coor = [] as any
  sales_list = [] as any
  ads_list = [] as any
  schedule_list = [] as any
  channel_list = [] as any
  company_list = [] as any
  payment_list = [] as any
  services_list = ['Waterproofing', 'Antislip', 'Waterproofing & Antislip'] as any
  label_main_list = [] as any
  label_sub_list = [] as any
  label_list = [] as any
  loading = false

  // map;
  tiles;
  marker
  map_location
  searchedResult = [] as any

  getNo
  leadId
  fromPage

  selectedMainLabel = ''
  selectedSubLabel = ''

  startDate = null
  today2 = new Date()
  currentMonth = this.today2.getMonth();
  currentYear = this.today2.getFullYear();

  tasklistCount = 1
  tasklist = [] as any

  totalDue = 0
  state = ['Kuala Lumpur', 'Selangor', 'Johor', 'Kedah', 'Kelantan', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Putrajaya', 'Sabah', 'Sarawak', 'Terengganu']
  city = []

  oriAddress = ''
  oriCompAddress = ''
  oriLat
  oriLong
  searchAddress

  userid

  keywordGender = ''
  selectionGender = false
  gender = ['Male', 'Female']
  keywordRace = ''
  selectionRace = false
  race = ['Malay', 'Chinese', 'India',  'Others']
  title = ['Mr', 'Mrs', 'Miss', 'Ms', 'Datuk', 'Datuk Seri', 'Dr', 'Tan Sri', 'Tun']

  tempRemark = null

  constructor(
    private nav: NavController,
    private actroute: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private modalController: ModalController,
    private share: ShareServiceService,
    private ngZone: NgZone, private geoCoder: MapGeocoder,
    private platform : Platform,
    private socket : Socket
  ) { }

  // ngAfterViewInit(): void {
  //   // Binding autocomplete to search input control
  //   let autocomplete = new google.maps.places.Autocomplete(
  //     this.searchElementRef.nativeElement
  //   );
  //   // Align search box to center
  //   this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
  //     this.searchElementRef.nativeElement
  //   );
  //   autocomplete.addListener('place_changed', () => {
  //     this.ngZone.run(() => {
  //       //get the place result
  //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //       //verify result
  //       if (place.geometry === undefined || place.geometry === null) {
  //         return;
  //       }

  //       // console.log({ place }, place.geometry.location?.lat(), place.geometry.location?.lng());
  //       this.lead.address = place.formatted_address
  //       this.lead.company_address = place.name
  //       //set latitude, longitude and zoom
  //       this.latitude = place.geometry.location?.lat();
  //       this.longitude = place.geometry.location?.lng();

  //       // Set marker position
  //       this.setMarkerPosition(this.latitude, this.longitude);

  //       this.center = {
  //         lat: this.latitude,
  //         lng: this.longitude,
  //       };
  //     });
  //   });
  // }

  ngOnInit() {
    this.socket.connect(); 
    // // console.log(new Date().toLocaleString());
    this.actroute.queryParams.subscribe((a) => {

      this.userid = a['uid']
      this.leadId = a['lid']
      // console.log(this.leadId);

      this.tabs = 'details'


      this.refresh()

      // this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: a['id'] }).subscribe((s) => {
      //   this.appointment = s['data']
      //   // console.log(this.appointment);
      // })

    })

  }

  tabClicked(x) {

    if (x == 'details') {
      this.tabs = 'details'
      this.loadMap()
    } 
    // else if (x == 'appointment') {
    //   this.tabs = 'appointment'
    //   this.loadMap()
    // } 
    // else if (x == 'payment') {
    //   this.tabs = 'payment'
    // } else if (x == 'tasklist') {
    //   this.tabs = 'tasklist'
    // }
    else if (x == 'appointmentSE') {
      this.nav.navigateForward('task-detail?uid=' + this.uid + '&tid=' + this.lead.appointment_id)
    }

  }

  refresh() {

    this.tempRemark = null

    this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Coordinator' }).subscribe((s) => {
      this.sales_coor = s['data']
    })

    this.http.get('https://api.nanogapp.com/getAds').subscribe((s) => {
      this.ads_list = s['data']
      // // console.log('ads', this.ads_list);
    })

    this.http.get('https://api.nanogapp.com/getChannel').subscribe((s) => {
      this.channel_list = s['data']
      // // console.log('channel', this.channel_list);
    })

    this.http.get('https://api.nanogapp.com/getAllSubCompany').subscribe((s) => {
      this.company_list = s['data']
      // console.log('company', this.company_list);
    })

    this.http.post('https://api.nanogapp.com/getLeadDetail', { lead_id: this.leadId }).subscribe((s) => {
      this.lead = s['data']
      // console.log(this.lead)

      this.oriAddress = this.lead.address
      this.oriCompAddress = this.lead.company_address
      this.oriLat = this.lead.lattitude
      this.oriLong = this.lead.longtitude
      this.keywordServices = this.lead.services
      this.keywordChannel = this.lead.channel
      this.keywordAds = this.lead.ads
      this.keywordSalesCoord = this.lead.sales_coordinator
      // this.keywordSalesExec = this.lead.assigned_to
      this.keywordState = this.lead.customer_state
      this.keywordCity = this.lead.customer_city
      this.keywordGender = this.lead.gender
      this.keywordRace = this.lead.race
      this.keywordTitle = this.lead.customer_title

      this.http.post('https://api.nanogapp.com/getSalesPackageViaAppointment', { appointment_id: this.lead.appointment_id }).subscribe((s) => {
        this.sales_package = s['data'].sort((a, b) => a.sap_id - b.sap_id)
        // console.log('sales package', this.sales_package);
      })

      this.http.post('https://api.nanogapp.com/getSales', { appointment_id: this.lead.appointment_id }).subscribe((s) => {
        this.sales_list = s['data']
        // console.log('sales', this.sales_list);

        this.calcDue()

        if (s['data']) {

          if (this.sales_list.subcon_choice.length > 0) {
            this.keywordCompany = this.sales_list.subcon_choice.at(-1).company
          }
          // this.keywordCompany = this.sales_list.subcon_choice

          this.http.post('https://api.nanogapp.com/getAllScheduleBySales', { sales_id: this.sales_list.id }).subscribe((s) => {
            this.schedule_list = s['data'].sort((a, b) => a.id - b.id)
            // console.log('schedule_list', this.schedule_list);

            if (this.schedule_list.length > 0) {
              this.schedule_date = this.schedule_list.at(-1).schedule_date
              this.startDate = this.datepipe.transform(new Date(parseInt(this.schedule_date)), 'yyyy-MM-dd')
            }
          })
        }

      })

      this.http.post('https://api.nanogapp.com/getSalesPayment', { id: this.lead.appointment_id }).subscribe((s) => {
        this.payment_list = s['data'].sort((a, b) => a.id - b.id)
        // console.log('payment', this.payment_list);
      })

      this.http.get('https://api.nanogapp.com/getLabel').subscribe((s) => {

        this.label_list = s['data']
        // // console.log(this.label_list);

        this.label_main_list = s['data'].filter(a => a.main == true).sort((a, b) => a.id - b.id)
        this.selectedMainLabel = this.lead.label_m
        this.selectedSubLabel = this.lead.label_s
        this.label_sub_list = s['data'].filter(a => (a.main == false && a.category == this.selectedMainLabel)).sort((a, b) => a.name - b.name)
        // console.log('label', this.label_main_list, this.label_sub_list);
        this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Executive' }).subscribe((s) => {
          this.sales_exec = s['data']
          // console.log('sales exec', this.sales_exec);
          if (this.lead.appointment_time != 'NaN' && this.lead.appointment_time != null && this.lead.appointment_time != '') {
            this.lead.appointment_time = parseInt(this.lead.appointment_time)

            this.SEblur(this.lead.appointment_time)

            this.lead.date = this.datepipe.transform(new Date(parseInt(this.lead.appointment_time)), 'yyyy-MM-dd')
            this.lead.time = this.datepipe.transform(parseInt(this.lead.appointment_time), 'HH:mm')
          }
        })

        // if (this.tasklist.length == 0) {
        //   this.addTask()
        // }

      })

      if (this.tabs == 'details' || this.tabs == 'appointment') {
        this.loadMap()
      }
      this.city = this.share.statecity[this.lead.customer_state]

    })

  }

  paymentShow(x) {
    if (x == 'ac') {
      if (this.payment_list.filter(a => a.ac_approval == null).length > 0) {
        return true
      }
    } else if (x == 'sc') {
      if (this.payment_list.filter(a => a.sc_approval == null).length > 0) {
        return true
      }
    } else {
      if (this.payment_list.filter(a => a.sc_approval == null).length > 0) {
        return true
      }
    }

  }

  loadMap() {
    this.loading = false

    this.http.post('https://api.nanogapp.com/getLeadDetail', { lead_id: this.leadId }).subscribe((s) => {
      this.lead = s['data']
      if (!this.lead.sc_photo) {
        this.lead.sc_photo = [] as any
      }
      // console.log('Lead', this.lead);

      this.keywordServices = this.lead.services
      this.keywordChannel = this.lead.channel
      this.keywordAds = this.lead.ads
      this.keywordSalesCoord = this.lead.sales_coordinator
      // if (this.lead.assigned_to != null) {
      //   this.keywordSalesExec = this.lead.assigned_to
      // } else {
      //   this.keywordSalesExec = ''
      // }

      // this.map_location = null

      if (this.lead.appointment_time != 'NaN' && this.lead.appointment_time != null && this.lead.appointment_time != '') {
        this.lead.appointment_time = parseInt(this.lead.appointment_time)

        this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Executive' }).subscribe((s) => {
          this.sales_exec = s['data']
          // // console.log('sales exec', this.sales_exec);
          this.SEblur(this.lead.appointment_time)
        })

        this.lead.date = this.datepipe.transform(new Date(parseInt(this.lead.appointment_time)), 'yyyy-MM-dd')
        this.lead.time = this.datepipe.transform(parseInt(this.lead.appointment_time), 'HH:mm')
      }

      // Binding autocomplete to search input control
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      // Align search box to center
      // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      //   this.searchElementRef.nativeElement
      // );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // console.log({ place }, place.geometry.location?.lat(), place.geometry.location?.lng());
          this.lead.address = place.formatted_address
          this.lead.company_address = place.name
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location?.lat();
          this.longitude = place.geometry.location?.lng();
          this.lead.lattitude = this.latitude
          this.lead.longtitude = this.longitude

          // Set marker position
          this.setMarkerPosition(this.latitude, this.longitude);
          this.SEblur(this.lead.date)

          this.center = {
            lat: this.latitude,
            lng: this.longitude,
          };
        });
      });

      // MAP
      // navigator.geolocation.getCurrentPosition((position) => {
      //   this.latitude = position.coords.latitude;
      //   this.longitude = position.coords.longitude;
      //   this.center = {
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude,
      //   };

      //   this.setMarkerPosition(this.latitude, this.longitude);
      // });

      navigator.geolocation.getCurrentPosition((position) => {

        // console.log(this.lead.lattitude, this.lead.longtitude)

        if (this.lead.lattitude && this.lead.longtitude) {
          this.latitude = this.lead.lattitude;
          this.longitude = this.lead.longtitude;
          this.center = {
            lat: this.lead.lattitude,
            lng: this.lead.longtitude,
          };
        } else {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        }
        this.setMarkerPosition(this.latitude, this.longitude);
      });


      // let lat1 = 3.1569
      // let lng1 = 101.7123

      // if (this.lead.lattitude != null && this.lead.longtitude != null) {
      //   lat1 = this.lead.lattitude
      //   lng1 = this.lead.longtitude
      // }
      // this.map = L.map('map').setView([lat1, lng1], 18);

      // this.tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      // }).addTo(this.map);


      // this.marker = L.marker([lat1, lng1], {
      //   icon: L.icon({
      //     iconUrl: '../../assets/icon/nano_pinpoint.png',
      //     iconSize: [23, 28],
      //   })
      // }).addTo(this.map)

      // this.map.on('click', e => {
      //   let lat = e.latlng.lat;
      //   let lng = e.latlng.lng;
      //   let address;

      //   if (this.marker) {
      //     this.map.removeLayer(this.marker)
      //   }

      //   this.marker = L.marker([lat, lng], {
      //     icon: L.icon({
      //       iconUrl: '../../assets/icon/nano_pinpoint.png',
      //       iconSize: [23, 28],
      //     })
      //   }).addTo(this.map)

      //   const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=10&q=${encodeURI(
      //     lat + ',' + lng
      //   )}&countrycodes=my`;

      //   return new Promise((resolve) => {
      //     fetch(api)
      //       .then((response) => response.json())
      //       .then((data) => {
      //         // console.log(address = data || 'Your location')
      //         this.map_location = data.features[0].properties.display_name
      //         resolve(address = data.features[0].properties.display_name || 'Your location');

      //         this.lead.lattitude = data.features[0].geometry.coordinates[1]
      //         this.lead.longtitude = data.features[0].geometry.coordinates[0]
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //       });
      //   });
      // })

    })

  }

  resetAddress() {
    this.searchAddress = ''
    this.lead.address = this.oriAddress
    this.lead.company_address = this.oriCompAddress
    this.lead.lattitude = this.oriLat
    this.lead.longtitude = this.oriLong

    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // Set marker position
      this.setMarkerPosition(this.latitude, this.longitude);
    });

  }

  setMarkerPosition(latitude: any, longitude: any) {
    // Set marker position
    this.markers = [
      {
        position: {
          lat: latitude,
          lng: longitude,
        },
        options: {
          animation: google.maps.Animation.DROP,
          draggable: true,
        },
      },
    ];

    // console.log(this.markers);

  }

  eventHandler(event: any, name: string) {
    // // console.log(event, name);
    switch (name) {
      case 'mapDblclick': // Add marker on double click event
        this.setMarkerPosition(event.latLng.lat(), event.latLng.lng())
        this.getAddress(event.latLng.lat(), event.latLng.lng());
        break;

      case 'mapDragMarker':
        break;

      case 'mapDragend':
        this.getAddress(event.latLng.lat(), event.latLng.lng());
        break;

      default:
        break;
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder
      .geocode({ location: { lat: latitude, lng: longitude } })
      .subscribe((addr: MapGeocoderResponse) => {
        if (addr.status === 'OK') {
          if (addr.results[0]) {
            this.zoom = 12;
            this.address = addr.results[0].formatted_address;
            this.lead.address = addr.results[0].formatted_address;
            this.lead.lattitude = addr.results[0].geometry.location.lat()
            this.lead.longtitude = addr.results[0].geometry.location.lng()
            // console.log(addr.results[0], addr.results[0].geometry.location.lat(), addr.results[0].geometry.location.lng());
          } else {
            this.address = ''
            window.alert('No results found');
          }
        } else {
          this.address = '';
          window.alert('Geocoder failed due to: ' + addr.status);
        }
      });
  }

  clearLatLong() {
    this.lead.lattitude = null
    this.lead.longtitude = null
  }

  // searchMap() {

  //   if (this.marker) {
  //     this.map.removeLayer(this.marker)
  //   }

  //   let api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=10&q=${encodeURI(this.lead.address)}&countrycodes=my`;

  //   if (this.lead.lattitude != null && this.lead.longtitude != null) {
  //     api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=10&q=${encodeURI(this.lead.lattitude + ',' + this.lead.longtitude)}&countrycodes=my`;
  //     // console.log('in');

  //   } else {
  //     api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=10&q=${encodeURI(this.lead.address)}&countrycodes=my`;
  //     // console.log('out');
  //   }

  //   return new Promise((resolve) => {
  //     fetch(api)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log(data || 'Your location')
  //         // // console.log(data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]);
  //         if (data.features.length == 0) {

  //           Swal.fire({
  //             icon: 'warning',
  //             title: 'Address cannnot be identify.',
  //             timer: 3000,
  //             heightAuto: false

  //           })

  //         } else {
  //           this.map.flyTo([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]])

  //           this.marker = L.marker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], {
  //             icon: L.icon({
  //               iconUrl: '../../assets/icon/nano_pinpoint.png',
  //               iconSize: [23, 28],
  //             })
  //           }).addTo(this.map)

  //           resolve(this.searchedResult = data.features[0]);

  //           this.map_location = data.features[0].properties.display_name

  //           this.lead.lattitude = data.features[0].geometry.coordinates[1]
  //           this.lead.longtitude = data.features[0].geometry.coordinates[0]
  //         }

  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   });
  // }

  // ionViewDidEnter() {
  //   if (this.map) {
  //     this.map.invalidateSize();
  //   }
  // }

  // onMapClick() {
  //   this.map.on('click', e => {
  //     // console.log(e.latlng.lat)
  //   })

  // }

  // clearMap() {
  //   if (this.marker) {
  //     this.map.removeLayer(this.marker)
  //   }
  //   this.map_location = null
  //   this.lead.lattitude = null
  //   this.lead.longtitude = null
  // }

  // searchAddress() {
  //   this.map.on('click', e => {
  //     let lat = e.latlng.lat;
  //     let lng = e.latlng.lng;
  //     let address;
  //     if (this.marker) {
  //       this.map.removeLayer(this.marker)
  //     }

  //     const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=10&q=${encodeURI(lat + ',' + lng)}&countrycodes=my`;

  //     this.marker = L.marker([lat, lng], {
  //       icon: L.icon({
  //         iconUrl: '../../assets/icon/nano_pinpoint.png',
  //         iconSize: [23, 28],
  //       })
  //     }).addTo(this.map)

  //     return new Promise((resolve) => {
  //       fetch(api)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           // console.log(address = data || 'Your location')
  //           this.map_location = data.features[0].properties.display_name
  //           resolve(address = data.features[0].properties.display_name || 'Your location');
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     });
  //   })
  // }

  // applyAddress() {
  //   this.lead.address = this.map_location
  // }

  async quotation() {
    // const modal = await this.modalController.create({
    //   component: LeadsDetailQuotationPage,
    //   cssClass: 'fullModal',
    //   componentProps: { appoint_id: this.lead.appointment_id },

    // });
    // await modal.present();

    // const { data } = await modal.onWillDismiss();
    // // console.log(data)

    // this.refresh()
    // if (data == 1) {
    //   this.refreshList()
    // }
  }
  // needApprove() {

  // }

  calcDue() {
    if (this.sales_list != null) {
      this.totalDue = this.sales_list.total - this.lead.total_price
      // console.log(this.totalDue);
    }

  }

  SEblur(x) {
    let date: string = this.datepipe.transform(new Date(x), 'dd MMM yyyy')
    // // console.log(date);

    let firstDay = new Date(date).getTime()
    let lastDay = (new Date(date).getTime() + 86400000)

    // // console.log(firstDay, lastDay);


    this.http.post('https://api.nanogapp.com/getAppointmentList', { firstDay: firstDay, lastDay: lastDay }).subscribe((s) => {
      this.appointment = s['data'].sort((a, b) => a.appointment_time - b.appointment_time)

      for (let i = 0; i < this.appointment.length; i++) {
        if (this.appointment[i].lattitude != null && this.appointment[i].longtitude != null && this.lead.lattitude != null && this.lead.longtitude != null) {
          this.appointment[i].distanceOf = this.getDistanceFromLatLonInKm(this.lead.lattitude, this.lead.longtitude, this.appointment[i].lattitude, this.appointment[i].longtitude)
        } else {
          this.appointment[i].distanceOf = null
        }
      }
      // console.log('appointment', this.appointment);

      this.appointment = lodash.chain(this.appointment).groupBy('assigned_to').map((value, key) => ({
        group: key,
        lists: value,

      })).value() || []

      // console.log('appointment_lodash', this.appointment)

      for (let i = 0; i < this.sales_exec.length; i++) {
        let temp = this.appointment

        if ((temp.filter(a => a.group == this.sales_exec[i].user_name).length)) {
          this.sales_exec[i].SElist = temp.filter(a => a.group == this.sales_exec[i].user_name)
        } else {
          this.sales_exec[i].SElist = [{ group: '', lists: [] }]
        }

        if (i + 1 == this.sales_exec.length) {
          if (this.lead.date && this.lead.time) {
            this.loading = true
          }
        }
      }

      // console.log('salec_exec', this.sales_exec);

    })

  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  // assignSales(x) {

  //   // console.log(x);

  //   if (x.SElist[0].lists.length > 0) {

  //     let pass = true

  //     for (let i = 0; i < x.SElist[0].lists.length; i++) {
  //       // 3600000 = 1 hour
  //       let up = new Date(this.lead.date + ', ' + this.lead.time).getTime() + 7000000
  //       let down = new Date(this.lead.date + ', ' + this.lead.time).getTime() - 7000000
  //       // // console.log(x.SElist[0].lists[i].appointment_time);
  //       // // console.log(up, down);

  //       if (Number(x.SElist[0].lists[i].appointment_time) >= up || Number(x.SElist[0].lists[i].appointment_time) <= down) {

  //         pass = true
  //       } else {
  //         if (this.lead.appointment_id != x.SElist[0].lists[i].appointment_id) {
  //           pass = false

  //           Swal.fire({
  //             icon: 'warning',
  //             title: "Warning",
  //             text: "Appointment made matched existing appointment time within TWO(2) hours. Enter 'YES' to continue assign",
  //             input: 'text',
  //             heightAuto: false,
  //             showCancelButton: true,
  //             showConfirmButton: true,
  //             cancelButtonText: 'Cancel',
  //             confirmButtonText: 'Continue Assign',
  //             reverseButtons: true,
  //             cancelButtonColor: '#ff0000',
  //           }).then(a => {

  //             if (a.isConfirmed && a.value == 'YES') {
  //               this.keywordSalesExec = x.user_name

  //               const Toast = Swal.mixin({
  //                 toast: true,
  //                 position: 'top',
  //                 showConfirmButton: false,
  //                 timer: 2500,
  //                 timerProgressBar: true,
  //               })

  //               Toast.fire({
  //                 icon: 'info',
  //                 title: 'Sales Executive Assigned.'
  //               })
  //             } else if (a.isConfirmed && a.value != 'YES') {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: "Error",
  //                 text: "Enter 'YES' to continue assign",
  //                 heightAuto: false,
  //                 showCancelButton: false,
  //               })
  //             }

  //           })
  //           break

  //           // Swal.fire({
  //           //   icon: 'error',
  //           //   title: 'Appointment made should be prior/after TWO(2) hours of any existing appointment',
  //           //   heightAuto: false
  //           // })
  //           // pass = false
  //           // break
  //         }

  //       }

  //     }

  //     if (pass) {
  //       this.keywordSalesExec = x.user_name

  //       const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top',
  //         showConfirmButton: false,
  //         timer: 2500,
  //         timerProgressBar: true,
  //       })

  //       Toast.fire({
  //         icon: 'info',
  //         title: 'Sales Executive Assigned.'
  //       })
  //     }

  //   } else {
  //     this.keywordSalesExec = x.user_name

  //     const Toast = Swal.mixin({
  //       toast: true,
  //       position: 'top',
  //       showConfirmButton: false,
  //       timer: 2500,
  //       timerProgressBar: true,
  //     })

  //     Toast.fire({
  //       icon: 'info',
  //       title: 'Sales Executive Assigned.'
  //     })

  //   }

  // }

  selectLabel(x, y) {
    if (y == 'main') {
      this.selectedMainLabel = x
      this.label_sub_list = this.label_list.filter(a => (a.main == false && a.category == this.selectedMainLabel)).sort((a, b) => a.name - b.name)
    } else {
      this.selectedSubLabel = x
    }
  }

  openPic(x) {
    this.openPicture = true

    this.img = x
    // console.log(this.img);
  }

  closePic() {
    this.openPicture = false
  }

  handleIssues(x) {
    if (x != '' && x != null) {
      if (this.lead.issues == null) {
        this.lead.issues = []
      }
      this.lead.issues.push(x)
    }
    this.issuesText = ''

  }

  onKeydown(event) {
    event.preventDefault();
  }

  issuesSplice(x) {
    this.lead.issues.splice(this.lead.issues.indexOf(x), 1)
  }

  condis(x) {

    if (((x || '').toString()).substring(0, 1) == '+') {
      return x.substring(1, x.length)
    } else if (((x || '').toString()).substring(0, 1) == '6') {
      return x
    } else if (((x || '').toString()).substring(0, 1) == '0') {
      return '6' + x
    } else {
      return '60' + x
    }
  }

  focus(x, selection) {
    // // console.log(x,selection);

    if (x) {
      eval(selection + '= true')
    } else {
      setTimeout(() => {
        eval(selection + '= false')
      }, 100);
    }
  }

  selected(x, keyword, item) {
    eval(keyword + '= x')
    eval(item + '=' + keyword)

    if (keyword == 'this.keywordState') {
      this.stateSelected()
    }

  }

  selectedAdsChannel(x, keyword, item) {
    eval(keyword + '= x.name')
    eval(item + '=' + x.id)
  }

  filterer(x, keyword) {
    return x ? x.filter(a => (a || '').toLowerCase().includes(eval(keyword).toLowerCase())) : []
  }

  filtererUsername(x, keyword) {
    return x ? x.filter(a => (a.user_name || '').toLowerCase().includes(eval(keyword).toLowerCase())) : []
  }

  filtererName(x, keyword) {
    return x ? x.filter(a => (a.name || '').toLowerCase().includes(eval(keyword).toLowerCase())) : []
  }

  stateSelected() {
    this.keywordCity = ''
    this.lead.city = ''
    this.city = this.share.statecity[this.lead.customer_state]
    // console.log(this.city);
  }

  emailValidator(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email) {
      return re.test(String(email).toLowerCase());
    }
  }

  // Lead
  updateLead() {

    if (this.lead.customer_name == null || this.lead.customer_name == '') {
      this.errorField('Customer Name')
    } else if (this.lead.customer_phone == null || this.lead.customer_phone == '') {
      this.errorField('Customer Phone')
    }
    // else if (!this.lead.customer_email) {
    //   this.errorField('Customer Email')
    // }
    else if (this.lead.customer_email && !this.emailValidator(this.lead.customer_email)) {
      Swal.fire({
        icon: 'error',
        title: "Error!",
        text: "Email format is invalid (Eg. Johndoe@mail.com)",
        heightAuto: false
      })
    }
    // else if (this.lead.customer_state == null || this.lead.customer_state == '') {
    //   this.errorField('State')
    // } else if (this.lead.customer_city == null || this.lead.customer_city == '') {
    //   this.errorField('City')
    // } else if (this.lead.services == null || this.lead.services == '') {
    //   this.errorField('Services')
    // } else if (this.lead.issues.length <= 0) {
    //   this.errorField('Issues')
    // } else if (this.lead.address == null || this.lead.address == '') {
    //   this.errorField('Address')
    // } 
    else if (this.tempRemark == null || this.tempRemark == '') {
      this.errorField('Remark')
    }
    else {

      this.lead.services = this.keywordServices
      this.lead.channel = this.keywordChannel
      this.lead.ads = this.keywordAds
      this.lead.state = this.keywordState
      this.lead.city = this.keywordCity
      this.lead.gender = this.keywordGender
      this.lead.race = this.keywordRace
      this.lead.customer_phone = this.condis(this.lead.customer_phone)
      // let salesCoor = this.sales_coor
      let label_main = this.label_list.filter(a => a.name == this.selectedMainLabel)[0].id
      let label_sub = this.label_list.filter(a => a.name == this.selectedSubLabel)[0].id

      // if (this.lead.remark_json != null) {
      //   this.lead.remark_json.push({ remark: this.lead.remark, date: new Date().getTime() })
      // } else {
      //   this.lead.remark_json = [{ remark: this.lead.remark, date: new Date().getTime() }]
      // }

      // if (this.keywordSalesCoord != null && this.keywordSalesCoord != '') {
      // this.lead.coordinator = salesCoor.filter(a => a.name = this.keywordSalesCoord)[0]['uid']
      // }

      // console.log(this.lead);

      Swal.fire({
        icon: 'question',
        title: "Update Lead",
        text: "Are you sure to update this lead?",
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        cancelButtonColor: '#ff0000',
      }).then(a => {

        if (a.isConfirmed) {

          if (this.lead.remark_json != null) {
            this.lead.remark_json.push({ remark: this.tempRemark, date: new Date().getTime() })
          } else {
            this.lead.remark_json = [{ remark: this.tempRemark, date: new Date().getTime() }]
          }


          this.http.post('https://api.nanogapp.com/updateLeadDetail', {
            name: this.lead.customer_name, email: this.lead.customer_email, phone: this.lead.customer_phone, state: this.lead.customer_state,
            city: this.lead.customer_city, address: this.lead.address, company_add: this.lead.company_address, saleexec_note: this.lead.saleexec_note,
            remark_json: JSON.stringify(this.lead.remark_json), ads: this.lead.ads, channel: this.lead.channel, services: this.lead.services, uid: this.userid,
            issues: JSON.stringify(this.lead.issues), lattitude: this.lead.lattitude, longtitude: this.lead.longtitude, status: this.lead.status, id: this.lead.lead_id,
            label_m: label_main, label_s: label_sub, gender : this.lead.gender, race : this.lead.race, title: this.lead.customer_title
          }).subscribe((s) => {

            Swal.fire({
              icon: 'success',
              title: 'Lead Updated Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.refresh()
          })
        }

      })

    }
  }

  // Appointment
  // checkAppointment(x) {
  //   // console.log(x);

  //   if (x.SElist[0].lists.length > 0) {

  //     let pass = true

  //     for (let i = 0; i < x.SElist[0].lists.length; i++) {
  //       // 3600000 = 1 hour
  //       let up = new Date(this.lead.date + ', ' + this.lead.time).getTime() + 7000000
  //       let down = new Date(this.lead.date + ', ' + this.lead.time).getTime() - 7000000
  //       // console.log(x.SElist[0].lists[i].appointment_time);
  //       // console.log(up, down);

  //       if (Number(x.SElist[0].lists[i].appointment_time) >= up || Number(x.SElist[0].lists[i].appointment_time) <= down) {

  //         // console.log('yes');
  //         pass = true
  //       } else {
  //         if (this.lead.appointment_id != x.SElist[0].lists[i].appointment_id) {
  //           Swal.fire({
  //             icon: 'warning',
  //             title: "Warning",
  //             text: "Appointment made should be prior/after TWO(2) hours of any existing appointment, 'Continue' to ignore this warning",
  //             heightAuto: false,
  //             showCancelButton: true,
  //             showConfirmButton: true,
  //             cancelButtonText: 'Cancel',
  //             confirmButtonColor: 'Continue Assign',
  //             reverseButtons: true,
  //             cancelButtonColor: '#ff0000',
  //           }).then(a => {

  //             if (a.isConfirmed) {
  //               // console.log('yes');
  //               pass = true
  //             } else {
  //               pass = false
  //               // break
  //             }

  //           })
  //           // Swal.fire({
  //           //   icon: 'error',
  //           //   title: 'Appointment made should be prior/after TWO(2) hours of any existing appointment',
  //           //   heightAuto: false
  //           // })
  //           // pass = false
  //           // break
  //         }

  //       }

  //     }

  //     if (pass) {
  //       this.keywordSalesExec = x.user_name
  //       this.updateAppointment()
  //     }

  //   } else {
  //     this.keywordSalesExec = x.user_name
  //     this.updateAppointment()

  //   }
  // }

  updateAppointment() {
    // , 'lattitude', 'longitude'
    // // console.log(this.keywordSalesExec);

    // this.lead.assigned_to = this.sales_exec.filter(a => a.user_name == this.keywordSalesExec)[0].uid

    if ((['address', 'date', 'time']).every(a => (this.lead[a] != null && this.lead[a] != ''))) {
      // let format = !Math.floor(parseInt(this.lead.time.split(':')[0]) / 12) ? 'AM' : 'PM'
      // let date = this.datepipe.transform(new Date(this.lead.date), 'MM/dd/yyyy')
      // let time = parseInt(this.lead.time.split(':')[0]) % 12 + ':' + this.lead.time.split(':')[1] + ':00' + format

      let appointment_time = new Date(this.lead.date + ', ' + this.lead.time).getTime()

      // console.log(this.lead);

      Swal.fire({
        icon: 'question',
        title: "Update Appointment",
        text: "Are you sure to update this appointment?",
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        cancelButtonColor: '#ff0000',
      }).then(a => {

        // console.log(this.lead)

        if (a.isConfirmed) {

          this.http.post('https://api.nanogapp.com/updateLeadAppointmentforapp', {
            sales_exec_note: this.lead.saleexec_note, remark: this.lead.remark, address: this.lead.address,
            lattitude: this.lead.lattitude, longtitude: this.lead.longtitude, id: this.lead.lead_id, assigned_to4: JSON.stringify(this.userid),
            status: this.lead.appointment_status, appointment_time: appointment_time, uid : this.userid, kiv : this.lead.kiv
          }).subscribe((s) => {
            this.socket.emit('callUpdate', 'fromClient');
            if (this.lead.label_s == 'Pending Appointment Date') {

              this.http.post('https://api.nanogapp.com/updateSubLabel', {
                id: this.lead.lead_id, label_s: 11, uid: this.userid
              }).subscribe((s) => {

                Swal.fire({
                  icon: 'success',
                  title: 'Appointment Updated Successfully',
                  timer: 2000,
                  heightAuto: false

                })

                this.refresh()
              })

            } else {
              Swal.fire({
                icon: 'success',
                title: 'Appointment Updated Successfully',
                timer: 2000,
                heightAuto: false

              })

              this.refresh()
            }


          })
        }

      })

    } else {
      Swal.fire({
        icon: 'error',
        title: "Error!",
        text: "Sales Executive / Date / Time is required.",
        heightAuto: false
      })
    }
  }

  errorField(x) {
    Swal.fire({
      icon: 'error',
      title: "Error!",
      text: "Field '" + x + "' cannot be empty.",
      heightAuto: false
    })
  }

  close() {
    if (this.fromPage == 1) {
      this.nav.navigateBack('tabs-leads')
    } else if (this.fromPage == 2) {
      this.nav.navigateBack('tabs-calendar')

    }
  }

  // Payment
  // async toUploadInvoice(x, y, z) {
  //   let tempReceipt = z.receipt
  //   const modal = await this.modalController.create({
  //     component: LeadsDetailReceiptPage,
  //     cssClass: 'fullModal',
  //     componentProps: { receipts: tempReceipt },

  //   });
  //   await modal.present();

  //   const { data } = await modal.onWillDismiss();
  //   // console.log(data)

  //   // this.refresh()
  //   if (data != null) {
  //     this.updateApprovalAcc(x, y, z, data)
  //   } else {
  //     this.refresh()
  //   }

  // }

  updateApprovalAcc(x, y, z, receiptArr) {

    if (x == 'ac') {
      z.ac_approval = y
    } else {
      z.sc_approval = y
    }

    // console.log(z);
    this.http.post('https://api.nanogapp.com/updatePaymentReceipt', { receipt: JSON.stringify(receiptArr), payment_id: z.id }).subscribe((s) => {
    })

    this.http.post('https://api.nanogapp.com/updateApproval', { role: x, approval: y, id: z.id }).subscribe((s) => {

      if (this.totalDue <= 0 && this.payment_list.every(a => a.ac_approval == 'Approved') && this.payment_list.every(a => a.sc_approval == 'Approved')) {
        // console.log('in');

        this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
          payment_status: 'Completed', id: this.sales_list.id
        }).subscribe((s) => {

          Swal.fire({
            icon: 'success',
            title: 'Payment Status Updated Successfully',
            timer: 2000,
            heightAuto: false

          })

          this.refresh()
        })

      } else {
        // console.log('out');
        this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
          payment_status: 'Pending', id: this.sales_list.id
        }).subscribe((s) => {

          Swal.fire({
            icon: 'success',
            title: 'Payment Status Updated Successfully',
            timer: 2000,
            heightAuto: false

          })

          this.refresh()
        })
      }

    })

  }

  checkPdf(x) {
    window.open(x, '_blank');
  }

  updateApproval(x, y, z) {

    let word = ''

    if (y == 'Approved') {
      word = 'Approve'
    } else {
      word = 'Reject'
    }

    Swal.fire({
      icon: 'question',
      title: word + " Payment",
      text: "Are you sure to '" + word + "' this payment?",
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirm',
      reverseButtons: true,
      cancelButtonColor: '#ff0000',
    }).then(a => {

      if (a.isConfirmed) {

        // console.log(z);

        if (y == 'Approved') {

          this.updateApproval2(x, y, z, '')

        } else {

          Swal.fire({
            icon: 'info',
            title: "Remark Needed",
            text: "Remark is needed on rejecting approval",
            input: 'text',
            heightAuto: false,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Submit',
            reverseButtons: true,
            cancelButtonColor: '#ff0000',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(a => {

            if (a.isConfirmed && a.value != '') {

              this.updateApproval2(x, y, z, a.value)

            } else if (a.isConfirmed && a.value == '') {
              Swal.fire({
                icon: 'error',
                title: "Error",
                text: "Remark cannot be empty.",
                heightAuto: false,
                showCancelButton: false,
              })
            }

          })
        }
      }
    })
  }

  updateApproval2(x, y, z, remark) {

    if (x == 'ac') {
      z.ac_approval = y
    } else {
      z.sc_approval = y
    }

    if (x == 'ac') {

      this.http.post('https://api.nanogapp.com/updateApproval', { role: x, approval: y, id: z.id, remark_ac_reject: remark, remark_sc_reject: z.remark_sc_reject }).subscribe((s) => {

        if (this.totalDue <= 0 && this.payment_list.every(a => a.ac_approval == 'Approved') && this.payment_list.every(a => a.sc_approval == 'Approved')) {
          // console.log('in');

          this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
            payment_status: 'Completed', id: this.sales_list.id
          }).subscribe((s) => {

            Swal.fire({
              icon: 'success',
              title: 'Payment Status Updated Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.refresh()
          })

        } else {
          // console.log('out');

          this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
            payment_status: 'Pending', id: this.sales_list.id
          }).subscribe((s) => {

            Swal.fire({
              icon: 'success',
              title: 'Payment Status Updated Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.refresh()
          })
        }

      })
    } else {

      this.http.post('https://api.nanogapp.com/updateApproval', { role: x, approval: y, id: z.id, remark_ac_reject: z.remark_ac_reject, remark_sc_reject: remark }).subscribe((s) => {

        if (this.totalDue <= 0 && this.payment_list.every(a => a.ac_approval == 'Approved') && this.payment_list.every(a => a.sc_approval == 'Approved')) {
          // console.log('in');

          this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
            payment_status: 'Completed', id: this.sales_list.id
          }).subscribe((s) => {

            Swal.fire({
              icon: 'success',
              title: 'Payment Status Updated Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.refresh()
          })

        } else {
          // console.log('out');

          this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
            payment_status: 'Pending', id: this.sales_list.id
          }).subscribe((s) => {

            Swal.fire({
              icon: 'success',
              title: 'Payment Status Updated Successfully',
              timer: 2000,
              heightAuto: false

            })

            this.refresh()
          })
        }

      })
    }
  }

  // Tasklist
  addTask(x) {
    // console.log(x);

    let temp = {
      task: "",
      created_date: new Date().getTime()
    }

    x.push(temp)
    // console.log(x);
    // setTimeout(() => {
    //   this.myContent.scrollToBottom(0);
    // }, 50);

  }

  deleteTask(x, y) {
    // console.log(x, y);

    Swal.fire({
      title: 'Delete Task',
      text: "This task will be delete, are you sure?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        const index: number = x.indexOf(y);
        if (index !== -1) {
          x.splice(index, 1);
        }
        // console.log(x);
      }
    })

  }

  submitTaskList() {

    // console.log(this.sales_package);

    let pass = true
    let temp = this.sales_package.map(a => ({ task: a.task, sap_id: a.sap_id, from_date: a.from_date }))
    // console.log(temp);

    // for (let i = 0; i < this.sales_package.length; i++) {
    //   if (this.sales_package[i].task == null || this.sales_package[i].task == '') {
    //     pass = false

    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Tasklist of "' + this.sales_package[i].place + '" is empty.',
    //       heightAuto: false
    //     })

    //     break
    //   } else {

    //     for (let j = 0; j < this.sales_package[i].task.length; j++) {

    //       if (this.sales_package[i].task[j].task == null || this.sales_package[i].task[j].task == '') {
    //         pass = false

    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Field No.' + (j + 1) + ' in "' + this.sales_package[i].place + '" is empty.',
    //           heightAuto: false
    //         })

    //         break
    //       }
    //       // else if (this.sales_package[i].task[j].from_date == null || this.sales_package[i].task[j].from_date == '') {
    //       //   pass = false

    //       //   Swal.fire({
    //       //     icon: 'error',
    //       //     title: 'Field installation time in "' + this.sales_package[i].place + '" is empty.',
    //       //     heightAuto: false
    //       //   })

    //       //   break
    //       // }

    //     }
    //   }
    // }

    if (this.keywordCompany == '' || this.keywordCompany == null) {

      pass = false

      Swal.fire({
        icon: 'error',
        title: 'Company Field cannot be empty',
        heightAuto: false
      })

    } else if (this.company_list.filter(a => a.name == this.keywordCompany).length <= 0) {
      pass = false

      Swal.fire({
        icon: 'error',
        title: 'Sub-con selection does not match any existing company.',
        heightAuto: false
      })

    }

    if (pass) {

      Swal.fire({
        title: 'Submit Tasklist',
        text: "Assign this tasklist to '" + this.keywordCompany + "' ?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        reverseButtons: true,
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          // this.http.post('https://api.nanogapp.com/updateTask', { task: JSON.stringify(temp) }).subscribe(s => {

          if (this.sales_list.subcon_choice.length == 0 || (this.sales_list.subcon_choice.at(-1).company == this.keywordCompany && this.sales_list.subcon_state == 'Pending') || this.sales_list.subcon_state == 'Rejected') {
            this.sales_list.subcon_choice.push({ company: this.keywordCompany, date: new Date().getTime() })
            this.http.post('https://api.nanogapp.com/updateSalesSub', { choice: JSON.stringify(this.sales_list.subcon_choice), state: 'Pending', pending_subcon: this.keywordCompany, id: this.lead.appointment_id }).subscribe(s => {
            })

            Swal.fire({
              icon: 'success',
              title: 'Tasklist Updated!',
              timer: 2000,
              heightAuto: false
            })

            this.refresh()

          } else {

            Swal.fire({
              title: 'Submit Tasklist',
              text: "Tasklist assigned to '" + this.sales_list.pending_subcon + "', still waiting for response. \n\nOverwrite sub-con selection to '" + this.keywordCompany + "' ?",
              icon: 'warning',
              showCancelButton: true,
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirm',
              reverseButtons: true,
              heightAuto: false
            }).then((result) => {
              if (result.isConfirmed) {

                this.sales_list.subcon_choice.push({ company: this.keywordCompany, date: new Date().getTime() })
                this.http.post('https://api.nanogapp.com/updateSalesSub', { choice: JSON.stringify(this.sales_list.subcon_choice), state: 'Pending', pending_subcon: this.keywordCompany, id: this.lead.appointment_id }).subscribe(s => {
                })

                Swal.fire({
                  icon: 'success',
                  title: 'Tasklist Updated!',
                  timer: 2000,
                  heightAuto: false
                })

                this.refresh()
              }
            })

          }
          // else if () {
          //   this.sales_list.subcon_choice.push({ company: this.keywordCompany, date: new Date().getTime() })
          //   this.http.post('https://api.nanogapp.com/updateSalesSub', { choice: JSON.stringify(this.sales_list.subcon_choice), state: 'Pending', pending_subcon: this.keywordCompany, id: this.lead.appointment_id }).subscribe(s => {
          //   })
          //   // console.log('2');
          // }


          // })
        }
      })

    }

  }

  deletePic(x) {


    let tempPhoto = JSON.stringify(this.lead.sc_photo)

    Swal.fire({
      icon: 'question',
      title: "Delete Photo",
      text: "Are you sure to delete this photo?",
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      cancelButtonColor: '#ff0000',
    }).then(a => {

      if (a.isConfirmed) {
        this.lead.sc_photo.splice(x, 1)
        // console.log(this.lead.sc_photo);

        this.http.post('https://api.nanogapp.com/updateLeadScPhoto', { sc_photo: tempPhoto, id: this.lead.lead_id }).subscribe((s) => {

          const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          })

          Toast.fire({
            icon: 'success',
            title: 'Photo Deleted.'
          })

        })
      }

    })
  }

  imagectype;
  imagec;
  base64img;

  fileChange(event, name, maxsize) {
    // console.log(this.lead);
    const files = event.target.files;

    for(let i = 0; i< files.length ; i++)
    {

    if (event.target.files && event.target.files[i] && event.target.files[i].size < 10485768) {
      // this.imagectype = event.target.files[0].type;
      // EXIF.getData(event.target.files[0], () => {
      // // console.log(event.target.files[0]);
      //  // console.log(event.target.files[0].exifdata.Orientation);
      //  const orientation = EXIF.getTag(this, 'Orientation');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const thisImage = new Image;

      const maxW = maxsize;
      const maxH = maxsize;
      thisImage.onload = (a) => {
        // // console.log(a);
        const iw = thisImage.width;
        const ih = thisImage.height;
        const scale = Math.min((maxW / iw), (maxH / ih));
        const iwScaled = iw * scale;
        const ihScaled = ih * scale;
        can.width = iwScaled;
        can.height = ihScaled;
        ctx.save();
        // const width = can.width; const styleWidth = can.style.width;
        // const height = can.height; const styleHeight = can.style.height;
        // // console.log(event.target.files[0]);
        ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
        ctx.restore();
        this.imagec = can.toDataURL();
        // const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
        // const imgarr = imgggg.split('thisisathingtoreplace;');
        // this.base64img = imgarr[1];
        // event.target.value = '';
        this.lead['sc_photo'] ? this.lead['sc_photo'].push('https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif') : this.lead['sc_photo'] = ['https://i.pinimg.com/originals/a2/dc/96/a2dc9668f2cf170fe3efeb263128b0e7.gif'];

        // this.http.post('https://forcar.vsnap.my/upload', { image: this.imagec, folder: 'goalgame', userid: Date.now() }).subscribe((link) => {
        //   // console.log(link['imageURL']);
        //   this.lead['sc_photo'][this.lengthof(this.lead['sc_photo']) - 1] = link['imageURL']
        //   // console.log(this.lead['sc_photo']);

        //   let tempPhoto = JSON.stringify(this.lead.sc_photo)
        //   this.http.post('https://api.nanogapp.com/updateLeadScPhoto', { sc_photo: tempPhoto, id: this.lead.lead_id }).subscribe((s) => {
        //   })

        // });

        this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nano', userid: 'NanoGApp' }).subscribe((link) => {
            // // console.log(link['imageURL']);
            this.lead['sc_photo'][this.lengthof(this.lead['sc_photo']) - 1] = link['imageURL']
            // // console.log(this.lead['sc_photo']);
  
            let tempPhoto = JSON.stringify(this.lead.sc_photo)
            this.http.post('https://api.nanogapp.com/updateLeadScPhoto', { sc_photo: tempPhoto, id: this.lead.lead_id }).subscribe((s) => {
            })
          });
      };
      thisImage.src = URL.createObjectURL(event.target.files[i]);

    } else {
      // S.close();
      Swal.fire({
        text: 'Your Current Image Too Large, ' + event.target.files[i].size / (1024102.4) + 'MB! (Please choose file lesser than 8MB',
        heightAuto : false,
        icon : 'info',
      })
      // alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
    }
  }
  }

  fileChange2(event, maxsize) {
    return new Promise((resolve, reject) => {
      const files = event.target.files;

      for(let i = 0; i< files.length ; i++)
      {
        Swal.fire({
          title: 'processing...',
          text: 'Larger size of image may result in a longer upload time.',
          icon: 'info',
          heightAuto: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        })
      if (event.target.files && event.target.files[i]) {
        this.imagectype = event.target.files[i].type;
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          const thisImage = new Image;
          const maxW = maxsize;
          const maxH = maxsize;
          thisImage.onload = (a) => {

            // console.log(a);
            const iw = thisImage.width;
            const ih = thisImage.height;
            const scale = Math.min((maxW / iw), (maxH / ih));
            const iwScaled = iw * scale;
            const ihScaled = ih * scale;
            can.width = iwScaled;
            can.height = ihScaled;
            ctx.save();

            ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
            ctx.restore();

            this.imagec = can.toDataURL();
            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.lead['sc_photo'][this.lengthof(this.lead['sc_photo']) - 1] = res['imageURL']
              let tempPhoto = JSON.stringify(this.lead.sc_photo)
              this.http.post('https://api.nanogapp.com/updateLeadScPhoto', { sc_photo: tempPhoto, id: this.lead.lead_id }).subscribe((s) => {
              })
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              // console.log('run here 3')
              reject(awe)
            })


          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
        // });
      } 
    }

    })
  }

  lengthof(x) {
    return x ? x.length : 0
  }

  clear(){
    // console.log(this.searchElementRef.nativeElement.value)
    this.searchElementRef.nativeElement.value = ''
  }

  back(){
    this.nav.navigateBack('lead-task?uid=' + this.userid)
  }

  platformType(){
    return this.platform.platforms()
  }

}