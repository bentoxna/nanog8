import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/auth'
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';
// declare var google;
import * as lodash from 'lodash'
import * as L from 'leaflet'
import { Media } from '@capacitor-community/media';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;

import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';
import { CompletedJobServicePage } from '../completed-job-service/completed-job-service.page';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-completed-job-detail',
  templateUrl: './completed-job-detail.page.html',
  styleUrls: ['./completed-job-detail.page.scss'],
})
export class CompletedJobDetailPage implements OnInit {
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

  oriAddress = ''
  oriCompAddress = ''
  oriLat
  oriLong
  searchAddress

  theList = ["test test", "test test test test test", "test test test test test test test test"]
  keywordServices = ''
  keywordChannel = ''
  keywordAds = ''
  keywordSalesAdmin = ''
  keywordSalesCoord = ''
  keywordSalesExec = ''
  keywordCompany = ''
  selectionServices = false
  selectionChannel = false
  selectionAds = false
  selectionSalesAdmin = false
  selectionSalesCoord = false
  selectionSalesExec = false
  selectionCompany = false
  issuesText = ''
  openPicture = false
  openVideo = false
  openPictureOld = false
  currentImgArr = [] as any
  selectedImgIndex = 0
  img = ''

  lead = [] as any
  appointment = [] as any
  tabs = 'order'
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
  services = [] as any
  activity_log = [] as any
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

  today2 = new Date()
  currentMonth = this.today2.getMonth();
  currentYear = this.today2.getFullYear();

  tasklistCount = 1
  tasklist = [] as any

  totalDue = 0

  usersList = []
  keyword = ''
  keywordTeam = ''
  teamLists = []
  getUserList

  storeTeamMember = []
  storeTeamLeader = ''
  storeTeamId = []
  storeTeamLeaderUid = ''
  storeLeaderInfo

  userId = ''
  profile

  storeRemark = ''

  // Service Form
  loading = false
  quoteid
  servicenum
  service
  // today = this.changeformat(new Date())
  datestring = ''
  installation_date = [] as any
  pdffileurl = {} as any
  service2 = [] as any

  constructor(
    private menu: MenuController,
    private nav: NavController,
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private ngZone: NgZone,
    private geoCoder: MapGeocoder,
    private modalController: ModalController) { }

  ngOnInit() {
    console.log(new Date().toLocaleString());

    firebase.auth().onAuthStateChanged(x => {
      if (x != null) {
        this.userId = x.uid

        this.http.get('https://api.nanogapp.com/getTeam').subscribe((s) => {
          this.teamLists = s['data'].filter(a => a.status)
          this.teamLists.filter(a => a['selected'] = false)
          console.log(this.teamLists);
        })

        this.activateRoute.queryParams.subscribe((a) => {
          this.getNo = a['no']
          this.leadId = a['id']
          this.fromPage = a['from']

          if (a['no'] == 1) {
            this.tabs = 'order'
          } else if (a['no'] == 2) {
            this.tabs = 'order'
          } else if (a['no'] == 3) {
            this.tabs = 'order'
          } else {
            this.tabs = 'order'
          }

          this.refresh()
        })
      }
    })
  }

