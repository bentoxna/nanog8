import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab4CompletedJobPage } from './tab4-completed-job.page';

describe('Tab4CompletedJobPage', () => {
  let component: Tab4CompletedJobPage;
  let fixture: ComponentFixture<Tab4CompletedJobPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Tab4CompletedJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
