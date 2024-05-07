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

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;

@Component({
  selector: 'app-pdf-quotation',
  templateUrl: './pdf-quotation.page.html',
  styleUrls: ['./pdf-quotation.page.scss'],
})
export class PdfQuotationPage implements OnInit {

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
  deductpricestring

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

  warranty = [0, 1, 2, 3, 4, 5, 6, 7]
  selectedwarranty

  quotationnumber

  constructor(
    //  private fileOpener: FileOpener,
    private file: File,
    private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private document: DocumentViewer,
    private platform: Platform) { }

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

      this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
        this.user = res['data']
      })

      this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
        this.discounts = a['data']

        this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe((s) => {
          this.appointment = s['data']
          // console.log(this.appointment)
          this.service = s['data']['sales_packages']
          for (let i = 0; i < this.service.length; i++) {
            this.service2[i] = this.service[i]
            this.service[i].area == 'others' ? this.service2[i].area = this.service[i].other_area : this.service2[i].area = this.service2[i].area
            this.service[i].sqft == 'others' ? this.service2[i].sqft = this.service[i].size : this.service2[i].sqft = this.service[i].sqft
            this.service2[i].name == null ? this.service2[i].name = 'Other Package' : this.service2[i].name = this.service[i].name
            this.service2[i].discount = this.service[i].total_after ? Number(this.service[i].total - this.service[i].total_after).toFixed(2) : 0
          }
          this.sales_status = s['data']['sales_status']
          this.pdffileurl = s['data']['gen_quotation']

          if (this.pdffileurl.length > 0) {
            for (let i = 0; i < this.pdffileurl.length; i++) {
              this.pdffilename.push(this.pdffileurl[i]['pdf'].split('/')[4])
            }
          }

          this.custompdffileurl = s['data']['custom_quotation']
          if (this.custompdffileurl.length > 0) {
            for (let i = 0; i < this.custompdffileurl.length; i++) {
              this.custompdffilename.push(this.custompdffileurl[i]['pdf'].split('/')[4])
            }
          }
          if (!this.appointment.promo_id) {
            this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
              this.dpercentage = 0
              this.dnumber = 0
              a['data'].filter(b => b['type'] ? ((b['status'] == true || b['status'] == null) ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage) : this.dnumber += b['percentage'])

              this.gettotal()
            })
            this.discounttext = 'Discount: '
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

  handleChange() {
    // // console.log(x['detail']['value'])
    // let warranty = x['detail']['value']
    this.http.post('https://api.nanogapp.com/updateworkingduration', { working_duration: this.appointment.working_duration, salesid: this.salesid }).subscribe(a => {
      Swal.fire({
        text: 'working duration updated',
        icon: 'success',
        heightAuto: false,
        showConfirmButton: false,
        timer: 1000,
      }).then(a => {
        this.ngOnInit()
      })

    })
  }

  async getDiscount(x) {
    this.discountstatus = x
    this.totaldiscount = 0
    this.totaldiscountphoto = []
    this.discountselected = []
    this.discountselected2 = []

    return new Promise((resolve, reject) => {
      this.localstoragediscount = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))


      if (x == 'fromdatabase' || x == 'fromlocal') {
        this.filterdiscount(x)
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
    }

    if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && this.dpercentage == 0 && this.dnumber == 0) {

      this.total = this.subtotal + this.appointment.scaff_fee + this.appointment.skylift_fee + this.appointment.transportation_fee
    }
    else if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && ((this.dpercentage != 0 || this.dnumber != 0) || (this.dpercentage != 0 && this.dnumber != 0))) {
      this.total = this.subtotal - tempdeduct - this.dnumber + this.appointment.scaff_fee + this.appointment.skylift_fee + this.appointment.transportation_fee
    }

    this.deductprice = Number(tempdeduct) + Number(this.dnumber)
    // this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    // this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.subtotalstring = ((this.appointment.sales_packages.map(a => a['total']).reduce((a, b) => a + b)) + this.appointment.skylift_fee + this.appointment.scaff_fee + this.appointment.transportation_fee).toFixed(2)
    this.deductpricestring = ((this.appointment.sales_packages.map(a => Number(a['discount'])).reduce((a, b) => a + b)) + this.deductprice).toFixed(2)
    this.totaldiscountdisplay = (this.dpercentage / 100 * 100).toFixed(2)
  }

  gettotal2() {
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    this.appointment.sales_packages.forEach(a => {
      this.subtotal += a['total_after'] ? a['total_after'] : a['total']
      this.deductprice = (this.subtotal * this.dpercentage / 100).toFixed(2)
    });

    // this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.subtotalstring = ((this.appointment.sales_packages.map(a => a['total']).reduce((a, b) => a + b)) + this.appointment.skylift_fee + this.appointment.scaff_fee + this.appointment.transportation_fee).toFixed(2)
    this.deductpricestring = ((this.appointment.sales_packages.map(a => Number(a['discount'])).reduce((a, b) => a + b)) + Number(this.deductprice)).toFixed(2)
    this.total = this.subtotal - this.deductprice + this.appointment.scaff_fee + this.appointment.skylift_fee + this.appointment.transportation_fee
    this.total = (this.total / 100 * 100).toFixed(2)
  }


  // gettotal() {
  //   this.total = 0
  //   this.subtotal = 0
  //   this.deductprice = 0
  //   // console.log(this.totaldiscount)

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
  //   // console.log(this.totaldiscount, this.total, this.deductprice)
  //   // this.rate.includes('Discount2') ? this.discount2photo = true : this.discount2photo = false

  // }

  // gettotal2() {
  //   this.total = 0
  //   this.subtotal = 0
  //   this.deductprice = 0
  //   // console.log(this.totaldiscount)

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
  //   // console.log(this.totaldiscount, this.total, this.deductprice)
  //   // this.rate.includes('Discount2') ? this.discount2photo = true : this.discount2photo = false

  // }

  async filterdiscount(x) {
    return new Promise((resolve, reject) => {
      if (x == 'fromlocal') {
        this.discountselected = this.discountselected = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))

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
    return combine
  }

  tableBody(data, columns) {
    var body = [] as any;

    body.push(columns);

    for (let i = 0; i < data.length; i++) {
      var dataRow = [] as any;

      for (let j = 0; j < columns.length; j++) {

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
        // else if (columns[j]["text"] == "sub_total") {
        //   dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString(), style: "tableData" });
        // }
        else if (columns[j]["text"] == "rate") {
          dataRow.push({ text: "RM " + (Math.round((data[i][columns[j]["text"]] ? data[i][columns[j]["text"]] : 0) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }
        // else if (columns[j]["text"] == "discount") {
        //   dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        // }


        // else if (columns[j]["text"] == "total") {
        //   dataRow.push({ text: "RM " + (Math.round((data[i]['total_after'] ? data[i]['total_after'] : data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        // }
        else if (columns[j]["text"] == "total") {
          dataRow.push({ text: "RM " + (Math.round((data[i]['total']) * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }


        // else if (columns[j]["text"] == "height") {
        //   dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString() + ' (ft)', style: "tableData" });
        // }



        // else {
        //   // console.log(data[i][columns[j]["text"]]);
        //   dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        // }

      }

      body.push(dataRow);
    }
    //Change Table's header
    columns[0].text = "Service"
    columns[1].text = "Area"
    columns[2].text = "Size(sqft)"
    columns[3].text = "Package"
    columns[4].text = "Warranty(yr)"
    columns[5].text = "Rate(RM)"
    columns[6].text = "Price(RM)"

    // { text: 'services', style: "tableHeader" },
    // { text: 'area', style: "tableHeader" }, 
    // { text: 'sqft', style: "tableHeader" },
    // { text: 'name', style: "tableHeader" }, 
    // { text: 'warranty', style: "tableHeader" }, 
    // { text: 'rate', style: "tableHeader" }, 
    // { text: 'total', style: "tableHeader" }
    return body
  }


  table(data, columns) {
    return {
      table: {
        layout: 'lightHorizontalLines', // optional
        headerRows: 1,
        widths: ['15%', '15%', '13%', '16%', '15%', '13%', '13%'],
        // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: this.tableBody(data, columns)
      }
    };
  }


  createpdf() {
    Swal.fire(
      {
        text: 'Are you sure to create quotation for this appointment?',
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

        this.returnquotenumber().then(a => {
          // console.log(a)
          this.http.post('https://api.nanogapp.com/updateSalesQuotation', {
            quote_no: a,
            sales_id: this.appointment.sales_id,
            sales_status: status,
            total: this.total,
            sub_total: this.subtotal,
          }).subscribe(res => {
            if (res['success'] == true) {
              Swal.close()
              this.openpdf()
            }
          })
        })


      }
    })
  }

  async returnquotenumber() {
    return new Promise((resolve, reject) => {
      this.quotationnumber = this.appointment.sales_id
      resolve(this.quotationnumber)
      // if(this.appointment.quote_no)
      // {
      //   this.quotationnumber = this.appointment.quote_no
      //   // console.log(this.quotationnumber)
      //   resolve(this.quotationnumber)
      // }
      // else{
      //  this.http.get('https://api.nanogapp.com/getquotationNumber').subscribe(a => {
      //       // console.log(a)
      //       this.quotationnumber = (a['data']['count'] + 1)
      //       // console.log(this.quotationnumber)
      //       resolve(this.quotationnumber)
      //   })
      // }
    })

  }

  extraservicetable() {
    if (this.appointment.scaff_fee > 0 || this.appointment.skylift_fee > 0 || this.appointment.transportation_fee > 0) {

      let items = [
        [
          { text: 'Additional Service', style: "tableHeader" },
          { text: 'Price(RM)', style: "tableHeader" }
        ],

      ] as any

      if (this.appointment.scaff_fee) {
        items.push(
          [
            [
              { text: 'Scaffolding', alignment: 'center', style: 'tableData' }
            ],
            [
              { text: this.appointment.scaff_fee ? 'RM ' + this.appointment.scaff_fee : '-', alignment: 'center', style: 'tableData' }

            ],

          ],
        )
      }

      if (this.appointment.skylift_fee) {
        items.push(
          [
            [

              { text: 'Skylift', alignment: 'center', style: 'tableData' }
            ],
            [
              { text: this.appointment.skylift_fee ? 'RM ' + this.appointment.skylift_fee : '-', alignment: 'center', style: 'tableData' }
            ],
          ],
        )
      }

      if (this.appointment.transportation_fee) {
        items.push(
          [
            [

              { text: 'Transportation', alignment: 'center', style: 'tableData' }
            ],
            [
              { text: this.appointment.transportation_fee ? 'RM ' + this.appointment.transportation_fee : '-', alignment: 'center', style: 'tableData' }
            ],
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

  quoteid
  returnzeroquote
  returnzero(x) {
    let temp = x + ''
    let temp2 = x + ''
    for (let i = (x + '').length; i < 5; i++) {
      temp = '0' + temp
    }
    return temp
  }

  // + '/' + new Date().getFullYear() + (((new Date().getMonth() + 1) + '').length < 2 ? ('0' + (new Date().getMonth() + 1) ): ('' + (new Date().getMonth() + 1))) + 
  //   ((new Date().getDate() + '').length < 2 ? ('0' + new Date().getDate() ): ('' + new Date().getDate())) + '/' + ((new Date().getHours() + '').length < 2 ? ('0' + new Date().getHours() ): ('' + new Date().getHours())) +
  //   ((new Date().getMinutes() + '').length < 2 ? ('0' + new Date().getMinutes() ): ('' + new Date().getMinutes()))
  async openpdf() {
    Number(this.deductpricestring) == 0 ? this.fontsize = 0 : this.fontsize = 9


    this.quoteid = 'NGQ/A' + this.returnzero(this.quotationnumber) + '-' + this.appointment.gen_quotation.length
    Swal.fire({
      text: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false,
      allowOutsideClick: false
    })

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
              stack: [
                { text: 'From: ', fontSize: 11, width: '45%', bold: true, margin: [0, 2, 0, 2], alignment: 'left', },
                { text: this.user.user_name + '(' + this.user.user_role + ')', fontSize: 10, color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
                { text: this.user.user_phone_no, fontSize: 10, color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
                { text: this.user.user_email, fontSize: 10, color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              ],
              width: '45%'
            },
            {
              stack: [
                { alignment: 'right', text: 'Quotation', fontSize: 20, color: '#6DAD48', bold: 'true', width: '20%', margin: [0, 0, 0, 2] },
                {
                  columns: [
                    { text: 'Issue Date:', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
                    { text: this.today, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
                  ],
                },
                {
                  columns: [
                    { text: 'Quote No:', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
                    { text: this.quoteid, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
                  ],
                  width: 'auto',
                  alignment: 'right'
                },
              ],
            },
          ],
          width: '100%',
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              { text: 'Customer Info', fontSize: 11, width: '100%', bold: true, margin: [0, 2, 0, 2], alignment: 'left', },
              { text: this.appointment.customer_name, fontSize: 10, width: '100%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.customer_phone, fontSize: 10, width: '100%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.address, fontSize: 10, width: '100%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.customer_email, fontSize: 10, width: '100%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
            ],
          ],
          width: '100%',
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }],
          margin: [0, 0, 0, 10],
        },
        { text: 'Breakdown of fees (inclusive of materials and labor)', fontSize: 11, width: '100%', bold: true, margin: [0, 2, 0, 2], alignment: 'left', },
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
        // {
        //   style: 'tableExample',
        //   table: {
        //     layout: 'lightHorizontalLines',
        //     widths: ['33%', '33%'],
        //     body: [
        //       [
        //         { text: 'Additional Service', style: "tableHeader" },
        //         { text: 'Price(RM)', style: "tableHeader" }
        //       ],
        //       [
        //         [
        //           { text: 'Scaffolding', alignment: 'center', style: 'tableData' }
        //         ],
        //         [
        //           { text: this.appointment.scaff_fee ? 'RM ' + this.appointment.scaff_fee : '-', alignment: 'center', style: 'tableData' }

        //         ],

        //       ],
        //       [
        //         [

        //           { text: 'Skylift', alignment: 'center', style: 'tableData' }
        //         ],
        //         [
        //           { text: this.appointment.skylift_fee ? 'RM ' + this.appointment.skylift_fee : '-', alignment: 'center', style: 'tableData' }
        //         ],
        //       ],
        //       [
        //         [

        //           { text: 'Transportation', alignment: 'center', style: 'tableData' }
        //         ],
        //         [
        //           { text: this.appointment.transportation_fee ? 'RM ' + this.appointment.transportation_fee : '-', alignment: 'center', style: 'tableData' }
        //         ],
        //       ]
        //     ]
        //   },
        //   margin: [0, 15, 0, 0],
        // },
        this.extraservicetable(),

        {
          columns: [
            {
              text: 'Duration of works is estimated to last at approximately ' + (this.appointment.working_duration ? this.appointment.working_duration : 'x') + ' working day/s subject to climate factor.',
              width: '70%',
              alignment: 'left',
              margin: [0, 20, 10, 0],
              fontSize: 11
            },
            {
              stack: [
                {
                  columns: [
                    { text: 'Subtotal: ', alignment: 'left', margin: [0, 20, 0, 0], fontSize: 9, color: '#444444' },
                    { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '65%', margin: [0, 20, 0, 0], fontSize: 9, color: '#444444' },
                  ],
                },
                {
                  columns: [
                    { text: this.discounttext, alignment: 'left', fontSize: this.fontsize, margin: [0, 2, 0, 0], color: '#444444' },
                    { text: '- RM ' + this.deductpricestring, alignment: 'right', width: '65%', margin: [0, 2, 0, 0], fontSize: this.fontsize, color: '#444444' },
                  ],
                },
                {
                  columns: [
                    { text: 'Total: ', alignment: 'left', fontSize: 11, margin: [0, 5, 0, 0] },
                    { text: 'RM ' + this.total, alignment: 'right', width: '65%', margin: [0, 5, 0, 0], fontSize: 11 },
                  ],
                }
              ]
            },
          ],
          width: '100%',
        },
        {
          columns: [

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

          ],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }
          ],
          margin: [0, 10, 0, 10],
        },
        //signature
        // {
        //   columns: [
        //     {
        //       image: await this.getBase64ImageFromURL(
        //         "assets/icon/nano-g-nb.png"
        //       ),
        //       width: 150,
        //       alignment: 'right',
        //     },
        //   ],
        //   margin: [0, 60, 0, 0]
        // },
        // { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 150, y2: 10, lineWidth: 0.5  }] },
        // {
        //   columns: [
        //     { text: 'Signature by : ', width: 'auto', alignment: 'left', margin: [2, 2, 2, 2], fontSize: 11 },
        //   ],
        //   margin: [0, 5, 0, 0]
        // },


        { text: 'Payment Terms', fontSize: 11, width: '100%', bold: true, margin: [0, 2, 0, 2], alignment: 'left' },
        { text: '100% Full Payment Upon Confirmation', alignment: 'left', fontSize: 9 },

        { text: 'All Payment should be payable to: ', fontSize: 11, width: '100%', bold: true, margin: [0, 10, 0, 2], alignment: 'left' },
        { text: 'MAYBANK BERHAD', alignment: 'left', width: 'auto', fontSize: 10 },
        { text: 'Nano G Central Sdn Bhd', alignment: 'left', width: 'auto', fontSize: 10 },
        { text: '512978013332', alignment: 'left', width: 'auto', fontSize: 10 },


        { text: 'Quotation validity thirty (30) days from the date of issue', fontSize: 11, width: '100%', bold: true, margin: [0, 10, 0, 2], alignment: 'left' },


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


    this.uploadpdf(docDefinition).then((a) => {
      let pdfurl = a['pdf']

      window.open(pdfurl, '_system')
      if (!window.open(pdfurl, '_system')) {
        window.location.href = pdfurl;
      }

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
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(x).getDataUrl((dataUrl) => {

        this.http.post('https://api.nanogapp.com/uploadQFPDF', { base64: dataUrl, leadid: this.appointment.lead_id, salesid: this.salesid, no: this.returnzero(this.quotationnumber) + '-' + this.appointment.gen_quotation.length }).subscribe((link) => {


          let now = Date.now()
          let temppdf = {} as any
          temppdf.pdf = link['imageURL']
          temppdf.date = now
          this.pdffileurl.push(temppdf)


          Swal.close()

          this.pdffilename.push(link['imageURL'].split('/')[4])

          this.http.post('https://api.nanogapp.com/uploadGenQuotation', {
            sales_id: this.salesid,
            quotation: JSON.stringify(this.pdffileurl) || [],
            lead_id: this.appointment.lead_id,
            uid: this.userid,
            by: this.user.user_name,
            latest_quotation: this.pdffileurl[this.pdffileurl.length - 1]['pdf']
          }).subscribe((res) => {
            if (res['success'] == true) {

              resolve(temppdf)
            }
          })

        }, awe => {
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
    if (type == 'system') {
      this.pdffileurl.filter(a => a['pdf'].split('/')[4] == x ? pdfurl = a['pdf'] : pdfurl = pdfurl)
    }
    else if (type == 'custom') {
      this.custompdffileurl.filter(a => a['pdf'].split('/')[4] == x ? pdfurl = a['pdf'] : pdfurl = pdfurl)
    }


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


    // fetch('https://nanogbucket.s3.ap-southeast-1.amazonaws.com/nano/NGQ-A00261-0.pdf')
    // .then((response: Response) => {
    //   // Ensure the response is successful (status code 200) before processing the data
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }
    //   // Return the response as an ArrayBuffer
    //   return response.arrayBuffer();
    // })
    // .then((arrayBuffer: ArrayBuffer) => {
    //   // Create a Blob from the ArrayBuffer with the correct content type
    //   const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    //   // Create a URL for the Blob
    //   const url = window.URL.createObjectURL(blob);
    //   window.open(url)
    //   // console.log(url)
    //   // Set the URL to the iframe to display the PDF content
    //   // document.querySelector('iframe').src = url;
    // })
    // .catch((error: any) => {
    //   console.error('Error fetching or processing the PDF:', error);
    // });
  }

  platformType() {
    return this.platform.platforms()
  }

  popup = false

  clicktopop() {
    this.popup = !this.popup
  }

  request() {
    Swal.fire({
      text: 'Are you sure wan to request a official quotation?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed']) {
        this.http.post('https://api.nanogapp.com/requestCustomQuotation', {
          sales_id: this.salesid,
        }).subscribe((res) => {
          Swal.fire({
            text: 'Request Successfully',
            icon: 'success',
            heightAuto: false,
            timer: 1000
          })
        })
      }
    })

  }
}