  refresh() {

    this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Coordinator' }).subscribe((s) => {
      this.sales_coor = s['data']
    })

    this.http.get('https://api.nanogapp.com/getAds').subscribe((s) => {
      this.ads_list = s['data']
      // console.log('ads', this.ads_list);
    })

    this.http.get('https://api.nanogapp.com/getChannel').subscribe((s) => {
      this.channel_list = s['data']
      // console.log('channel', this.channel_list);
    })

    // get specific company name
    this.http.get('https://api.nanogapp.com/getAllSubCompany').subscribe((s) => {
      this.company_list = s['data']
      console.log('company', this.company_list);
    })

    this.http.post('https://api.nanogapp.com/getLeadDetail', { lead_id: this.leadId }).subscribe((s) => {
      this.lead = s['data']
      console.log(this.lead);

      this.keywordServices = this.lead.services
      this.keywordChannel = this.lead.channel
      this.keywordAds = this.lead.ads
      this.keywordSalesCoord = this.lead.sales_coordinator
      this.keywordSalesExec = this.lead.assigned_to

      if (this.lead['assigned_worker'] != null) {
        //seperate team leader and members
        this.lead['assigned_worker'].filter(a => a['role'] == 'leader' ? this.storeTeamLeader = a['uid'] : this.storeTeamMember.push(a['uid']))
        console.log(this.lead['assigned_worker']);
        this.http.get('https://api.nanogapp.com/getSubUser').subscribe((s) => {
          console.log(s);

          s['data'].filter((a) => a['uid'] == this.storeTeamLeader ? this.storeLeaderInfo = a : false)

          if (this.storeLeaderInfo != undefined) {
            this.storeTeamLeader = this.storeLeaderInfo['user_name']
            this.storeTeamLeaderUid = this.storeLeaderInfo['uid']
          } else {

          }
          this.storeTeamMember = s['data'].filter((a) => this.storeTeamMember.includes(a['uid']))
          console.log(this.storeTeamMember);
          console.log(this.storeTeamLeader);
          console.log(this.storeLeaderInfo);
        })
      }

      this.http.post('https://api.nanogapp.com/getSalesPackageViaAppointment', { appointment_id: this.lead.appointment_id }).subscribe((s) => {
        this.sales_package = s['data'].sort((a, b) => a.sap_id - b.sap_id)
        console.log('sales package', this.sales_package);
      })

      this.http.post('https://api.nanogapp.com/getSales', { appointment_id: this.lead.appointment_id }).subscribe((s) => {
        this.sales_list = s['data']
        console.log('sales', this.sales_list);

        this.calcDue()

        if (this.sales_list.sub_team == null) {
          this.sales_list.sub_team = []
        }

        if (this.sales_list.sub_team.length > 0) {
          this.teamLists.forEach(x => {
            // Find the corresponding item in teamLists based on team_id
            const correspondingTeam = this.sales_list.sub_team.find(teamItem => teamItem.team_id === x.team_id);

            // If a corresponding team is found, set selected to true
            if (correspondingTeam) {
              x.selected = true;
            }
          });
        }

        if (s['data']) {

          if (this.sales_list.subcon_choice.length > 0) {
            this.keywordCompany = this.sales_list.subcon_choice.at(-1).company
          }
          // this.keywordCompany = this.sales_list.subcon_choice

          this.http.post('https://api.nanogapp.com/getAllScheduleBySales', { sales_id: this.sales_list.id }).subscribe((s) => {
            this.schedule_list = s['data'].sort((a, b) => a.id - b.id)
            console.log('schedule_list', this.schedule_list);

            if (this.schedule_list.length > 0) {
              this.schedule_date = this.schedule_list.at(-1).schedule_date
            }
          })

          this.http.post('https://api.nanogapp.com/getSpecificLDetailPM', { sales_id: this.sales_list.id }).subscribe((s) => {
            this.services = s['data'][0]
            console.log('services', this.services)
            this.service = s['data'][0]['sap']
            this.pdffileurl = s['data'][0]['serviceform'] ? s['data'][0]['serviceform'] : null

            for (let i = 0; i < this.service.length; i++) {
              this.service2[i] = this.service[i]
              for (let j = 0; j < this.service[i].from_date2.length; j++) {
                this.installation_date.push(this.service[i]['from_date2'][j])
                // console.log(this.installation_date)
              }

              this.service[i].area == 'others' ? this.service2[i].area = this.service[i].other_area : this.service2[i].area = this.service2[i].area
              this.service[i].sqft == 'others' ? this.service2[i].sqft = this.service[i].size : this.service2[i].sqft = this.service[i].sqft
              this.service2[i].name == null ? this.service2[i].name = 'Other Package' : this.service2[i].name = this.service[i].name
            }

            Swal.close()
            this.loading = true
          })

        }

        this.http.post('https://api.nanogapp.com/getSubActivityLog', { sales_id: this.sales_list.id }).subscribe((s) => {
          this.activity_log = s['data'].filter(a => a.activity_type != 'Payment');
          console.log('activity log', this.activity_log);
        });

      })

      this.http.post('https://api.nanogapp.com/getSalesPayment', { id: this.lead.appointment_id }).subscribe((s) => {
        this.payment_list = s['data'].sort((a, b) => a.id - b.id)
        console.log('payment', this.payment_list);
      })

      this.http.get('https://api.nanogapp.com/getLabel').subscribe((s) => {

        this.label_list = s['data']
        // console.log(this.label_list);

        this.label_main_list = s['data'].filter(a => a.main == true).sort((a, b) => a.id - b.id)
        this.selectedMainLabel = this.lead.label_m
        this.selectedSubLabel = this.lead.label_s
        this.label_sub_list = s['data'].filter(a => (a.main == false && a.category == this.selectedMainLabel)).sort((a, b) => a.name - b.name)
        console.log('label', this.label_main_list, this.label_sub_list);

        if (this.lead.appointment_time != 'NaN' && this.lead.appointment_time != null && this.lead.appointment_time != '') {
          this.lead.appointment_time = parseInt(this.lead.appointment_time)

          this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Executive' }).subscribe((s) => {
            this.sales_exec = s['data'].filter(a => a.status)
            // console.log('sales exec', this.sales_exec);
            this.SEblur(this.lead.appointment_time)
          })

          this.lead.date = this.datepipe.transform(new Date(parseInt(this.lead.appointment_time)), 'yyyy-MM-dd')
          this.lead.time = this.datepipe.transform(parseInt(this.lead.appointment_time), 'HH:mm')
        }

        // if (this.tasklist.length == 0) {
        //   this.addTask()
        // }

      })

      if (this.tabs == 'details' || this.tabs == 'appointment') {
        this.loadMap()
      }

    })

  }

  openUrl() {
    Swal.fire({
      title: 'Complaint Form',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: false,
      html: 'Choose a selection',
      confirmButtonText: 'Go to Complaint Page',
      denyButtonText: `Copy Complaint Link`,
      heightAuto: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        window.open('https://admin-nanog.web.app/form-page?no=' + this.leadId + '&form=3', '_blank');
      } else if (result.isDenied) {
        this.copyLinkToClipboard('https://admin-nanog.web.app/form-page?no=' + this.leadId + '&form=3')
      }

    })

  }

  copyLinkToClipboard(x) {
    const link = x;

    // Create a temporary input element
    const input = document.createElement('input');
    input.value = link;
    document.body.appendChild(input);

    // Select the input element's content
    input.select();

    // Copy the selected content to clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(input);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        Swal.showLoading()
      }
    })

    Toast.fire({
      icon: 'info',
      title: 'Link Copied to ClipBoard'
    })

    // Optionally, you can show a notification to indicate that the link has been copied.
    // You can use a library like ngx-toastr or create your own notification component.
    // For example, if you're using ngx-toastr:
    // this.toastr.success('Link copied to clipboard!', 'Success');
  }

  async genServiceForm() {

    const modal = await this.modalController.create({
      component: CompletedJobServicePage,
      cssClass: 'fullModal',
      componentProps: {
        lead: this.lead,
        services: this.services,
        service: this.service,
      },

    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    // this.refresh()
    // if (data == 1) {
    //   this.refreshList()
    // }
  }

  reassignTeam() {

    console.log(this.storeLeaderInfo);
    console.log(this.storeTeamLeader);
    console.log(this.storeTeamMember);

    //to make the selected member appear

    this.storeLeaderInfo['leader'] = true
    this.storeTeamMember.filter(a => a['leader'] = false)
    this.usersList = this.usersList.concat(this.storeTeamMember)
    this.usersList.push(this.storeLeaderInfo)
    console.log(this.usersList);
    this.usersList.filter(a => this.checkIfDuplicateExists(this.usersList) ? true : false)
    this.usersList.filter(a => a['added'] = true)
    console.log(this.usersList);

  }

  rejectOrder() {
    let acceptState = 'Rejected'
    let assginedworkers = JSON.stringify([])
    this.keywordCompany = null

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      heightAuto: false
    }).then(async (result) => {
      if (result.isConfirmed) {

        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: 'Remarks',
          inputPlaceholder: 'Type your message here...',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
          heightAuto: false,
          showCancelButton: true
        })

        if (text) {
          this.storeRemark = text
          console.log(this.storeRemark);

          this.http.post('https://api.nanogapp.com/updateSubSalesStatus', { pm_remark: this.storeRemark, accepted_subcon: this.keywordCompany, assigned_worker: assginedworkers, subcon_state: acceptState, sales_id: this.sales_list['id'] }).subscribe((s) => {
            Swal.fire({
              title: 'Task Rejected',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
              heightAuto: false
            }).then((ok) => {
              if (ok.isConfirmed) {
                this.nav.navigateBack('/folder/Completed')
              }
            })
          })

        }

      }
    })
  }

  chooseLeader(x) {
    console.log(x);

    x['leader'] = !x['leader']
    this.usersList.filter(a => a['uid'] != x.uid && a['leader'] == true ? a['added'] = false : a['leader'])
    this.usersList.filter(a => a['uid'] != x.uid ? a['leader'] = false : a['leader'])

    // leader
    if (x['leader']) {
      x['added'] = true
      this.storeTeamLeader = x['user_name']
      this.storeTeamLeaderUid = x['uid']

      if (this.storeTeamMember.findIndex(a => a['uid'] == x['uid']) != -1) {
        this.storeTeamMember.splice(this.storeTeamMember.findIndex(a => a['uid'] == x['uid']), 1)
      }
    } else {
      // member
      x['added'] = false
      this.storeTeamLeader = ''
      this.storeTeamLeaderUid = ''
    }
  }

  chooseMember(x) {
    console.log(x);

    x['added'] = !x['added']

    // undo
    if (x['added']) {
      this.storeTeamMember.push(x)
    } else {
      // add
      if (x['leader']) {
        x['leader'] = false
        this.storeTeamLeader = ''
        if (this.storeTeamMember.findIndex(a => a['uid'] == x['uid']) != -1) {
          this.storeTeamMember.splice(this.storeTeamMember.findIndex(a => a['uid'] == x['uid']), 1)
        }
      } else {
        this.storeTeamMember.splice(this.storeTeamMember.findIndex(a => a['uid'] == x['uid']), 1)
      }
    }
  }

  chooseTeam(x) {
    console.log(x);

    x['selected'] = !x['selected']

    if (x['selected']) {
      console.log(x);

      let tempStoreMembers = x['members'].filter(a => a['team_id'] = x.team_id)
      tempStoreMembers.filter(a => a['added'] = false)
      tempStoreMembers.filter(a => a['leader'] = false)
      this.usersList.filter(a => this.checkIfDuplicateExists(this.usersList) ? true : false)
      this.usersList = this.usersList.concat(tempStoreMembers)
      this.usersList = this.usersList.filter((variable, index) => index === this.usersList.findIndex(other => variable.uid === other.uid))

    } else {
      this.usersList = this.usersList.filter(a => a['team_id'] != x.team_id ? true : false)
    }
  }

  checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
  }

  kick(x) {
    this.usersList.splice(x, 1)
    // this.usersList.splice(this.usersList.findIndex(a => a['uid'] == x.uid), 1)
  }


  filtererUserList(x) {
    return x ? x.filter(a => (((a['user_name'] || '')).toLowerCase()).includes(this.keyword.toLowerCase())) : []
  }

  filtererMemberList(x) {
    return x ? x.filter(a => (((a['user_name'] || '')).toLowerCase()).includes(this.keywordTeam.toLowerCase())) : []
  }

  filtererTeamList(x) {
    return x ? x.filter(a => (((a['name'] || '')).toLowerCase()).includes(this.keyword.toLowerCase())) : []
  }

  tabClicked(x) {

    if (x == 'order') {
      this.tabs = 'order'
    } else if (x == 'details') {
      this.tabs = 'details'
      // this.loadMap()
    }
    else if (x == 'media') {
      this.tabs = 'media'
    }
  }

  loadMap() {
    this.loading = false

    this.http.post('https://api.nanogapp.com/getLeadDetail', { lead_id: this.leadId }).subscribe((s) => {
      this.lead = s['data']
      if (!this.lead.sc_photo) {
        this.lead.sc_photo = [] as any
      }
      console.log('Lead', this.lead);

      this.keywordServices = this.lead.services
      this.keywordChannel = this.lead.channel
      this.keywordAds = this.lead.ads
      this.keywordSalesCoord = this.lead.sales_coordinator
      if (this.lead.assigned_to != null) {
        this.keywordSalesExec = this.lead.assigned_to
      } else {
        this.keywordSalesExec = ''
      }

      // this.map_location = null

      if (this.lead.appointment_time != 'NaN' && this.lead.appointment_time != null && this.lead.appointment_time != '') {
        this.lead.appointment_time = parseInt(this.lead.appointment_time)

        this.http.post('https://api.nanogapp.com/getSpecificUser', { user_role: 'Sales Executive' }).subscribe((s) => {
          this.sales_exec = s['data']
          // console.log('sales exec', this.sales_exec);
          // this.SEblur(this.lead.appointment_time)
        })

        this.lead.date = this.datepipe.transform(new Date(parseInt(this.lead.appointment_time)), 'yyyy-MM-dd')
        this.lead.time = this.datepipe.transform(parseInt(this.lead.appointment_time), 'HH:mm')
      }

      // Binding autocomplete to search input control
      // let autocomplete = new google.maps.places.Autocomplete(
      //   this.searchElementRef.nativeElement
      // );
      // // Align search box to center
      // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      //   this.searchElementRef.nativeElement
      // );

      // autocomplete.addListener('place_changed', () => {
      //   this.ngZone.run(() => {
      //     //get the place result
      //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

      //     //verify result
      //     if (place.geometry === undefined || place.geometry === null) {
      //       return;
      //     }

      //     console.log({ place }, place.geometry.location?.lat(), place.geometry.location?.lng());
      //     this.lead.address = place.formatted_address
      //     this.lead.company_address = place.name
      //     //set latitude, longitude and zoom
      //     this.latitude = place.geometry.location?.lat();
      //     this.longitude = place.geometry.location?.lng();
      //     this.lead.lattitude = this.latitude
      //     this.lead.longtitude = this.longitude

      //     // Set marker position
      //     this.setMarkerPosition(this.latitude, this.longitude);
      //     // this.SEblur(this.lead.date)

      //     this.center = {
      //       lat: this.latitude,
      //       lng: this.longitude,
      //     };
      //   });

      // });

      // MAP
      navigator.geolocation.getCurrentPosition((position) => {

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
        // Set marker position
        this.setMarkerPosition(this.latitude, this.longitude);
      });

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
    console.log(this.markers);

  }

  eventHandler(event: any, name: string) {
    // console.log(event, name);
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
            console.log(addr.results[0], addr.results[0].geometry.location.lat(), addr.results[0].geometry.location.lng());
            // this.SEblur(this.lead.date)

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

  resetAddress() {
    this.searchAddress = ''
    this.lead.address = this.oriAddress
    this.lead.company_address = this.oriCompAddress
    this.lead.lattitude = this.oriLat
    this.lead.longtitude = this.oriLong

    navigator.geolocation.getCurrentPosition((position) => {

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
      // Set marker position
      this.setMarkerPosition(this.latitude, this.longitude);
    });

  }

  applyAddress() {
    this.lead.address = this.map_location
  }

  calcDue() {
    this.totalDue = this.sales_list.total - this.lead.total_price
    console.log(this.totalDue);

  }

  SEblur(x) {
    let date: string = this.datepipe.transform(new Date(x), 'dd MMM yyyy')
    // console.log(date);

    let firstDay = new Date(date).getTime()
    let lastDay = (new Date(date).getTime() + 86400000)

    console.log(firstDay, lastDay);


    this.http.post('https://api.nanogapp.com/getAppointmentList', { firstDay: firstDay, lastDay: lastDay }).subscribe((s) => {
      this.appointment = s['data'].sort((a, b) => a.appointment_id - b.appointment_id)

      console.log('appointment', this.appointment);


      this.appointment = lodash.chain(this.appointment).groupBy('assigned_to').map((value, key) => ({
        group: key,
        lists: value,

      })).value() || []

      console.log('appointment_lodash', this.appointment)

      for (let i = 0; i < this.sales_exec.length; i++) {
        let temp = this.appointment

        if ((temp.filter(a => a.group == this.sales_exec[i].user_name).length)) {
          this.sales_exec[i].SElist = temp.filter(a => a.group == this.sales_exec[i].user_name)
        } else {
          this.sales_exec[i].SElist = [{ group: '', lists: [] }]
        }

        if (i + 1 == this.sales_exec.length) {
          this.loading = true
        }
      }

      console.log('salec_exec', this.sales_exec);

    })

  }

  assignSales(x) {

    console.log(x);

    if (x.SElist[0].lists.length > 0) {

      let pass = true

      for (let i = 0; i < x.SElist[0].lists.length; i++) {
        // 3600000 = 1 hour
        let up = new Date(this.lead.date + ', ' + this.lead.time).getTime() + 7000000
        let down = new Date(this.lead.date + ', ' + this.lead.time).getTime() - 7000000
        // console.log(x.SElist[0].lists[i].appointment_time);
        // console.log(up, down);

        if (Number(x.SElist[0].lists[i].appointment_time) >= up || Number(x.SElist[0].lists[i].appointment_time) <= down) {

          pass = true
        } else {
          if (this.lead.appointment_id != x.SElist[0].lists[i].appointment_id) {
            Swal.fire({
              icon: 'error',
              title: 'Appointment made should be prior/after TWO(2) hours of any existing appointment',
              heightAuto: false
            })
            pass = false
            break
          }

        }

      }

      if (pass) {
        this.keywordSalesExec = x.user_name

        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        })

        Toast.fire({
          icon: 'info',
          title: 'Consultant Assigned.'
        })
      }

    } else {
      this.keywordSalesExec = x.user_name

      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: 'info',
        title: 'Consultant Assigned.'
      })

    }

  }

  selectLabel(x, y) {
    if (y == 'main') {
      this.selectedMainLabel = x
      this.label_sub_list = this.label_list.filter(a => (a.main == false && a.category == this.selectedMainLabel)).sort((a, b) => a.name - b.name)
    } else {
      this.selectedSubLabel = x
    }
  }

  openPic(x, i, type) {
    console.log(x);

    this.currentImgArr = x
    type == 'image' ? this.openPicture = true : this.openVideo = true
    this.img = x[i]
    this.selectedImgIndex = i
    console.log(this.img);
  }

  openPicOld(x) {
    this.openPictureOld = true

    this.img = x
    console.log(this.img);
  }

  navigatePhoto(direction: string) {

    const currentIndex = this.currentImgArr.indexOf(this.img); // Use this.img instead of this.selectedImgIndex
    let newIndex;

    if (direction === 'previous') {
      newIndex = currentIndex === 0 ? this.currentImgArr.length - 1 : currentIndex - 1;
    } else if (direction === 'next') {
      newIndex = currentIndex === this.currentImgArr.length - 1 ? 0 : currentIndex + 1;
    }

    this.img = this.currentImgArr[newIndex];
    this.selectedImgIndex = newIndex; // Update the selectedImgIndex accordingly
  }

  download() {
    this.http.post('https://api.nanogapp.com/downloadfroms3', { img: this.img }).subscribe(async (response: any) => {
      console.log(response);
      // this.displayImageFromArrayBuffer(response.imageURL.data);
      const base64 = this.arrayBufferToBase64(response.imageURL.data);
      await this.downloadImage('data:image/png;base64,' + base64);
    });
  }

  arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);
    const binary = uint8Array.reduce((binaryString, byte) => {
      return binaryString + String.fromCharCode(byte);
    }, '');
    return btoa(binary);
  }

  // displayImageFromArrayBuffer(arrayBuffer: ArrayBuffer) {
  //   // Convert the ArrayBuffer to a Blob
  //   const blob = this.convertArrayBufferToBlob(arrayBuffer);

  //   // Create a Blob URL from the Blob
  //   const blobUrl = URL.createObjectURL(blob);

  //   this.downloadImage(blobUrl)
  // }

  // convertArrayBufferToBlob(arrayBuffer: ArrayBuffer): Blob {
  //   // Create a Uint8Array from the ArrayBuffer
  //   const uint8Array = new Uint8Array(arrayBuffer);

  //   // Create a Blob from the Uint8Array
  //   const blob = new Blob([uint8Array], { type: 'image/png' });

  //   return blob;
  // }

  async downloadImage(base64) {
    console.log(base64);

    if (Capacitor.getPlatform().toLowerCase() === 'ios' || Capacitor.getPlatform().toLowerCase() === 'android') {

      let name = Date.now() + '.png';

      await Media.getAlbums().then(async list => {
        let album = list.albums.filter(x => x['name'] == 'NanoG')[0]

        if (album) {
          console.log('1');

          let option = {
            path: encodeURI(base64),
            albumIdentifier: album['identifier'],
            fileName: name
          }
          console.log(option);

          Media.savePhoto(option).then(x => {
            // this.bentoService.swalclose()
            // this.presentToast(this.translate.instant("swal.Image Saved"), 'bottom')
            // alert('Image Saved!')
            const Toast = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            })

            Toast.fire({
              icon: 'info',
              title: 'Image Downloaded.'
            })
          })

        } else {
          console.log('2');

          await Media.createAlbum({ name: 'NanoG' }).then(async a => {
            await Media.getAlbums().then(async list2 => {

              let album2 = list2.albums.filter(x => x['name'] == 'NanoG')[0]

              let option = {
                path: encodeURI(base64),
                albumIdentifier: album2['identifier'],
                fileName: name
              }
              console.log(option);

              Media.savePhoto(option).then(x => {
                // this.bentoService.swalclose()
                // alert('Image Saved!')
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top',
                  showConfirmButton: false,
                  timer: 2500,
                  timerProgressBar: true,
                })

                Toast.fire({
                  icon: 'info',
                  title: 'Image Downloaded.'
                })
              })

            })
          })
        }
      }, error => {
        // this.bentoService.swalclose()
      })

    } else {
      var temp = document.createElement('a');
      temp.download = Date.now().toString() + '.png';
      temp.href = base64;
      temp.click()
      // this.bentoService.swalclose()
    }

  }
  // downloadImage(blobUrl: string) {
  //   // Create a temporary anchor element
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = blobUrl;

  //   // Set the download attribute to specify the filename
  //   downloadLink.setAttribute('download', 'image.png');

  //   // Append the anchor element to the DOM
  //   document.body.appendChild(downloadLink);
  //   downloadLink.download = 'image.png'
  //   // Trigger the download
  //   downloadLink.click();
  //   console.log(downloadLink);

  //   // Clean up
  //   document.body.removeChild(downloadLink);
  // }


  closePic2() {
    this.openPicture = false;
  }

  closePic3() {
    this.openPictureOld = false;
  }

  closePic(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.openPicture = false;
    }
  }

  closeVideo2() {
    this.openVideo = false;
  }

  closeVideo(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.openVideo = false;
    }
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
    // console.log(x,selection);

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

  // Lead
  updateLead() {

    if (this.lead.customer_name == null || this.lead.customer_name == '') {
      this.errorField('Customer Name')
    } else if (this.lead.customer_phone == null || this.lead.customer_phone == '') {
      this.errorField('Customer Phone')
    } else if (this.lead.customer_email == null || this.lead.customer_email == '') {
      this.errorField('Customer Email')
    } else if (this.lead.customer_state == null || this.lead.customer_state == '') {
      this.errorField('State')
    } else if (this.lead.customer_city == null || this.lead.customer_city == '') {
      this.errorField('City')
    } else if (this.lead.services == null || this.lead.services == '') {
      this.errorField('Services')
    } else if (this.lead.address == null || this.lead.address == '') {
      this.errorField('Address')
    } else if (this.lead.sales_coordinator == null || this.lead.sales_coordinator == '') {
      this.errorField('Sales Coordinator')
    } else {

      this.lead.services = this.keywordServices
      this.lead.channel = this.keywordChannel
      this.lead.ads = this.keywordAds
      this.lead.customer_phone = this.condis(this.lead.customer_phone)
      let salesCoor = this.sales_coor
      let label_main = this.label_list.filter(a => a.name == this.selectedMainLabel)[0].id
      let label_sub = this.label_list.filter(a => a.name == this.selectedSubLabel)[0].id

      if (this.lead.remark_json != null) {
        this.lead.remark_json.push({ remark: this.lead.remark, date: new Date().getTime() })
      } else {
        this.lead.remark_json = [{ remark: this.lead.remark, date: new Date().getTime() }]
      }

      // if (this.keywordSalesCoord != null && this.keywordSalesCoord != '') {
      this.lead.coordinator = salesCoor.filter(a => a.name = this.keywordSalesCoord)[0]['uid']
      // }

      console.log(this.lead);

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
          this.http.post('https://api.nanogapp.com/updateLeadDetail', {
            name: this.lead.customer_name, email: this.lead.customer_email, phone: this.lead.customer_phone, state: this.lead.customer_state,
            city: this.lead.customer_city, address: this.lead.address, company_add: this.lead.company_address, saleexec_note: this.lead.saleexec_note,
            remark_json: JSON.stringify(this.lead.remark_json), ads: this.lead.ads, channel: this.lead.channel, services: this.lead.services,
            issues: JSON.stringify(this.lead.issues), lattitude: this.lead.lattitude, longtitude: this.lead.longitude,
            sales_coord: this.lead.coordinator, status: this.lead.status, id: this.lead.lead_id,
            label_m: label_main, label_s: label_sub
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
  checkAppointment(x) {
    console.log(x);

    if (x.SElist[0].lists.length > 0) {

      let pass = true

      for (let i = 0; i < x.SElist[0].lists.length; i++) {
        // 3600000 = 1 hour
        let up = new Date(this.lead.date + ', ' + this.lead.time).getTime() + 7000000
        let down = new Date(this.lead.date + ', ' + this.lead.time).getTime() - 7000000
        console.log(x.SElist[0].lists[i].appointment_time);
        console.log(up, down);

        if (Number(x.SElist[0].lists[i].appointment_time) >= up || Number(x.SElist[0].lists[i].appointment_time) <= down) {

          console.log('yes');
          pass = true
        } else {
          if (this.lead.appointment_id != x.SElist[0].lists[i].appointment_id) {
            Swal.fire({
              icon: 'error',
              title: 'Appointment made should be prior/after TWO(2) hours of any existing appointment',
              heightAuto: false
            })
            pass = false
            break
          }

        }

      }

      if (pass) {
        this.keywordSalesExec = x.user_name
        this.updateAppointment()
      }

    } else {
      this.keywordSalesExec = x.user_name
      this.updateAppointment()

    }
  }

  updateAppointment() {
    // , 'lattitude', 'longitude'
    console.log(this.keywordSalesExec);

    this.lead.assigned_to = this.sales_exec.filter(a => a.user_name == this.keywordSalesExec)[0].uid

    if ((['assigned_to', 'address', 'date', 'time']).every(a => (this.lead[a] != null && this.lead[a] != ''))) {
      // let format = !Math.floor(parseInt(this.lead.time.split(':')[0]) / 12) ? 'AM' : 'PM'
      // let date = this.datepipe.transform(new Date(this.lead.date), 'MM/dd/yyyy')
      // let time = parseInt(this.lead.time.split(':')[0]) % 12 + ':' + this.lead.time.split(':')[1] + ':00' + format

      let appointment_time = new Date(this.lead.date + ', ' + this.lead.time).getTime()

      console.log(this.lead);

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

        if (a.isConfirmed) {

          this.http.post('https://api.nanogapp.com/updateLeadAppointment', {
            sales_exec_note: this.lead.saleexec_note, remark: this.lead.remark, address: this.lead.address,
            lattitude: this.lead.lattitude, longtitude: this.lead.longitude, id: this.lead.lead_id, assigned_to: this.lead.assigned_to,
            status: this.lead.status, appointment_time: appointment_time
          }).subscribe((s) => {

            if (this.lead.label_s == 'Pending Appointment Date') {

              this.http.post('https://api.nanogapp.com/updateSubLabel', {
                id: this.lead.lead_id, label_s: 11
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
        text: "Consultant / Date / Time is required.",
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
      this.nav.navigateBack('/folder/Pending')
    } else if (this.fromPage == 2) {
      this.nav.navigateBack('/folder/Completed')
    } else if (this.fromPage == 3) {
      this.nav.navigateBack('/folder/Calendar')
    }

  }

  back() {
    this.nav.pop()
  }

  // Payment
  updateApproval(x, y, z) {

    Swal.fire({
      icon: 'question',
      title: "Approve Payment",
      text: "Are you sure to approve this payment?",
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      cancelButtonColor: '#ff0000',
    }).then(a => {

      if (a.isConfirmed) {

        if (x == 'ac') {
          z.ac_approval = y
        } else {
          z.sc_approval = y
        }

        console.log(z);

        this.http.post('https://api.nanogapp.com/updateApproval', { role: x, approval: y, id: z.id }).subscribe((s) => {

          if (this.totalDue <= 0 && this.payment_list.every(a => a.ac_approval == 'Approved') && this.payment_list.every(a => a.sc_approval == 'Approved')) {
            console.log('in');

            this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
              payment_status: 'Completed', id: this.sales_list.id
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
            console.log('out');
            this.http.post('https://api.nanogapp.com/updatePaymentStatus', {
              payment_status: 'Pending', id: this.sales_list.id
            }).subscribe((s) => {

              Swal.fire({
                icon: 'success',
                title: 'Appointment Updated Successfully',
                timer: 2000,
                heightAuto: false

              })

              this.refresh()
            })
          }


        })
      }

    })
  }

  logOutBtn() {
    // firebase.auth().signOut().then((x) => {
    //   this.nav.navigateRoot('login')
    // })
    firebase.auth().signOut().then((x) => {
      this.nav.navigateRoot('login')
    })
  }

  // Tasklist
  addTask(x) {
    console.log(x);

    let temp = {
      task: "",
      created_date: new Date().getTime()
    }

    x.push(temp)
    console.log(x);
    // setTimeout(() => {
    //   this.myContent.scrollToBottom(0);
    // }, 50);

  }

  deleteTask(x, y) {
    console.log(x, y);

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
        console.log(x);
      }
    })

  }

  deletePicInstall(j, type, i) {
    if (type == 'image') {

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

          this.sales_package[i].sub_image.splice(j, 1)
          console.log(this.sales_package[i].sub_image);

          this.http.post('https://api.nanogapp.com/updatePackageInstallPhoto', { sub_image: JSON.stringify(this.sales_package[i].sub_image), id: this.sales_package[i].sap_id }).subscribe((s) => {

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

    } else {
      Swal.fire({
        icon: 'question',
        title: "Delete Video",
        text: "Are you sure to delete this video?",
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        cancelButtonColor: '#ff0000',
      }).then(a => {

        if (a.isConfirmed) {
          this.sales_package[i].sub_video.splice(j, 1)
          console.log(this.sales_package[i].sub_video);

          this.http.post('https://api.nanogapp.com/updatePackageInstallVideo', { sub_image: JSON.stringify(this.sales_package[i].sub_video), id: this.sales_package[i].sap_id }).subscribe((s) => {

            const Toast = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            })

            Toast.fire({
              icon: 'success',
              title: 'Video Deleted.'
            })

          })

        }
      })
    }
  }

  deletePicComplaint(j, type, i) {
    if (type == 'image') {

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

          this.sales_package[i].sub_complaint_image.splice(j, 1)
          console.log(this.sales_package[i].sub_complaint_image);

          this.http.post('https://api.nanogapp.com/updatePackageComplaintPhoto', { sub_complaint_image: JSON.stringify(this.sales_package[i].sub_complaint_image), id: this.sales_package[i].sap_id }).subscribe((s) => {

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

    } else {
      Swal.fire({
        icon: 'question',
        title: "Delete Video",
        text: "Are you sure to delete this video?",
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        cancelButtonColor: '#ff0000',
      }).then(a => {

        if (a.isConfirmed) {
          this.sales_package[i].sub_complaint_video.splice(j, 1)
          console.log(this.sales_package[i].sub_complaint_video);

          this.http.post('https://api.nanogapp.com/updatePackageComplaintVideo', { sub_complaint_video: JSON.stringify(this.sales_package[i].sub_complaint_video), id: this.sales_package[i].sap_id }).subscribe((s) => {

            const Toast = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            })

            Toast.fire({
              icon: 'success',
              title: 'Video Deleted.'
            })

          })

        }
      })
    }
  }

  submitTaskList() {

    console.log(this.sales_package);

    let pass = true
    let temp = this.sales_package.map(a => ({ task: a.task, sap_id: a.sap_id, from_date: a.from_date }))
    console.log(temp);

    for (let i = 0; i < this.sales_package.length; i++) {
      if (this.sales_package[i].task == null || this.sales_package[i].task == '') {
        pass = false

        Swal.fire({
          icon: 'error',
          title: 'Tasklist of "' + this.sales_package[i].place + '" is empty.',
          heightAuto: false
        })

        break
      } else {

        for (let j = 0; j < this.sales_package[i].task.length; j++) {

          if (this.sales_package[i].task[j].task == null || this.sales_package[i].task[j].task == '') {
            pass = false

            Swal.fire({
              icon: 'error',
              title: 'Field No.' + (j + 1) + ' in "' + this.sales_package[i].place + '" is empty.',
              heightAuto: false
            })

            break
          }
          // else if (this.sales_package[i].task[j].from_date == null || this.sales_package[i].task[j].from_date == '') {
          //   pass = false

          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Field installation time in "' + this.sales_package[i].place + '" is empty.',
          //     heightAuto: false
          //   })

          //   break
          // }

        }
      }
    }

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
        title: 'Company does not match any existing company.',
        heightAuto: false
      })

    }

    if (pass) {


      Swal.fire({
        title: 'Submit Tasklist',
        text: "Are you sure to submit this tasklist?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        reverseButtons: true,
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.post('https://api.nanogapp.com/updateTask', { task: JSON.stringify(temp) }).subscribe(s => {

            if (this.sales_list.subcon_choice.length == 0) {
              this.sales_list.subcon_choice.push({ company: this.keywordCompany, date: new Date().getTime() })
              this.http.post('https://api.nanogapp.com/updateSalesSub', { choice: JSON.stringify(this.sales_list.subcon_choice), state: 'Pending', id: this.lead.appointment_id }).subscribe(s => {
              })
              console.log('1');

            } else if (this.sales_list.subcon_choice.at(-1).company != this.keywordCompany) {
              this.sales_list.subcon_choice.push({ company: this.keywordCompany, date: new Date().getTime() })
              this.http.post('https://api.nanogapp.com/updateSalesSub', { choice: JSON.stringify(this.sales_list.subcon_choice), state: 'Pending', id: this.lead.appointment_id }).subscribe(s => {
              })
              console.log('2');
            }

            Swal.fire({
              icon: 'success',
              title: 'Tasklist Updated Successfully',
              timer: 2000,
              heightAuto: false
            })

            this.refresh()

          })
        }
      })

    }

  }

  changeStatus() {
    Swal.fire({
      title: 'Update Status',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: false,
      html: 'Which status would you like to proceed with...',
      confirmButtonText: 'Approve Installation',
      denyButtonText: `Reject Installation`,
      reverseButtons: true,
      heightAuto: false,
    }).then((result) => {

      if (result.isConfirmed) {
        this.approveInstall()
      } else if (result.isDenied) {
        this.rejectInstall()
      }
    });
  }

  approveInstall() {

    let assignto = []
    for (let i = 0; i < this.lead.assigned_to4.length; i++) {
      let temp = this.sales_exec.filter(a => a.user_name == this.lead.assigned_to4[i])[0].uid
      assignto.push(temp)
    }

    Swal.fire({
      title: 'Approve Installation',
      text: "Are you sure to submit this status?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        let temp = this.sales_package.map(a => ({ sap_id: a.sap_id, from_date: a.from_date ? new Date(a.from_date).getTime() : null, from_date2: a.from_date2 }))

        this.http.post('https://api.nanogapp.com/updateTask', { task: JSON.stringify(temp) }).subscribe(s => { })
        this.http.post('https://api.nanogapp.com/updateTask2', { task: JSON.stringify(temp) }).subscribe(s => { })

        this.http.post('https://api.nanogapp.com/updateFinalApproval2', {
          final_approval: true, sales_id: this.sales_list.id, final_reject_remark: JSON.stringify(this.sales_list.final_reject_remark), lead_id: this.lead.lead_id, uid: this.userId, log: this.profile + ' has approved ' + this.lead.customer_name + "'s installation", activity_type: 9
        }).subscribe(s => {

          Swal.fire({
            icon: 'success',
            title: 'Installation Status Updated Successfully',
            timer: 2000,
            heightAuto: false
          })


          for (let i = 0; i < assignto.length; i++) {

            let body2 = {
              title: 'Installation Completed',
              body: "Installation of '" + this.lead.customer_name + "' has been completed and approved by Project Manager",
              path: 'home',
              topic: assignto[i],
            }

            this.http.post('https://api.nanogapp.com/fcmAny', body2).subscribe(data2 => {

              console.log(assignto[i]);
              // Message Type :
              // 1 = New Appointment
              // 2 = Update Appointment
              // 3 = New Event
              // 4 = Update Event
              // 5 = Custom Quotation
              // 6 = Payment
              // 7 = Sales Order Form
              this.http.post('https://api.nanogapp.com/insertNotificationHistory', {
                to_id: assignto[i], from_id: this.userId, message_type: 8,
                his_date: new Date().getTime(), lead_id: this.lead.lead_id, sales_id: this.lead.sales_id || null
              }).subscribe(data2 => {
                // this.refresh()
                console.log(data2);
              }, e => {
                console.log(e);
              });

            }, e => {
              console.log(e);
            });

          }

          this.nav.navigateBack('/folder/Completed')

        })

      }

    })

  }

  rejectInstall() {

    Swal.fire({
      title: 'Reject Installation',
      text: "Are you sure to submit this status?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      reverseButtons: true,
      heightAuto: false
    }).then(async (result) => {
      if (result.isConfirmed) {

        this.selectTitle()

      }

    })
  }

  async selectTitle() {
    let selectedTitle: string | undefined;

    const inputOptions = { 0: 'No Installation Photo/Video', 1: 'Others' };

    const { value } = await Swal.fire<string>({
      title: "Select a title",
      input: "select",
      inputOptions: inputOptions,
      heightAuto: false,
      showCancelButton: true,
      inputPlaceholder: "Select a title",
      cancelButtonColor: '#d33',
      reverseButtons: true,
      inputValidator: (value: string) => {
        return new Promise<string>((resolve) => {
          if (value) {
            selectedTitle = inputOptions[value];
            resolve('');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'You need to select a title',
              timer: 2000,
              heightAuto: false
            });
            resolve('');  // Resolve with a string in case of an error
          }
        });
      }
    });

    if (value && selectedTitle) {
      console.log(selectedTitle);
      this.inputRemark(selectedTitle);
    }
  }

  // async selectArea(a) {
  //   let selectedArea: string | undefined;
  //   const areas = this.sales_package;
  //   const inputOptions = {};

  //   for (let i = 0; i < areas.length; i++) {
  //     const x = areas[i];
  //     const areaValue = x.area;

  //     if (areaValue) {
  //       // Use the loop index as the key
  //       const key = i.toString();
  //       inputOptions[key] = areaValue;
  //     }
  //   }

  //   console.log(inputOptions);


  //   const { value } = await Swal.fire({
  //     title: "Select an area",
  //     input: "select",
  //     inputOptions: inputOptions,
  //     heightAuto: false,
  //     showCancelButton: true,
  //     inputPlaceholder: "Select an area",
  //     cancelButtonColor: '#d33',
  //     reverseButtons: true,
  //     inputValidator: (value: string) => {
  //       return new Promise<string>((resolve) => {
  //         if (value) {
  //           selectedArea = inputOptions[value];
  //           resolve('');
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'You need to select an area',
  //             timer: 2000,
  //             heightAuto: false
  //           });
  //           resolve('');  // Resolve with a string in case of an error
  //         }
  //       });
  //     }
  //   });

  //   if (value && selectedArea) {
  //     console.log(selectedArea);
  //     this.inputRemark(a, selectedArea);
  //   }

  // }

  async inputRemark(title) {
    let assignto = []
    for (let i = 0; i < this.lead.assigned_to4.length; i++) {
      let temp = this.sales_exec.filter(a => a.user_name == this.lead.assigned_to4[i])[0].uid
      assignto.push(temp)
    }


    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Remarks',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      heightAuto: false,
      showCancelButton: true
    })

    if (text) {

      this.sales_list.final_reject_remark.push({ title: title, msg: text, time: (new Date().getTime()) })
      let temp = this.sales_package.map(a => ({ sap_id: a.sap_id, from_date: a.from_date ? new Date(a.from_date).getTime() : null, from_date2: a.from_date2 }))

      this.http.post('https://api.nanogapp.com/updateTask', { task: JSON.stringify(temp) }).subscribe(s => { })
      this.http.post('https://api.nanogapp.com/updateTask2', { task: JSON.stringify(temp) }).subscribe(s => { })

      this.http.post('https://api.nanogapp.com/updateFinalApproval2', {
        final_approval: false, sales_id: this.sales_list.id,
        final_reject_remark: JSON.stringify(this.sales_list.final_reject_remark), lead_id: this.lead.lead_id, uid: this.userId, log: this.profile + ' has rejected installation of ' + this.lead.customer_name + ' due to ' + text, activity_type: 9
      }).subscribe(s => {

        Swal.fire({
          icon: 'success',
          title: 'Installation Status Updated Successfully',
          timer: 2000,
          heightAuto: false
        })


        for (let i = 0; i < assignto.length; i++) {

          let body2 = {
            title: 'Installation Rejected',
            body: "Installation of '" + this.lead.customer_name + "' has been rejected by Project Manager",
            path: 'home',
            topic: assignto[i],
          }

          this.http.post('https://api.nanogapp.com/fcmAny', body2).subscribe(data2 => {

            console.log(assignto[i]);
            // Message Type :
            // 1 = New Appointment
            // 2 = Update Appointment
            // 3 = New Event
            // 4 = Update Event
            // 5 = Custom Quotation
            // 6 = Payment
            // 7 = Sales Order Form
            this.http.post('https://api.nanogapp.com/insertNotificationHistory', {
              to_id: assignto[i], from_id: this.userId, message_type: 8,
              his_date: new Date().getTime(), lead_id: this.lead.lead_id, sales_id: this.lead.sales_id || null
            }).subscribe(data2 => {
              // this.refresh()
              console.log(data2);
            }, e => {
              console.log(e);
            });

          }, e => {
            console.log(e);
          });

        }

        this.nav.navigateBack('/folder/Completed')

      })
    }
  }

  // changeformat(dates) {
  //   let year = dates.getFullYear()
  //   let month = '' + (dates.getMonth() + 1)
  //   let date = '' + dates.getDate()

  //   if (month.length < 2) {
  //     month = '0' + month
  //   }
  //   if (date.length < 2) {
  //     date = '0' + date
  //   }

  //   let newdate = [year, month, date].join('-')
  //   let newdatehour = [new Date().getHours(), new Date().getMinutes()].join(':')
  //   let combine = [newdate, newdatehour].join(' ')
  //   return combine
  // }

  // createdatestring() {
  //   let temp = [] as any
  //   this.installation_date.forEach(a => {
  //     if (!temp.includes(a)) {
  //       temp.push(a)
  //     }
  //   });

  //   if (!temp) {
  //     this.datestring = ''
  //   }
  //   else if (temp && temp.length == 1) {
  //     temp[0] ? this.datestring = this.datepipe.transform(Number(temp[0]), 'dd MMM yyyy hh:mm a') : this.datestring

  //   }
  //   else if (temp && temp.length > 1) {
  //     for (let i = 0; i < temp.length; i++) {
  //       if (temp[i]) {
  //         if (i == 0) {
  //           this.datestring = this.datepipe.transform(Number(temp[i]), 'dd MMM yyyy hh:mm a')
  //         }
  //         else {
  //           this.datestring = [this.datestring, this.datepipe.transform(Number(temp[i]), 'dd MMM yyyy hh:mm a')].join(', ')
  //         }

  //       }
  //       else if (!temp[i]) {
  //         this.datestring = this.datestring
  //       }

  //     }
  //   }
  //   return this.datestring
  // }

  // tableBody(data, columns) {
  //   var body = [] as any;
  //   body.push(columns);

  //   for (let i = 0; i < data.length; i++) {
  //     var dataRow = [] as any;

  //     for (let j = 0; j < columns.length; j++) {
  //       if (columns[j]["text"] == "area") {
  //         dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
  //       }
  //       else if (columns[j]["text"] == "name") {
  //         dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
  //       }
  //       else if (columns[j]["text"] == "services") {
  //         dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
  //       }
  //       else if (columns[j]["text"] == "sqft") {
  //         dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
  //       }
  //       else if (columns[j]["text"] == "warranty") {
  //         dataRow.push({ text: (data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0).toString(), style: "tableData" });
  //       }
  //       // else if (columns[j]["text"] == "rate") {
  //       //   dataRow.push({ text: "RM " + (Math.round((data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0) * 100) / 100).toFixed(2).toString(), style: "tableData" });
  //       // }
  //       // else if (columns[j]["text"] == "total") {
  //       //   dataRow.push({ text: "RM " + (Math.round((data[i]['total_after'] ? data[i]['total_after'] : data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
  //       // }
  //       // else if (columns[j]["text"] == "total") {
  //       //   dataRow.push({ text: "RM " + (Math.round((data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
  //       // }
  //     }
  //     body.push(dataRow);
  //   }

  //   columns[0].text = "Service"
  //   columns[1].text = "Area"
  //   columns[2].text = "Size(sqft)"
  //   columns[3].text = "Package"
  //   columns[4].text = "Warranty(yr)"
  //   // columns[5].text = "Rate(RM)"
  //   // columns[6].text = "Price(RM)"
  //   return body
  // }

  // table(data, columns) {
  //   return {
  //     table: {
  //       layout: 'lightHorizontalLines', // optional
  //       headerRows: 1,
  //       widths: ['20%', '20%', '20%', '20%', '20%'],
  //       body: this.tableBody(data, columns)
  //     }
  //   };
  // }

  // async openpdf() {
  //   this.quoteid = 'SER/NANO-' + await this.getservicenum()

  //   Swal.fire({
  //     text: 'Processing...',
  //     icon: 'info',
  //     heightAuto: false,
  //     showConfirmButton: false,
  //   })

  //   let imageSign = await this.getBase64ImageFromURL(this.services.sub_cust_sign)
  //   let imageSign2 = await this.getBase64ImageFromURL(this.services.sub_sub_sign)


  //   var docDefinition = {
  //     content: [
  //       {
  //         columns: [
  //           {
  //             image: await this.getBase64ImageFromURL(
  //               "assets/icon/nano-g-nb.png"
  //             ),
  //             width: 100,
  //             alignment: 'left',
  //           },
  //           {
  //             text: '',
  //             width: '3%'
  //           },
  //           {
  //             columns: [
  //               {
  //                 stack: [
  //                   { text: 'NANO G CENTRAL SDN BHD 201401003990 (1080064-V)', fontSize: 9, color: '#444444', width: '100%' },
  //                   { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 9, color: '#444444', alignment: 'left', width: '100%' },
  //                 ],
  //               },
  //             ],
  //             width: '56%',
  //             margin: [0, 0, 5, 0]
  //           },
  //           {
  //             columns: [
  //               {
  //                 stack: [
  //                   { text: 'Tel : 1-800-18-6266', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
  //                   { text: 'W : www.nanog.com.my', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
  //                   { text: 'S : fb.com/nanogmalaysia', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' }
  //                 ]
  //               }
  //             ],
  //             alignment: 'right'
  //           }
  //         ]
  //       },
  //       {
  //         canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
  //         margin: [0, 0, 0, 10],
  //       },
  //       {
  //         columns: [
  //           {
  //             text: ' ',
  //             width: '50%',
  //           },
  //           {
  //             stack: [
  //               { alignment: 'right', text: 'Service Form', fontSize: 20, color: '#6DAD48', bold: 'true', width: '20%', margin: [0, 0, 0, 10] },
  //               {
  //                 columns: [
  //                   { text: 'Issue Date:', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
  //                   { text: this.today, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
  //                 ],
  //               },
  //               {
  //                 columns: [
  //                   { text: 'SER No:', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
  //                   { text: this.quoteid, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
  //                 ],
  //                 width: 'auto',
  //                 alignment: 'right'
  //               },
  //             ],
  //           },
  //         ],
  //         width: '100%',
  //         alignment: 'right'
  //       },
  //       {
  //         canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
  //         margin: [0, 0, 0, 10],
  //       },
  //       {
  //         columns: [
  //           { text: 'Customer Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
  //         ]
  //       },
  //       {
  //         columns: [
  //           { text: 'Company Name', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //           { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //           { text: (this.services.company_name ? this.services.company_name : '-'), fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
  //         ]
  //       },
  //       {
  //         columns: [
  //           { text: 'Name', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //           { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //           { text: this.services.customer_name, fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
  //         ]
  //       },
  //       {
  //         columns: [
  //           { text: 'Phone', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //           { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //           { text: this.services.customer_phone, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //         ]
  //       },
  //       // {
  //       //   columns: [
  //       //     { text: 'IC', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //       //     { text: this.services.icno, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     { text: 'Email', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //       //     { text: this.services.customer_email, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     { text: 'Mailing Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //       //     { text: this.services.mailing_address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //       //   ]
  //       // },

  //       {
  //         columns: [
  //           { text: 'Installation Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //           { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //           { text: this.services.address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //         ]
  //       },
  //       // { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
  //       // {
  //       //   columns: [
  //       //     { text: 'Customer residence/office information', fontSize: 12, width: '100%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     { text: 'Type of Residence', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //       //     { text: this.services.residence_type, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //       //   ]
  //       // },

  //       // {
  //       //   columns: [
  //       //     { text: 'Residential Status', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
  //       //     { text: this.services.residential_status, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
  //       //   ]
  //       // },
  //       { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
  //       { text: 'Installation Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 5], alignment: 'left', },
  //       this.table(this.service,
  //         [
  //           { text: 'services', style: "tableHeader" },
  //           { text: 'area', style: "tableHeader" },
  //           { text: 'sqft', style: "tableHeader" },
  //           { text: 'name', style: "tableHeader" },
  //           { text: 'warranty', style: "tableHeader" },
  //           // { text: 'rate', style: "tableHeader" },
  //           // { text: 'total', style: "tableHeader" }
  //         ],
  //       ),
  //       {
  //         columns: [
  //           { text: 'Remarks', fontSize: 12, width: '100%', bold: true, margin: [0, 10, 0, 2], alignment: 'left', },
  //         ]
  //       },

  //       this.remarkarray(),
  //       // this.extraservicetable(),
  //       // {
  //       //   columns: [
  //       //     { text: '' },
  //       //     { text: 'Subtotal: ', alignment: 'left', width: '14%', margin: [1, 20, 0, 0], fontSize: 9, color: '#444444' },
  //       //     { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '15%', margin: [0, 20, 1, 0], fontSize: 9, color: '#444444' },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     {},
  //       //     { text: this.discounttext, alignment: 'left', width: '14%', margin: [1, 2, 0, 0], fontSize: this.fontsize, color: '#444444' },
  //       //     { text: '- RM ' + this.deductpricestring, alignment: 'right', width: '15%', margin: [0, 2, 1, 0], fontSize: this.fontsize, color: '#444444' },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     {},
  //       //     { text: this.discounttext2, alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 9, color: '#444444' },
  //       //     { text: '- RM ' + this.dnumber, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 9, color: '#444444' },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     {},
  //       //     { text: 'Total: ', alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 11 },
  //       //     { text: 'RM ' + this.total, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 11 },
  //       //   ],
  //       // },
  //       {
  //         canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
  //         margin: [0, 0, 0, 10],
  //       },
  //       // {
  //       //   columns: [
  //       //     { text: 'Payment Mode', fontSize: 9, width: '15%', bold: true, alignment: 'left' },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center' },
  //       //     { text: this.services.payment_mode, fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
  //       //   ]
  //       // },
  //       // {
  //       //   columns: [
  //       //     { text: 'Conditional Offer', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left' },
  //       //     { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
  //       //     { text: this.services.conditional_status, fontSize: 9, width: 'auto', color: '#444444', margin: [0, 2, 0, 0], alignment: 'left' },
  //       //   ]
  //       // },
  //       {
  //         columns: [
  //           { text: 'Installation Date', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left' },
  //           { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
  //           { text: this.createdatestring(), fontSize: 8, width: 'auto', color: '#444444', margin: [0, 3, 0, 0], alignment: 'left' },
  //         ]
  //       },
  //       {
  //         canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
  //         margin: [0, 0, 0, 10],
  //       },

  //       {
  //         columns: [
  //           {
  //             stack: [
  //               { text: 'Sales Executive Information', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2] },
  //               this.searray(),
  //               { text: 'Workers Information', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2] },
  //               this.workerarray(),
  //             ],
  //             width: '100%'
  //           }

  //         ]
  //       },

  //       // { canvas: [{ type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
  //       // { text: 'Signed By : ' + this.services.customer_name, width: '100%', alignment: 'right', color: '#000000', margin: [2, 2, 2, 2], fontSize: 9 },

  //       {
  //         columns: [
  //           {
  //             stack: [
  //               { text: 'Worker Signature', fontSize: 11, width: '50%', bold: true, margin: [0, 20, 0, 4], alignment: 'left' },
  //               {
  //                 columns: [
  //                   {
  //                     stack: [
  //                       {
  //                         image: imageSign2,
  //                         width: 100,
  //                       },
  //                     ],
  //                   },
  //                 ],
  //                 margin: [0, 5, 0, 0],
  //                 alignment: 'left',
  //                 width: '50%',
  //               },
  //             ]
  //           },
  //           {
  //             stack: [
  //               { text: 'Customer Signature', fontSize: 11, width: '50%', bold: true, margin: [0, 20, 0, 4], alignment: 'right' },
  //               {
  //                 columns: [
  //                   {
  //                     stack: [
  //                       {
  //                         image: imageSign,
  //                         width: 100,
  //                       },
  //                     ],
  //                   },
  //                 ],
  //                 margin: [0, 5, 0, 0],
  //                 alignment: 'right',
  //                 width: '50%',
  //               },
  //             ]
  //           }

  //         ]
  //       },

  //       { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 120, y2: 10, lineWidth: 0.5 }, { type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
  //       {
  //         columns: [
  //           {
  //             stack: [
  //               {
  //                 text: 'Signed By : ' + 'Worker',
  //                 width: '50%',
  //                 alignment: 'left',
  //                 color: '#000000',
  //                 margin: [2, 2, 2, 2],
  //                 fontSize: 9
  //               }
  //             ]
  //           },
  //           {
  //             stack: [
  //               {
  //                 text: 'Signed By : ' + this.services.customer_name,
  //                 width: '50%',
  //                 alignment: 'right',
  //                 color: '#000000',
  //                 margin: [2, 2, 2, 2],
  //                 fontSize: 9
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ],
  //     styles: {
  //       tableData: {
  //         alignment: "center",
  //         fontSize: 9,
  //         margin: [2, 2, 2, 2],
  //         color: '#5c5b5b'
  //       },
  //       tableHeader: {
  //         fontSize: 11,
  //         alignment: "center",
  //       },
  //       boldText: {
  //         bold: true
  //       },
  //       dataItem: {
  //         fontSize: 9,
  //         margin: [0, 0, 0, 4],
  //       },
  //       dataItem2: {
  //         fontSize: 9,
  //         margin: [0, 0, 0, 2],
  //       },
  //     }
  //   };

  //   console.log(docDefinition);

  //   this.uploadpdf(docDefinition).then((a) => {
  //     let pdfurl = a['serviceform']

  //     this.checkPdf(pdfurl)

  //     // this.ngOnInit()
  //   })
  // }

  // checkPdf(x) {
  //   // window.open(x, '_blank');
  //   fetch(x)
  //     .then((response: Response) => {
  //       // Ensure the response is successful (status code 200) before processing the data
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       // Return the response as an ArrayBuffer
  //       return response.arrayBuffer();
  //     })
  //     .then((arrayBuffer: ArrayBuffer) => {
  //       // Create a Blob from the ArrayBuffer with the correct content type
  //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

  //       // Create a URL for the Blob
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url)
  //       console.log(url)
  //       // Set the URL to the iframe to display the PDF content
  //       // document.querySelector('iframe').src = url;
  //     })
  //     .catch((error: any) => {
  //       console.error('Error fetching or processing the PDF:', error);
  //     });
  // }

  // getBase64ImageFromURL(url) {
  //   return new Promise(async (resolve, reject) => {
  //     var img = new Image();
  //     img.setAttribute("crossOrigin", "anonymous");


  //     img.onload = () => {
  //       var canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       var ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);
  //       var dataURL = canvas.toDataURL("image/png");
  //       resolve(dataURL);
  //     };
  //     img.onerror = error => {
  //       reject(error);
  //     };
  //     img.src = url + "?not-from-cache-please";

  //   });
  // }

  // uploadpdf(x) {
  //   let temppdf = {} as any
  //   return new Promise((resolve, reject) => {
  //     pdfMake.createPdf(x).getDataUrl((dataUrl) => {
  //       this.http.post('https://api.nanogapp.com/uploadServiceFilePDF', { base64: dataUrl, pdfname: this.quoteid }).subscribe((link) => {
  //         console.log(link)

  //         let now = Date.now()

  //         temppdf.serviceform = link['imageURL']

  //         temppdf.create_date = now


  //         Swal.close()

  //         if (!this.services.sales_id) {
  //           Swal.fire({
  //             text: 'Something went wrong...kindly to reload the page',
  //             heightAuto: false,
  //             timer: 1500,
  //             icon: 'error'
  //           })
  //         }
  //         else {
  //           this.http.post('https://api.nanogapp.com/uploadServiceForm', {
  //             sales_id: this.services.sales_id,
  //             quoteid: this.services.serviceformid,
  //             lead_id: this.services.lead_id,
  //             userid: 3,
  //             by: 'Project Manager',
  //             latest_serviceform: temppdf['serviceform'],
  //           }).subscribe((res) => {
  //             if (res['success'] == true) {
  //               console.log(temppdf)
  //               resolve(temppdf)
  //             }
  //           })
  //         }


  //       }, awe => {
  //         resolve('done')
  //       })
  //     });
  //   })

  // }

  // getpdf(x, type) {
  //   let pdfurl = x

  //   window.open(pdfurl, '_system')
  //   if (!window.open(pdfurl, '_system')) {
  //     window.location.href = pdfurl;
  //   }
  // }

  // async getservicenum() {
  //   return new Promise((resolve, reject) => {
  //     this.servicenum = String(this.services.sales_order_number);
  //     console.log(this.servicenum);

  //     // Check if the length is less than 5 digits
  //     if (this.servicenum.length < 5) {
  //       // Pad with leading zeros to make it 5 digits
  //       for (let i = 0; i <= 5 - this.servicenum.length; i++) {
  //         this.servicenum = '0' + this.servicenum;
  //         console.log(this.servicenum);
  //       }
  //     }

  //     // Resolve the Promise with the updated servicenum
  //     resolve(this.servicenum);
  //   });
  // }

  // workerarray() {
  //   let workerbody = [] as any
  //   if (this.services.assigned_worker && this.services.assigned_worker.length > 0) {
  //     this.services.assigned_worker.forEach(a => {
  //       // const dataitem = a.user_name + '\n ' + a.user_phone_no + '\n ' + a.user_email;
  //       const dataitem = a.user_name
  //       workerbody.push({ text: dataitem, style: 'dataItem' });
  //     })

  //     return workerbody

  //   }
  //   else {
  //     return []
  //   }
  // }

  // searray() {
  //   let workerbody = [] as any
  //   if (this.sales_list.se_data && this.sales_list.se_data.length > 0) {

  //     this.sales_list.se_data.forEach(a => {
  //       // const dataitem = a.user_name + '\n ' + a.user_phone_no + '\n ' + a.user_email;
  //       const dataitem = a.se_name + '\n ' + a.se_phone
  //       workerbody.push({ text: dataitem, style: 'dataItem' });
  //     })

  //     return workerbody

  //   }
  //   else {
  //     return []
  //   }
  // }

  // remarkarray() {
  //   let remarkbody = [] as any
  //   if (this.services.schedule_remarks && this.services.schedule_remarks.length > 0) {
  //     this.services.schedule_remarks.forEach(a => {
  //       const dataitem = a.schedule_remark;
  //       remarkbody.push({ text: dataitem, style: 'dataItem2' });
  //     })


  //     return remarkbody

  //   }
  //   else {
  //     return []
  //   }
  // }

  lengthof(x) {
    return x ? x.length : 0
  }

  installAssign(x, i) {
    if (!this.sales_package[i].from_date2) {
      this.sales_package[i].from_date2 = []
    }
    this.sales_package[i].from_date2.push(new Date(x).getTime())
  }

  installDelete(x, i) {
    this.sales_package[i].from_date2.splice(this.sales_package[i].from_date2.indexOf(x), 1)
  }

}

