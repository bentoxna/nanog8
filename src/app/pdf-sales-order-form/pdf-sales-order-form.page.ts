import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;

@Component({
  selector: 'app-pdf-sales-order-form',
  templateUrl: './pdf-sales-order-form.page.html',
  styleUrls: ['./pdf-sales-order-form.page.scss'],
})
export class PdfSalesOrderFormPage implements OnInit {

  customer = [] as any
  user = {} as any

  userid
  taskid
  salesid

  appointment = {} as any
  subtask = [] as any
  filtercustomer = {} as any
  permission = 1
  open
  payment_date
  today = this.changeformat(new Date())
  quotations = {} as any
  service
  service2 = [] as any
  packages = [] as any

  rate
  total
  subtotal
  subtotalstring

  deductprice
  discount2photo = false

  sales_status
  status

  discountselected = [] as any
  discounts
  totaldiscount = 0
  discountselected2 = [] as any
  totaldiscountphoto = [] as any
  discountimageurl = [] as any
  localstoragediscount = [] as any
  discountstatus

  promocode
  promocodedetail = {} as any
  promocodeverifystatus
  promocodeexpire
  promocodeinput = true
  promocodechecking = false
  promocodeapplied = false
  promocodereset = false

  pdffileurl = [] as any
  pdffilename = [] as any

  custompdffileurl = [] as any
  custompdffilename = [] as any

  tab1 = true
  tab2 = false

  dpercentage
  dnumber
  totaldiscountdisplay
  discounttext

  fontsize
  loading = false

  quotation
  quotationlink
  selectedquotation

  constructor(
    //  private fileOpener: FileOpener,
    private file: File,
    private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private document: DocumentViewer,
    private platform: Platform,
    private datePipe : DatePipe) { }

