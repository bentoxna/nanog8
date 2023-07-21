import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TaskPaymentSignPage } from '../task-payment-sign/task-payment-sign.page';
import { TermsAndConditionPage } from '../terms-and-condition/terms-and-condition.page';

@Component({
  selector: 'app-pdf-sof-fill',
  templateUrl: './pdf-sof-fill.page.html',
  styleUrls: ['./pdf-sof-fill.page.scss'],
})
export class PdfSofFillPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''
  leadid
  taskid
  salesid
  type
  lead = [] as any
  gender = ['Male', 'Female', 'Others']
  race = ['Chinese', 'Malay','Indian', 'Others']
  maritial_status = ['Married', 'Single', 'Others']
  residence_type = ['Apartment/Condo', 'Terrace', 'Semi-D', 'Bungalow', 'Office', 'Hostel/Quarter']
  residential_status = ['Own', 'Rented', 'Others']
  conditional_status = ['Video Interview', 'Photo/Selfie', 'FB like & Share & Google Review']
  payment_mode = ['Credit/Debit Card', 'Cash', 'Online Transfer', 'Cheques', 'Others']

  constructor(private route : ActivatedRoute,
    private nav : NavController,
    private http : HttpClient, private modal : ModalController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      this.leadid = a['leadid']
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.type = a['type']

      this.http.post('https://api.nanogapp.com/selectleadinfo', { leadid : this.leadid }).subscribe(res => {
        this.lead = res['data']
        console.log(this.lead)
        this.lead.gender ? (this.gender.findIndex(a => a == this.lead.gender) == -1 ? this.change('gender') : this.lead.gender) : this.lead.gender
        this.lead.race ? (this.race.findIndex(a => a == this.lead.race) == -1 ? this.change('race') : this.lead.race) : this.lead.race
        this.lead.maritial_status ? (this.maritial_status.findIndex(a => a == this.lead.maritial_status) == -1 ? this.change('maritial_status') : this.lead.maritial_status) : this.lead.maritial_status
        this.lead.residence_type ? (this.residence_type.findIndex(a => a == this.lead.residence_type) == -1 ? this.change('residence_type') : this.lead.residence_type) : this.lead.residence_type
        this.lead.residential_status ? (this.residential_status.findIndex(a => a == this.lead.residential_status) == -1 ? this.change('residential_status') : this.lead.residential_status) : this.lead.residential_status
        this.lead.payment_mode ? (this.payment_mode.findIndex(a => a == this.lead.payment_mode) == -1 ? this.change('payment_mode') : this.lead.payment_mode) : this.lead.payment_mode
        this.lead.mailing_address ? this.lead.mailing_address : this.lead.mailing_address = this.lead.address
      })
    })
  }

  customersignimage

  async customersign() {
    const modal = await this.modal.create({
      cssClass: 'signaturemodal',
      component: TaskPaymentSignPage,
      componentProps: { uid: this.userid, sid: this.salesid }
    })

    await modal.present()


    modal.onDidDismiss().then(a => {
      if (a['data']) {
        this.lead.customer_signature = a['data']
      }
    })
  }


  change(x){
    if(x == 'race')
    {
      this.lead.race2 = this.lead.race
      this.lead.race = 'Others'
    }
    else if(x == 'gender')
    {
      this.lead.gender2 = this.lead.gender
      this.lead.gender = 'Others'
    }
    else if(x == 'maritial_status')
    {
      this.lead.maritial_status2 = this.lead.maritial_status
      this.lead.maritial_status = 'Others'
    }
    else if(x == 'residence_type')
    {
      this.lead.residence_type2 = this.lead.residence_type
      this.lead.residence_type = 'Others'
    }
    else if(x == 'residential_status')
    {
      this.lead.residential_status2 = this.lead.residential_status
      this.lead.residential_status = 'Others'
    }
    else if(x == 'payment_mode')
    {
      this.lead.payment_mode2 = this.lead.payment_mode
      this.lead.payment_mode = 'Others'
    }
  }


  remove(x){
    if(x == 'race')
    {
      this.lead.race = ''
    }
    else if(x == 'gender')
    {
      this.lead.gender = ''
    }
    else if(x == 'maritial_status')
    {
      this.lead.maritial_status = ''
    }
    else if(x == 'residence_type')
    {
      this.lead.residence_type = ''
    }
    else if(x == 'residential_status')
    {
      this.lead.residential_status = ''
    }
    else if(x == 'payment_mode')
    {
      this.lead.payment_mode = ''
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove any whitespace or special characters from the phone number
    const cleanedNumber = phoneNumber.replace(/\s+/g, "").replace(/[-()]/g, "");
  
    // Check if the number already starts with "60"
    if (cleanedNumber.startsWith("60")) {
      return cleanedNumber;
    }
  
    // Remove leading "6" or "+" from the phone number
    const withoutLeading6 = cleanedNumber.replace(/^(6|\+)/, "");
  
    // Add "60" at the beginning of the number
    const formattedNumber = "60" + withoutLeading6;
  
    return formattedNumber;
  }
  

  changeTermAndConditionStatus() {
    this.lead.termsncondition = true
    this.customersign()
  }

  async viewTermAndConditionDetail() {
    const modal = await this.modal.create({
      cssClass: 'termsAndConditionmodal',
      component: TermsAndConditionPage,
    })

    await modal.present()
  }

  save(){
    console.log(this.lead.customer_phone)
    if(!this.lead.customer_name || !this.lead.customer_phone || !this.lead.customer_email || !this.lead.address || !this.lead.mailing_address
      || (this.lead.gender == 'Others' ? !this.lead.gender2 : !this.lead.gender) 
      || (this.lead.race == 'Others' ? !this.lead.race2 : !this.lead.race) 
      || (this.lead.residence_type == 'Others' ? !this.lead.residence_type2 : !this.lead.residence_type)
      || (this.lead.residential_status == 'Others' ? !this.lead.residential_status2 : !this.lead.residential_status))
    {
      Swal.fire({
        text : 'Please input all the data',
        icon : 'info',
        heightAuto : false,
        timer : 1000
      })
    }
    else if(!this.isValidEmail(this.lead.customer_email))
    {
      Swal.fire({
        text : 'Invalid email',
        icon : 'info',
        heightAuto : false,
        timer : 1000
      })
    }
    else
    {
      this.http.post('https://api.nanogapp.com/updateleadinfo', { 
        customer_name : this.lead.customer_name,
        customer_phone : this.formatPhoneNumber(this.lead.customer_phone + ''),
        customer_email : this.lead.customer_email,
        address : this.lead.address,
        icno : this.lead.icno,
        gender : this.lead.gender == 'Others' ? this.lead.gender2 : this.lead.gender,
        race : this.lead.race == 'Others' ? this.lead.race2 : this.lead.race,
        maritial_status : this.lead.maritial_status == 'Others' ? this.lead.maritial_status2 : this.lead.maritial_status,
        residence_type : this.lead.residence_type == 'Others' ? this.lead.residence_type2 : this.lead.residence_type,
        residential_status : this.lead.residential_status == 'Others' ? this.lead.residential_status2 : this.lead.residential_status,
        mailing_address : this.lead.mailing_address,
        company_name : this.lead.company_name,
        customer_signature : this.lead.customer_signature,
        conditional_status : this.lead.conditional_status,
        payment_mode : this.lead.payment_mode == 'Others' ? this.lead.payment_mode2 : this.lead.payment_mode,
        termsncondition : this.lead.termsncondition,
        leadid : this.leadid
      }).subscribe(res => {
        console.log(res)
        Swal.fire({
          text : 'Updated Successfully',
          icon : 'success',
          heightAuto : false,
          timer:  1000,
        }).then(a => {
          // this.nav.navigateForward('pdf-sales-order-form?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
          this.nav.navigateForward('task-payment?uid=' + this.userid + '&tid=' + this.taskid + '&type=' + this.type + '&sid=' + this.salesid)
        })
      })
    }
  }

  back(){
    this.nav.pop()
  }

}
