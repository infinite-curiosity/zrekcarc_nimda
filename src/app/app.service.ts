import { Injectable } from '@angular/core';
import { LoadingController  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

@Injectable()
export class AppService {
    private userId;
    private userName;
    private isAdmin;
    public categoriesList;
    public brandsList;
    private baseUrl;
    public cartCount;
    public openPage;
    public myApp;
    constructor(private http: Http, public loadingCtrl: LoadingController, public events : Events){
        this.userId = -1;
        this.baseUrl = "http://crackersapp.us-east-2.elasticbeanstalk.com";
    }
    getUserId(){
        return this.userId;
    }
    setUserId(userId){
        if(!userId){
            this.userId = -1;
        }
        else{
            this.userId = userId;
            this.getCartItems();
        }
    }
    getUserName(){
        return this.userName;
    }
    setUserName(userName){
        this.userName = userName;
    }
    getIsAdmin(){
        return this.isAdmin;
    }
    setIsAdmin(isAdmin){
        this.isAdmin = isAdmin;
    }
    getBrandsList(){
        return this.brandsList;
    }
    setBrandsList(brandsList){
        this.brandsList = brandsList;
    }
    getCategoriesList(){
        return this.categoriesList;
    }
    setCategoriesList(categoriesList){
        this.categoriesList = categoriesList;
    }
    getBaseUrl(){
        return this.baseUrl;
    }
    setBaseUrl(baseUrl){
        this.baseUrl = baseUrl;
    }

    getCartCount(){
        return this.cartCount;
    }
    setCartCount(count){
        this.cartCount = count;
    }
    getCartItems(){
        var request = {
            uid: this.getUserId()
        };
        var serviceUrl = this.getBaseUrl()+"/store/getCartItems";
        var thisObservable = this.http.post(serviceUrl,request)
            .map(res => res.json());

        thisObservable.subscribe(res => {
            if(res.response===200){
                if(res.data && res.data.products && Array.isArray(res.data.products)){
                    this.setCartCount(res.data.products.length);
                }
            }else{

            }
        });
        return thisObservable;
    }
    redirectToShoppingCartPage(){
        this.openPage.call(this.myApp,"shoppingCartPage");
    }
    getLoadingRef(){
        return {
            present : (() => {
                this.events.publish("showLoading",true);
            }),
            dismiss : (() => {
                this.events.publish("showLoading",false);
            })
        };
    }
    getToastSettings(){
        return {
            duration: 1500,
            showCloseButton: false,
            closeButtonText : "x",
            position: "bottom"
        }
    }
}