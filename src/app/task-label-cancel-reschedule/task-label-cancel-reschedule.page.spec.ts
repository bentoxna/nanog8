import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskLabelCancelReschedulePage } from './task-label-cancel-reschedule.page';

describe('TaskLabelCancelReschedulePage', () => {
  let component: TaskLabelCancelReschedulePage;
  let fixture: ComponentFixture<TaskLabelCancelReschedulePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskLabelCancelReschedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskLabelCancelReschedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
