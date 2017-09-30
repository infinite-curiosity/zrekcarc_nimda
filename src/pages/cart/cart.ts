import { Component, ViewChild  } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Http} from '@angular/http';
import { AppService } from "../../app/app.service";
import { CrackerItem } from '../product/product';
import { OrderHistoryPage } from '../orders/orders';

@Component({
  	selector: 'shopping-cart',
  	templateUrl: 'cart.html'
})
export class ShoppingCartPage {
	public cartList = [];
	public grandTotal;
	public couponCode;
	public couponType;
	public couponId;
	public couponApplicabilityMsg;
	public couponApplicability;
	public selectedPaymentMode;
	public sectionOnDisplay;
	public addressList;
	public selectedDeliveryAddress;
	public selectedDeliveryAddressId;
	public loadingRef;
	public newAddress;
	public loading;
	public ADDRESS_MIN_LENGTH = 3;
	public ADDRESS_MAX_LENGTH = 40;

	@ViewChild(CrackerItem) crackerItem: CrackerItem;

	constructor(public navCtrl: NavController, private http: Http, public appService: AppService, private toastCtrl: ToastController) {
		this.cartList = [];
		this.loadingRef = this.appService.getLoadingRef();
		this.grandTotal = 0;
		this.couponApplicability = "disp-none";
		this.couponApplicabilityMsg = null;
		this.sectionOnDisplay = 0;
		this.resetNewAddress();
	}

	ngAfterViewInit() {
		this.fetchData();
	}

	/* cart item actions start here*/

	addToCart(item){
		this.crackerItem.addToCart(item);
		this.calculateItemTotal(item);
	}

	removeFromCart(item){
		this.crackerItem.removeFromCart(item);
		this.calculateItemTotal(item);
		if(item.cartQuantity===0){
			this.cartList.splice(this.cartList.indexOf(item),1);
		}
	}

	addToWishlist(item){
		this.crackerItem.setAsFav(item);
  	}

	removeFromWishlist(item){
		this.crackerItem.unsetAsFav(item);
  	}

  	/* cart item actions end here*/

  	/*navigation starts*/

  	onClickContinue(){
  		this.sectionOnDisplay = 1;
  		this.fetchAddress();
  	}

  	onClickBack(){
  		this.sectionOnDisplay = 0;
  	}

  	onClickAddNewAddress(){
  		this.sectionOnDisplay = 2;
  	}

  	onClickBackToChooseAddress(){
  		this.sectionOnDisplay = 1;
  	}

  	/*navigation ends here*/

  	onSelectAddress(address){
  		this.selectedDeliveryAddress = address;
  	}

  	onSelectPaymentMode(paymentMode){
  		this.selectedPaymentMode = paymentMode;
  	}

  	calculateItemTotal(item){
		item.totalAmount = item.netPrice * item.cartQuantity;
		item.totalAmount = item.totalAmount.toFixed(2);
		this.updateGrandTotal();
	}

	updateGrandTotal(){
		var total = 0;
		this.cartList.forEach((item)=>{
			total += item.netPrice * item.cartQuantity;
		});
		this.grandTotal = total.toFixed(2);
	}

	fetchData(){
		//this.loadingRef = this.appService.getLoadingRef();
		this.loading = true;
		this.loadingRef.present();
		this.appService.getCartItems().subscribe(res => {
	            if(res.response===200){
	                if(res.data && res.data.products && Array.isArray(res.data.products)){
	                    this.cartList = res.data.products;
	                    this.cartList.forEach(item => {
	                    	item.cartQuantity = item.quantity;
	                    	this.calculateItemTotal(item);
	                    });
	                }
	            }else{

	            }
	        },
	        e => {

			},
			() => {
				try{
					this.loadingRef.dismiss();
					this.loading = false;
				}catch(e){
					console.error("error @ ionic loading module");
				}
			}
       	);
	}

