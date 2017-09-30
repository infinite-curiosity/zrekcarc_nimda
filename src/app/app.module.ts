import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { AppService } from "./app.service";

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
/*import "../vendors/swiper/js/swiper.min.js";*/

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ListingPage } from '../pages/listing/listing';
import { DetailsPage } from '../pages/details/details';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ShowLoading } from '../pages/loading/loading';
import { ShoppingCartPage } from '../pages/cart/cart';
import { OrderHistoryPage } from '../pages/orders/orders';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { CrackerItem } from '../pages/product/product';
import { FilterComponent } from '../pages/filter/filter';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import {Observable} from "rxjs/Rx";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ListingPage,
    DetailsPage,
    TabsPage,
    LoginPage,
    ShowLoading,
    ShoppingCartPage,
    OrderHistoryPage,
    WishlistPage,
    CrackerItem,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      activator: 'ripple',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out'
    }),
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ListingPage,
    DetailsPage,
    TabsPage,
    LoginPage,
    ShowLoading,
    ShoppingCartPage,
    OrderHistoryPage,
    WishlistPage,
    CrackerItem,
    FilterComponent
  ],
  providers: [
    AppService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
