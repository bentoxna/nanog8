import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import Swal from 'sweetalert2';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare let cordova: any;

@Component({
  selector: 'app-quotation-pdf',
  templateUrl: './quotation-pdf.page.html',
  styleUrls: ['./quotation-pdf.page.scss'],
})
export class QuotationPdfPage implements OnInit {
  userid
  taskid

  user
  task
  service

  subtotal = 0
  subtotalstring
  discount = 0
  discountamount
  total

  blob

  today = this.changeformat(new Date())

  quotation = {
    date: new Date(),
    id: 'Q0001'
  } as any

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    // private fileOpener: FileOpener,
    private file :File,
    private platform : Platform) { }


  ngOnInit() {

    this.quotation.date = this.changeformat(this.quotation.date)
    console.log(this.quotation.date)

    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.userid = a['uid']
      this.taskid = a['tid']

      this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
        this.user = res['data']
        console.log(this.user)
      })

      this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe(res => {
        this.task = res['data']
        this.service = res['data']['sales_packages']

        if (res['data']['discount'] == 0) {
          this.discount = 0
        }
        else if (res['data']['discount'] == 1) {
          this.discount = 5
        }
        else if (res['data']['discount'] == 2) {
          this.discount = 10
        }

        console.log(this.discount)

        for (let i = 0; i < res['data']['sales_packages'].length; i++) {
          this.subtotal = this.subtotal + res['data']['sales_packages'][i]['amount']
          console.log(res['data']['sales_packages'][i]['amount'])
          console.log('Total: ' + this.subtotal)
        }

        this.subtotalstring = (this.subtotal).toFixed(2).toString()
        this.discountamount = (this.subtotal / 100 * this.discount).toFixed(2).toString()
        console.log(this.discountamount)
        this.total = (this.subtotal / 100 * (100 - this.discount)).toFixed(2).toString()
        console.log(this.total)
        console.log(this.service)
        console.log(this.task)
      })
    })
  }

  createbrowser(x) {
    console.log(x)
    /** Process the type1 base64 string **/
    var myBaseString = x;
    // Split the base64 string in data and contentType
    var block = myBaseString.split(";");
    // Get the content type
    var dataType = block[0].split(":")[1];// In this case "application/pdf"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "JVBERi0xLjcKCjE...."
    // The path where the file will be created
    var folderpath = "file:///storage/emulated/0/";
    // The name of the PDF
    var filename = "mypdf.pdf";

    // this.b64toBlob(realData, dataType, 512);
    // console.log(this.blob)


    let content = x.split('base64,')[1]
    var byteCharacters = atob(realData);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: 'application/pdf;' });
    var fileURL = URL.createObjectURL(file);
    console.log(fileURL)
    // window.open(fileURL);

    // let url = encodeURIComponent(block[1]);

    // browser.executeScript(x);

    // browser.insertCSS(...);
    // browser.on('loadstop').subscribe(event => {
    //    browser.insertCSS({ code: "body{color: red;" });
    // });

    // browser.close();
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    this.blob = new Blob(byteArrays, { type: contentType });
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
    console.log(newdate)
    return newdate
  }

  tableBody(data, columns) {
    var body = [] as any;

    body.push(columns);

    for (let i = 0; i < data.length; i++) {
      var dataRow = [] as any;

      console.log(data);

      for (let j = 0; j < columns.length; j++) {
        console.log(data[i][columns[j]]);
        console.log(columns[j]);
        console.log(columns[j]["text"]);
        console.log(data[i][columns[j]["text"]]);

        if (columns[j]["text"] == "place") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        } else if (columns[j]["text"] == "name") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "service") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "width") {
          dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString() + ' (ft)', style: "tableData" });
        }
        else if (columns[j]["text"] == "height") {
          dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString() + ' (ft)', style: "tableData" });
        }
        else if (columns[j]["text"] == "amount") {
          dataRow.push({ text: "RM " + (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }
        else {
          console.log(data[i][columns[j]["text"]]);
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }

      }

      console.log(dataRow);

      body.push(dataRow);
      console.log(body)
    }
    //Change Table's header
    columns[0].text = "Place"
    columns[1].text = "Package"
    columns[2].text = "Service"
    columns[3].text = "Width"
    columns[4].text = "Height"
    columns[5].text = "Price"

    console.log(body)
    return body
  }

  table(data, columns) {
    return {
      table: {
        layout: 'lightHorizontalLines', // optional
        headerRows: 1,
        widths: ['17%', '22%', '18%', '14%', '14%', '15%'],
        body: this.tableBody(data, columns)
      }
    };
  }

  // sampleexample = [ 
  //   {Place : 'BAthroom', Package: 'P001', Service : 'waterproof', Width: 18, Height: 10, Price: 2000},
  //   {Place : 'Bedroom', Package: 'P002', Service : 'waterproof', Width: 25, Height: 20, Price: 4000},
  //   {Place : 'Washroom', Package: 'P003', Service : 'waterproof', Width: 18, Height: 10, Price: 2000},
  // ]

  async openpdf() {
    var docDefinition = {
      content: [
        {
          columns: [
            { alignment: 'right', text: 'Quotation', fontSize: 20, margin: [0, 0, 0, 10] }
          ]
        },
        {
          columns: [
            [
              { text: 'Address : ', fontSize: 11, width: '45%', margin: [0, 0, 0, 2], bold: true, color: '#000000', alignment: 'left' },
              { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 10, width: '45%', color: '#444444', alignment: 'left' },
              {
                columns: [
                  { text: 'Tel : ', fontSize: 11, width: 'auto', margin: [0, 8, 2, 2], bold: true, color: '#000000', alignment: 'left' },
                  { text: '1-800-18-6266', fontSize: 11, width: '45%', margin: [0, 8, 0, 1], color: '#444444', alignment: 'left' }
                ]
              }
            ],
            [
              { text: '', width: '10%' }
            ],
            [
              {
                image: await this.getBase64ImageFromURL(
                  "../..////assets/icon/nano-g-nb.png"
                ),
                width: 150,
                alignment: 'right',
              },
            ]
          ],
          width: '100%',
        },
        {
          columns: [
            [
              { text: 'From : ', fontSize: 11, width: '45%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
              { text: this.user.user_name + '(' + this.user.user_role + ')', fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_phone_no, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_email, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: 'To : ', fontSize: 11, width: '45%', bold: true, margin: [0, 12, 0, 2], alignment: 'left', },
              { text: this.task.customer_name, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.task.customer_phone, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.task.address, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.task.customer_email, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
            ],
            [
              {

              }
            ],
            [
              {
                columns: [
                  { text: 'Date :', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
                  { text: this.quotation.date, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
                ],
              },
              {
                columns: [
                  { text: 'QUOTE NO :', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
                  { text: this.quotation.id, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
                ],
                width: '25%',
                alignment: 'right'
              },
            ]
          ],
          width: '100%',
          margin: [0, 40, 0, 50],
        },
        this.table(this.service, [{ text: 'place', style: "tableHeader" }, { text: 'name', style: "tableHeader" }, { text: 'service', style: "tableHeader" },
        { text: 'width', style: "tableHeader" }, { text: 'height', style: "tableHeader" }, { text: 'amount', style: "tableHeader" }]),
        {
          columns: [
            { text: '' },
            { text: 'Subtotal : ', alignment: 'left', width: '14%', margin: [1, 20, 0, 0], fontSize: 9, color: '#444444' },
            { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '15%', margin: [0, 20, 1, 0], fontSize: 9, color: '#444444' },
          ]
        },
        {
          columns: [
            {},
            { text: 'Discount : ', alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 9, color: '#444444' },
            { text: '- RM ' + this.discountamount, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 9, color: '#444444' },
          ]
        },
        {
          columns: [
            {},
            { text: 'Total : ', alignment: 'left', width: '14%', margin: [1, 8, 0, 0], fontSize: 11 },
            { text: 'RM ' + this.total, alignment: 'right', width: '15%', margin: [0, 8, 1, 0], fontSize: 11 },
          ],
        },
        {
          columns: [
            { text: 'Signature by : ', width: 'auto', alignment: 'left', margin: [2, 2, 2, 2], fontSize: 11 },
          ],
          margin: [0, 60, 0, 0]
        },
        {
          columns: [
            { text: 'Date : ', alignment: 'left', width: 'auto', margin: [2, 2, 2, 2], fontSize: 11 },
            { text: this.today, alignment: 'left', margin: [2, 2, 2, 2], color: '#444444', fontSize: 11 },
          ],
          width: '100%'
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
        }
      }
    };


    // pdfMake.createPdf(docDefinition).getDataUrl((dataUrl) => {
    //   // console.log(dataUrl);
    //   this.createbrowser(dataUrl)
    // });

    let globalVariable = this

      pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; // Convert to Binary...

        let fileName = 'sadasd' + ' - Payslip.pdf';
        let saveDir = cordova.file.dataDirectory;

        this.file.createFile(saveDir, fileName, true).then((fileEntry) => {
          fileEntry.createWriter((fileWriter) => {
            fileWriter.onwriteend = async () => {

              Swal.fire({
                title: 'Generating PDF',
                text: "Please Wait! Generating the PDF...",
                icon: 'info',
                timer: 2000,
                heightAuto: false,
                showCancelButton: false,
                showConfirmButton: false
              }).then(function (result) {

                console.log(result.dismiss);

                if (result.dismiss === Swal.DismissReason.timer) {
                  // globalVariable.fileOpener.open(
                  //   saveDir + fileName,
                  //   'application/pdf');
                }

              });
            };
            fileWriter.onerror = (e) => {
              console.log('file writer - error event fired: ' + e.toString());
            };
            fileWriter.write(binaryArray);
          });
        });
      });
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

  platformType(){
    return this.platform.platforms()
  }

}
