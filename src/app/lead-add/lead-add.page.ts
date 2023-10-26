import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ShareServiceService } from '../share-service.service';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-lead-add',
  templateUrl: './lead-add.page.html',
  styleUrls: ['./lead-add.page.scss'],
})
export class LeadAddPage implements OnInit {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;



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


  keywordServices = ''
  keywordChannel = ''
  keywordAds = ''
  keywordSalesAdmin = ''
  keywordSalesCoord = ''
  keywordState = ''
  keywordCity = ''
  keywordTitle = ''
  selectionServices = false
  selectionChannel = false
  selectionAds = false
  selectionSalesAdmin = false
  selectionSalesCoord = false
  selectionState = false
  selectionCity = false
  selectionTitle = false
  issuesText = ''
  lead = [] as any

  ads_list = [] as any
  channel_list = [] as any
  sales_coor = [] as any
  services_list = ['Waterproofing', 'Antislip', 'Waterproofing & Antislip'] as any

  // map;
  tiles;
  marker
  map_location
  searchedResult = [] as any

  city = []
  state = ['Kuala Lumpur', 'Selangor', 'Johor', 'Kedah', 'Kelantan', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Putrajaya', 'Sabah', 'Sarawak', 'Terengganu']
  userid
  leadid
  user = {} as any


  keywordGender = ''
  selectionGender = false
  gender = ['Male', 'Female']
  keywordRace = ''
  selectionRace = false
  race = ['Malay', 'Chinese', 'India', 'Others']
  title = ['Mr', 'Mrs', 'Miss', 'Ms', 'Datuk', 'Datuk Seri', 'Dr', 'Tan Sri', 'Tun']


  constructor(private nav: NavController,
    private http: HttpClient,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private share: ShareServiceService,
    private ngZone: NgZone, private geoCoder: MapGeocoder,
    private socket: Socket,
    private platform: Platform
  ) { }


  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    // Align search box to center
    // this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(
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
        this.lead.comp_address = place.name
        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        this.lead.lattitude = this.latitude
        this.lead.longtitude = this.longitude
        // Set marker position
        this.setMarkerPosition(this.latitude, this.longitude);

        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      });
    });
  }

  ngOnInit() {
    this.socket.connect();

    this.lead.issues = []

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

    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']

      this.http.post('https://api.nanogapp.com/getSalesExec', { uid: this.userid }).subscribe((s) => {
        // console.log(s['data'].user_name)
        this.user = s['data']
      })
    })

    this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Coordinator' }).subscribe((s) => {
      this.sales_coor = s['data']
      // console.log('sales_coor', this.sales_coor);

    })


    this.http.get('https://api.nanogapp.com/getAds').subscribe((s) => {
      this.ads_list = s['data']
      // console.log('ads', this.ads_list);
    })

    this.http.get('https://api.nanogapp.com/getChannel').subscribe((s) => {
      this.channel_list = s['data']
      // console.log('channel', this.channel_list);
    })
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

  back() {
    this.nav.navigateBack('lead-task?uid=' + this.userid)
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
    if (x) {
      eval(selection + '= true')
    } else {
      setTimeout(() => {
        eval(selection + '= false')
      }, 150);
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
    return x ? x.filter(a => ((a || '')).toLowerCase().includes((eval(keyword)).toLowerCase())) : []
  }

  filtererSalesCoord(x, keyword) {
    return x ? x.filter(a => ((a.user_name || '')).toLowerCase().includes((eval(keyword)).toLowerCase())) : []
  }

  filtererAdsChannel(x, keyword) {
    return x ? x.filter(a => ((a.name || '')).toLowerCase().includes((eval(keyword)).toLowerCase())) : []
  }

  stateSelected() {
    this.keywordCity = ''
    this.lead.city = ''
    this.city = this.share.statecity[this.lead.state]
    // console.log(this.city);
  }

  handleIssues(x) {
    if (x != '' && x != null) {
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

  createLead() {
    // console.log(this.lead.phone);

    this.lead.phone = this.condis(this.lead.phone)
    this.lead.services = this.keywordServices
    this.lead.coordinator = null
    this.lead.remark_json = [{ remark: this.lead.remark, date: new Date().getTime() }]
    this.lead.channel = this.keywordChannel
    this.lead.ads = this.keywordAds
    this.lead.state = this.keywordState
    this.lead.city = this.keywordCity
    let salesCoor = this.sales_coor
    let salesCoor2 = this.sales_coor

    if (this.lead.name == null || this.lead.name == '') {
      this.errorField('Customer Name')
    } else if (this.lead.phone == null || this.lead.phone == '') {
      this.errorField('Customer Phone')
    }
    // else if (this.lead.state == null || this.lead.state == '') {
    //   this.errorField('State')
    // } else if (this.lead.city == null || this.lead.city == '') {
    //   this.errorField('City')
    // }
    else if (this.lead.remark == null || this.lead.remark == '') {
      this.errorField('Remark')
    }

    else {
      // // console.log(this.lead);

      // Swal.fire({
      //   icon: 'question',
      //   title: "Create New Lead",
      //   text: "Are you sure to create new lead?",
      //   heightAuto: false,
      //   showCancelButton: true,
      //   showConfirmButton: true,
      //   reverseButtons: true,
      //   cancelButtonColor: '#ff0000',
      // }).then(a => {

      //   if (a.isConfirmed) {

      //     // console.log(this.userid)

      //     this.http.post('https://api.nanogapp.com/createLead', {
      //       created: this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'), name: this.lead.name, email: this.lead.email, phone: this.lead.phone,
      //       city: this.lead.city, state: this.lead.state, address: this.lead.address, comp_address: this.lead.comp_address, sales_note: null,
      //       remark_json: JSON.stringify(this.lead.remark_json), ads: this.lead.ads, channel: null, admin: null, services: this.lead.services, sales_exec : this.userid, created_by : this.userid,
      //       issues: JSON.stringify(this.lead.issues), lattitude: this.lead.lattitude, longitude: this.lead.longtitude, coordinator: this.lead.coordinator, status: true, label_m: 48, label_s: 2, race : this.lead.race,
      //       gender: this.lead.gender, sc_photo: JSON.stringify([]), title : this.lead.customer_title
      //     }).subscribe((s) => {

      //       // console.log(s)
      //       this.leadid = s['data']

      //       Swal.fire({
      //         icon: 'success',
      //         title: 'New Lead Created Successfully',
      //         timer: 3000,
      //         heightAuto: false

      //       })
      //       this.socket.emit('callUpdate', 'fromClient');
      //       // this.socket.fromEvent('usersActivity').subscribe(message => {
      //       //   // console.log(message)
      //       // });
      //       this.goLeadDetail()
      //     })
      //   }

      // })

      this.http.post('https://api.nanogapp.com/checkDuplicatePhone', { customer_phone: this.lead.phone }).subscribe((s) => {
        // console.log(s['data']);

        if (s['data'].length > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Phone Detected',
            html: "Duplicated customer name '" + s['data'][0].customer_name + "'.<br>Enter 'YES' to continue lead creation.",
            // text: "Are you sure to retrieve back this lead?\n Enter 'YES' to continue this action.",
            input: 'text',
            heightAuto: false,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Create Lead',
            reverseButtons: true,
            cancelButtonColor: '#ff0000',
          }).then(a => {

            if (a.isConfirmed && a.value == 'YES') {

              let userarray = [] as any
              userarray.push(this.userid)

              this.http.post('https://api.nanogapp.com/createLead', {
                // name: this.lead.name, phone: this.lead.phone, email: this.lead.email, state: this.lead.state,
                // address: this.lead.address, role: this.lead.usertype, emp_id: this.lead.empid, login_id: this.lead.login_id,
                // password: this.lead.password, active: null, status: true, created_at: this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                // profile_image: null, uid: '', branch: this.lead.branch
                created: this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'), name: this.lead.name, email: this.lead.email, phone: this.lead.phone,
                city: this.lead.city, state: this.lead.state, address: this.lead.address, comp_address: this.lead.comp_address, sales_note: this.lead.sales_note,
                remark_json: JSON.stringify(this.lead.remark_json), ads: this.lead.ads, channel: this.lead.channel, admin: null, services: this.lead.services, 
                issues: JSON.stringify(this.lead.issues), lattitude: this.lead.lattitude, longitude: this.lead.longtitude, coordinator: this.lead.coordinator, status: true, label_m: 48, label_s: 2,
                sc_photo: JSON.stringify(this.lead.sc_photo), race: this.lead.race, gender: this.lead.gender, created_by : this.userid, title: this.lead.customer_title, verified: true, customer_unit: this.lead.customer_unit,
                sales_exec : JSON.stringify(userarray)
              }).subscribe((s) => {
                this.socket.emit('callUpdate', 'fromClient');

                // console.log(s['data'])
                this.leadid = s['data']

                Swal.fire({
                  icon: 'success',
                  title: 'New Lead Created Successfully',
                  timer: 3000,
                  heightAuto: false

                })
                // this.close()
                this.socket.emit('callUpdate', 'fromClient');
            this.goLeadDetail()

              })

            } else if (a.isConfirmed && a.value != 'YES') {
              Swal.fire({
                icon: 'error',
                title: "Error",
                text: "Enter 'YES' to continue action",
                heightAuto: false,
                showCancelButton: false,
              })
            }

          })

        } else {
          Swal.fire({
            icon: 'question',
            title: "Create New Lead",
            text: "Are you sure to create new lead?",
            heightAuto: false,
            showCancelButton: true,
            showConfirmButton: true,
            reverseButtons: true,
            cancelButtonColor: '#ff0000',
          }).then(a => {

            let userarray = [] as any
            userarray.push(this.userid)

            if (a.isConfirmed) {

              this.http.post('https://api.nanogapp.com/createLead', {
                // name: this.lead.name, phone: this.lead.phone, email: this.lead.email, state: this.lead.state,
                // address: this.lead.address, role: this.lead.usertype, emp_id: this.lead.empid, login_id: this.lead.login_id,
                // password: this.lead.password, active: null, status: true, created_at: this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                // profile_image: null, uid: '', branch: this.lead.branch
                created: this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'), name: this.lead.name, email: this.lead.email, phone: this.lead.phone,
                city: this.lead.city, state: this.lead.state, address: this.lead.address, comp_address: this.lead.comp_address, sales_note: this.lead.sales_note,
                remark_json: JSON.stringify(this.lead.remark_json), ads: this.lead.ads, channel: this.lead.channel, admin: null, services: this.lead.services,
                issues: JSON.stringify(this.lead.issues), lattitude: this.lead.lattitude, longitude: this.lead.longtitude, coordinator: this.lead.coordinator, status: true, label_m: 48, label_s: 2,
                sc_photo: JSON.stringify(this.lead.sc_photo), race: this.lead.race, gender: this.lead.gender, created_by : this.userid, title: this.lead.customer_title, verified: null, customer_unit: this.lead.customer_unit,
                sales_exec : JSON.stringify(userarray)
              }).subscribe((s) => {

                // console.log(s['data'])
                this.leadid = s['data']
                this.socket.emit('callUpdate', 'fromClient');

                Swal.fire({
                  icon: 'success',
                  title: 'New Lead Created Successfully',
                  timer: 3000,
                  heightAuto: false

                })
                // this.close()
                this.goLeadDetail()
              })
            }
          })

        }
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

  goLeadDetail() {
    this.socket.disconnect();
    this.nav.navigateForward('lead-appointment?uid=' + this.userid + '&lid=' + this.leadid)
  }

  // close() {
  //   this.nav.navigateBack('tabs-leads')
  // }

  clear() {
    // console.log(this.searchElementRef.nativeElement.value)
    this.searchElementRef.nativeElement.value = ''
  }

  platformType() {
    return this.platform.platforms()
  }

}
