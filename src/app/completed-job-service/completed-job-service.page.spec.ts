import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedJobServicePage } from './completed-job-service.page';

describe('CompletedJobServicePage', () => {
  let component: CompletedJobServicePage;
  let fixture: ComponentFixture<CompletedJobServicePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompletedJobServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
