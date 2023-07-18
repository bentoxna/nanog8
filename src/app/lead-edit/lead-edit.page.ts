import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-lead-edit',
  templateUrl: './lead-edit.page.html',
  styleUrls: ['./lead-edit.page.scss'],
})
export class LeadEditPage implements OnInit {

  @ViewChild('uploadEl', { static: false }) 
  uploadElRef: ElementRef<HTMLInputElement>;

  @ViewChild('uploadtest2', { static: false }) 
  uploadElRef2: ElementRef<HTMLInputElement>;
  
  filename: string;

  newdata = [] as any
  newdata2 = [] as any

  // lead = {
  //   created_date: temp[i][9] == 'NULL' ? null : new Date(temp[i][9]).getTime(),
  //   customer_name: temp[i][2] == 'NULL' ? null : temp[i][2],
  //   customer_email: temp[i][3] == 'NULL' ? null : temp[i][3],
  //   customer_phone: temp[i][4] == 'NULL' ? null : temp[i][4],
  //   customer_city: temp[i][5] == 'NULL' ? null : temp[i][5],
  //   customer_state: temp[i][6] == 'NULL' ? null : temp[i][6],
  //   address: temp[i][14] == 'NULL' ? null : temp[i][14],
  //   company_address: temp[i][76] == 'NULL' ? null : temp[i][76],
  //   saleexec_note: temp[i][7] == 'NULL' ? null : temp[i][7],
  //   remark: null,
  //   ads_id: temp[i][78] == 'NULL' ? null : temp[i][78],
  //   channel_id: temp[i][88] == 'NULL' ? null : temp[i][88],
  //   sales_admin: null,
  //   sales_exec: null,
  //   services: temp[i][77] == 'NULL' ? null : temp[i][77] == '1' ? 'Waterproofing' : temp[i][77] == '2' ? 'Antislip' : temp[i][77] == '3' ? 'Waterproofing & Antislip' : null,
  //   issues: JSON.stringify([]),
  //   lattitude: (temp[i][30] == 'NULL' || temp[i][30] == 'null') ? 0.0 : temp[i][30],
  //   longtitude: (temp[i][31] == 'NULL' || temp[i][31] == 'null') ? 0.0 : temp[i][31],
  //   sales_coordinator: temp[i][11] == 'NULL' ? null : temp[i][11],
  //   status: temp[i][19] == 0 ? false : true,
  //   label_m: temp[i][56] == 'NULL' ? null : temp[i][56],
  //   label_s: temp[i][57] == 'NULL' ? null : temp[i][57],
  //   remark_json: JSON.stringify([{ remark: temp[i][75] == 'NULL' ? '' : temp[i][75], date: new Date().getTime() }]),
  //   created_by: temp[i][10] == 'NULL' ? null : temp[i][10],
  //   sc_photo: JSON.stringify([]),
  //   race: temp[i][82] == 'NULL' ? null : temp[i][82],
  //   gender: temp[i][80] == 'NULL' ? null : temp[i][80],
  //   warranty_id: null,
  //   verified: null,
  //   customer_title: null,
  //   label_photo: JSON.stringify([]),
  //   label_video: JSON.stringify([]),
  //   label_remark: null,
  //   fake_id : temp[i][0] == 'NULL' ? null : temp[i][0]
  // }

  // appointment1 = {
  //   lead_id : temp[i][1] == 'NULL' ? null : temp[i][1],
  //   created_time: temp[i][6] == 'NULL' ? null : new Date(temp[i][6]).getTime(),
  //   appointment_time : temp[i][2] == 'NULL' ? null : new Date(temp[i][2]).getTime(),
  //   appointment_status: null,
  //   checkin_latt: null,
  //   checkin_long: null,
  //   remark: null,
  //   checkin: null,
  //   checkin_img: null,
  //   assigned_to: null,
  //   sales_exec_note : null,
  //   checkin_address: null,
  // }

  // appointment2 = {
  //   appointment_status:  temp[i][17] == 'NULL' ? false : temp[i][17] == 1 ? true : temp[i][17] == 2 ? false : false,
  //   checkin: temp[i][20] == 'NULL' ? null : new Date(temp[i][20]),
  //   assigned_to: (temp[i][12] == 'NULL' || temp[i][12] == '0') ? null : temp[i][12],
  //   checkin_address: temp[i][25] == 'NULL' ? null : temp[i][25],
  //   lead_id : temp[i][0] == 'NULL' ? 0 : temp[i][0]
  // }


  constructor(private http : HttpClient,
    private papa : Papa) { }

  ngOnInit() {
  }


  async fileChange2(res: any) {

    console.log(res);
    return new Promise((resolve, reject) => {
      Swal.fire({
        icon : 'info',
        title : 'Please Wait',
        text : 'Processing....',
        showConfirmButton : false,
        allowOutsideClick : false,
        heightAuto : false
      })


      let temp;
      let csvData = res.target.files[0] || res.srcElement;
      this.uploadElRef.nativeElement.value = ''
      this.papa.parse(csvData, {
        complete: parsedData => {
          (parsedData.data).splice(0, 1), (parsedData.data).splice(parsedData.data.length - 1, 1)
          temp = parsedData.data;
          if ((csvData.name).includes('.csv')) {
            Swal.close();
            // if (res.target.id == 'files') {

            console.log(temp);
            let checker
            let passdata



            for (let i = 0; i < temp.length; i++) {

              // for(let j = 0 ; j<temp[i].length ; j++){

              //   newdate[i] = {  temp[i][j] }


              // }
              this.newdata[i] = { 
    appointment_status:  temp[i][17] == 'NULL' ? false : temp[i][17] == 1 ? true : temp[i][17] == 2 ? false : false,
    checkin: temp[i][20] == 'NULL' ? null : new Date(temp[i][20]),
    assigned_to: (temp[i][12] == 'NULL' || temp[i][12] == '0') ? null : temp[i][12],
    checkin_address: temp[i][25] == 'NULL' ? null : temp[i][25],
    lead_id : temp[i][0] == 'NULL' ? 0 : temp[i][0]
              }

              if(i ==  temp.length -1){

                resolve(this.newdata)

              }
            


            }

            console.log(this.newdata)

         


          } else {
            console.log('2');
            Swal.fire({
              icon : 'error',
              title : "Error",
              text : 'Please upload a CSV file',
              timer : 2000,
              showConfirmButton : false,
              heightAuto : false,
            })
            this.filename = '';
            temp = [];
            // resolve("error")
          }
        }
      });
    })

}

async uploadCSV(newdate) {

   this.fileChange2(newdate).then((a) =>{
    console.log(a)

    this.http.post('https://api.nanogapp.com/bulkInsert3', a).subscribe(z => {
      console.log(z);

    });
    

   })


}

}
