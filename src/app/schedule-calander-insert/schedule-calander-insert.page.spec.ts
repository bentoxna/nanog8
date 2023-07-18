import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScheduleCalanderInsertPage } from './schedule-calander-insert.page';

describe('ScheduleCalanderInsertPage', () => {
  let component: ScheduleCalanderInsertPage;
  let fixture: ComponentFixture<ScheduleCalanderInsertPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCalanderInsertPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleCalanderInsertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
