import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesAdd2Page } from './services-add2.page';

describe('ServicesAdd2Page', () => {
  let component: ServicesAdd2Page;
  let fixture: ComponentFixture<ServicesAdd2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesAdd2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
