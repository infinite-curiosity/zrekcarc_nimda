import { Component  } from '@angular/core';
import { NavController, ToastController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { AppService } from "../../app/app.service";

@Component({
  	selector: 'order-history',
  	templateUrl: 'orders.html'
})
export class OrderHistoryPage {
	public list;
	public totalOrdersCount;
	public loadingRef;
	public orderStatusConstants;

	constructor(public navCtrl: NavController, private http: Http, public appService: AppService, private toastCtrl: ToastController) {
		this.list = [];
		this.loadingRef = this.appService.getLoadingRef();
		this.orderStatusConstants = this.getOrderStatusConstants();
		this.fetchData();
	}

	ngAfterViewInit() {
		/*for (var i=0;i<5;i++){
			this.list.push({id:i,cartQuantity:i+1});
		}*/
	}

  	fetchData(){
		this.loadingRef.present();
		var request, serviceUrl;
		if(this.appService.getIsAdmin()){
			 request = {
				uid: 1
			};
			serviceUrl = this.appService.getBaseUrl()+"/admin/getAdminOrdersListBeta";
		}
		else{
			request = {
				uid: this.appService.getUserId(),
				offet:0,
				count: 200
			};
			serviceUrl = this.appService.getBaseUrl()+"/store/getOrdersList";
		}
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					console.info("response",res);
					this.list = (res.data && res.data.orders) ? res.data.orders : [];
					this.list.forEach(item => {
						item.orderStatusText = this.getOrderStatusText(item.status);
					});
					this.totalOrdersCount = res.data.totalOrdersCount;
				}else{

				}
				this.loadingRef.dismiss();
			});
  	}

  	showLessDetails(order){
  		order.viewMoreDetails = false;
  	}

  	showMoreDetails(order){
		order.viewMoreDetails = true;
		this.loadingRef.present();
		var request, serviceUrl;
		if(this.appService.getIsAdmin()){
			 request = {
				uid: 1
			};
			serviceUrl = this.appService.getBaseUrl()+"/admin/getAdminOrderDetailsBeta";
		}
		else{
			request = {
				uid: this.appService.getUserId(),
				orderId: order.orderId
			};
			serviceUrl = this.appService.getBaseUrl()+"/store/getOrderDetail";
		}
		order.loading = true;
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					console.info("response",res);
					order.details = res.data;
					if(order.details && order.details.couponCode=="null"){
						order.details.couponCode = null;
					}
					if(order.details && order.details.transactionId=="null"){
						order.details.transactionId = null;
					}
					if(order.details && order.details.paymentMode){
						switch(order.details.paymentMode){
							case 100:
								order.details.paymentModeText = "Cash On Delivery";
								break;
							case 101:
								order.details.paymentModeText = "Online";
								break;
							default:
								order.details.paymentModeText = "Cash On Delivery";
								break;

						}
					}
				}else{

				}
				this.loadingRef.dismiss();
				order.loading = false;
			});
	  }

	showChangeOrderStatus(order){
		order.showOrderStatus = true;
	}

	hideChangeOrderStatus(order){
		order.showOrderStatus = false;
	}

	changeOrderStatus(order,status){
		var request = {
		  status: status.id,
		  orderId: order.orderId
	  	};
	  	var serviceUrl = this.appService.getBaseUrl()+"/admin/changeOrderStatus";
	 	if(!window.confirm("Are you sure you want to change the status of this order?")){
			order.selectedOrderStatusId = null;
			return;
		}
	  	this.http
		  .post(serviceUrl,request)
		  .map(res => res.json())
		  .subscribe(res => {
			  if(res.response===200){
				  this.fetchData();
				  this.presentToast("Order status changed successfully");
			  }else{

			  }
		});
	}

  	cancelOrder(order){
  		var request = {
			uid: this.appService.getUserId(),
			orderId: order.orderId
		};
		if(!window.confirm("Are you sure you want to cancel the order")){
			return;
		}
		var serviceUrl = this.appService.getBaseUrl()+"/store/cancelOrder";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.fetchData();
					this.presentToast("Order #"+ order.orderId+" has been cancelled");
				}else{

				}
			});
	}

	getOrderStatusText(orderStatusId){
		switch(orderStatusId){
			case 1:
				return "DELIVERED";
			case 2:
				return "IN TRANSIT";
			case 3:
				return "OUT_FOR_DELIVERY";
			case 4:
				return "ORDER_PLACED";
			case 5:
				return "PENDING";
			case 6:
				return "CANCELLED";
			case 7:
				return "FAILED";
			case 8:
				return "ADMIN_CANCELLED";
		}
	}

	getOrderStatusConstants(){
		return [
			{
				id: 1,
				name: "DELIVERED"
			},
			{
				id: 2,
				name: "IN TRANSIT"
			},
			{
				id: 3,
				name: "OUT FOR DELIVERY"
			},
			{
				id: 4,
				name: "ORDER PLACED"
			},
			{
				id: 5,
				name: "PENDING"
			},
			{
				id: 6,
				name: "CANCELLED"
			},
			{
				id: 7,
				name: "FAILED"
			},
			{
				id: 8,
				name: "ADMIN_CANCELLED"
			}
		]
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


}
