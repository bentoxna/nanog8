import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-task-discount',
  templateUrl: './task-discount.page.html',
  styleUrls: ['./task-discount.page.scss'],
})
export class TaskDiscountPage implements OnInit {

  discounts = [] as any
  discountselect = [] as any
  // discountselected = [] as any

  taskid
  userid
  

  constructor(private http: HttpClient,
    private modal : ModalController,
    private route : ActivatedRoute,
    private navparam : NavParams,
    private platform : Platform
    ) { }

  ngOnInit() {
    this.taskid = this.navparam.get('tid')
    this.userid = this.navparam.get('uid')

    this.discountselect = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid)) || []
    console.log(this.discountselect)



    this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
      this.discounts = a['data']
      console.log(this.discounts)
      if(this.discountselect && this.discountselect.length > 0)
      {
        for(let i =0; i < this.discountselect.length ; i++)
        {
          let findIndex = this.discounts.findIndex(a => a['id'] == this.discountselect[i].id)
          if(findIndex != -1)
          {
            this.discounts[findIndex].selected = true
          }
        }
      }
    })
  }

  getclick(i){
    console.log(this.discounts[i])
    if(this.discountselect)
    {
      let index = this.discountselect.findIndex(a => a['id'] == this.discounts[i].id)
      if(index == -1)
      {
        this.discountselect.push(this.discounts[i])
        this.discounts[i].selected = true
      }
      else if(index != -1)
      {
        this.discountselect.splice(index, 1)
        this.discounts[i].selected = false
      }
    }
    else
    {
      this.discountselect.push(this.discounts[i])
    }


    console.log(this.discountselect)
    // for(let i = 0; i < this.discounts.length; i ++)
    // {
    //   for(let j = 0; j < this.discountselect.length; j++)
    //   {
    //     if(this.discounts[i].id == this.discountselect[j].id)
    //     {
    //       this.discounts[i].selected = true
    //     }
    //   }
    // }

    // console.log(this.discounts)
  }

  confirmdiscount(){
    // this.modal.dismiss(this.discountselect)
    localStorage.setItem('discount?tid=' + this.taskid , JSON.stringify(this.discountselect))
    this.modal.dismiss('confirm')
  }

  canceldiscount(){
    this.modal.dismiss()
  }

  platformType(){
    return this.platform.platforms()
  }
}
