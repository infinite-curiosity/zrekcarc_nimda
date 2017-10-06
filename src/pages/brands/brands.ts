import { Component  } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import {Http} from '@angular/http';
import { PopoverController } from 'ionic-angular';
import { AppService } from "../../app/app.service";
import { FilterComponent } from '../filter/filter';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../bcmodal/bcmodal';

@Component({
  	selector: 'manage-brands',
  	templateUrl: 'brands.html'
})
export class BrandsPage {
	public loadingRef;
	public pageLoading;
	public productList;
	public categoriesList;
	public brandsList;
	public sortSelectOptions;
	public sortOptions;
	public sortOrder;
	public entityType;
	public entityList;

	constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, public appService : AppService, public popoverCtrl: PopoverController,public modalCtrl: ModalController) {
		this.productList = [];
		this.entityType = this.navParams.data.entityType;
		//this.brandsList = this.appService.getBrandsList();
		//this.categoriesList = this.appService.getCategoriesList();
		if(this.entityType=="Brand"){
			this.entityList = this.appService.getBrandsList();
		}
		else{
			this.entityList = this.appService.getCategoriesList();
		}
		this.loadingRef = this.appService.getLoadingRef();
		//this.fetchData(this.navParams.data);
	}

	onClickEntity(entity){
		if(!entity){
			entity = {};
			entity.isCreate = true;
		}
		else{
			entity.isCreate = false;
		}
		entity.entityType = this.entityType;
		this.presentModal(entity);
	}

	presentModal(entity) {
		let modal = this.modalCtrl.create(ModalPage,entity);
		modal.present();
	}

	ionViewWillEnter(){

	}

	ionViewWillLeave(){

	}

  	fetchData(routeParams){
		this.pageLoading = true;
		this.loadingRef.present();
		var serviceUrl = this.appService.getBaseUrl()+"/store/getProductList";
		var request = {
			uid: this.appService.getUserId(),
			offset:0,
			count:20,
			filter: {
				sort:1,
				category: this.getIdsFromList(this.categoriesList, false),
				brands : this.getIdsFromList(this.brandsList, false)
			}
		};
		if(Array.isArray(routeParams) && routeParams.length){
			var that = this;
			routeParams.forEach(function(filterEntity){
				switch (filterEntity.field) {
					case "category":
						that.categoriesList = filterEntity.itemList;
						request.filter.category = that.getIdsFromList(that.categoriesList, true);
						break;
					case "brand":
						that.brandsList = filterEntity.itemList;
						request.filter.brands = that.getIdsFromList(that.brandsList, true);
						break;
					case "sort":
						that.sortOrder = that.getSortObjectFromId(filterEntity.sortId);
						request.filter.sort = filterEntity.sortId || 1;
					default:
						break;
				}
			});
		}
		if(routeParams && routeParams.field==="category"){
			if(routeParams.id>0){
				request.filter.category = [routeParams.id];
			}
		}
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				this.processListingData(res.data);
				/*if(res.response===200){
					this.events.publish('logIn', true);
				}else{
					this.events.publish('logIn', true);//false);
				}		  				  		  		*/
			});
  	}

  	getIdsFromList(list, isFilteredList){
  		var ids = [];
  		list.forEach(function(item){
  			if(isFilteredList){
  				if(item.checked===true){
  					ids.push(item.id);
  				}
  			}
  			else{
  				ids.push(item.id);
  			}
  		});
  		return ids;
  	}

  	getSortObjectFromId(sortId){
  		this.sortOptions.forEach((item,index) => {
  			if(item.id == sortId){
  				return item;
  			}
  		});
  	}

  	processListingData(data){
		this.productList = data.products;
		this.pageLoading = false;
		this.loadingRef.dismiss();
  	}

  	openFilterPopover(myEvent) {
		let filterData = {
			categoriesList : this.categoriesList,
			brandsList : this.brandsList
		}
		let popover = this.popoverCtrl.create(FilterComponent,filterData);
		popover.present({
			ev: myEvent
		});
		popover.onDidDismiss((popoverData) => {
			if(popoverData){
				var filterEntityCategory = {
		  			field : 'category',
		  			itemList : popoverData.categoriesList
		   		};
		   		var filterEntityBrand = {
		  			field : 'brand',
		  			itemList : popoverData.brandsList
		   		};
		   		this.fetchData([filterEntityCategory,filterEntityBrand]);
			}
			else{
				// do nothing
			}
	    })
	}

	compareFn(e1, e2): boolean {
	  return e1 && e2 ? e1.id === e2.id : e1 === e2;
	}

	onSortAction(option){
		if(option && option.id){
			var filterEntitySort = {
	  			field : 'sort',
	  			sortId : option.id
	   		};
	   		this.fetchData([filterEntitySort]);
		}
	}
}
