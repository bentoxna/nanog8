import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdfSalesOrderFormPage } from './pdf-sales-order-form.page';

describe('PdfSalesOrderFormPage', () => {
  let component: PdfSalesOrderFormPage;
  let fixture: ComponentFixture<PdfSalesOrderFormPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfSalesOrderFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfSalesOrderFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
