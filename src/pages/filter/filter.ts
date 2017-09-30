import { Component  } from '@angular/core';
import { NavController, NavParams, ViewController  } from 'ionic-angular';

@Component({
  template: `
    <ion-header class="position-relative">
        <ion-navbar>
            <ion-title>Filter</ion-title>
        </ion-navbar>
    </ion-header>
    <ion-list *ngIf="categoriesList && allCategories">
        <ion-list-header>Categories</ion-list-header>
        <ion-item>
            <ion-label>{{allCategories.name}}</ion-label>
            <ion-checkbox (click)="onUpdateCategory($event,'all')" [(ngModel)]="allCategories.checked"></ion-checkbox>
        </ion-item>
        <ion-item *ngFor="let category of categoriesList">
            <ion-label>{{category.name}}</ion-label>
            <ion-checkbox [(ngModel)]="category.checked" (click)="onUpdateCategory($event,category)"></ion-checkbox>
        </ion-item>
    </ion-list>
    <ion-list *ngIf="brandsList && allBrands">
        <ion-list-header>Brands</ion-list-header>
        <ion-item>
            <ion-label>All Brands</ion-label>
            <ion-checkbox (click)="onUpdateBrand($event,'all')" [(ngModel)]="allBrands.checked"></ion-checkbox>
        </ion-item>
        <ion-item *ngFor="let brand of brandsList">
            <ion-label>{{brand.name}}</ion-label>
            <ion-checkbox [(ngModel)]="brand.checked" (click)="onUpdateBrand($event,brand)"></ion-checkbox>
        </ion-item>
    </ion-list>
    <section class="action-bar disp-flex margin-bottom-10" style="justify-content:space-around;padding-bottom: 20px;">
        <button ion-button rounded color="secondary" style="flex-grow:1" (click)="applyFilter()">Apply</button>
        <button ion-button rounded color="danger" style="flex-grow:1" (click)="cancelFilter()">Cancel</button>
    </section>
  `
})
export class FilterComponent {
    passedFilterInput:any;
    categoriesList;
    brandsList:any;
    allCategories:any;
    allBrands:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.passedFilterInput = this.navParams.data;
        this.allCategories = {
            name : "All Categories",
            checked : true
        }
        this.allBrands = {
            name : "All Brands",
            checked : true
        }
        this.categoriesList = this.passedFilterInput.categoriesList;
        this.brandsList = this.passedFilterInput.brandsList;
        this.onUpdateCategory(null,null);
        this.onUpdateBrand(null,null);
        console.info("categoriesList",this.categoriesList);
        console.info("brandsList",this.brandsList);
    }

    ngAfterViewInit(){

    }

    onUpdateCategory(event, selectedItem){
        if(selectedItem === "all" && this.allCategories.checked){
            this.categoriesList.forEach(function(category){
                category.checked = true;
            });
            this.allCategories.checked = true;
        }
        else if(selectedItem === "all" && !this.allCategories.checked){
            this.categoriesList.forEach(function(category){
                category.checked = false;
            });
            this.allCategories.checked = false;
        }
        else{
            var count=0;
            this.categoriesList.forEach(function(category){
                if(category.checked){
                    count++;
                }
            });
            if(count === this.categoriesList.length){
                this.allCategories.checked = true;
            }else{
                this.allCategories.checked = false;
            }
        }

    }

    onUpdateBrand(event, selectedItem){
        if(selectedItem === "all"&& this.allBrands.checked){
            this.brandsList.forEach(function(brand){
                brand.checked = true;
            });
            this.allBrands.checked = true;
        }
         else if(selectedItem === "all" && !this.allBrands.checked){
            this.brandsList.forEach(function(brand){
                brand.checked = false;
            });
            this.allBrands.checked = false;
        }
        else{
            var count=0;
            this.brandsList.forEach(function(brand){
                if(brand.checked){
                    count++;
                }
            });
            if(count==this.brandsList.length){
                this.allBrands.checked = true;
            }else{
                this.allBrands.checked = false;
            }
        }
    }

    applyFilter(){
        var filteredBrandsList = this.brandsList.filter(function(item){
            return true;
        });
        var filteredCategoriesList = this.categoriesList.filter(function(item){
            return true;
        });
        var filterOutput = {
            brandsList : filteredBrandsList,
            categoriesList : filteredCategoriesList
        }
        this.viewCtrl.dismiss(filterOutput);
    }

    cancelFilter(){
        this.viewCtrl.dismiss();
    }

}