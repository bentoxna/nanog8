import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab1UpcomingTaskPage } from './tab1-upcoming-task.page';

describe('Tab1UpcomingTaskPage', () => {
  let component: Tab1UpcomingTaskPage;
  let fixture: ComponentFixture<Tab1UpcomingTaskPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1UpcomingTaskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1UpcomingTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
