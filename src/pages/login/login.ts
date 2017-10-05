import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import {Http} from '@angular/http';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AppService } from "../../app/app.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
    public loadingRef;
    public loginObj;
    public signupObj;
    public viewSignup = false;
    public NAME_MIN_LENGTH = 4;
    public NAME_MAX_LENGTH = 25;
    public PWD_MIN_LENGTH = 4;
    public PWD_MAX_LENGTH = 15;

	@ViewChild(Content) content: Content;
  	scrollToTop() {
    	this.content.scrollToTop();
  	}
  	constructor(private http: Http, public events : Events, private toastCtrl: ToastController, public appService : AppService) {
      this.loadingRef = this.appService.getLoadingRef();
      this.loginObj = this.createLoginObj();
      this.signupObj = this.createSignupObj();
    }

    createLoginObj(){
      return {
        mobileNo : null,
        pwd : null,
        mobileNoInvalid : false,
        pwdInvalid : false
      };
    }

    createSignupObj(){
      return {
        name : null,
        mobileNo : null,
        email : null,
        pwd : null,
        confirmPwd : null,
        nameInvalid : false,
        mobileNoInvalid : false,
        emailInvalid : false,
        pwdInvalid : false,
        confirmPwdInvalid : false
      };
    }
    showSignup(){
      this.signupObj = this.createSignupObj();
      this.viewSignup = true;
    }

    showLogin(){
      this.loginObj = this.createLoginObj();
      this.viewSignup = false;
    }

    skipLogin(){
      this.events.publish('logIn',true, null);
    }

  	loginAction(){
      this.loadingRef.present();
      var userName = this.loginObj.mobileNo;
      var serviceUrl = this.appService.getBaseUrl()+"/user/login";
      serviceUrl = this.appService.getBaseUrl()+"/admin/login";

  		var request = {
            data: "Admin",//userName,
            password: "password"//this.loginObj.pwd
        };
		  this.http
		  	.post(serviceUrl, request)
		  	.map(res => res.json())
		  	.subscribe(res => {
		  		if(res.response===200){
            /* if(this.loginObj.mobileNo==1111111111){
              res.data.isAdmin = true;
              res.data.name = "Admin";
            }
            else{
              res.data.isAdmin = false;
            } */
            this.events.publish('logIn',true,res.data.id,res.data.name,res.data.isAdmin);
            this.presentToast("Welcome Admin !!");
            this.loginObj = this.createLoginObj();
		  		}else{
            this.presentToast("Invalid Login credentials");
		  			this.events.publish('logIn',false, null, null);
          }
          this.loadingRef.dismiss();
		  	});
    }

    signupAction(){
      this.loadingRef.present();
      var serviceUrl = this.appService.getBaseUrl()+"/user/register";
  		var request = {
          name: this.signupObj.name,
          mobileNo: this.signupObj.mobileNo,
          email: this.signupObj.email,
          password: this.signupObj.pwd,
      };
		  this.http
		  	.post(serviceUrl, request)
		  	.map(res => res.json())
		  	.subscribe(res => {
		  		if(res.response===200){
            this.events.publish('logIn',true,res.data.id,res.data.name);
            this.presentToast("Welcome "+res.data.name+" !!");
            this.signupObj = this.createSignupObj();
		  		}else{
            this.presentToast("Invalid Login credentials");
		  			this.events.publish('logIn',false, null, null);
          }
          this.loadingRef.dismiss();
		  	});
    }

    validateMobileNo(obj){
      return (true);
      // if(isFinite(obj.mobileNo) && (obj.mobileNo >= Math.pow(10,9)) &&  (obj.mobileNo < Math.pow(10,10))){
      //   obj.mobileNoInvalid = false;
      //   return (true);
      // }
      // obj.mobileNoInvalid = true;
      // return (false);
    }

    validatePwd(obj){
      if(obj.pwd && (obj.pwd.length >= this.PWD_MIN_LENGTH) && (obj.pwd.length <= this.PWD_MAX_LENGTH)){
        obj.pwdInvalid = false;
        return (true);
      }
      obj.pwdInvalid = true;
      return (false);
    }

    validateConfirmPwd(obj){
      if(obj.pwd === obj.confirmPwd){
        obj.confirmPwdInvalid = false;
        return (true);
      }
      obj.confirmPwdInvalid = true;
      return (false);
    }

    validateEmail(){
      var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailRegex.test(this.signupObj.email)){
        this.signupObj.emailInvalid = false;
        return (true);
      }
      this.signupObj.emailInvalid = true;
      return (false);
    }

    validateName(){
      var nameRegex = /^[a-zA-Z ]*$/;
      if(this.signupObj.name && nameRegex.test(this.signupObj.name) && ( this.signupObj.name.length >= this.NAME_MIN_LENGTH) && ( this.signupObj.name.length <= this.NAME_MAX_LENGTH)){
        this.signupObj.nameInvalid = false;
        return (true);
      }
      this.signupObj.nameInvalid = true;
      return (false);
    }

    disableLogin(){
      var valid = Boolean(this.loginObj.mobileNo) && Boolean(this.loginObj.pwd)
                  && !this.loginObj.mobileNoInvalid && !this.loginObj.pwdInvalid ;
      //return !valid;
      return false;
    }

    disableSignup(){
      var valid = Boolean(this.signupObj.name) && !this.signupObj.nameInvalid
                  && Boolean(this.signupObj.mobileNo)  && !this.signupObj.mobileNoInvalid
                  && Boolean(this.signupObj.email) && !this.signupObj.emailInvalid
                  && Boolean(this.signupObj.pwd) && Boolean(this.signupObj.confirmPwd)
                  && !this.signupObj.pwdInvalid && !this.signupObj.confirmPwdInvalid;
      return !valid;
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: this.appService.getToastSettings().duration,
        showCloseButton: this.appService.getToastSettings().showCloseButton,
        closeButtonText : this.appService.getToastSettings().closeButtonText,
        position: this.appService.getToastSettings().position
      });

      toast.onDidDismiss(() => {

      });

      toast.present();
    }


}
