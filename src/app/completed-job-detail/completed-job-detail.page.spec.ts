import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedJobDetailPage } from './completed-job-detail.page';

describe('CompletedJobDetailPage', () => {
  let component: CompletedJobDetailPage;
  let fixture: ComponentFixture<CompletedJobDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompletedJobDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
