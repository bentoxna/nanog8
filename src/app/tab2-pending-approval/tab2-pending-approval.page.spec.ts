import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab2PendingApprovalPage } from './tab2-pending-approval.page';

describe('Tab2PendingApprovalPage', () => {
  let component: Tab2PendingApprovalPage;
  let fixture: ComponentFixture<Tab2PendingApprovalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab2PendingApprovalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2PendingApprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
