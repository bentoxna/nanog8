import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// declare var google;
import * as lodash from 'lodash'
import * as L from 'leaflet'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;
@Component({
  selector: 'app-completed-job-service',
  templateUrl: './completed-job-service.page.html',
  styleUrls: ['./completed-job-service.page.scss'],
})
export class CompletedJobServicePage implements OnInit {

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private navparam: NavParams,
    private datepipe: DatePipe,
  ) { }

  pdflist = [] as any
  uploadPdf = [] as any
  timeNow = new Date()
  sof = [] as any
  services = [] as any
  lead = [] as any
  // sales_custom_quotation = [] as any
  // lead_id = ''

  storeRemark = ''

  // Service Form
  loading = false
  quoteid
  servicenum
  service
  today = this.changeformat(new Date())
  datestring = ''
  installation_date = [] as any
  pdffileurl = {} as any
  service2 = [] as any
  sales_list = [] as any
  serform = [] as any
  appointment
  ngOnInit() {
    this.lead = this.navparam.get('lead')
    // this.service = this.navparam.get('service')
    // this.services = this.navparam.get('services')
    console.log(this.lead, this.service, this.services);

    this.refresh()

  }

  refresh() {
    // this.http.post('https://api.nanogapp.com/getsalesorderform', { id: this.lead_id }).subscribe((s) => {

    //   this.sof = s['data'].sort((a, b) => b.created_date - a.created_date)
    //   // this.sales_custom_quotation = this.sales.custom_quotation
    //   console.log('sof', this.sof);
    // })
    this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.lead.appointment_id }).subscribe((s) => {
      this.appointment = s['data']
      console.log(this.appointment);

    })

    this.http.post('https://api.nanogapp.com/getServiceFormByLead', { lead_id: this.lead.lead_id }).subscribe((s) => {

      this.serform = s['data']
      console.log('serform1', this.serform);
      if (this.serform && this.serform.length > 0) {
        // Sort the array in descending order based on timestamp
        this.serform.sort((a, b) => b.created_date - a.created_date);

        // Take the first element (latest one) and create a new array
        this.serform = [this.serform[0]];

      }
      console.log('serform', this.serform);
    })

    this.http.post('https://api.nanogapp.com/getSales', { appointment_id: this.lead.appointment_id }).subscribe((s) => {
      this.sales_list = s['data']
      console.log('sales', this.sales_list);

      this.http.post('https://api.nanogapp.com/getSpecificLDetailPM', { sales_id: this.lead.sales_id }).subscribe((s) => {
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

      })

      // this.calcDue()

      // if (this.sales_list.sub_team == null) {
      //   this.sales_list.sub_team = []
      // }

      // if (this.sales_list.sub_team.length > 0) {
      //   this.teamLists.forEach(x => {
      //     // Find the corresponding item in teamLists based on team_id
      //     const correspondingTeam = this.sales_list.sub_team.find(teamItem => teamItem.team_id === x.team_id);

      //     // If a corresponding team is found, set selected to true
      //     if (correspondingTeam) {
      //       x.selected = true;
      //     }
      //   });
      // }

      // if (s['data']) {

      //   if (this.sales_list.subcon_choice.length > 0) {
      //     this.keywordCompany = this.sales_list.subcon_choice.at(-1).company
      //   }
      //   // this.keywordCompany = this.sales_list.subcon_choice

      //   this.http.post('https://api.nanogapp.com/getAllScheduleBySales', { sales_id: this.sales_list.id }).subscribe((s) => {
      //     this.schedule_list = s['data'].sort((a, b) => a.id - b.id)
      //     console.log('schedule_list', this.schedule_list);

      //     if (this.schedule_list.length > 0) {
      //       this.schedule_date = this.schedule_list.at(-1).schedule_date
      //     }
      //   })

      //   this.http.post('https://api.nanogapp.com/getSpecificLDetailPM', { sales_id: this.sales_list.id }).subscribe((s) => {
      //     this.services = s['data'][0]
      //     console.log('services', this.services)
      //     this.service = s['data'][0]['sap']
      //     this.pdffileurl = s['data'][0]['serviceform'] ? s['data'][0]['serviceform'] : null

      //     for (let i = 0; i < this.service.length; i++) {
      //       this.service2[i] = this.service[i]
      //       for (let j = 0; j < this.service[i].from_date2.length; j++) {
      //         this.installation_date.push(this.service[i]['from_date2'][j])
      //         // console.log(this.installation_date)
      //       }

      //       this.service[i].area == 'others' ? this.service2[i].area = this.service[i].other_area : this.service2[i].area = this.service2[i].area
      //       this.service[i].sqft == 'others' ? this.service2[i].sqft = this.service[i].size : this.service2[i].sqft = this.service[i].sqft
      //       this.service2[i].name == null ? this.service2[i].name = 'Other Package' : this.service2[i].name = this.service[i].name
      //     }

      //     Swal.close()
      //     this.loading = true
      //   })

      // }


    })
  }

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

  submit() {
    Swal.fire(
      {
        text: 'Are you sure to create service form?',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
        icon: 'info',
      }
    ).then(a => {
      if (a['isConfirmed'] == true) {
        this.openpdf()
      }
    })
  }


  changeformat(dates) {
    let year = dates.getFullYear()
    let month = '' + (dates.getMonth() + 1)
    let date = '' + dates.getDate()

    if (month.length < 2) {
      month = '0' + month
    }
    if (date.length < 2) {
      date = '0' + date
    }

    let newdate = [year, month, date].join('-')
    let newdatehour = [new Date().getHours(), new Date().getMinutes()].join(':')
    let combine = [newdate, newdatehour].join(' ')
    return combine
  }

  createdatestring() {
    let temp = [] as any
    this.installation_date.forEach(a => {
      if (!temp.includes(a)) {
        temp.push(a)
      }
    });

    if (!temp) {
      this.datestring = ''
    }
    else if (temp && temp.length == 1) {
      temp[0] ? this.datestring = this.datepipe.transform(Number(temp[0]), 'd/M/yyyy hh:mm a') : this.datestring

    }
    else if (temp && temp.length > 1) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]) {
          if (i == 0) {
            this.datestring = this.datepipe.transform(Number(temp[i]), 'd/M/yyyy hh:mm a')
          }
          else {
            this.datestring = [this.datestring, this.datepipe.transform(Number(temp[i]), 'd/M/yyyy hh:mm a')].join(', ')
          }

        }
        else if (!temp[i]) {
          this.datestring = this.datestring
        }

      }
    }
    return this.datestring
  }

  extraservicetable() {
    if (this.appointment.scaff_fee > 0 || this.appointment.skylift_fee > 0 || this.appointment.transportation_fee > 0) {

      let items = [
        [
          { text: 'Additional Service', style: "tableHeader" },
          // { text: 'Price(RM)', style: "tableHeader" }
        ],

      ] as any

      if (this.appointment.scaff_fee) {
        items.push(
          [
            [
              { text: 'Scaffolding', alignment: 'center', style: 'tableData' }
            ],
            // [
            //   { text: this.appointment.scaff_fee ? 'RM ' + this.appointment.scaff_fee : '-', alignment: 'center', style: 'tableData' }

            // ],

          ],
        )
      }

      if (this.appointment.skylift_fee) {
        items.push(
          [
            [

              { text: 'Skylift', alignment: 'center', style: 'tableData' }
            ],
            // [
            //   { text: this.appointment.skylift_fee ? 'RM ' + this.appointment.skylift_fee : '-', alignment: 'center', style: 'tableData' }
            // ],
          ],
        )
      }

      if (this.appointment.transportation_fee) {
        items.push(
          [
            [

              { text: 'Transportation', alignment: 'center', style: 'tableData' }
            ],
            // [
            //   { text: this.appointment.transportation_fee ? 'RM ' + this.appointment.transportation_fee : '-', alignment: 'center', style: 'tableData' }
            // ],
          ],
        )
      }

      return {
        style: 'tableExample',
        table: {
          layout: 'lightHorizontalLines',
          widths: ['33%', '33%'],
          body: items
        },
        margin: [0, 15, 0, 0],
      };
    }
  }

  tableBody(data, columns) {
    var body = [] as any;
    body.push(columns);

    for (let i = 0; i < data.length; i++) {
      var dataRow = [] as any;

      for (let j = 0; j < columns.length; j++) {

        if (columns[j]["text"] == "area" || columns[j]["text"] == "services" || columns[j]["text"] == "sqft") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        } else if (columns[j]["text"] == "from_date2") {
          const dates = data[i][columns[j]["text"]];
          if (Array.isArray(dates) && dates.length > 0) {
            const formattedDates = dates.map(date => this.datepipe.transform(new Date(date), 'd/M/yyyy h:mm a'));
            dataRow.push({ text: formattedDates.join(", "), style: "tableData" });
          } else {
            dataRow.push({ text: '-', style: "tableData" });
          }
        } else if (columns[j]["text"] == "sub_completed") {
          if (data[i][columns[j]["text"]].length > 0) {
            dataRow.push({
              text: data[i][columns[j]["text"]][data[i][columns[j]["text"]].length - 1].status == true ?
                this.datepipe.transform(new Date(data[i][columns[j]["text"]][data[i][columns[j]["text"]].length - 1].updated_date), 'd/M/yyyy h:mm a') : '-',
              style: "tableData"
            });
          } else {
            dataRow.push({
              text: '-',
              style: "tableData"
            });
          }
        }

        // else if (columns[j]["text"] == "warranty") {
        //   dataRow.push({ text: (data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0).toString(), style: "tableData" });
        // }
        // else if (columns[j]["text"] == "rate") {
        //   dataRow.push({ text: "RM " + (Math.round((data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        // }
        // else if (columns[j]["text"] == "total") {
        //   dataRow.push({ text: "RM " + (Math.round((data[i]['total_after'] ? data[i]['total_after'] : data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        // }
        // else if (columns[j]["text"] == "total") {
        //   dataRow.push({ text: "RM " + (Math.round((data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        // }
      }
      body.push(dataRow);
    }

    columns[0].text = "Service"
    columns[1].text = "Area"
    columns[2].text = "Size(sqft)"
    columns[3].text = "Installation Date"
    columns[4].text = "Completed Date"
    // columns[3].text = "Package"
    // columns[4].text = "Warranty(yr)"
    // columns[5].text = "Rate(RM)"
    // columns[6].text = "Price(RM)"
    return body
  }

  table(data, columns) {
    return {
      table: {
        layout: 'lightHorizontalLines', // optional
        headerRows: 1,
        widths: ['20%', '20%', '20%', '20%', '20%'],
        body: this.tableBody(data, columns)
      }
    };
  }

  async openpdf() {
    this.quoteid = 'SER/NANO-' + await this.getservicenum()
    let tandc = `The Customer accepts that the terms and conditions herein are supplementary to the terms and conditions in the Sales Order Form and accepts to be bound by the terms and conditions in both the Sales Order Form and Service Form.
    
    1. Upon signing this Service Form, the Customer is deemed to have accepted that the service has been completed to the Customer’s satisfaction. For avoidance of the doubt, the Customer’s dissatisfaction towards the touch up work (mentioned in clause 8 of the Sales Order Form) shall not in any way be taken as Nano G’s failure in completing the service to the Customer’s satisfaction. 
    2. The installation must be completed within 30 days from the payment date. Failure to meet this timeframe will result in forfeiture of the payment.
    3. In the event the Customer is not satisfied with the service rendered, the Customer shall not sign this Service Form and shall contact Nano G Service Centre at 1800-18-6266 for further clarification.`

    Swal.fire({
      text: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false,
    })

    // let imageSign = await this.getBase64ImageFromURL(this.services.sub_cust_sign)
    // let imageSign2 = await this.getBase64ImageFromURL(this.services.sub_sub_sign)
    let imageSign = this.services.sub_cust_sign ? await this.getBase64ImageFromURL(this.services.sub_cust_sign) : await this.getBase64ImageFromURL("assets/icon/blank.png")
    let imageSign2 = this.services.sub_sub_sign ? await this.getBase64ImageFromURL(this.services.sub_sub_sign) : await this.getBase64ImageFromURL("assets/icon/blank.png")

    var docDefinition = {
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(
                "assets/icon/nano-g-nb.png"
              ),
              width: 100,
              alignment: 'left',
            },
            {
              text: '',
              width: '3%'
            },
            {
              columns: [
                {
                  stack: [
                    { text: 'NANO G CENTRAL SDN BHD 201401003990 (1080064-V)', fontSize: 9, color: '#444444', width: '100%' },
                    { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 9, color: '#444444', alignment: 'left', width: '100%' },
                  ],
                },
              ],
              width: '56%',
              margin: [0, 0, 5, 0]
            },
            {
              columns: [
                {
                  stack: [
                    { text: 'Tel : 1-800-18-6266', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
                    { text: 'W : www.nanog.com.my', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
                    { text: 'S : fb.com/nanogmalaysia', fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' }
                  ]
                }
              ],
              alignment: 'right'
            }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              text: ' ',
              width: '50%',
            },
            {
              stack: [
                { alignment: 'right', text: 'Service Form', fontSize: 20, color: '#6DAD48', bold: 'true', width: '20%', margin: [0, 0, 0, 10] },
                {
                  columns: [
                    { text: 'Issue Date:', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
                    { text: this.today, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
                  ],
                },
                {
                  columns: [
                    { text: 'SER No:', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
                    { text: this.quoteid, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
                  ],
                  width: 'auto',
                  alignment: 'right'
                },
              ],
            },
          ],
          width: '100%',
          alignment: 'right'
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: 'Customer Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
          ]
        },
        {
          columns: [
            { text: 'Company Name', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: (this.services.company_name ? this.services.company_name : '-'), fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Name', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.customer_name, fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Phone', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.customer_phone, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        // {
        //   columns: [
        //     { text: 'IC', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
        //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
        //     { text: this.services.icno, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
        //   ]
        // },
        // {
        //   columns: [
        //     { text: 'Email', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
        //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
        //     { text: this.services.customer_email, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
        //   ]
        // },
        // {
        //   columns: [
        //     { text: 'Mailing Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
        //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
        //     { text: this.services.mailing_address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
        //   ]
        // },

        {
          columns: [
            { text: 'Installation Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        // { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
        // {
        //   columns: [
        //     { text: 'Customer residence/office information', fontSize: 12, width: '100%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
        //   ]
        // },
        // {
        //   columns: [
        //     { text: 'Type of Residence', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
        //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
        //     { text: this.services.residence_type, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
        //   ]
        // },

        // {
        //   columns: [
        //     { text: 'Residential Status', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
        //     { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
        //     { text: this.services.residential_status, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
        //   ]
        // },
        { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
        { text: 'Installation Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 5], alignment: 'left', },
        this.table(this.service,
          [
            { text: 'services', style: "tableHeader" },
            { text: 'area', style: "tableHeader" },
            { text: 'sqft', style: "tableHeader" },
            { text: 'from_date2', style: "tableHeader" },
            { text: 'sub_completed', style: "tableHeader" },
            // { text: 'name', style: "tableHeader" },
            // { text: 'warranty', style: "tableHeader" },
            // { text: 'rate', style: "tableHeader" },
            // { text: 'total', style: "tableHeader" }
          ],
        ),
        this.extraservicetable(),
        {
          columns: [
            { text: 'Remarks', fontSize: 12, width: '100%', bold: true, margin: [0, 10, 0, 2], alignment: 'left', },
          ]
        },

        this.remarkarray(),
        // this.extraservicetable(),
        // {
        //   columns: [
        //     { text: '' },
        //     { text: 'Subtotal: ', alignment: 'left', width: '14%', margin: [1, 20, 0, 0], fontSize: 9, color: '#444444' },
        //     { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '15%', margin: [0, 20, 1, 0], fontSize: 9, color: '#444444' },
        //   ]
        // },
        // {
        //   columns: [
        //     {},
        //     { text: this.discounttext, alignment: 'left', width: '14%', margin: [1, 2, 0, 0], fontSize: this.fontsize, color: '#444444' },
        //     { text: '- RM ' + this.deductpricestring, alignment: 'right', width: '15%', margin: [0, 2, 1, 0], fontSize: this.fontsize, color: '#444444' },
        //   ]
        // },
        // {
        //   columns: [
        //     {},
        //     { text: this.discounttext2, alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 9, color: '#444444' },
        //     { text: '- RM ' + this.dnumber, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 9, color: '#444444' },
        //   ]
        // },
        // {
        //   columns: [
        //     {},
        //     { text: 'Total: ', alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 11 },
        //     { text: 'RM ' + this.total, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 11 },
        //   ],
        // },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        // {
        //   columns: [
        //     { text: 'Payment Mode', fontSize: 9, width: '15%', bold: true, alignment: 'left' },
        //     { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center' },
        //     { text: this.services.payment_mode, fontSize: 9, width: 'auto', color: '#444444', alignment: 'left' },
        //   ]
        // },
        // {
        //   columns: [
        //     { text: 'Conditional Offer', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left' },
        //     { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
        //     { text: this.services.conditional_status, fontSize: 9, width: 'auto', color: '#444444', margin: [0, 2, 0, 0], alignment: 'left' },
        //   ]
        // },
        // {
        //   columns: [
        //     { text: 'Installation Date', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left' },
        //     { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
        //     { text: this.createdatestring(), fontSize: 8, width: 'auto', color: '#444444', margin: [0, 3, 0, 0], alignment: 'left' },
        //   ]
        // },
        // {
        //   canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
        //   margin: [0, 0, 0, 10],
        // },

        {
          columns: [
            {
              stack: [
                { text: 'Workers Information', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2] },
                this.workerarray(),
              ],
              width: '50%',
              alignment: 'left',
            },
            {
              stack: [
                { text: 'Consultant Information', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2] },
                this.searray(),
              ],
              width: '50%',
              alignment: 'right'
            }

          ]
        },

        // { canvas: [{ type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
        // { text: 'Signed By : ' + this.services.customer_name, width: '100%', alignment: 'right', color: '#000000', margin: [2, 2, 2, 2], fontSize: 9 },

        {
          columns: [
            {
              stack: [
                { text: 'Worker Signature', fontSize: 11, width: '50%', bold: true, margin: [0, 20, 0, 4], alignment: 'left' },
                {
                  columns: [
                    {
                      stack: [
                        {
                          image: imageSign2,
                          width: 100,
                        },
                      ],
                    },
                  ],
                  margin: [0, 5, 0, 0],
                  alignment: 'left',
                  width: '50%',
                },
              ]
            },
            {
              stack: [
                { text: 'Customer Signature', fontSize: 11, width: '50%', bold: true, margin: [0, 20, 0, 4], alignment: 'right' },
                {
                  columns: [
                    {
                      stack: [
                        {
                          image: imageSign,
                          width: 100,
                        },
                      ],
                    },
                  ],
                  margin: [0, 5, 0, 0],
                  alignment: 'right',
                  width: '50%',
                },
              ]
            }

          ]
        },

        { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 120, y2: 10, lineWidth: 0.5 }, { type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
        {
          columns: [
            {
              stack: [
                {
                  text: (this.services.sub_sub_sign ? 'Signed By : Worker' : ''),
                  width: '50%',
                  alignment: 'left',
                  color: '#000000',
                  margin: [2, 2, 2, 2],
                  fontSize: 9
                }
              ]
            },
            {
              stack: [
                {
                  text: (this.services.sub_cust_sign ? 'Signed By : ' + this.services.customer_name : ''),
                  width: '50%',
                  alignment: 'right',
                  color: '#000000',
                  margin: [2, 2, 2, 2],
                  fontSize: 9
                }
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: 'Terms and Conditions',
              alignment: 'left',
              color: '#000000',
              margin: [2, 20, 2, 2],
              bold: true,
              fontSize: 9
            }
          ]
        },
        {
          columns: [
            {
              text: tandc,
              alignment: 'left',
              color: '#000000',
              margin: [2, 5, 2, 2],
              fontSize: 9
            }
          ]
        }
      ],
      styles: {
        tableData: {
          alignment: "center",
          fontSize: 9,
          margin: [2, 2, 2, 2],
          color: '#5c5b5b'
        },
        tableHeader: {
          fontSize: 11,
          alignment: "center",
        },
        boldText: {
          bold: true
        },
        dataItem: {
          fontSize: 9,
          margin: [0, 0, 0, 4],
        },
        dataItem2: {
          fontSize: 9,
          margin: [0, 0, 0, 2],
        },
      }
    };

    console.log(docDefinition);

    this.uploadpdf(docDefinition).then((a) => {
      let pdfurl = a['serviceform']

      this.checkPdf(pdfurl)
      this.refresh()
      // this.ngOnInit()
    })
  }

  checkPdf(x) {

    window.open(x)
  }

  checkPdf2(x) {
    // window.open(x, '_blank');
    fetch(x)
      .then((response: Response) => {
        // Ensure the response is successful (status code 200) before processing the data
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Return the response as an ArrayBuffer
        return response.arrayBuffer();
      })
      .then((arrayBuffer: ArrayBuffer) => {
        // Create a Blob from the ArrayBuffer with the correct content type
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        window.open(url)
        console.log(url)
        // Set the URL to the iframe to display the PDF content
        // document.querySelector('iframe').src = url;
      })
      .catch((error: any) => {
        console.error('Error fetching or processing the PDF:', error);
      });
  }

  getBase64ImageFromURL(url) {
    return new Promise(async (resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");


      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url + "?not-from-cache-please";

    });
  }

  uploadpdf(x) {
    let temppdf = {} as any
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(x).getDataUrl((dataUrl) => {
        this.http.post('https://api.nanogapp.com/uploadServiceFilePDF', { base64: dataUrl, pdfname: this.quoteid }).subscribe((link) => {
          console.log(link)

          let now = Date.now()

          temppdf.serviceform = link['imageURL']

          temppdf.create_date = now


          Swal.close()

          if (!this.services.sales_id) {
            Swal.fire({
              text: 'Something went wrong...kindly to reload the page',
              heightAuto: false,
              timer: 1500,
              icon: 'error'
            })
          }
          else {
            this.http.post('https://api.nanogapp.com/uploadServiceForm', {
              sales_id: this.services.sales_id,
              quoteid: this.services.serviceformid,
              lead_id: this.services.lead_id,
              userid: 3,
              by: 'Project Manager',
              latest_serviceform: temppdf['serviceform'],
            }).subscribe((res) => {
              if (res['success'] == true) {
                console.log(temppdf)
                resolve(temppdf)
              }
            })
          }


        }, awe => {
          resolve('done')
        })
      });
    })

  }

  getpdf(x, type) {
    let pdfurl = x

    window.open(pdfurl, '_system')
    if (!window.open(pdfurl, '_system')) {
      window.location.href = pdfurl;
    }
  }

  async getservicenum() {
    return new Promise((resolve, reject) => {
      this.servicenum = String(this.services.sales_order_number);
      console.log(this.servicenum);

      // Check if the length is less than 5 digits
      if (this.servicenum.length < 5) {
        // Pad with leading zeros to make it 5 digits
        for (let i = 0; i <= 5 - this.servicenum.length; i++) {
          this.servicenum = '0' + this.servicenum;
          console.log(this.servicenum);
        }
      }

      // Resolve the Promise with the updated servicenum
      resolve(this.servicenum);
    });
  }

  workerarray() {
    let workerbody = [] as any;
    if (this.services.worker && this.services.worker.length > 0) {

      this.services.worker.sort((a, b) => {
        if (a.role === 'leader') return -1;
        if (b.role === 'leader') return 1;
        return 0;
      });

      let leaders = [];
      let crewMembers = [];

      this.services.worker.forEach(a => {
        if (a.role === 'leader') {
          leaders.push(a.name);
        } else {
          crewMembers.push(a.name);
        }
      });

      // Push leaders first
      if (leaders.length > 0) {
        const leaderString = "(Leader) " + leaders.join(', ');
        workerbody.push({ text: leaderString, style: 'dataItem' });
      } else {
        // Push a placeholder for Leader
        workerbody.push({ text: "(Leader)", style: 'dataItem' });
      }

      // Push crew members
      if (crewMembers.length > 0) {
        const crewString = "(Crew) " + crewMembers.join(', ');
        workerbody.push({ text: crewString, style: 'dataItem' });
      } else {
        // Push a placeholder for Crew
        workerbody.push({ text: "(Crew)", style: 'dataItem' });
      }

      return workerbody;
    } else {
      workerbody.push({ text: "(Leader)", style: 'dataItem' });
      workerbody.push({ text: "(Crew)", style: 'dataItem' });
      return [];
    }
  }

  searray() {
    let workerbody = [] as any
    if (this.sales_list.se_data && this.sales_list.se_data.length > 0) {

      this.sales_list.se_data.forEach(a => {
        // const dataitem = a.user_name + '\n ' + a.user_phone_no + '\n ' + a.user_email;
        const dataitem = a.se_name + '\n ' + a.se_phone
        workerbody.push({ text: dataitem, style: 'dataItem' });
      })

      return workerbody

    }
    else {
      return []
    }
  }

  remarkarray() {
    let remarkbody = [] as any
    if (this.services.schedule_remarks && this.services.schedule_remarks.length > 0) {
      this.services.schedule_remarks.forEach(a => {
        const dataitem = a.schedule_remark;
        remarkbody.push({ text: dataitem, style: 'dataItem2' });
      })


      return remarkbody

    }
    else {
      return []
    }
  }

  lengthof(x) {
    return x ? x.length : 0
  }

  close() {
    this.modalController.dismiss()
  }


}

