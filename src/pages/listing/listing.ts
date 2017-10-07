import { Component  } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import {Http} from '@angular/http';
import { PopoverController } from 'ionic-angular';
import { AppService } from "../../app/app.service";
import { FilterComponent } from '../filter/filter';
import { ProductCreatePage } from '../createproduct/createproduct';

@Component({
  	selector: 'page-listing',
  	templateUrl: 'listing.html'
})
export class ListingPage {
	public loadingRef;
	public pageLoading;
	public productList;
	public categoriesList;
	public brandsList;
	public sortSelectOptions;
	public sortOptions;
	public sortOrder;
	public prevRouteParams;
	public lazyLoadOffset = 0;
	public lazyLoadLimit = 10;
	public fetchDataObservable;
	public fetchDataInProgress;
	public totalProductCount;

	constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, public appService : AppService, public popoverCtrl: PopoverController) {
		this.productList = [];
		this.brandsList = this.appService.getBrandsList();
		this.categoriesList = this.appService.getCategoriesList();
		console.info("this.brandsList",this.brandsList);
		console.info("this.categoriesList",this.categoriesList);
		this.loadingRef = this.appService.getLoadingRef();
		this.sortSelectOptions = {
		  title: 'Sort By'
		};
		this.sortOptions = [
			{
				id : 1,
				title : 'Low to High',
			},
			{
				id : 2,
				title : 'High to Low',
			},
			{
				id : 3,
				title : 'New Arrivals',
			},
			{
				id : 4,
				title : 'Discount Rate',
			}
			// {
			// 	id : 0,
			// 	title : 'None'
			// }
		];
		this.fetchData(this.navParams.data,false, null);
	}

  	fetchData(routeParams, islazyFetch, infiniteScroll){
		this.prevRouteParams = routeParams;
		this.fetchDataInProgress = true;
		if(!islazyFetch){
			this.pageLoading = true;
			this.loadingRef.present();
		}
		var serviceUrl = this.appService.getBaseUrl()+"/store/getProductList";
		var request = {
			uid: this.appService.getUserId(),
			offset: this.lazyLoadOffset,
			count: this.lazyLoadLimit,
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
		this.fetchDataObservable = this.http.post(serviceUrl,request).map(res => res.json());
		this.fetchDataObservable.subscribe(res => {
			this.processListingData(res.data, islazyFetch,infiniteScroll);
		});
	}

	processListingData(data,islazyFetch,infiniteScroll){
		this.totalProductCount = data.totalProductCount;
		if(islazyFetch && this.productList && Array.isArray(this.productList) && this.productList.length){
			data.products.forEach((item)=>{
				this.productList.push(item);
			});
			infiniteScroll.complete();
		}
		else{
			this.productList = data.products;
			this.pageLoading = false;
			this.loadingRef.dismiss();
		}
		this.fetchDataInProgress = false;
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
		   		this.fetchData([filterEntityCategory,filterEntityBrand],false,null);
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
	   		this.fetchData([filterEntitySort],false,null);
		}
	}

	createProduct(){
		this.navCtrl.push(ProductCreatePage);
	}

	doInfinite(infiniteScroll) {
		if(this.productList && this.productList.length){
			this.lazyLoadOffset += this.lazyLoadLimit;
			var fetchNotOver =  this.productList.length < this.totalProductCount;
			if(fetchNotOver && !this.fetchDataInProgress){
				this.fetchData(this.prevRouteParams,true,infiniteScroll);
			}
			else{
				infiniteScroll.enable(false);
			}
		}
	  }
}
