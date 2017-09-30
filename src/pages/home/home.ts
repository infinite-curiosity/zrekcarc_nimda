import { Component, ViewChild  } from '@angular/core';
import { Platform, NavController  } from 'ionic-angular';
import {Http} from '@angular/http';
import { Events } from 'ionic-angular';
import { CrackerItem } from '../product/product';
import { ListingPage } from '../listing/listing';
import { AppService } from "../../app/app.service";

@Component({
  	selector: 'page-home',
  	templateUrl: 'home.html'
})
export class HomePage {
	public categoriesList;
	public bannerImagesList;
	public brandsList;
	public newArrivalsList;
	public discountList;
	public noOfItemsInCart;
	public pageLoading;
	public loadingRef;
	public homeSlider;
	public showHomeSlider;

	@ViewChild(CrackerItem) crackerItem: CrackerItem;

	constructor(public navCtrl: NavController, private http: Http, public platform: Platform, public events : Events, public appService : AppService) {
		this.loadingRef = this.appService.getLoadingRef();
		this.initHomePage();
	}

	ionViewWillEnter(){

	}

	ionViewWillLeave(){

	}

	initHomePage(){

		this.fetchData();
	}

	checkIfAllImagesAreLoaded(list,callback){
		var loaded = true;
		list.forEach((item)=>{
			loaded = item.loaded && loaded;
		});
		callback(loaded);
	}


  	fetchData(){
		this.showHomeSlider = false;
		this.loadingRef.present();
		this.pageLoading = true;
  		var request = {
  			"uid" : Number(this.appService.getUserId())
  		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/getDashboardItems";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				if(res.response===200){
					this.processInitData(res.data);;
				}else{

				}
			});
  	}

  	processInitData(data){
		this.bannerImagesList = [];
		data.bannerImages.forEach((imageUrl) => {
			var obj = {
				src : imageUrl,
				loaded : false,
				checkLoaded : null
			};
			obj.checkLoaded = (status)=>{
				obj.loaded = status;
				this.checkIfAllImagesAreLoaded(this.bannerImagesList,(allLoaded)=>{
					if(allLoaded){
						setTimeout(()=>{
							this.showHomeSlider = true;
						},1000);
					}
				});
			};
			var img = new Image();
			img.src = imageUrl;
			img.onload = () => {
				obj.checkLoaded(true);
			};
			this.bannerImagesList.push(obj);
		});
		this.categoriesList = data.categories;
		this.noOfItemsInCart = data.noOfItemsInCart;
		this.brandsList = data.brands;
		this.newArrivalsList = data.newArrivals;
		this.discountList = data.discounted;
		this.appService.setBrandsList(data.brands);
		this.appService.setCategoriesList(data.categories);
		this.appService.setCartCount(data.noOfItemsInCart);
		this.pageLoading = false;
		this.loadingRef.dismiss();
  	}


  	redirectToCategory(category){
		  var filteredList,
			  filterEntity = {
	  			field : 'category',
	  			itemList : []
	   		};
  		if(category){
  			filteredList = this.categoriesList.map(function(item){
  				if(category.id == item.id){
					item.checked = true;
  				}else{
  					item.checked = false;
  				}
  				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}else{
  			filteredList = this.categoriesList.map(function(item){
				item.checked = true;
				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

  	redirectToBrand(brand){
  		var filterEntity = {
  			field : 'brand',
  			itemList : []
		   };
		var filteredList;
  		if(brand){
  			filteredList = this.brandsList.map(function(item){
  				if(brand.id == item.id){
					item.checked = true;
  				}else{
  					item.checked = false;
  				}
  				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}else{
  			filteredList = this.brandsList.map(function(item){
				item.checked = true;
				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

  	redirectWithSort(sortId){
  		var filterEntity = {
  			field : 'sort',
  			sortId : sortId
   		};
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

}