  	applyCouponCode(couponCode){
		//this.loadingRef = this.appService.getLoadingRef();
		this.loadingRef.present();
		var request = {
			uid: this.appService.getUserId(),
			couponCode: this.couponCode
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/applyCoupon";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200 && res.data.isApplicable){
					this.couponApplicabilityMsg = "Coupon applied successfully";
					this.couponApplicability = "applicable";
					this.couponType = res.data.couponType;
					this.couponId = res.data.couponId;
				}
				else{
					this.couponApplicabilityMsg = "Sorry, this coupon code is not applicable";
					this.couponApplicability = "not-applicable";
					this.couponType = null;
					this.couponId = null;
				}
			},
			e => {
				this.couponApplicabilityMsg = "Sorry, this coupon code is not applicable";
				this.couponApplicability = "not-applicable";
				this.couponType = null;
				this.couponId = null;
			},
  			() => {
  				try{
					this.loadingRef.dismiss();
				}catch(e){
					console.error("error @ ionic loading module");
				}
  			}
  		);
	}

  	fetchAddress(){
  		//this.loadingRef = this.appService.getLoadingRef();
  		this.loadingRef.present();
  		var request = {
			uid: this.appService.getUserId()
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/getAddresses";
		var thisObservable =  this.http
			.post(serviceUrl,request)
			.map(res => res.json());
		thisObservable.subscribe(res => {
				if(res.response===200){
					this.addressList = res.data.addresses;
				}else{

				}
			},
			e => {

			},
			() => {
				try{
					this.loadingRef.dismiss();
				}catch(e){
					console.error("error @ ionic loading module");
				}
			}
		);

		//return thisObservable;
	}

	onClickPlaceOrder(){
		var request = {
		  uid: this.appService.getUserId(),
		  addressId: this.selectedDeliveryAddressId,
		  paymentMode: null,
		  couponId: 2343,//null,
		  couponType: 2343,//null
	  	};

		if(this.couponApplicability == "applicable"){
			request.couponId = this.couponCode;
			request.couponType = this.couponType;
		}
		switch(this.selectedPaymentMode){
			case "cod":
				request.paymentMode = 100;
				break;
			case "online":
				request.paymentMode = 101;
				break;
			default:
				request.paymentMode = 100;
				break;
		}

		var serviceUrl = this.appService.getBaseUrl()+"/store/checkOut";
		var thisObservable =  this.http
			.post(serviceUrl,request)
			.map(res => res.json());
		thisObservable.subscribe(res => {
			if(res.response===200){
				this.presentToast("Order placed successfully")
				this.navCtrl.push(OrderHistoryPage);
			}else{

			}
		});
		return thisObservable;
	}


  	doAddAddress(){
  		var request = {
  			uid: this.appService.getUserId(),
  			address:{
  				addressLine1: this.newAddress.addressLine1,
  				addressLine2: this.newAddress.addressLine2,
  				city: this.newAddress.city,
  				state:this.newAddress.state,
  				pinCode: this.newAddress.pinCode,
  				contactNo: this.newAddress.contactNo,
  				alternateContact: this.newAddress.alternateContact
  			}
		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/addAddress";
		this.http.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.onClickBackToChooseAddress();
					this.fetchAddress();
					this.resetNewAddress();
				}else{

				}
			},
			e => {

			},
			() => {

			}
		);
  	}

	validateText(text,field){
		if(text && ( text.length >= this.ADDRESS_MIN_LENGTH) && ( text.length <= this.ADDRESS_MAX_LENGTH)){
			this.newAddress[field] = false;
			return (true);
		}
		this.newAddress[field] = true;
		return (false);
	}

	validateMobileNo(number,field){
		if(isFinite(number) && (number >= Math.pow(10,9)) &&  (number < Math.pow(10,10))){
			this.newAddress[field] = false;
		  return (true);
		}
		this.newAddress[field] = true;
		return (false);
	}

	validatePinCode(number,field){
		if(isFinite(number) && (number >= Math.pow(10,5)) &&  (number < Math.pow(10,6))){
			this.newAddress[field] = false;
		  	return (true);
		}
		this.newAddress[field] = true;
		return (false);
	}

	disableAddAddress(){
		var valid = Boolean(this.newAddress.addressLine1) && !this.newAddress.addressLine1Invalid
					&& Boolean(this.newAddress.addressLine2)  && !this.newAddress.addressLine2Invalid
					&& Boolean(this.newAddress.city) && !this.newAddress.cityInvalid
					&& Boolean(this.newAddress.state) && !this.newAddress.stateInvalid
					&& Boolean(this.newAddress.pinCode) && !this.newAddress.pinCodeInvalid
					&& Boolean(this.newAddress.contactNo) && !this.newAddress.contactNoInvalid
					&& Boolean(this.newAddress.alternateContact) && !this.newAddress.alternateContactInvalid
		return !valid;
	}

  	disableApplyCoupon(){
  		return !(this.couponCode && (typeof this.couponCode)==="string" && this.couponCode.length>3);
  	}

  	disableContinue(){
  		return !(this.grandTotal && this.grandTotal>0);
  	}

  	disablePlaceOrder(){
  		var flag = false;
  		try{
  			if(this.selectedDeliveryAddressId && this.selectedPaymentMode){
  				flag = false;
  			}
  			else{
  				flag = true;
  			}
  		}
  		catch(e){
  			flag = true;
  		}
  		return flag;
  	}

  	resetNewAddress(){
  		this.newAddress = {
			addressLine1: null,
			addressLine1Invalid: false,
			addressLine2: null,
			addressLine2Invalid: false,
			city: null,
			cityInvalid: false,
			state: null,
			stateInvalid: false,
			pinCode: null,
			pinCodeInvalid: false,
			contactNo: null,
			contactNoInvalid: false,
			alternateContact: null,
			alternateContactInvalid: false,
		}
  	}

	getCouponConstants(){
		return{
			COUPON_TYPE_NONE : 0,
			COUPON_TYPE_OTHER : 1001,
			COUPON_TYPE_ACK_REFER : 1002,
			COUPON_TYPE_REFER : 1003
		}
	}

	presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: this.appService.getToastSettings().duration,
			showCloseButton: this.appService.getToastSettings().showCloseButton,
			closeButtonText : this.appService.getToastSettings().closeButtonText,
			position: this.appService.getToastSettings().position
		});

		toast.present();
	}
}
