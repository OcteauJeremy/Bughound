import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgSelect2Module } from 'ng-select2';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
      BrowserAnimationsModule,
      BrowserModule,
      FormsModule,
      RouterModule,
      NavbarModule,
      FooterModule,
      SidebarModule,
      AppRoutingModule,
      HttpClientModule,
      ToastrModule.forRoot(),
      NgSelectModule,
      FontAwesomeModule
  ],
  declarations: [
      AppComponent,
      AdminLayoutComponent,
      LoginLayoutComponent
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        library.add(faEdit, faTrashAlt, faEye);
    }
}
