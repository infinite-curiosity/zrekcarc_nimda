import { Component, Input } from '@angular/core';
import { Platform, NavController, ToastController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { DetailsPage } from '../details/details';
import { AppService } from "../../app/app.service";
import {Observable} from 'rxjs/Observable';

let self;

@Component({
  	selector: 'cracker-item',
  	templateUrl: 'product.html'
})

export class CrackerItem {
	@Input() data;
	public item;

	constructor(public navCtrl: NavController, private http: Http, platform: Platform, public events : Events, private toastCtrl: ToastController, public appService : AppService) {
		self = this;
	}

	ngAfterContentInit() {
		var img = new Image();
		img.src= this.data.imageUrl;
		img.onload = ()=>{
			this.data.imageLoaded = true;
		};
		this.item = this.data;
	}

	setAsFav(item){
		if(!(this.appService.getUserId() > 0)){
			this.events.publish('showLogInScreen',true);
			return Observable.throw('Login required!');
		}
		(!item) ? item = self : function(){};
		item.isInWishList = true;
		self.presentToast(item.productName + " added to wishlist");
		return self.addToWishList(item);
	}

	addToWishList(item){
		var request = {
			uid: this.appService.getUserId(),
			productId: item.id
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/addToWishList";
		var thisObservable =  this.http
			.post(serviceUrl,request)
			.map(res => res.json());
		thisObservable.subscribe(res => {
			if(res.response===200){

			}else{

			}
			});
		return thisObservable;
	}

	unsetAsFav(item){
		if(!(this.appService.getUserId() > 0)){
			this.events.publish('showLogInScreen',true);
			return Observable.throw('Login required!');
		}
		(!item) ? item = self : function(){};
		item.isInWishList = false;
		self.presentToast(item.productName + " removed from wishlist");
		return self.removeFromWishlist(item);
	}

	unsetAsFavWithoutToat(item){
		(!item) ? item = self : function(){};
		item.isInWishList = false;
		return self.removeFromWishlist(item);
	}

	removeFromWishlist(item){
		var serviceUrl = this.appService.getBaseUrl()+"/store/removeFromWishlist";
		var request = {
			"uid" : Number(this.appService.getUserId()),
			"productId": item.id,
		};
		var thisObservable = this.http
			.post(serviceUrl, request)
			.map(res => res.json());

		thisObservable.subscribe(res => {
			if(res.response===200){

			}else{

			}
		});
		return thisObservable;
  	}

	addToCart(item){
		if(!(this.appService.getUserId() > 0)){
			this.events.publish('showLogInScreen',true);
			return Observable.throw('Login required!');
		}
		(!item) ? item=this : function(){};
		(!item.cartQuantity) ? item.cartQuantity = 1 : item.cartQuantity += 1;
		return this.updateCart(item);
	}

	removeFromCart(item){
		if(!(this.appService.getUserId() > 0)){
			this.events.publish('showLogInScreen',true);
			return Observable.throw('Login required!');
		}
		(!item) ? item=this : function(){};
		(!item.cartQuantity) ? item.cartQuantity = 0 : item.cartQuantity -= 1;
		return this.updateCart(item);
	}

	updateCart(item){
		(!item) ? item=this : function(){};
		var request = {
			uid: this.appService.getUserId(),
			productId: item.id,
			count : item.cartQuantity
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/addToCart";
		var thisObservable = this.http
			.post(serviceUrl,request)
			.map(res => res.json());
		thisObservable.subscribe(res => {
			if(res.response===200){
				if(res.data){
					this.appService.setCartCount(res.data.noOfItemsInCart);
				}
			}else{

			}
		});
		return thisObservable;
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: this.appService.getToastSettings().duration,
			showCloseButton: this.appService.getToastSettings().showCloseButton,
			closeButtonText : this.appService.getToastSettings().closeButtonText,
			position: this.appService.getToastSettings().position
		});

		/*toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});*/

		toast.present();
	}


  	redirectToProductDetails(product){
  		product.setAsFav = this.setAsFav;
  		product.unsetAsFav = this.unsetAsFav;
  		product.addToCart = this.addToCart;
  		product.removeFromCart = this.removeFromCart;
  		product.updateCart = this.updateCart;
  		product.presentToast = this.presentToast;
  		this.navCtrl.push(DetailsPage,product);
  	}

}