  ngOnInit() {
    Swal.fire({
      title: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false,
      allowOutsideClick: false,
    })

    this.route.queryParams.subscribe(a => {
      this.userid = a.uid
      this.taskid = a.tid
      this.salesid = a['sid']

      console.log(this.taskid)
      this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
        this.user = res['data']
        console.log(this.user)

      })

      this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
        this.discounts = a['data']
        console.log(this.discounts)

        this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe((s) => {
          this.appointment = s['data']
          console.log(this.appointment)
          this.service = s['data']['sales_packages']
          this.quotation = s['data']['gen_quotation'].map(a => a['pdf'].split('/')[4])
          this.quotationlink = s['data']['gen_quotation'].map(a => a['pdf'])
          this.createdatestring()
          console.log(this.quotation)
          console.log(this.service)
          for (let i = 0; i < this.service.length; i++) {
            this.service2[i] = this.service[i]
            this.service[i].area == 'others' ? this.service2[i].area = this.service[i].other_area : this.service2[i].area = this.service2[i].area
            this.service[i].sqft == 'others' ? this.service2[i].sqft = this.service[i].size : this.service2[i].sqft = this.service[i].sqft
            this.service2[i].name == null ? this.service2[i].name = 'Other Package' : this.service2[i].name = this.service[i].name
            this.service2[i].discount = this.service[i].total_after ? Number(this.service[i].total - this.service[i].total_after).toFixed(2) : 0
          }
          console.log(this.service, this.service2)
          this.sales_status = s['data']['sales_status']
          console.log(s['data']['salesorderform_list'])
          this.pdffileurl = s['data']['salesorderform_list'] || []
          console.log(this.pdffileurl)
          // if(this.pdffileurl.length > 0)
          // {
          //   for (let i = 0; i < this.pdffileurl.length; i++) {
          //     console.log(this.pdffileurl[i])
          //     this.pdffilename.push(this.pdffileurl[i]['pdf'].split('/')[4])
          //   }
          // }

          // this.custompdffileurl = s['data']['custom_quotation']
          // console.log(this.custompdffileurl)
          // if(this.custompdffileurl.length > 0)
          // {
          //   for (let i = 0; i < this.custompdffileurl.length; i++) {
          //     console.log(this.custompdffileurl[i])
          //     this.custompdffilename.push(this.custompdffileurl[i]['pdf'].split('/')[4])
          //   }
          // }

          // console.log(this.custompdffilename)
          console.log(this.promocodedetail)
          console.log(this.appointment.promo_id)
          if (!this.appointment.promo_id) {
            this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
              console.log(a)
              this.dpercentage = 0
              this.dnumber = 0
              a['data'].filter(b => b['type'] == true ? ((b['status'] == true || b['status'] == null) ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage) : this.dnumber += b['percentage'])
              this.gettotal()
            })
            this.discounttext = 'Discount:'
          }
          else if (this.appointment.promo_id) {
            this.dpercentage = this.appointment.promo_percent
            this.gettotal2()
            this.discounttext = 'Discount(P): '
          }

          if (this.appointment.checkin_latt == null || this.appointment.checkin_long == null || this.appointment.checkin_time == null || this.appointment.checkin_img == null) {
            this.appointment.checkin_status = 'havent'
          }
          else {
            this.appointment.checkin_status = 'checked'
          }

          Swal.close()
          this.loading = true
        })


      })
    })
  }

  datestring = ''
  createdatestring(){
    let temp = this.appointment['installation_date']
    console.log(temp)

      if(temp.length == 1)
      {
        temp[0].from_date ? this.datestring =  this.datePipe.transform(Number(temp[0].from_date),'yyyy-MM-dd yyyy-MM-dd hh:mm a')  : this.datestring
      }
      else if(temp.length > 1)
      {
        for(let i = 0; i < temp.length; i++)
        {
          if(temp[i].from_date)
          {
            if(i == 0)
            {
              this.datestring =  this.datePipe.transform(Number(temp[i].from_date),'yyyy-MM-dd yyyy-MM-dd hh:mm a')
            }
            else{
              this.datestring = [this.datestring, this.datePipe.transform(Number(temp[i].from_date),'yyyy-MM-dd hh:mm a')].join(', ')
              console.log(this.datestring)
            }

          }
          else if(!temp[i].from_date)
          {
            this.datestring = this.datestring
          }

      }
      }

   
    console.log(this.datestring)
  }

  selectedquotationlink

  viewquotationpdf() {
    let index = this.quotationlink.findIndex(a => a.split('/')[4] == this.selectedquotation)
    console.log(this.quotationlink[index])
    this.selectedquotationlink = this.quotationlink[index]
    this.getpdf(this.quotationlink[index], 'system')
  }

  async getDiscount(x) {
    this.discountstatus = x
    this.totaldiscount = 0
    this.totaldiscountphoto = []
    this.discountselected = []
    this.discountselected2 = []

    console.log(this.appointment.discount_applied)
    return new Promise((resolve, reject) => {
      this.localstoragediscount = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))
      console.log(x)

      if (x == 'fromdatabase' || x == 'fromlocal') {
        console.log(this.discounts)
        console.log(x)
        this.filterdiscount(x)

        console.log(this.totaldiscountphoto)
        console.log(this.totaldiscount)
        console.log(this.discountselected2)
      }
      resolve('done')
    })
  }

  gettotal() {
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    let tempdeduct
    let temp = 0
    if (this.appointment.sales_packages) {
      this.appointment.sales_packages.forEach(a => {
        this.subtotal += a['total_after'] ? a['total_after'] : a['total']

        temp = this.subtotal * this.dpercentage / 100
        tempdeduct = (temp / 100 * 100).toFixed(2)
      });

      console.log(this.subtotal)
    }

    if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && this.dpercentage == 0 && this.dnumber == 0) {

      this.total = this.subtotal + this.appointment.scaff_fee + this.appointment.skylift_fee
    }
    else if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && ((this.dpercentage != 0 || this.dnumber != 0) || (this.dpercentage != 0 && this.dnumber != 0))) {
      this.total = this.subtotal - tempdeduct - this.dnumber + this.appointment.scaff_fee + this.appointment.skylift_fee
    }

    this.deductprice = Number(tempdeduct) + Number(this.dnumber)
    this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.totaldiscountdisplay = (this.dpercentage / 100 * 100).toFixed(2)

    console.log(this.deductprice, this.total, this.subtotalstring, this.totaldiscountdisplay)
  }

  gettotal2() {
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    this.appointment.sales_packages.forEach(a => {
      this.subtotal += a['total_after'] ? a['total_after'] : a['total']
      console.log(a['total_after'])
      this.deductprice = (this.subtotal * this.dpercentage / 100).toFixed(2)

      console.log(this.subtotal)
    });

    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.total = this.subtotal - this.deductprice + this.appointment.scaff_fee + this.appointment.skylift_fee
    this.total = (this.total / 100 * 100).toFixed(2)
  }


  // gettotal() {
  //   this.total = 0
  //   this.subtotal = 0
  //   this.deductprice = 0
  //   console.log(this.totaldiscount)

  //   if (this.appointment.sales_packages != null && this.appointment.sales_packages.length > 0 && this.totaldiscount == 0) {
  //     this.appointment.sales_packages.forEach(a => {
  //       this.subtotal += a.total
  //     });
  //     this.deductprice = this.subtotal / 100 * this.totaldiscount
  //     this.total = this.subtotal
  //   }
  //   else if (this.appointment.sales_packages != null && this.appointment.sales_packages.length > 0 && this.totaldiscount != 0) {
  //     this.appointment.sales_packages.forEach(a => {
  //       this.subtotal += a.total
  //     });
  //     this.deductprice = this.subtotal / 100 * this.totaldiscount
  //     this.total = this.subtotal / 100 * (100 - this.totaldiscount)
  //   }

  //   this.deductprice = this.deductprice.toFixed(2)
  //   this.total = this.total.toFixed(2)
  //   this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
  //   console.log(this.totaldiscount, this.total, this.deductprice)
  //   // this.rate.includes('Discount2') ? this.discount2photo = true : this.discount2photo = false

  // }

  // gettotal2() {
  //   this.total = 0
  //   this.subtotal = 0
  //   this.deductprice = 0
  //   console.log(this.totaldiscount)

  //   if (this.appointment.sales_packages != null && this.appointment.sales_packages.length > 0 && this.totaldiscount == 0) {
  //     this.appointment.sales_packages.forEach(a => {
  //       this.subtotal += a.total
  //     });
  //     this.deductprice = this.subtotal / 100 * this.totaldiscount
  //     this.total = this.subtotal
  //   }
  //   else if (this.appointment.sales_packages != null && this.appointment.sales_packages.length > 0 && this.totaldiscount != 0) {
  //     this.appointment.sales_packages.forEach(a => {
  //       this.subtotal += a.total
  //     });
  //     this.deductprice = this.subtotal / 100 * this.totaldiscount
  //     this.total = this.subtotal / 100 * (100 - this.totaldiscount)
  //   }

  //   this.deductprice = this.deductprice.toFixed(2)
  //   this.total = this.total.toFixed(2)
  //   this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
  //   console.log(this.totaldiscount, this.total, this.deductprice)
  //   // this.rate.includes('Discount2') ? this.discount2photo = true : this.discount2photo = false

  // }

  async filterdiscount(x) {
    return new Promise((resolve, reject) => {
      if (x == 'fromlocal') {
        this.discountselected = this.discountselected = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))
        console.log(this.discountselected)
      }
      else if (x == 'fromdatabase') {
        if (this.appointment.discount_applied != null && this.appointment.discount_applied != undefined && this.discounts) {
          for (let i = 0; i < this.appointment.discount_applied.length; i++) {
            let finddiscount = this.discounts.findIndex(a => a['id'] == this.appointment.discount_applied[i])
            if (finddiscount != -1) {
              this.discountselected.push(this.discounts[finddiscount])
            }
          }
        }
        console.log(this.discountselected)
        console.log('run here for fromdatabase')
      }
      resolve('done')
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
    console.log(combine)
    return combine
  }

  tableBody(data, columns) {
    var body = [] as any;
    body.push(columns);

    for (let i = 0; i < data.length; i++) {
      var dataRow = [] as any;

      for (let j = 0; j < columns.length; j++) {
        console.log(columns)
        console.log(data[i][columns[j]]);
        console.log(columns[j]);
        console.log(columns[j]["text"]);
        console.log(data[i][columns[j]["text"]]);

        if (columns[j]["text"] == "area") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "name") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "services") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "sqft") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "warranty") {
          dataRow.push({ text: (data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0).toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "rate") {
          dataRow.push({ text: "RM " + (Math.round((data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "total") {
          dataRow.push({ text: "RM " + (Math.round((data[i]['total_after'] ? data[i]['total_after'] : data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }
      }
      body.push(dataRow);
    }

    columns[0].text = "Service"
    columns[1].text = "Area"
    columns[2].text = "Size(sqft)"
    columns[3].text = "Package"
    columns[4].text = "Warranty"
    columns[5].text = "Rate(RM)"
    columns[6].text = "Price(RM)"
    return body
  }


  table(data, columns) {
    return {
      table: {
        layout: 'lightHorizontalLines', // optional
        headerRows: 1,
        widths: ['16%', '16%', '13%', '16%', '13%', '13%', '13%'],
        body: this.tableBody(data, columns)
      }
    };
  }


  createpdf() {

    Swal.fire(
      {
        text: 'Are you sure to create sales order form for this appointment?',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
        icon: 'info',
      }
    ).then(a => {
      if (a['isConfirmed'] == true) {
        Swal.fire(
          {
            icon: 'info',
            title: 'Processing...',
            heightAuto: false,
            showConfirmButton: false,
          }
        )
        let status
        if (!this.appointment.sales_status) {
          status = 'Quotation'
        }
        else {
          status = this.appointment.sales_status
        }

        this.openpdf()

        // this.http.post('https://api.nanogapp.com/updateSalesQuotation', {
        //   sales_id: this.appointment.sales_id,
        //   sales_status: status,
        //   total: this.total,
        //   sub_total : this.subtotal,
        // }).subscribe(res => {
        //   if (res['success'] == true) {
        //       Swal.close()
        //       this.openpdf()
        //   }
        // })
      }
    })


  }

  SOFnum

  async getSOFnum() {

    return new Promise((resolve, reject) => {
      this.http.get('https://api.nanogapp.com/getSOFnumber').subscribe(a => {
        let num = a['data'][0]['sofkey'] + 1
        this.SOFnum = num
        if ((num + '').length < 5) {
          for (let i = 0; i < (5 - (num + '').length); i++) {
            this.SOFnum = '0' + this.SOFnum
          }
          resolve(this.SOFnum);
        }
        else if ((num + '').length >= 5) {
          this.SOFnum = '' + this.SOFnum
          resolve(this.SOFnum);
        }

        console.log(this.SOFnum)

      })
    })



  }

  quoteid

  async openpdf() {
    this.deductprice == 0 ? this.fontsize = 0 : this.fontsize = 9
    // let quoteid =  (this.appointment.id ? this.appointment.id : '0000') + '/' + (this.appointment.gen_quotation.length + 1) + '/' + new Date().getFullYear() + (((new Date().getMonth() + 1) + '').length < 2 ? ('0' + (new Date().getMonth() + 1) ): ('' + (new Date().getMonth() + 1))) + 
    // ((new Date().getDate() + '').length < 2 ? ('0' + new Date().getDate() ): ('' + new Date().getDate())) + '/' + ((new Date().getHours() + '').length < 2 ? ('0' + new Date().getHours() ): ('' + new Date().getHours())) +
    // ((new Date().getMinutes() + '').length < 2 ? ('0' + new Date().getMinutes() ): ('' + new Date().getMinutes()))
    this.quoteid = 'SOF/KV/A' + await this.getSOFnum()
    Swal.fire({
      text: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false,
    })

    var docDefinition = {
      content: [
        // {
        //   columns: [
        //     { alignment: 'right', text: 'Sales Order Form', style: 'boldText', fontSize: 20, margin: [0, 0, 0, 10] }
        //   ]
        // },
        // {
        //   columns: [
        //     [
        //       { text: 'Address : ', fontSize: 11, width: '45%', margin: [0, 0, 0, 2], bold: true, color: '#000000', alignment: 'left' },
        //       { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 10, width: '45%', color: '#444444', alignment: 'left' },
        //       {
        //         columns: [
        //           { text: 'Tel : ', fontSize: 11, width: 'auto', margin: [0, 8, 2, 2], bold: true, color: '#000000', alignment: 'left' },
        //           { text: '1-800-18-6266', fontSize: 11, width: '45%', margin: [0, 8, 0, 1], color: '#444444', alignment: 'left' }
        //         ]
        //       }
        //     ],
        //     [
        //       { text: '', width: '10%' }
        //     ],
        //     [
        //       {
        //         image: await this.getBase64ImageFromURL(
        //           "assets/icon/nano-g-nb.png"
        //         ),
        //         width: 150,
        //         alignment: 'right',
        //       },
        //       {
        //         text: ' ',
        //         fontSize: 2,
        //         width: 150,
        //         alignment: 'right',
        //       },
        //       {
        //         text: '201401003990 (1080064-V)',
        //         fontSize: 10,
        //         width: 150,
        //         alignment: 'right',
        //       },
        //     ]
        //   ],
        //   width: '100%',
        // },
        // { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }] },
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
            [
              { text: 'NANO G CENTRAL SDN BHD 201401003990 (1080064-V)', fontSize: 9, width: '100%', color: '#444444', margin: [0, 0, 0, 3] },
              {
                columns: [

                  { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 9, width: '60%', color: '#444444', alignment: 'left' },
                  {text: '', width: '3%'},
                  [
                    {
                      columns: [
                        { text: 'Tel : ', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#444444', alignment: 'left' },
                        { text: '1-800-18-6266', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#000000', alignment: 'left' },

                      ]
                    },
                    {
                      columns: [
                        { text: 'W : ', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#444444', alignment: 'left' },
                        { text: 'www.nanog.com.my', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#000000', alignment: 'left' }
                      ]
                    },
                    {
                      columns: [
                        { text: 'S : ', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#444444', alignment: 'left' },
                        { text: 'fb.com/nanogmalaysia', fontSize: 9, width: 'auto', margin: [0, 0, 0, 2], color: '#000000', alignment: 'left' }
                      ]
                    },
                    { text: '', width: '37%' },
                  ]

                ],
                width: '100%'
              },

            ],
            { alignment: 'left', text: 'Sales Order Form', fontSize: 14, color: '#444444', bold: 'true', width: '22%' }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              { text: 'Created by', fontSize: 11, width: '45%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
              { text: this.user.user_name + '(' + this.user.user_role + ')', fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_phone_no, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_email, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
            ],
            // [
            //   {

            //   }
            // ],
            [
              {
                columns: [
                  { text: 'Issue Date:', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
                  { text: this.today, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
                ],
              },
              {
                columns: [
                  { text: 'SOF No:', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
                  { text: this.quoteid, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
                ],
                width: 'auto',
                alignment: 'right'
              },
            ]
          ],
          width: '100%',
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
            { text: this.appointment.company_name, fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Name', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.customer_name, fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Phone', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.customer_phone, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'IC', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.icno, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Email', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.customer_email, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Mailing Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.mailing_address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },

        {
          columns: [
            { text: 'Installation Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
        {
          columns: [
            { text: 'Customer residence/office information', fontSize: 12, width: '100%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
          ]
        },
        {
          columns: [
            { text: 'Type of Residence', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.residence_type, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },

        {
          columns: [
            { text: 'Residential Status', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.appointment.residential_status, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
        // {
        //   columns: [
        //     [
        //       { text: 'Service Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 5], alignment: 'left', },
        //       { text: this.appointment.warranty < 1 ? 'Warranty: ' + 'no warranty' : ('Warranty: ' + this.appointment.warranty + ' year/s'), fontSize: 9, width: '45%', margin: [0, 0, 0, 5], alignment: 'left', },
        //     ]
        //   ]
        // },
        { text: 'Order & Payment Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 5], alignment: 'left', },
        this.table(this.service,
          [
            { text: 'services', style: "tableHeader" },
            { text: 'area', style: "tableHeader" },
            { text: 'sqft', style: "tableHeader" },
            { text: 'name', style: "tableHeader" },
            { text: 'warranty', style: "tableHeader" },
            { text: 'rate', style: "tableHeader" },
            { text: 'total', style: "tableHeader" }
          ],
        ),
        {
          style: 'tableExample',
          table: {
            layout: 'lightHorizontalLines',
            widths: ['33%', '33%'],
            body: [
              [
                { text: 'Additional Service', style: "tableHeader" },
                { text: 'Price(RM)', style: "tableHeader" }
              ],
              [
                [
                  { text: 'ScaffHolding', alignment: 'center', style: 'tableData' }
                ],
                [
                  { text: this.appointment.scaff_fee ? 'RM ' + this.appointment.scaff_fee : '-', alignment: 'center', style: 'tableData' }

                ],

              ],
              [
                [

                  { text: 'Skylift', alignment: 'center', style: 'tableData' }
                ],
                [
                  { text: this.appointment.skylift_fee ? 'RM ' + this.appointment.skylift_fee : '-', alignment: 'center', style: 'tableData' }
                ],
              ],
              [
                [

                  { text: 'Transportation', alignment: 'center', style: 'tableData' }
                ],
                [
                  { text: this.appointment.transportation_fee ? 'RM ' + this.appointment.transportation_fee : '-', alignment: 'center', style: 'tableData' }
                ],
              ]
            ]
          },
          margin: [0, 15, 0, 0],
        },
        {
          columns: [
            { text: '' },
            { text: 'Subtotal: ', alignment: 'left', width: '14%', margin: [1, 20, 0, 0], fontSize: 9, color: '#444444' },
            { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '15%', margin: [0, 20, 1, 0], fontSize: 9, color: '#444444' },
          ]
        },
        {
          columns: [
            {},
            { text: this.discounttext, alignment: 'left', width: '14%', margin: [1, 2, 0, 0], fontSize: this.fontsize, color: '#444444' },
            { text: '- RM ' + this.deductprice, alignment: 'right', width: '15%', margin: [0, 2, 1, 0], fontSize: this.fontsize, color: '#444444' },
          ]
        },
        // {
        //   columns: [
        //     {},
        //     { text: this.discounttext2, alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 9, color: '#444444' },
        //     { text: '- RM ' + this.dnumber, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 9, color: '#444444' },
        //   ]
        // },
        {
          columns: [
            {},
            { text: 'Total: ', alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 11 },
            { text: 'RM ' + this.total, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 11 },
          ],
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: 'Payment Mode', fontSize: 9, width: '15%', bold: true, alignment: 'left'},
            { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center'},
            { text: this.appointment.payment_mode, fontSize: 9,width: 'auto', color: '#444444', alignment: 'left'},
          ]
        },
        {
          columns: [
            { text: 'Conditional Offer', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left'},
            { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
            { text: this.appointment.conditional_status, fontSize: 9,width: 'auto', color: '#444444', margin: [0, 2, 0, 0], alignment: 'left'},
          ]
        },
        {
          columns: [
            { text: 'Installation Date', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left'},
            { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
            { text: this.datestring, fontSize: 8,width: 'auto', color: '#444444', margin: [0, 3, 0, 0], alignment: 'left'},
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: 'Customer Signature', fontSize: 12, width: '100%', bold: true, margin: [0, 0, 0, 2], alignment: 'right', },
          ]
        },
        {
          columns: [
            {
              stack: [
                {
                  image: await this.getBase64ImageFromURL(
                    this.appointment.customer_signature
                  ),
                  width: 100,
                },
              ],
            },
          ],
          margin: [0, 20, 0, 0],
          alignment: 'right', // Move the container (and image) to the right side
          width: '100%',
        },
        { canvas: [{ type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5  }] },
        { text: 'Signed By : ' + this.appointment.customer_name, width: '100%', alignment: 'right', color: '#000000', margin: [2, 2, 2, 2], fontSize: 9 },
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
        }
      }
    };

    console.log(docDefinition)

    this.uploadpdf(docDefinition).then((a) => {
      console.log(a)
      let pdfurl = a['sales_order_form']

      window.open(pdfurl, '_system')
      if (!window.open(pdfurl, '_system')) {
        window.location.href = pdfurl;
      }
      // let globalVariable = this
      // pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
      //   var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
      //   let binaryArray = utf8.buffer; // Convert to Binary...

      //   let fileName = 'sadasd' + ' - Payslip.pdf';
      //   let saveDir = cordova.file.dataDirectory;

      //   this.file.createFile(saveDir, fileName, true).then((fileEntry) => {
      //     fileEntry.createWriter((fileWriter) => {
      //       fileWriter.onwriteend = async () => {

      //         Swal.fire({
      //           title: 'Generating PDF',
      //           text: "Please Wait! Generating the PDF...",
      //           icon: 'info',
      //           timer: 2000,
      //           heightAuto: false,
      //           showCancelButton: false,
      //           showConfirmButton: false
      //         }).then(function (result) {

      //           console.log(result.dismiss);

      //           if (result.dismiss === Swal.DismissReason.timer) {
      //             // globalVariable.fileOpener.open(
      //             //   saveDir + fileName,
      //             //   'application/pdf');

      //             console.log(saveDir + fileName,'application/pdf', '_system')


      //             window.open(saveDir + fileName,'application/pdf', '_system')
      //           }

      //         });
      //       };
      //       fileWriter.onerror = (e) => {
      //         console.log('file writer - error event fired: ' + e.toString());
      //       };
      //       fileWriter.write(binaryArray);
      //       console.log(binaryArray)
      //     });
      //   });
      // });
    })




  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
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

      img.src = url;
    });
  }

  uploadpdf(x) {
    let temppdf = {} as any
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(x).getDataUrl((dataUrl) => {
        console.log(dataUrl);
        console.log(this.quoteid)
        this.http.post('https://api.nanogapp.com/uploadSOFFilePDF', { base64: dataUrl, pdfname: this.quoteid }).subscribe((link) => {
          console.log(link)

          let now = Date.now()

          temppdf.sales_order_form = link['imageURL']
          temppdf.create_date = now
          this.pdffileurl.push(temppdf)
          console.log(this.pdffileurl)

          Swal.close()

          // this.pdffilename.push(link['imageURL'].split('/')[4])
          // console.log(link['imageURL']);
          // console.log(this.pdffilename)
          // console.log(this.pdffileurl)
          this.http.post('https://api.nanogapp.com/uploadGenSalesOrderForm', {
            sales_id: this.salesid,
            appointment_id: this.appointment.appointment_id,
            // orderform : JSON.stringify(this.pdffileurl) || [],
            lead_id: this.appointment.lead_id,
            userid: this.userid,
            by: this.user.user_name,
            latest_orderform: temppdf['sales_order_form'],
          }).subscribe((res) => {
            if (res['success'] == true) {
              console.log(this.pdffileurl)
              resolve(temppdf)
            }
          })

        }, awe => {
          console.log(awe);
          resolve('done')
        })
      });
    })

  }

  back() {
    this.nav.pop()
  }

  changetab(x) {
    if (x == 'tab1') {
      this.tab1 = true
      this.tab2 = false
    }
    else if (x == 'tab2') {
      this.tab2 = true
      this.tab1 = false
    }
  }

  getpdf(x, type) {
    let pdfurl
    // if(type == 'system')
    // {
    // this.pdffileurl.filter(a => a['pdf'].split('/')[4] == x ? pdfurl = a['pdf'] : pdfurl = pdfurl)
    // }
    // else if(type == 'custom')
    // {
    //   this.custompdffileurl.filter(a => a['pdf'].split('/')[4] == x ? pdfurl = a['pdf'] : pdfurl = pdfurl)
    // }
    pdfurl = x
    console.log(pdfurl)


    // var windowReference = window.open();
    // windowReference.location.href = pdfurl;

    window.open(pdfurl, '_system')
    if (!window.open(pdfurl, '_system')) {
      window.location.href = pdfurl;
    }

    // var windowReference = window.open();
    // windowReference.location = pdfurl
    // myService.getUrl().then(function(url) {
    //   windowReference.location = url;
    // });
    // const options: DocumentViewerOptions = {
    //   title: 'My PDF'
    // }

    // this.document.viewDocument(pdfurl, 'application/pdf', options)
  }

  platformType() {
    return this.platform.platforms()
  }

  popup = false

  clicktopop() {
    this.popup = !this.popup
    console.log(this.popup)
  }
}

