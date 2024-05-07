import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-csv',
  templateUrl: './insert-csv.page.html',
  styleUrls: ['./insert-csv.page.scss'],
})
export class InsertCsvPage implements OnInit {

  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  constructor(private papa: Papa, private http: HttpClient) { }

  ngOnInit() {
  }

  csvdata = [] as any

  condis(x) {
    x = (x || '').toString().replace(/[- ]/g, '');

    if (x[0] === '+') {
      x = x.substring(1);
    } else if (x[0] === '1') {
      x = '60' + x.substring(0);
    } else if (x[0] === '0' || x[0] === '5') {
      x = '6' + x.substring(0);
    } else if (x[0] !== '6') {
      x = '60' + x;
    }

    if (isNaN(x)) {
      x = ''
    }

    return x;
  }

  fileChange(res: any, x): void {

    Swal.fire({
      icon: 'info',
      title: 'Please wait',
      text: 'Processing...',
      allowOutsideClick: false,
      showConfirmButton: false,
    })

    let csvData2 = res.target.files[0] || res.srcElement;
    this.uploadElRef.nativeElement.value = ''
    this.papa.parse(csvData2, {
      complete: parsedData => {
        console.log(parsedData.data);
        let temp = parsedData.data
        console.log(temp)
        temp.splice(0, 1)
        temp.splice(-1, 1)
        for (let i = 0; i < temp.length; i++) {
          this.csvdata[i] = {}
          for (let j = 0; j < temp[i].length; j++) {
            if (j == 3) {
              this.csvdata[i]['customer_name'] = temp[i][j]
            }
            else if (j == 4) {
              this.csvdata[i]['customer_email'] = temp[i][j]
            }
            else if (j == 5) {
              this.csvdata[i]['customer_phone'] = this.condis(temp[i][j])
            }
            else if (j == 6) {
              this.csvdata[i]['created_date'] = new Date().getTime()
            }
            else if (j == 7) {
              this.csvdata[i]['remark_json'] = JSON.stringify([{ date: new Date().getTime() }])
            }
          }
        }
        console.log(this.csvdata)
        this.filename = csvData2.name;
        let data = parsedData.data
        // .filter(a => { a[1] })
        data.splice(0, 1)
        data.splice(-1, 1)

        // console.log(data);
        // .map(a => a)
        // this.temp = (data).filter(a => a[4] != 'Kepong' && a[4] != 'Ara Damansara' && a[5] != 'NO');
        new Set(data.map(a => a[1])).forEach(a => {
          this.temp.push(a)
        });

        // console.log(this.temp)
        console.log(this.temp)

        // this.http.post('https://autospa.vsnap.my:3003/getspecorders', { data: this.temp.map(a => a[1]).join(',') }).subscribe(a => {
        //   this.data = a['data'].filter(a => !a.used_date);
        //   console.log(this.data);
        // })

        this.counter++;
        // console.log(this.counter)
        if ((csvData2.name).includes('.csv')) {
          Swal.close();

        } else {
          console.log('2');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please upload a CSV file!',
            timer: 2000,
            showConfirmButton: false,
          })
          this.filename = '';
          this.temp = [];
        }
      }
    });
  }
  i = 0
  downloaduser3() {
    console.log(this.temp)
    let index = []

    if(this.i < this.csvdata.length)
    {
        this.http.post('https://api.nanogapp.com/bulkInsert99', this.csvdata[this.i]).subscribe((s) => {
          console.log(s)
          index.push(s)
          console.log(index)
          console.log(index.length)
        })
        // console.log(this.csvdata[this.i])

        setTimeout(() => {
          this.i++
          this.downloaduser3()
        }, 1000);
    }

  }


  // downloaduser4() {
  //   console.log(this.csvdata[0])

  //   this.http.post('https://api.nanogapp.com/bulkInsert99', this.csvdata[0]).subscribe((s) => {
  //     console.log(s)
  //   })


  // }

  filename
  temp = []
  counter

}
