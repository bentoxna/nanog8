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
import { async } from '@angular/core/testing';
// import * as tobase64 from 'image-to-base64';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;

@Component({
  selector: 'app-pdf-service-form',
  templateUrl: './pdf-service-form.page.html',
  styleUrls: ['./pdf-service-form.page.scss'],
})
export class PdfServiceFormPage implements OnInit {

  user = {} as any
  userid
  taskid
  salesid

  today = this.changeformat(new Date())
  service
  service2 = [] as any

  pdffileurl = {} as any

  loading = false

  services = [] as any
  installation_date = [] as any

  quoteid
  datestring = ''
  servicenum

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private platform: Platform,
    private datePipe: DatePipe) { }

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

        this.http.post('https://api.nanogapp.com/getSpecificLDetailPM', { sales_id: this.salesid}).subscribe((s) => {
          this.services = s['data'][0]
          console.log(this.services)
          this.service = s['data'][0]['sap']
          this.pdffileurl = s['data'][0]['serviceform'] ? s['data'][0]['serviceform'] : null

          for (let i = 0; i < this.service.length; i++) {
            this.service2[i] = this.service[i]
            for (let j = 0; j < this.service[i].from_date2.length; j++) {
              this.installation_date.push(this.service[i]['from_date2'][j])
              console.log(this.installation_date)
            }

            this.service[i].area == 'others' ? this.service2[i].area = this.service[i].other_area : this.service2[i].area = this.service2[i].area
            this.service[i].sqft == 'others' ? this.service2[i].sqft = this.service[i].size : this.service2[i].sqft = this.service[i].sqft
            this.service2[i].name == null ? this.service2[i].name = 'Other Package' : this.service2[i].name = this.service[i].name
          }

          Swal.close()
          this.loading = true

          // this.remarkarray()
          // this.workerarray()
        })

    })
  }

  createdatestring() {
    let temp = [] as any
    this.installation_date.forEach(a => {
      if(!temp.includes(a))
      {
        temp.push(a)
      }
    });

    if (!temp) {
      this.datestring = ''
    }
    else if (temp && temp.length == 1) {
      temp[0] ? this.datestring = this.datePipe.transform(Number(temp[0]), 'yyyy-MM-dd hh:mm a') : this.datestring
  
    }
    else if (temp && temp.length > 1) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]) {
          if (i == 0) {
            this.datestring = this.datePipe.transform(Number(temp[i]), 'yyyy-MM-dd hh:mm a')
          }
          else {
            this.datestring = [this.datestring, this.datePipe.transform(Number(temp[i]), 'yyyy-MM-dd hh:mm a')].join(', ')
          }

        }
        else if (!temp[i]) {
          this.datestring = this.datestring
        }

      }
    }
    return this.datestring
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
    columns[3].text = "Package"
    columns[4].text = "Warranty(yr)"
    // columns[5].text = "Rate(RM)"
    // columns[6].text = "Price(RM)"
    return body
  }


  remarkarray() {
    let remarkbody = [] as any
    if (this.services.schedule_remarks && this.services.schedule_remarks.length > 0) {
      this.services.schedule_remarks.forEach(a => {
        const dataitem = a.schedule_remark;
        remarkbody.push({text : dataitem, style: 'dataItem2'});
      })


      return remarkbody

    }
    else
    {
      return []
    }
  }


  workerarray() {
    let workerbody = [] as any
    if (this.services.assigned_worker && this.services.assigned_worker.length > 0) {
      this.services.assigned_worker.forEach(a => {
        const dataitem = a.user_name + '\n ' +  a.user_phone_no + '\n ' + a.user_email;
        workerbody.push({text : dataitem, style: 'dataItem'});
      })


      return workerbody

    }
    else
    {
      return []
    }
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

  createpdf() {

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

  async getservicenum() {

    return new Promise((resolve, reject) => {
      console.log(this.services.sales_id)
      let num = this.services.sales_order_number
      let tempnum = '' + this.services.sales_order_number
      if ((num + '').length < 5) {
        for (let i = 0; i < (5 - (num + '').length); i++) {
          tempnum = '0' + tempnum
          console.log(tempnum)
        }
        resolve(tempnum);
      }
      else if ((num + '').length >= 5) {
        tempnum = '' + tempnum
        resolve(tempnum);
      }

        // this.http.post('https://api.nanogapp.com/getServiceFormnumber', {sales_id : this.services.sales_id}).subscribe(a => {
        //   let num : Number
        //   if(a['data'][0]['id'])
        //   {
        //     num =  a['data'][0]['id']
        //     this.services.serviceformid = a['data'][0]['id']
        //   }
        //   else
        //   {
        //     num = a['data'][0]['sofkey'] + 1
        //   }

        //   this.servicenum = num
        //   if ((num + '').length < 5) {
        //     for (let i = 0; i < (5 - (num + '').length); i++) {
        //       this.servicenum = '0' + this.servicenum
        //     }
        //     resolve(this.servicenum);
        //   }
        //   else if ((num + '').length >= 5) {
        //     this.servicenum = '' + this.servicenum
        //     resolve(this.servicenum);
        //   }
        // })
      })
  }

  async openpdf() {
    this.quoteid = 'SOF/NANO-' + await this.getservicenum()

    Swal.fire({
      text: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false,
    })

    let imageSign = await this.getBase64ImageFromURL(this.services.sub_cust_sign)
    let imageSign2 = await this.getBase64ImageFromURL(this.services.sub_sub_sign)


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
                    { text: 'SOF No:', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
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
            { text: this.services.company_name, fontSize: 9, bold: true, color: '#444444', margin: [2, 0.5, 1, 0.5] },
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
        {
          columns: [
            { text: 'IC', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.icno, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Email', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.customer_email, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        {
          columns: [
            { text: 'Mailing Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.mailing_address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },

        {
          columns: [
            { text: 'Installation Address', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.address, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
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
            { text: this.services.residence_type, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },

        {
          columns: [
            { text: 'Residential Status', fontSize: 9, color: '#444444', width: '25%', margin: [0, 0, 0, 0] },
            { text: ':', fontSize: 9, color: '#444444', width: '5%', alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.services.residential_status, fontSize: 9, color: '#444444', alignment: 'left', margin: [2, 0.5, 1, 0.5] },
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 520, y2: 10 }], margin: [0, 0, 0, 10] },
        { text: 'Installation Information', fontSize: 12, width: '45%', bold: true, margin: [0, 0, 0, 5], alignment: 'left', },
        this.table(this.service,
          [
            { text: 'services', style: "tableHeader" },
            { text: 'area', style: "tableHeader" },
            { text: 'sqft', style: "tableHeader" },
            { text: 'name', style: "tableHeader" },
            { text: 'warranty', style: "tableHeader" },
            // { text: 'rate', style: "tableHeader" },
            // { text: 'total', style: "tableHeader" }
          ],
        ),
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
        {
          columns: [
            { text: 'Installation Date', fontSize: 9, width: '15%', bold: true, margin: [0, 2, 0, 0], alignment: 'left' },
            { text: ':', fontSize: 9, color: '#444444', width: '2%', alignment: 'center', margin: [0, 2, 0, 0] },
            { text: this.createdatestring(), fontSize: 8, width: 'auto', color: '#444444', margin: [0, 3, 0, 0], alignment: 'left' },
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
                { text: 'Workers Information', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2] },
                this.workerarray(),
              ],
              width: '45%'
            },
            {
              stack: [
                { text: 'Customer Signature', fontSize: 11, width: '55%', bold: true, margin: [0, 0, 0, 2], alignment: 'right' },
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
                  width: '65%',
                },
              ]
            }

          ]
        },

        { canvas: [{ type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
        { text: 'Signed By : ' + this.services.customer_name, width: '100%', alignment: 'right', color: '#000000', margin: [2, 2, 2, 2], fontSize: 9 },

        {
          columns: [
            { 
              stack: [
                { text: 'Worker Signature', fontSize: 11, width: '55%', bold: true, margin: [0, 20, 0, 4], alignment: 'right' },
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
                  alignment: 'right',
                  width: '65%',
                },
              ]
            }

          ]
        },

        { canvas: [{ type: 'line', x1: 400, y1: 10, x2: 520, y2: 10, lineWidth: 0.5 }] },
        { text: 'Signed By : ' + 'Worker', width: '100%', alignment: 'right', color: '#000000', margin: [2, 2, 2, 2], fontSize: 9 },
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

    this.uploadpdf(docDefinition).then((a) => {
      let pdfurl = a['serviceform']

      window.open(pdfurl, '_system')
      if (!window.open(pdfurl, '_system')) {
        window.location.href = pdfurl;
      }

      this.ngOnInit()
    })
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

          if(!this.services.sales_id)
          {
            Swal.fire({
              text: 'Something went wrong...kindly to reload the page',
              heightAuto: false,
              timer: 1500,
              icon : 'error'
            })
          }
          else
          {
            this.http.post('https://api.nanogapp.com/uploadServiceForm', {
              sales_id: this.services.sales_id,
              quoteid :  this.services.serviceformid,
              lead_id: this.services.lead_id,
              userid: this.userid,
              by: this.user.user_name,
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

  back() {
    this.nav.pop()
  }

  getpdf(x, type) {
    let pdfurl = x

    window.open(pdfurl, '_system')
    if (!window.open(pdfurl, '_system')) {
      window.location.href = pdfurl;
    }
  }

  platformType() {
    return this.platform.platforms()
  }

  popup = false

  clicktopop() {
    this.popup = !this.popup
    // console.log(this.popup)
  }
}


