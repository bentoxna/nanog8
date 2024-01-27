import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home2',
    loadChildren: () => import('./home2/home2.module').then( m => m.Home2PageModule),
    canLoad : [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'createuser',
    loadChildren: () => import('./createuser/createuser.module').then( m => m.CreateuserPageModule)
  },
  {
    path: 'task-detail',
    loadChildren: () => import('./task-detail/task-detail.module').then( m => m.TaskDetailPageModule)
  },
  {
    path: 'home-setting',
    loadChildren: () => import('./home-setting/home-setting.module').then( m => m.HomeSettingPageModule)
  },
  {
    path: 'check-in',
    loadChildren: () => import('./check-in/check-in.module').then( m => m.CheckInPageModule)
  },
  {
    path: 'create-sub-task',
    loadChildren: () => import('./create-sub-task/create-sub-task.module').then( m => m.CreateSubTaskPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },  
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  {
    path: 'task-all',
    loadChildren: () => import('./task-all/task-all.module').then( m => m.TaskAllPageModule)
  },
  {
    path: 'services-add',
    loadChildren: () => import('./services-add/services-add.module').then( m => m.ServicesAddPageModule)
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./image-viewer/image-viewer.module').then( m => m.ImageViewerPageModule)
  },
  {
    path: 'check-in-history',
    loadChildren: () => import('./check-in-history/check-in-history.module').then( m => m.CheckInHistoryPageModule)
  },
  {
    path: 'services-edit',
    loadChildren: () => import('./services-edit/services-edit.module').then( m => m.ServicesEditPageModule)
  },
  {
    path: 'quotation-pdf',
    loadChildren: () => import('./quotation-pdf/quotation-pdf.module').then( m => m.QuotationPdfPageModule)
  },
  {
    path: 'task-payment',
    loadChildren: () => import('./task-payment/task-payment.module').then( m => m.TaskPaymentPageModule)
  },
  {
    path: 'schedule-calander',
    loadChildren: () => import('./schedule-calander/schedule-calander.module').then( m => m.ScheduleCalanderPageModule)
  },
  {
    path: 'service-package-detail',
    loadChildren: () => import('./service-package-detail/service-package-detail.module').then( m => m.ServicePackageDetailPageModule)
  },
  {
    path: 'task-discount',
    loadChildren: () => import('./task-discount/task-discount.module').then( m => m.TaskDiscountPageModule)
  },
  {
    path: 'schedule-calander-insert',
    loadChildren: () => import('./schedule-calander-insert/schedule-calander-insert.module').then( m => m.ScheduleCalanderInsertPageModule)
  },
  {
    path: 'schedule-calander-edit',
    loadChildren: () => import('./schedule-calander-edit/schedule-calander-edit.module').then( m => m.ScheduleCalanderEditPageModule)
  },
  {
    path: 'schedule-calander-detail',
    loadChildren: () => import('./schedule-calander-detail/schedule-calander-detail.module').then( m => m.ScheduleCalanderDetailPageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./signature/signature.module').then( m => m.SignaturePageModule)
  },
  {
    path: 'pdf-quotation',
    loadChildren: () => import('./pdf-quotation/pdf-quotation.module').then( m => m.PdfQuotationPageModule)
  },
  {
    path: 'pdf-receipt-invoice',
    loadChildren: () => import('./pdf-receipt-invoice/pdf-receipt-invoice.module').then( m => m.PdfReceiptInvoicePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'task-discount2',
    loadChildren: () => import('./task-discount2/task-discount2.module').then( m => m.TaskDiscount2PageModule)
  },
  {
    path: 'task-discount-custom',
    loadChildren: () => import('./task-discount-custom/task-discount-custom.module').then( m => m.TaskDiscountCustomPageModule)
  },
  {
    path: 'task-discount-photo',
    loadChildren: () => import('./task-discount-photo/task-discount-photo.module').then( m => m.TaskDiscountPhotoPageModule)
  },
  {
    path: 'home-calendar',
    loadChildren: () => import('./home-calendar/home-calendar.module').then( m => m.HomeCalendarPageModule)
  },
  {
    path: 'terms-and-condition',
    loadChildren: () => import('./terms-and-condition/terms-and-condition.module').then( m => m.TermsAndConditionPageModule)
  },
  {
    path: 'lead-task',
    loadChildren: () => import('./lead-task/lead-task.module').then( m => m.LeadTaskPageModule)
  },
  {
    path: 'lead-add',
    loadChildren: () => import('./lead-add/lead-add.module').then( m => m.LeadAddPageModule)
  },
  {
    path: 'lead-edit',
    loadChildren: () => import('./lead-edit/lead-edit.module').then( m => m.LeadEditPageModule)
  },
  {
    path: 'lead-appointment',
    loadChildren: () => import('./lead-appointment/lead-appointment.module').then( m => m.LeadAppointmentPageModule)
  },
  {
    path: 'task-label',
    loadChildren: () => import('./task-label/task-label.module').then( m => m.TaskLabelPageModule)
  },
  {
    path: 'services-view',
    loadChildren: () => import('./services-view/services-view.module').then( m => m.ServicesViewPageModule)
  },
  {
    path: 'services-warranty-add',
    loadChildren: () => import('./services-warranty-add/services-warranty-add.module').then( m => m.ServicesWarrantyAddPageModule)
  },
  {
    path: 'services-warranty-edit',
    loadChildren: () => import('./services-warranty-edit/services-warranty-edit.module').then( m => m.ServicesWarrantyEditPageModule)
  },
  {
    path: 'service-addon-list',
    loadChildren: () => import('./service-addon-list/service-addon-list.module').then( m => m.ServiceAddonListPageModule)
  },
  {
    path: 'task-discount-list',
    loadChildren: () => import('./task-discount-list/task-discount-list.module').then( m => m.TaskDiscountListPageModule)
  },
  {
    path: 'task-discount3',
    loadChildren: () => import('./task-discount3/task-discount3.module').then( m => m.TaskDiscount3PageModule)
  },  {
    path: 'tab1-upcoming-task',
    loadChildren: () => import('./tab1-upcoming-task/tab1-upcoming-task.module').then( m => m.Tab1UpcomingTaskPageModule)
  },
  {
    path: 'tab2-pending-approval',
    loadChildren: () => import('./tab2-pending-approval/tab2-pending-approval.module').then( m => m.Tab2PendingApprovalPageModule)
  },
  {
    path: 'tab3-task-all',
    loadChildren: () => import('./tab3-task-all/tab3-task-all.module').then( m => m.Tab3TaskAllPageModule)
  },
  {
    path: 'tab0-notification-history',
    loadChildren: () => import('./tab0-notification-history/tab0-notification-history.module').then( m => m.Tab0NotificationHistoryPageModule)
  },
  {
    path: 'check-out',
    loadChildren: () => import('./check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'service-warranty2',
    loadChildren: () => import('./service-warranty2/service-warranty2.module').then( m => m.ServiceWarranty2PageModule)
  },
  {
    path: 'task-label-cancel-reschedule',
    loadChildren: () => import('./task-label-cancel-reschedule/task-label-cancel-reschedule.module').then( m => m.TaskLabelCancelReschedulePageModule)
  },
  {
    path: 'task-equipment',
    loadChildren: () => import('./task-equipment/task-equipment.module').then( m => m.TaskEquipmentPageModule)
  },
  {
    path: 'reminder',
    loadChildren: () => import('./reminder/reminder.module').then( m => m.ReminderPageModule)
  },
  {
    path: 'task-payment-sign',
    loadChildren: () => import('./task-payment-sign/task-payment-sign.module').then( m => m.TaskPaymentSignPageModule)
  },
  {
    path: 'pdf-sales-order-form',
    loadChildren: () => import('./pdf-sales-order-form/pdf-sales-order-form.module').then( m => m.PdfSalesOrderFormPageModule)
  },
  {
    path: 'video-viewer',
    loadChildren: () => import('./video-viewer/video-viewer.module').then( m => m.VideoViewerPageModule)
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then( m => m.EventPageModule)
  },
  {
    path: 'pdf-sof-fill',
    loadChildren: () => import('./pdf-sof-fill/pdf-sof-fill.module').then( m => m.PdfSofFillPageModule)
  },
  {
    path: 'pc-home',
    loadChildren: () => import('./pc-home/pc-home.module').then( m => m.PcHomePageModule)
  },
  {
    path: 'pc-lead',
    loadChildren: () => import('./pc-lead/pc-lead.module').then( m => m.PcLeadPageModule)
  },
  {
    path: 'insert-csv',
    loadChildren: () => import('./insert-csv/insert-csv.module').then( m => m.InsertCsvPageModule)
  },
  {
    path: 'inspect',
    loadChildren: () => import('./inspect/inspect.module').then( m => m.InspectPageModule)
  },
  {
    path: 'tab4-havent-checkin',
    loadChildren: () => import('./tab4-havent-checkin/tab4-havent-checkin.module').then( m => m.Tab4HaventCheckinPageModule)
  },
  {
    path: 'website-sign',
    loadChildren: () => import('./website-sign/website-sign.module').then( m => m.WebsiteSignPageModule)
  },
  {
    path: 'pdf-service-form',
    loadChildren: () => import('./pdf-service-form/pdf-service-form.module').then( m => m.PdfServiceFormPageModule)
  },
  {
    path: 'pdf-service-form-view',
    loadChildren: () => import('./pdf-service-form-view/pdf-service-form-view.module').then( m => m.PdfServiceFormViewPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
