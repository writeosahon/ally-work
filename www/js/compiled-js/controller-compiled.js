'use strict';function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}/**
 * Created by UTOPIA SOFTWARE on 3/11/2017.
 *//**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware.ally' namespace has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */// define the controller namespace
utopiasoftware.ally.controller={/**
     * method is used to handle the special event created by the intel xdk developer library. The special event (app.Ready)
     * is triggered when ALL the hybrid app plugins have been loaded/readied and also the document DOM content is ready
     */appReady:function appReady(){// initialise the onsen library
ons.ready(function(){// set the default handler for the app
ons.setDefaultDeviceBackButtonListener(function(){// does nothing for now!!
});if(utopiasoftware.ally.model.isAppReady===false){// if app has not completed loading
// displaying prepping message
$('#loader-modal-message').html("Loading App...");$('#loader-modal').get(0).show();// show loader
}// check if the user is currently logged in
if(window.localStorage.getItem("app-status")&&window.localStorage.getItem("app-status")!=""){// user is logged in
//set the first page to be displayed to be the login page
$('ons-splitter').get(0).content.load("login-template");}else{// user has NOT been logged in
// set the first page to be displayed to be the onboarding page
$('ons-splitter').get(0).content.load("onboarding-template");}// set the content page for the app
//$('ons-splitter').get(0).content.load("app-main-template");
});// END OF ONSEN LIBRARY READY EVENT
// add listener for when the Internet network connection is offline
document.addEventListener("offline",function(){// display a toast message to let user no there is no Internet connection
window.plugins.toast.showWithOptions({message:"No Internet Connection. App functionality may be limited",duration:4000,// 4000 ms
position:"bottom",styling:{opacity:1,backgroundColor:'#000000',textColor:'#FFFFFF',textSize:14}});},false);try{// lock the orientation of the device to 'PORTRAIT'
screen.lockOrientation('portrait');}catch(err){}// set status bar color
StatusBar.backgroundColorByHexString("#2C8E01");// prepare the inapp browser plugin
window.open=cordova.InAppBrowser.open;// use Promises to load the other cordova plugins
new Promise(function(resolve,reject){// this promise  just sets the promise chain in motion
window.setTimeout(function(){resolve();// resolve the promise
},0);}).then(function(){// load the securely stored / encrypted data into the app
// check if the user is currently logged in
if(!window.localStorage.getItem("app-status")||window.localStorage.getItem("app-status")==""){// user is not logged in
return null;}return Promise.resolve(intel.security.secureStorage.read({"id":"ally-user-details"}));}).then(function(instanceId){if(instanceId==null){// user is not logged in
return null;}return Promise.resolve(intel.security.secureData.getData(instanceId));}).then(function(secureData){if(secureData==null){// user is not logged in
return null;}utopiasoftware.ally.model.appUserDetails=JSON.parse(secureData);// transfer the collected user details to the app
// update the first name being displayed in the side menu
//$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);
return null;}).then(function(){// notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
utopiasoftware.ally.model.isAppReady=true;// hide the splash screen
navigator.splashscreen.hide();}).catch(function(err){// notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
utopiasoftware.ally.model.isAppReady=true;// hide the splash screen
navigator.splashscreen.hide();// display a toast message to let user no there is no Internet connection
window.plugins.toast.showWithOptions({message:"Startup Error. App functionality may be limited. Always update the app to "+"get the best secure experience. Please contact us if problem continues",duration:5000,// 5000 ms
position:"bottom",styling:{opacity:1,backgroundColor:'#000000',textColor:'#FFFFFF',textSize:14}});});},/**
     * object is the view-model for the app side menu
     */sideMenuViewModel:{/**
         * method is used to listen for when the list
         * items in the side menu is clicked
         *
         * @param label {String} label represents clicked list item in the side-menu
         */sideMenuListClicked:function sideMenuListClicked(label){if(label=="events schedule"){// 'events schedule' button was clicked
// close the side menu
$('ons-splitter').get(0).left.close().then(function(){$('#app-main-navigator').get(0).bringPageTop("events-schedule-page.html",{});// navigate to the specified page
}).catch(function(){});return;}if(label=="hotels"){// 'hotels' button was clicked
// close the side menu
$('ons-splitter').get(0).left.close().then(function(){$('#app-main-navigator').get(0).bringPageTop("hotels-page.html",{});// navigate to the specified page
}).catch(function(){});return;}}},/**
     * object is view-model for main-menu page
     */mainMenuPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");$('#menu-tabbar .tabbar__border').css("visibility","hidden");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){// stop the rotating animation on main menu page
//$('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
},/**
         * method is used to track changes on the tabbar tabs
         * @param event
         */tabbarPreChange:function tabbarPreChange(event){// determine the tab that was clicked
switch(event.originalEvent.index){case 0:$('#menu-tabbar ons-tab').removeAttr("label");// remove all displaced labels
$(event.originalEvent.tabItem).attr("label","Dashboard");// update the label of the to-be displayed tab
break;case 1:$('#menu-tabbar ons-tab').removeAttr("label");// remove all displaced labels
$(event.originalEvent.tabItem).attr("label","Payments");// update the label of the to-be displayed tab
break;case 2:$('#menu-tabbar ons-tab').removeAttr("label");// remove all displaced labels
$(event.originalEvent.tabItem).attr("label","Wallet");// update the label of the to-be displayed tab
break;case 3:$('#menu-tabbar ons-tab').removeAttr("label");// remove all displaced labels
$(event.originalEvent.tabItem).attr("label","Transfers");// update the label of the to-be displayed tab
break;case 4:$('#menu-tabbar ons-tab').removeAttr("label");// remove all displaced labels
$(event.originalEvent.tabItem).attr("label","Account");// update the label of the to-be displayed tab
break;}}},/**
     * object is view-model for onboarding page
     */onboardingPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#onboarding-navigator').get(0).topPage.onDeviceBackButton=function(){ons.notification.confirm('Do you want to close the app?',{title:'Exit',buttonLabels:['No','Yes']})// Ask for confirmation
.then(function(index){if(index===1){// OK button
navigator.app.exitApp();// Close the app
}});};// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){},/**
         * method is used to listen for click events of the "Sign Up" button
         *
         */signupButtonClicked:function signupButtonClicked(){$('#onboarding-navigator').get(0).pushPage("signup-page.html",{});// navigate to the signup page
},/**
         * method is used to listen for click events of the "Login" button
         *
         */loginButtonClicked:function loginButtonClicked(){$('ons-splitter').get(0).content.load('login-template');// navigate to the login page
},/**
         * method is used to track changes on the carousel slides
         * @param event
         */carouselPostChange:function carouselPostChange(event){// change the carousel counter indicator based on the currently active and previously active carousel slides
$('#onboarding-page .carousel-counter').eq(event.originalEvent.lastActiveIndex).removeClass('active');$('#onboarding-page .carousel-counter').eq(event.originalEvent.activeIndex).addClass('active');}},/**
     * object is view-model for login page
     */loginPageViewModel:{/**
         * used to hold the parsley form validation object for the sign-in page
         */formValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#login-navigator').get(0).topPage.onDeviceBackButton=function(){$('ons-splitter').get(0).content.load('onboarding-template');};// check if the user is currently logged in
if(window.localStorage.getItem("app-status")&&window.localStorage.getItem("app-status")!=""){// user is logged in
// display the user's save phone number on the login page phonenumber input
$('#login-page #login-phone-number').val(utopiasoftware.ally.model.appUserDetails.phone);}// initialise the login form validation
utopiasoftware.ally.controller.loginPageViewModel.formValidator=$('#login-form').parsley();// attach listener for the log in button click event on the login page
$('#login-signin').get(0).onclick=function(){// run the validation method for the sign-in form
utopiasoftware.ally.controller.loginPageViewModel.formValidator.whenValidate();};// listen for log in form field validation failure event
utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);});// listen for log in form field validation success event
utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");});// listen for log in form validation success
utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.loginPageViewModel.loginFormValidated);// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){try{// remove any tooltip being displayed on all forms in the login page
$('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#login-page [data-hint]').removeAttr("data-hint");// reset the form validator object in the sign-in page
utopiasoftware.ally.controller.loginPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms in the login page
$('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#login-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects in the login page
utopiasoftware.ally.controller.loginPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when sign-in form is successfully validated
         *
         */loginFormValidated:function loginFormValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"user cannot login to ALLY account without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var formData={lock:$('#login-page #login-pin').val(),phone:$('#login-page #login-phone-number').val().startsWith("0")?$('#login-page #login-phone-number').val().replace("0","+234"):$('#login-page #login-phone-number').val()};// begin login process
Promise.resolve().then(function(){// display the loader message to indicate that account is being created;
$('#loader-modal-message').html("Completing User Login...");return Promise.resolve($('#loader-modal').get(0).show());// show loader
}).then(function(){// clear all data belonging to previous user
var promisesArray=[];// holds all the Promise objects for all data being deleted
var promiseObject=new Promise(function(resolve,reject){// delete the user app details from secure storage if it exists
Promise.resolve(intel.security.secureStorage.delete({'id':'ally-user-details'})).then(function(){resolve();},function(){resolve();});// ALWAYS resolve the promise
});// add the promise object to the promise array
promisesArray.push(promiseObject);// return promise when all operations have completed
return Promise.all(promisesArray);}).then(function(){// clear all data in the device local/session storage
window.localStorage.clear();window.sessionStorage.clear();return null;}).then(function(){// upload the user details to the server
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/login.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:formData}));}).then(function(serverResponseText){serverResponseText+="";var newUser=JSON.parse(serverResponseText.trim());// get the new user object
// add a timestamp for the last time user details was updated
newUser._lastUpdatedDate=Date.now();// check if any error occurred
if(newUser.status=="error"){// an error occured
throw newUser.message;// throw the error message attached to this error
}// store user data
utopiasoftware.ally.model.appUserDetails=newUser;// store the user details
return newUser;// return user data
}).then(function(newUser){// create a cypher data of the user details
return Promise.resolve(intel.security.secureData.createFromData({"data":JSON.stringify(newUser)}));}).then(function(instanceId){// store the cyphered data in secure persistent storage
return Promise.resolve(intel.security.secureStorage.write({"id":"ally-user-details","instanceID":instanceId}));}).then(function(){// set app-status local storage (as user phone number)
window.localStorage.setItem("app-status",utopiasoftware.ally.model.appUserDetails.phone);// update the first name being displayed in the side menu
//$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);
return $('#loader-modal').get(0).hide();// hide loader
}).then(function(){// navigate to the main menu page
return $('ons-splitter').get(0).content.load("app-main-template");}).then(function(){ons.notification.toast("Login complete! Welcome",{timeout:3000});}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Login could not be completed";}$('#loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Log In Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});}},/**
     * object is view-model for forgot-pin page
     */forgotPinPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#login-navigator').get(0).topPage.onDeviceBackButton=function(){$('#login-navigator').get(0).popPage({});};// initialise the form validation
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator=$('#forgot-pin-form').parsley();// attach listener for the log in button click event on the login page
$('#forgot-pin-reset').get(0).onclick=function(){// run the validation method for the sign-in form
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.whenValidate();};// listen for log in form field validation failure event
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);});// listen for log in form field validation success event
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");});// listen for log in form validation success
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.forgotPinPageViewModel.forgotPinFormValidated);// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){try{// remove any tooltip being displayed on all forms in the page
$('#forgot-pin-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#forgot-pin-page [data-hint]').removeAttr("data-hint");// reset the form validator object in the page
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms in the page
$('#forgot-pin-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#forgot-pin-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects in the page
utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         *
         */forgotPinFormValidated:function forgotPinFormValidated(){$('#login-navigator').get(0).popPage({});}},/**
     * object is view-model for signup page
     */signupPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#onboarding-navigator').get(0).topPage.onDeviceBackButton=function(){// move to the onboarding page
$('#onboarding-navigator').get(0).popPage({});};// initialise the create-account form validation
utopiasoftware.ally.controller.signupPageViewModel.formValidator=$('#signup-form').parsley();// attach listener for the sign up button on the page
$('#signup-signup-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.signupPageViewModel.formValidator.whenValidate();};// listen for log in form field validation failure event
utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");});// listen for the form validation success
utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.signupPageViewModel.signupFormValidated);// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when the signup page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// remove any tooltip being displayed on all forms on the page
$('#signup-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#signup-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.signupPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the signup page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms on the page
$('#signup-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#signup-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.signupPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when sign-up form is successfully validated
         */signupFormValidated:function signupFormValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY account cannot be created without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var createAcctFormData={firstName:$('#signup-page #signup-firstname').val(),lastName:$('#signup-page #signup-lastname').val(),lock:$('#signup-page #signup-secure-pin').val(),phone:$('#signup-page #signup-phone-number').val().startsWith("0")?$('#signup-page #signup-phone-number').val().replace("0","+234"):$('#signup-page #signup-phone-number').val()};// tell the user that phone number verification is necessary
new Promise(function(resolve,reject){ons.notification.confirm('To complete sign up, your phone number must be verified. <br>'+'Usual SMS charge from your phone network provider will apply.<br> '+'Please ensure you have sufficient airtime to send/receive one SMS',{title:'Verify Phone Number',buttonLabels:['Cancel','Ok']})// Ask for confirmation
.then(function(index){if(index===1){// OK button
resolve();}else{reject("your phone number could not be verified");}});}).then(function(){// verify the user's phone number
//return null;
return utopiasoftware.ally.validatePhoneNumber($('#signup-page #signup-phone-number').val());}).then(function(){// display the loader message to indicate that account is being created;
$('#loader-modal-message').html("Completing Sign Up...");return Promise.resolve($('#loader-modal').get(0).show());// show loader
}).then(function(){// clear all data belonging to previous user
var promisesArray=[];// holds all the Promise objects for all data being deleted
var promiseObject=new Promise(function(resolve,reject){// delete the user app details from secure storage if it exists
Promise.resolve(intel.security.secureStorage.delete({'id':'ally-user-details'})).then(function(){resolve();},function(){resolve();});// ALWAYS resolve the promise
});// add the promise object to the promise array
promisesArray.push(promiseObject);// return promise when all operations have completed
return Promise.all(promisesArray);}).then(function(){// clear all data in the device local/session storage
window.localStorage.clear();window.sessionStorage.clear();return null;}).then(function(){// upload the user details to the server
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/signup.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:createAcctFormData}));}).then(function(serverResponseText){serverResponseText+="";var newUser=JSON.parse(serverResponseText.trim());// get the new user object
// add a timestamp for the last time user details was updated
newUser._lastUpdatedDate=Date.now();// check if any error occurred
if(newUser.status=="error"){// an error occured
throw newUser.message;// throw the error message attached to this error
}// store user data
utopiasoftware.ally.model.appUserDetails=newUser;return newUser;}).then(function(newUser){// create a cypher data of the user details
return Promise.resolve(intel.security.secureData.createFromData({"data":JSON.stringify(newUser)}));}).then(function(instanceId){// store the cyphered data in secure persistent storage
return Promise.resolve(intel.security.secureStorage.write({"id":"ally-user-details","instanceID":instanceId}));}).then(function(){// set app-status local storage (as user phone number)
window.localStorage.setItem("app-status",utopiasoftware.ally.model.appUserDetails.phone);// update the first name being displayed in the side menu
//$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);
return $('#loader-modal').get(0).hide();// hide loader
}).then(function(){return $('ons-splitter').get(0).content.load("app-main-template");}).then(function(){ons.notification.toast("Sign Up complete! Welcome",{timeout:3000});}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Sign Up could not be completed";}$('#loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Sign Up Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is triggered when the PIN visibility button is clicked.
         * It toggles pin visibility
         *
         * @param buttonElement
         */pinVisibilityButtonClicked:function pinVisibilityButtonClicked(buttonElement){if($(buttonElement).attr("data-ally-visible")==="no"){// pin is not visible, make it visible
$('#signup-secure-pin input').css("-webkit-text-security","none");// change the text-security for the input field
$(buttonElement).find('ons-icon').attr("icon","md-eye-off");// change the icon associated with the input
$(buttonElement).attr("data-ally-visible","yes");// flag the pin is now visible
}else{// make the pin not visible
$('#signup-secure-pin input').css("-webkit-text-security","disc");// change the text-security for the input field
$(buttonElement).find('ons-icon').attr("icon","md-eye");// change the icon associated with the input
$(buttonElement).attr("data-ally-visible","no");// flag the pin is now invisible
}},/**
         * method is used to change the value for the Verify Phone Number based on the checkbox state.
         * This change is used to enable validation for the input
         *
         * @param inputElement
         */verifyPhoneNumberClicked:function verifyPhoneNumberClicked(inputElement){if(inputElement.checked){// input is checked
// update the input value
inputElement.value="checked";}else{// input is NOT checked
// reset the input value
inputElement.value="";}}},/**
     * object is view-model for dashboard page
     */dashboardPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$thisPage.get(0).onDeviceBackButton=utopiasoftware.ally.controller.dashboardPageViewModel.backButtonClicked;// initialise the DropDownList
var dropDownListObject=new ej.dropdowns.DropDownList({});// render initialized DropDownList
dropDownListObject.appendTo('#dashboard-period-select');// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){// stop the rotating animation on main menu page
//$('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
},/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}ons.notification.confirm('Do you want to close the app?',{title:'Exit',buttonLabels:['No','Yes']})// Ask for confirmation
.then(function(index){if(index===1){// OK button
navigator.app.exitApp();// Close the app
}});}},/**
     * object is view-model for account page
     */accountPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$thisPage.get(0).onDeviceBackButton=utopiasoftware.ally.controller.accountPageViewModel.backButtonClicked;$('#account-preloading-fab',$thisPage).css("display","inline-block");// display page preloader
// initialise the form validation
utopiasoftware.ally.controller.accountPageViewModel.formValidator=$('#account-page #account-form').parsley();// listen for form field validation failure event
utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");});// listen for the form validation success
utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.accountPageViewModel.accountFormValidated);// load the user data
utopiasoftware.ally.controller.accountPageViewModel.loadUserAccountData().then(function(userDetails){// save the returned user details in app cache
return utopiasoftware.ally.saveUserAppDetails(userDetails);}).then(function(userDetails){// update the page with the collect data details
// update user data on app
utopiasoftware.ally.model.appUserDetails=userDetails;$('#account-wallet-balance',$thisPage).html(kendo.toString(kendo.parseFloat(userDetails.balance),"n2"));$('#account-last-updated',$thisPage).html(kendo.toString(new Date(userDetails._lastUpdatedDate),"MMM d yyyy, h:mmtt"));$('#account-firstname',$thisPage).val(userDetails.firstname);$('#account-lastname',$thisPage).val(userDetails.lastname);$('#account-phone-number',$thisPage).val(userDetails.phone);$('#account-email',$thisPage).val(userDetails.email&&userDetails.email!=""?userDetails.email:"");// display the necessary page components
$('#account-list',$thisPage).css("display","block");$('#account-reload-fab',$thisPage).css("display","inline-block");$('#account-edit-fab',$thisPage).css("display","inline-block");// hide necessary page components
$('#account-save',$thisPage).css("display","none");$('#account-page-error',$thisPage).css("display","none");// hide page preloader
$('#account-preloading-fab',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// an error occurred when trying to load the user data
// hide the necessary page components
$('#account-list',$thisPage).css("display","none");$('#account-save',$thisPage).css("display","none");$('#account-edit-fab',$thisPage).css("display","none");// display necessary page components
$('#account-page-error',$thisPage).css("display","block");$('#account-reload-fab',$thisPage).css("display","inline-block");// hide page preloader
$('#account-preloading-fab',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();});}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){try{// remove any tooltip being displayed on all forms on the page
$('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#account-page [data-hint]').removeAttr("data-hint");// reset the form validator objects on the page
utopiasoftware.ally.controller.accountPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){try{// remove any tooltip being displayed on all forms on the page
$('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#account-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.accountPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// check if the menu tabbar exists
if($('#menu-tabbar').get(0)){// the menu tabbar object exists
// move to the previous tab
$('#menu-tabbar').get(0).setActiveTab(3);}},/**
         * method is triggered when the Edit Account fab button is clicked
         */editAccountButtonClicked:function editAccountButtonClicked(){// remove the the readonly attributes, so the form  elements can be editable
$('#account-page [data-ally-readonly-field]').removeAttr('readonly');// hide the edit account button
$('#account-page #account-edit-fab').css("display","none");// show the save account button
$('#account-page #account-save').css("display","inline-block");// display the instruction for running the account edit
ons.notification.toast("you can edit your account",{timeout:3000});},/**
         * method is triggered when the Refresh Account fab button is clicked
         */refreshAccountButtonClicked:function refreshAccountButtonClicked(){// add the the readonly attributes, so the form  elements cannot be editable
$('#account-page [data-ally-readonly-field]').attr('readonly',true);// hide the edit account button
$('#account-page #account-edit-fab').css("display","none");// hide the save account button
$('#account-page #account-save').css("display","none");// remove any tooltip being displayed on all forms on the page
$('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#account-page [data-hint]').removeAttr("data-hint");// reset the form validator objects on the page
utopiasoftware.ally.controller.accountPageViewModel.formValidator.reset();// display the page preloader
$('#account-page #account-preloading-fab').css("display","inline-block");// load the user data
utopiasoftware.ally.controller.accountPageViewModel.loadUserAccountData().then(function(userDetails){// save the returned user details in app cache
return utopiasoftware.ally.saveUserAppDetails(userDetails);}).then(function(userDetails){// update the page with the collected data details
// update user data on app
utopiasoftware.ally.model.appUserDetails=userDetails;$('#account-page #account-wallet-balance').html(kendo.toString(kendo.parseFloat(userDetails.balance),"n2"));$('#account-page #account-last-updated').html(kendo.toString(new Date(userDetails._lastUpdatedDate),"MMM d yyyy, h:mmtt"));$('#account-page #account-firstname').val(userDetails.firstname);$('#account-page #account-lastname').val(userDetails.lastname);$('#account-page #account-phone-number').val(userDetails.phone);$('#account-page #account-email').val(userDetails.email&&userDetails.email!=""?userDetails.email:"");// display the necessary page components
$('#account-page #account-list').css("display","block");$('#account-page #account-reload-fab').css("display","inline-block");$('#account-page #account-edit-fab').css("display","inline-block");// hide necessary page components
$('#account-page #account-save').css("display","none");$('#account-page #account-page-error').css("display","none");// hide page preloader
$('#account-page #account-preloading-fab').css("display","none");}).catch(function(){// an error occurred when trying to load the user data
// hide the necessary page components
$('#account-page #account-list').css("display","none");$('#account-page #account-save').css("display","none");$('#account-page #account-edit-fab').css("display","none");// display necessary page components
$('#account-page #account-page-error').css("display","block");$('#account-page #account-reload-fab').css("display","inline-block");// hide page preloader
$('#account-page #account-preloading-fab').css("display","none");});},/**
         * method is triggered when the Save Account fab button is clicked
         */saveAccountButtonClicked:function saveAccountButtonClicked(){// run the validation method for the sign-in form
utopiasoftware.ally.controller.accountPageViewModel.formValidator.whenValidate();},/**
         * method is triggered when form is successfully validated
         */accountFormValidated:function accountFormValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY account cannot be updated without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// ask user for secure PIN before proceeding. secure pin MUST match
ons.notification.prompt({title:'<ons-icon icon="ion-lock-combination" size="28px" '+'style="color: #30a401;"></ons-icon> Security Check',id:"pin-security-check",messageHTML:'<div><span>'+'Please enter your ALLY Secure PIN to proceed</span></div>',cancelable:true,placeholder:"Secure PIN",inputType:"number",defaultValue:"",autofocus:false,submitOnEnter:true}).then(function(userInput){// collect user secure PIN and submit the rest of the form data
// add the the readonly attributes, so the form  elements cannot be editable
$('#account-page [data-ally-readonly-field]').attr('readonly',true);// hide the edit account button
$('#account-page #account-edit-fab').css("display","none");// hide the save account button
$('#account-page #account-save').css("display","none");// create the form data to be submitted
var formData={firstName:$('#account-page #account-firstname').val(),lastName:$('#account-page #account-lastname').val(),lock:userInput,phone:$('#account-page #account-phone-number').val(),email:$('#account-page #account-email').val()};// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Saving Account Details...");// forward the form data &show loader
return Promise.all([formData,Promise.resolve($('#hour-glass-loader-modal').get(0).show())]);}).then(function(dataArray){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/update-profile.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:dataArray[0]// data to submit to server
}));}).then(function(serverResponseText){serverResponseText+="";var userAcctDetails=JSON.parse(serverResponseText.trim());// get the new user object
// add a timestamp for the last time user details was updated
userAcctDetails._lastUpdatedDate=Date.now();// check if any error occurred
if(userAcctDetails.status=="error"){// an error occured
throw userAcctDetails.message;// throw the error message attached to this error
}return utopiasoftware.ally.saveUserAppDetails(userAcctDetails);// cache the returned account details
}).then(function(userAcctDetails){// update the user data on the app
utopiasoftware.ally.model.appUserDetails=userAcctDetails;return userAcctDetails;}).then(function(){// display the necessary page components
$('#account-page #account-list').css("display","block");$('#account-page #account-reload-fab').css("display","inline-block");$('#account-page #account-edit-fab').css("display","inline-block");// hide necessary page components
$('#account-page #account-save').css("display","none");$('#account-page #account-page-error').css("display","none");// hide page preloader
$('#account-page #account-preloading-fab').css("display","none");return $('#hour-glass-loader-modal').get(0).hide();// hide loader
}).then(function(){ons.notification.toast("Account Details Updated!",{timeout:3000});}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Your account details could not be updated. Please retry";}// remove the readonly attributes, so the form  elements can be editable
$('#account-page [data-ally-readonly-field]').removeAttr('readonly',true);// hide the edit account button
$('#account-page #account-edit-fab').css("display","none");// show the save account button
$('#account-page #account-save').css("display","inline-block");$('#hour-glass-loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Account Update Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is used to load the user account data either from
         * the locally cached data OR directly from the remote server
         */loadUserAccountData:function loadUserAccountData(){return new Promise(function(resolve,reject){// check if there is internet connection
if(navigator.connection.type===Connection.NONE){// no internet connection
// inform the user that cached data will be displayed in the absence of internet
window.plugins.toast.showWithOptions({message:"No Internet Connection. Previously cached data will be displayed",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#008000',textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});// no internet connection, so use local cache of data
resolve(utopiasoftware.ally.loadUserCachedAppDetails());}else{// there's internet, so make request for new data
Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/get-profile.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{phone:utopiasoftware.ally.model.appUserDetails.phone}// data to submit to server
})).then(function(serverResponseText){serverResponseText+="";var userDetailsData=JSON.parse(serverResponseText.trim());// get the new user object
// add a timestamp for the last time user details was updated
userDetailsData._lastUpdatedDate=Date.now();// check if any error occurred
if(userDetailsData.status=="error"){// an error occurred
throw userDetailsData.message;// throw the error message attached to this error
}resolve(userDetailsData);// return user data and resolve the Promise
}).catch(function(err){reject(err);// reject the Promise error
});}});}},/**
     * object is view-model for wallet page
     */walletPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$thisPage.get(0).onDeviceBackButton=utopiasoftware.ally.controller.walletPageViewModel.backButtonClicked;$('#wallet-preloading-fab',$thisPage).css("display","inline-block");// display page preloader
// load the user data
utopiasoftware.ally.controller.walletPageViewModel.loadUserAccountData().then(function(userDetails){// save the returned user details in app cache
return utopiasoftware.ally.saveUserAppDetails(userDetails);}).then(function(userDetails){// update the page with the collect data details
// update user data on app
utopiasoftware.ally.model.appUserDetails=userDetails;$('#wallet-balance',$thisPage).html(kendo.toString(kendo.parseFloat(userDetails.balance),"n2"));$('#wallet-owner-name',$thisPage).html(userDetails.firstname+" "+userDetails.lastname);// display the necessary page components
$('#wallet-list',$thisPage).css("display","block");$('#wallet-reload-fab',$thisPage).css("display","inline-block");// hide page preloader
$('#wallet-preloading-fab',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// an error occurred when trying to load the user data
// display the necessary page components
$('#wallet-list',$thisPage).css("display","block");// display necessary page components
$('#wallet-reload-fab',$thisPage).css("display","inline-block");// hide page preloader
$('#wallet-preloading-fab',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();});}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(event){var $thisPage=$(event.target);// get the current page shown
// check if the user triggered a page refresh
if($('#app-main-navigator').get(0).topPage.data.refresh!==true){// page refresh was NOT triggered
return;// exit
}// a page refresh was triggered, so begin refresh the wallet page content
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");$('#wallet-preloading-fab',$thisPage).css("display","inline-block");// display page preloader
// hide the necessary page components
$('#wallet-list',$thisPage).css("display","none");// load the user data
utopiasoftware.ally.controller.walletPageViewModel.loadUserAccountData().then(function(userDetails){// save the returned user details in app cache
return utopiasoftware.ally.saveUserAppDetails(userDetails);}).then(function(userDetails){// update the page with the collect data details
// update user data on app
utopiasoftware.ally.model.appUserDetails=userDetails;$('#wallet-balance',$thisPage).html(kendo.toString(kendo.parseFloat(userDetails.balance),"n2"));$('#wallet-owner-name',$thisPage).html(userDetails.firstname+" "+userDetails.lastname);// display the necessary page components
$('#wallet-list',$thisPage).css("display","block");$('#wallet-reload-fab',$thisPage).css("display","inline-block");// hide page preloader
$('#wallet-preloading-fab',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// an error occurred when trying to load the user data
// display the necessary page components
$('#wallet-list',$thisPage).css("display","block");// display necessary page components
$('#wallet-reload-fab',$thisPage).css("display","inline-block");// hide page preloader
$('#wallet-preloading-fab',$thisPage).css("display","none");});},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){},/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// check if the menu tabbar exists
if($('#menu-tabbar').get(0)){// the menu tabbar object exists
// move to the previous tab
$('#menu-tabbar').get(0).setActiveTab(1);}},/**
         * method is triggered when the Refresh Account fab button is clicked
         */refreshAccountButtonClicked:function refreshAccountButtonClicked(){// display the page preloader
$('#wallet-page #wallet-preloading-fab').css("display","inline-block");// load the user data
utopiasoftware.ally.controller.walletPageViewModel.loadUserAccountData().then(function(userDetails){// save the returned user details in app cache
return utopiasoftware.ally.saveUserAppDetails(userDetails);}).then(function(userDetails){// update the page with the collected data details
// update user data on app
utopiasoftware.ally.model.appUserDetails=userDetails;$('#wallet-page #wallet-balance').html(kendo.toString(kendo.parseFloat(userDetails.balance),"n2"));$('#wallet-page #wallet-owner-name').html(userDetails.firstname+" "+userDetails.lastname);// display the necessary page components
$('#wallet-page #wallet-list').css("display","block");$('#wallet-page #wallet-reload-fab').css("display","inline-block");// hide page preloader
$('#wallet-page #wallet-preloading-fab').css("display","none");}).catch(function(){// an error occurred when trying to load the user data
// display the necessary page components
$('#wallet-page #wallet-list').css("display","none");// display necessary page components
$('#wallet-page #wallet-reload-fab').css("display","inline-block");// hide page preloader
$('#wallet-page #wallet-preloading-fab').css("display","none");});},/**
         * method is used to load the user account data either from
         * the locally cached data OR directly from the remote server
         */loadUserAccountData:function loadUserAccountData(){return new Promise(function(resolve,reject){// check if there is internet connection
if(navigator.connection.type===Connection.NONE){// no internet connection
// inform the user that cached data will be displayed in the absence of internet
window.plugins.toast.showWithOptions({message:"No Internet Connection. Previously cached data will be displayed",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#008000',textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});// no internet connection, so use local cache of data
resolve(utopiasoftware.ally.loadUserCachedAppDetails());}else{// there's internet, so make request for new data
Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/get-profile.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{phone:utopiasoftware.ally.model.appUserDetails.phone}// data to submit to server
})).then(function(serverResponseText){serverResponseText+="";var userDetailsData=JSON.parse(serverResponseText.trim());// get the new user object
// add a timestamp for the last time user details was updated
userDetailsData._lastUpdatedDate=Date.now();// check if any error occurred
if(userDetailsData.status=="error"){// an error occurred
throw userDetailsData.message;// throw the error message attached to this error
}resolve(userDetailsData);// return user data and resolve the Promise
}).catch(function(err){reject(err);// reject the Promise error
});}});}},/**
     * object is view-model for fund-wallet page
     */fundWalletPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * used to hold the parsley validator for the Amount field
         */amountFieldValidator:null,/**
         * used to hold the Card Number DropDownList component
         */cardDropDownList:null,/**
         * * used to hold the ej Tooltip component
         */formTooltip:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware.ally.controller.fundWalletPageViewModel.backButtonClicked;// display the page preloader
$('.page-preloader',$thisPage).css('display',"block");// hide the form
$('#fund-wallet-form',$thisPage).css('display',"none");// create the form data to be sent
var formData={phone:utopiasoftware.ally.model.appUserDetails.phone};// get the collection of stored/tokenised cards
Promise.resolve(formData).then(function(){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/get-my-cards.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:formData// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object
return serverResponse;// forward the server response i.e. collection of tokenised cards
}).then(function(cardCollectionArray){// initialise the card DropDown widget
utopiasoftware.ally.controller.fundWalletPageViewModel.cardDropDownList=new ej.dropdowns.DropDownList({//set the data to dataSource property
dataSource:cardCollectionArray,fields:{text:'CARDNUMBER2',value:'CARDNUMBER2'},placeholder:"Select Card",floatLabelType:"Auto",popupHeight:"300px"});// render initialized card DropDownList
utopiasoftware.ally.controller.fundWalletPageViewModel.cardDropDownList.appendTo('#fund-wallet-card-number');// initialise form tooltips
utopiasoftware.ally.controller.fundWalletPageViewModel.formTooltip=new ej.popups.Tooltip({target:'.ally-input-tooltip',position:'top center',cssClass:'ally-input-tooltip',opensOn:'focus'});// render the initialized form tooltip
utopiasoftware.ally.controller.fundWalletPageViewModel.formTooltip.appendTo('#fund-wallet-form');// initialise the amount field
utopiasoftware.ally.controller.fundWalletPageViewModel.amountFieldValidator=$('#fund-wallet-amount').parsley({value:function value(parsley){// convert the amount back to a plain text without the thousand separator
var parsedNumber=kendo.parseFloat($('#fund-wallet-amount',$thisPage).val());return parsedNumber?parsedNumber:$('#fund-wallet-amount',$thisPage).val();}});// initialise the form validation
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator=$('#fund-wallet-form').parsley();// attach listener for the fund wallet button on the page
$('#fund-wallet-fund-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.whenValidate();};// listen for the form field validation failure event
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);$(fieldInstance.$element).attr("title",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");$(fieldInstance.$element).removeAttr("title");});// listen for the form validation success
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.fundWalletPageViewModel.formValidated);// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#fund-wallet-form',$thisPage).css('display',"block");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#fund-wallet-form',$thisPage).css('display',"block");// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"some content could be loaded without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});});}},/**
         * method is triggered when page is shown
         *
         * @param event
         */pageShow:function pageShow(event){},/**
         * method is triggered when the page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// remove any tooltip being displayed on all forms on the page
$('#fund-wallet-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#fund-wallet-page [title]').removeAttr("title");$('#fund-wallet-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms on the page
$('#fund-wallet-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#fund-wallet-page [data-hint]').removeAttr("title");$('#fund-wallet-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.fundWalletPageViewModel.amountFieldValidator.destroy();utopiasoftware.ally.controller.fundWalletPageViewModel.formValidator.destroy();// destroy other form components
utopiasoftware.ally.controller.fundWalletPageViewModel.cardDropDownList.destroy();utopiasoftware.ally.controller.fundWalletPageViewModel.formTooltip.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         */formValidated:function formValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY wallet cannot be funded without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var formData={firstname:utopiasoftware.ally.model.appUserDetails.firstname,lastname:utopiasoftware.ally.model.appUserDetails.lastname,phone:utopiasoftware.ally.model.appUserDetails.phone,email:utopiasoftware.ally.model.appUserDetails.email?utopiasoftware.ally.model.appUserDetails.email:"",cardno:utopiasoftware.ally.controller.fundWalletPageViewModel.cardDropDownList.value,amount:kendo.parseFloat($('#fund-wallet-page #fund-wallet-amount').val())};// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Funding User Wallet...");// forward the form data & show loader
Promise.all([formData,Promise.resolve($('#hour-glass-loader-modal').get(0).show())]).then(function(dataArray){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/rave-payment-using-token.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:dataArray[0]// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object
// check if any error occurred
if(serverResponse.status!="success"){// an error occured
throw serverResponse.message||serverResponse.data.message;// throw the error message attached to this error
}return serverResponse;// forward the server response
}).then(function(serverResponse){// hide the loader
return Promise.all([serverResponse,$('#hour-glass-loader-modal').get(0).hide()]);}).then(function(responseArray){// ask user for transaction otp
return Promise.all([responseArray[0],ons.notification.alert({title:'<ons-icon icon="md-check-circle" size="32px" '+'style="color: green;"></ons-icon> Wallet Funded',messageHTML:'<span>FUNDING FEE: '+kendo.toString(kendo.parseFloat(responseArray[0].data.appfee),'n2')+'<br>\n                    AMOUNT CHARGED: '+kendo.toString(kendo.parseFloat(responseArray[0].data.charged_amount),'n2')+'</span>',cancelable:false})]);}).then(function(){return Promise.all([ons.notification.toast("Wallet Funded Successfully!",{timeout:4000}),$('#app-main-navigator').get(0).popPage({data:{refresh:true}})]);}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Your ALLY wallet could not be funded. Please retry";}$('#hour-glass-loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Wallet Funding Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// remove this page form the main navigator stack
$('#app-main-navigator').get(0).popPage();}},/**
     * object is view-model for Add Card page
     */addCardPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * used to validate the card number field
         */cardNumberFieldValidator:null,/**
         * used to hold the parsley validator for the Amount field
         */amountFieldValidator:null,/**
         * used to hold the ej library card masked text input
         */cardMaskedTextInput:null,/**
         * used to hold the ej library card month dropdown list component
         */cardMonthDropDownList:null,/**
         * used to hold the ej library card year dropdown list component
         */cardYearDropDownList:null,/**
         * * used to hold the ej Tooltip component
         */formTooltip:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware.ally.controller.addCardPageViewModel.backButtonClicked;// initialise the card masked input widget
utopiasoftware.ally.controller.addCardPageViewModel.cardMaskedTextInput=new ej.inputs.MaskedTextBox({mask:'0000 0000 0000 0000 99999',placeholder:"Card Number",promptChar:'*',floatLabelType:"Always"});// render initialized card masked input widget
utopiasoftware.ally.controller.addCardPageViewModel.cardMaskedTextInput.appendTo('#add-card-card-number');// initialise the card month DropDown widget
utopiasoftware.ally.controller.addCardPageViewModel.cardMonthDropDownList=new ej.dropdowns.DropDownList({dataSource:[{value:"01",displayText:"01"},{value:"02",displayText:"02"},{value:"03",displayText:"03"},{value:"04",displayText:"04"},{value:"05",displayText:"05"},{value:"06",displayText:"06"},{value:"07",displayText:"07"},{value:"08",displayText:"08"},{value:"09",displayText:"09"},{value:"10",displayText:"10"},{value:"11",displayText:"11"},{value:"12",displayText:"12"}],fields:{text:'displayText',value:'value'},placeholder:"Expiry Month",floatLabelType:"Auto"});// render the initialized card month dropdown list
utopiasoftware.ally.controller.addCardPageViewModel.cardMonthDropDownList.appendTo('#add-card-expiry-month');// initialise the array to hold the valid card expiry years
var cardYearsArray=[];var yearOption=new Date().getFullYear();// get the current year
// add the current year as an object in the cardYearsArray
cardYearsArray.push({value:(""+yearOption).substring(2,4),displayText:yearOption});// add 3 more years to the cardYearsArray for the Card Expiry Year
for(var index=0;index<3;index++){// increase the yearOption by 1
yearOption+=1;// add the additional year as an object in the cardYearsArray
cardYearsArray.push({value:(""+yearOption).substring(2,4),displayText:yearOption});}// initialise the card expiry year DropDown widget
utopiasoftware.ally.controller.addCardPageViewModel.cardYearDropDownList=new ej.dropdowns.DropDownList({dataSource:cardYearsArray,fields:{text:'displayText',value:'value'},placeholder:"Expiry Year",floatLabelType:"Auto"});// render the initialized card expiry year dropdown list
utopiasoftware.ally.controller.addCardPageViewModel.cardYearDropDownList.appendTo('#add-card-expiry-year');// initialise form tooltips
utopiasoftware.ally.controller.addCardPageViewModel.formTooltip=new ej.popups.Tooltip({target:'.ally-input-tooltip',position:'top center',cssClass:'ally-input-tooltip',opensOn:'focus'});// render the initialized form tooltip
utopiasoftware.ally.controller.addCardPageViewModel.formTooltip.appendTo('#add-card-form');// initialise the card number field validator
utopiasoftware.ally.controller.addCardPageViewModel.cardNumberFieldValidator=$('#add-card-card-number').parsley({value:function value(parsley){// return the unmasked input from the card number field
return utopiasoftware.ally.controller.addCardPageViewModel.cardMaskedTextInput.value;}});// initialise the amount field
utopiasoftware.ally.controller.addCardPageViewModel.amountFieldValidator=$('#add-card-charge-amount').parsley({value:function value(parsley){// convert the amount back to a plain text without the thousand separator
var parsedNumber=kendo.parseFloat($('#add-card-charge-amount',$thisPage).val());return parsedNumber?parsedNumber:$('#add-card-charge-amount',$thisPage).val();}});// initialise the form validation
utopiasoftware.ally.controller.addCardPageViewModel.formValidator=$('#add-card-form').parsley();// attach listener for the fund wallet button on the page
$('#add-card-fund-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.addCardPageViewModel.formValidator.whenValidate();};// listen for the form field validation failure event
utopiasoftware.ally.controller.addCardPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);$(fieldInstance.$element).attr("title",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.addCardPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");$(fieldInstance.$element).removeAttr("title");});// listen for the form validation success
utopiasoftware.ally.controller.addCardPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.addCardPageViewModel.formValidated);// display the form
$('#add-card-form',$thisPage).css("display","block");// hide the preloader
$('.page-preloader',$thisPage).css("display","none");// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         *
         * @param event
         */pageShow:function pageShow(event){},/**
         * method is triggered when the page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// remove any tooltip being displayed on all forms on the page
$('#add-card-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#add-card-page [title]').removeAttr("title");$('#add-card-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.addCardPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms on the page
$('#add-card-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#add-card-page [title]').removeAttr("title");$('#add-card-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.addCardPageViewModel.cardNumberFieldValidator.destroy();utopiasoftware.ally.controller.addCardPageViewModel.amountFieldValidator.destroy();utopiasoftware.ally.controller.addCardPageViewModel.formValidator.destroy();// destroy other form components
utopiasoftware.ally.controller.addCardPageViewModel.cardMaskedTextInput.destroy();utopiasoftware.ally.controller.addCardPageViewModel.cardMonthDropDownList.destroy();utopiasoftware.ally.controller.addCardPageViewModel.cardYearDropDownList.destroy();utopiasoftware.ally.controller.addCardPageViewModel.formTooltip.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         */formValidated:function formValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY wallet cannot be saved without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var formData={firstName:utopiasoftware.ally.model.appUserDetails.firstname,lastName:utopiasoftware.ally.model.appUserDetails.lastname,phone:utopiasoftware.ally.model.appUserDetails.phone,email:utopiasoftware.ally.model.appUserDetails.email?utopiasoftware.ally.model.appUserDetails.email:"",cardno:utopiasoftware.ally.controller.addCardPageViewModel.cardMaskedTextInput.value,cvv:$('#add-card-page #add-card-cvv').val(),expirymonth:utopiasoftware.ally.controller.addCardPageViewModel.cardMonthDropDownList.value,expiryyear:utopiasoftware.ally.controller.addCardPageViewModel.cardYearDropDownList.value,pin:$('#add-card-page #add-card-pin').val(),amount:kendo.parseFloat($('#add-card-page #add-card-charge-amount').val())};// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Funding User Wallet...");// forward the form data & show loader
Promise.all([formData,Promise.resolve($('#hour-glass-loader-modal').get(0).show())]).then(function(dataArray){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/rave-card-payment.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:dataArray[0]// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object
// check if any error occurred
if(serverResponse.status!="success"){// an error occured
throw serverResponse.message||serverResponse.data.message;// throw the error message attached to this error
}return serverResponse;// forward the server response
}).then(function(serverResponse){// hide the loader
return Promise.all([serverResponse,$('#hour-glass-loader-modal').get(0).hide()]);}).then(function(responseArray){// ask user for transaction otp
return Promise.all([responseArray[0],ons.notification.prompt({title:"OTP Confirmation",messageHTML:'<div><ons-icon icon="md-ally-icon-otp" size="24px"\n                    style="color: #30a401; float: left; width: 26px;"></ons-icon>\n                    <span style="float: right; width: calc(100% - 26px);">\n                    FUNDING FEE: '+kendo.toString(kendo.parseFloat(responseArray[0].data.appfee),'n2')+'<br>\n                    AMOUNT TO CHARGE: '+kendo.toString(kendo.parseFloat(responseArray[0].data.charged_amount),'n2')+'<br>\n                    Confirm Transaction by providing OTP sent to your phone or generated by your bank token</span></div>',cancelable:false,placeholder:"OTP",inputType:"number",defaultValue:"",autofocus:false,submitOnEnter:true})]);}).then(function(responseArray){// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Authorizing Wallet Fund...");return Promise.all([].concat(_toConsumableArray(responseArray),[$('#hour-glass-loader-modal').get(0).show()]));}).then(function(responseArray){// create the data object to be sent
var submitData={raverefid:responseArray[0].data.flwRef,otp:responseArray[1],phone:utopiasoftware.ally.model.appUserDetails.phone};submitData.savecard=$('#add-card-page #add-card-save-card-details').get(0).checked;// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/rave-approve-card-payment-via-otp.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:submitData// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the new user object
// check if any error occurred
if(serverResponse.status=="error"){// an error occured
throw serverResponse.message;// throw the error message attached to this error
}return $('#hour-glass-loader-modal').get(0).hide();// hide loader
}).then(function(){return Promise.all([ons.notification.toast("Wallet Funded Successfully!",{timeout:4000}),$('#app-main-navigator').get(0).popPage({data:{refresh:true}})]);}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Your ALLY wallet could not be funded. Please retry";}$('#hour-glass-loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Wallet Funding Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// remove this page form the main navigator stack
$('#app-main-navigator').get(0).replacePage('fund-wallet-page.html',{animation:'fade-md'});}},/**
     * object is view-model for wallet-transfer page
     */walletTransferPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * used to hold the parsley validator for the Amount field
         */amountFieldValidator:null,/**
         * * used to hold the ej Tooltip component
         */formTooltip:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware.ally.controller.walletTransferPageViewModel.backButtonClicked;// attach listen for when the 'wallet-transfer-add-recipient-button' is clicked
$('#wallet-transfer-add-recipient-button').get(0).onclick=utopiasoftware.ally.controller.walletTransferPageViewModel.pickContactButtonClicked;// display the page preloader
$('.page-preloader',$thisPage).css('display',"block");// hide the form
$('#wallet-transfer-form',$thisPage).css('display',"none");// start a promise chain to setup the page
Promise.resolve({}).then(function(){// initialise the amount field
utopiasoftware.ally.controller.walletTransferPageViewModel.amountFieldValidator=$('#wallet-transfer-amount').parsley({value:function value(parsley){// convert the amount back to a plain text without the thousand separator
var parsedNumber=kendo.parseFloat($('#wallet-transfer-amount',$thisPage).val());return parsedNumber?parsedNumber:$('#wallet-transfer-amount',$thisPage).val();}});// initialise the form validation
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator=$('#wallet-transfer-form').parsley();// attach listener for the wallet-transfer button on the page
$('#wallet-transfer-transfer-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.whenValidate();};// listen for the form field validation failure event
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);$(fieldInstance.$element).attr("title",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");$(fieldInstance.$element).removeAttr("title");});// listen for the form validation success
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.walletTransferPageViewModel.formValidated);// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#wallet-transfer-form',$thisPage).css('display',"block");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#wallet-transfer-form',$thisPage).css('display',"block");});}},/**
         * method is triggered when page is shown
         *
         * @param event
         */pageShow:function pageShow(event){},/**
         * method is triggered when the page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// remove any tooltip being displayed on all forms on the page
$('#wallet-transfer-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#wallet-transfer-page [title]').removeAttr("title");$('#wallet-transfer-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms on the page
$('#wallet-transfer-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#wallet-transfer-page [data-hint]').removeAttr("title");$('#wallet-transfer-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.walletTransferPageViewModel.amountFieldValidator.destroy();utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         */formValidated:function formValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY wallet transfer cannot be performed without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var formData={phone_sender:utopiasoftware.ally.model.appUserDetails.phone,phone_receiver:$('#wallet-transfer-page #wallet-transfer-receiver-phone-number').val(),amount:kendo.parseFloat($('#wallet-transfer-page #wallet-transfer-amount').val())};// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Completing Wallet Transfer...");// forward the form data & show loader
Promise.all([formData,Promise.resolve($('#hour-glass-loader-modal').get(0).show())]).then(function(dataArray){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/transfer-wallet-to-wallet.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:dataArray[0]// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object
// check if any error occurred
if(serverResponse.status!="success"){// an error occured
throw serverResponse.message||serverResponse.data.message;// throw the error message attached to this error
}return serverResponse;// forward the server response
}).then(function(serverResponse){// hide the loader
return Promise.all([serverResponse,$('#hour-glass-loader-modal').get(0).hide()]);}).then(function(responseArray){// ask user for transaction otp
return Promise.all([responseArray[0],ons.notification.prompt({title:"ALLY Secure PIN Confirmation",id:'pin-security-check2',messageHTML:'<div><ons-icon icon="ion-lock-combination" size="24px"\n                    style="color: #30a401; float: left; width: 26px;"></ons-icon>\n                    <span style="float: right; width: calc(100% - 26px);">\n                    '+(responseArray[0].fullname.length>1?'RECIPIENT: '+responseArray[0].fullname+'<br>':'')+'\n                    TRANSFER FEE: '+kendo.toString(kendo.parseFloat(responseArray[0].appfee),'n2')+'<br>\n                    AMOUNT TO CHARGE: '+kendo.toString(kendo.parseFloat(responseArray[0].total),'n2')+'<br>\n                    Confirm wallet transfer by providing your ALLY Secure PIN</span></div>',cancelable:false,placeholder:"Secure PIN",inputType:"number",defaultValue:"",autofocus:false,submitOnEnter:true})]);}).then(function(responseArray){// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Authorizing Wallet Transfer...");return Promise.all([].concat(_toConsumableArray(responseArray),[$('#hour-glass-loader-modal').get(0).show()]));}).then(function(responseArray){// create the data to be sent for confirm of wallet transfer
var confirmationData=responseArray[0];confirmationData.lock=responseArray[1];// submit the data
return Promise.all([Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/transfer-wallet-to-wallet-confirm.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:confirmationData// data to submit to server
})),responseArray[0]]);}).then(function(serverResponse){// NOTE: serverResponse is an array
serverResponse[0]=JSON.parse((serverResponse[0]+"").trim());// get the new user object
// check if any error occurred
if(serverResponse[0].status=="error"){// an error occured
throw serverResponse.message;// throw the error message attached to this error
}return serverResponse;// forward the serverResponse i.e the user details object
}).then(function(responseDetailsArray){// the parameter contains 2 items. item 1 - userDetails; item 2- details of the wallet transfer
// forward details of the wallet-transfer; also save the user details to encrypted storage;
return Promise.all([responseDetailsArray[1],utopiasoftware.ally.saveUserAppDetails(responseDetailsArray[0])]);}).then(function(dataArray){// update local copy of user app details
utopiasoftware.ally.model.appUserDetails=dataArray[1];// forward details of the wallet-transfer and the user details
return Promise.all([].concat(_toConsumableArray(dataArray),[$('#hour-glass-loader-modal').get(0).hide()]));}).then(function(dataArray){// check if the recipient of the wallet transfer is a registered user
if(dataArray[0].isregistereduser!="yes"){// append the json details for the wallet-transfer to the wallet-transfer-sms-confirm-modal confirmation button
$($('#wallet-transfer-sms-confirm-modal #wallet-transfer-sms-confirm-button').get(0)).attr("data-wallet-transfer",JSON.stringify(dataArray[0]));// show the wallet-transfer-sms-confirm-modal to the user
return $('#wallet-transfer-sms-confirm-modal').get(0).show();}else{// recipient is registered
return"registered recipient";}}).then(function(result){if(result==="registered recipient"){// the recipient of the wallet transfer is already registered
// reset the form for the wallet transfer page
$('#wallet-transfer-page #wallet-transfer-form').get(0).reset();// reset the form validator object on the page
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.reset();return Promise.all([ons.notification.toast("Wallet Transfer Successful!",{timeout:4000})]);// conclude wallet transfer process
}}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Your ALLY wallet transfer could not be completed. Please retry";}$('#hour-glass-loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Wallet Transfer Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// check if the menu tabbar exists
if($('#menu-tabbar').get(0)){// the menu tabbar object exists
// move to the previous tab
$('#menu-tabbar').get(0).setActiveTab(2);}},/**
         * method is triggered when the 'Pick Contact" button is clicked
         */pickContactButtonClicked:function pickContactButtonClicked(){// display the list of contacts from the user's phone address book
new Promise(function(resolve,reject){window.plugins.contactNumberPicker.pick(resolve,reject);}).then(function(contact){// retrieve picked contact
// get the selected contact phone number
var contactPhoneNumber=contact.phoneNumber;//format the retrieved phone number to acceptable app standards
contactPhoneNumber=contactPhoneNumber.replace(/\D/ig,"");// remove any non-digit character between phone numbers
// if any number brings with '0' replace it with '+234'
if(contactPhoneNumber.startsWith("0")){// the phone number starts with 0, replace it with international dialing code
contactPhoneNumber=contactPhoneNumber.replace("0","+234");}//ensure phone number begins with a '+'
if(!contactPhoneNumber.startsWith("+")){// the phone number does not start with '+'
contactPhoneNumber="+"+contactPhoneNumber;// append the '+' to the beginning
}// update the recipient phone input field with the retrieved & formatted phone number
$('#wallet-transfer-form #wallet-transfer-receiver-phone-number').val(contactPhoneNumber);}).catch(function(){// inform the user that there was an error
window.plugins.toast.showWithOptions({message:"phone contacts could not be accessed right now",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});});},walletTransferSmsConfirmButtonClicked:function walletTransferSmsConfirmButtonClicked(buttonElem){// get the details of the wall transfer for which an sms confirmation is being sent
var walletTransferDetails=JSON.parse($(buttonElem).attr('data-wallet-transfer'));// use a promise to send the sms confirmation message to the recipient
new Promise(function(resolve,reject){// send sms
SMS.sendSMS(walletTransferDetails.receiver,"Hello, I just sent "+walletTransferDetails.amount+" to your ALLY wallet. Download ALLY using this link "+"and your phone number to receive your funds\r\n"+utopiasoftware.ally.model.ally_app_share_link,resolve,reject);});// hide the sms confirmation modal
$('#wallet-transfer-sms-confirm-modal').get(0).hide();// reset the form for the wallet transfer page
$('#wallet-transfer-page #wallet-transfer-form').get(0).reset();// reset the form validator object on the page
utopiasoftware.ally.controller.walletTransferPageViewModel.formValidator.reset();return Promise.all([ons.notification.toast("Wallet Transfer Successful!",{timeout:4000})]);// conclude wallet transfer process
}},/**
     * object is view-model for disburse-wallet page
     */disburseWalletPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * used to hold the parsley validator for the Amount field
         */amountFieldValidator:null,/**
         * used to hold the Account Number ComboBox component
         */accountNumberComboBox:null,/**
         * used to hold the Banks DropDownList component
         */banksDropDownList:null,/**
         ** used to hold the ej Tooltip component
         */formTooltip:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware.ally.controller.disburseWalletPageViewModel.backButtonClicked;// display the page preloader
$('.page-preloader',$thisPage).css('display',"block");// hide the form
$('#disburse-wallet-form',$thisPage).css('display',"none");// create the form data to be sent
var formData={phone:utopiasoftware.ally.model.appUserDetails.phone};// get the collection of stored bank accounts and bank names
Promise.resolve(formData).then(function(){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/get-my-bank-accounts.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:formData// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object (i.e. array of bank account objects)
serverResponse.forEach(function(acctObject){// add an additional property to each object
// this property is displayed to the user
acctObject.displayText=acctObject.RECIPIENTNAME+" - "+acctObject.ACCOUNTNUMBER;});return Promise.all([serverResponse,utopiasoftware.ally.banksData()]);// forward the server response i.e. collection of bank accounts (and the list of banks)
}).then(function(promiseArray){// this array contains the list of user bank accounts AND the list of banks in nigeria
// initialise the account number combo box widget
utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox=new ej.dropdowns.ComboBox({//set the data to dataSource property
dataSource:promiseArray[0],fields:{text:'displayText',value:'ACCOUNTNUMBER'},placeholder:"Account Name or Number (NUBAN)",floatLabelType:"Auto",popupHeight:"300px",allowCustom:true});// render initialized card ComboBox
utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.appendTo('#disburse-wallet-account-number');// initialise the bank DropDown widget
utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList=new ej.dropdowns.DropDownList({//set the data to dataSource property
dataSource:promiseArray[1],fields:{text:'name',value:'code'},sortOrder:"Ascending",enabled:true,placeholder:"Select Bank",floatLabelType:"Auto",popupHeight:"300px"});// render initialised bank dropdown list
utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.appendTo('#disburse-wallet-bank');// initialise form tooltips
utopiasoftware.ally.controller.disburseWalletPageViewModel.formTooltip=new ej.popups.Tooltip({target:'.ally-input-tooltip',position:'top center',cssClass:'ally-input-tooltip',opensOn:'focus'});// render the initialized form tooltip
utopiasoftware.ally.controller.disburseWalletPageViewModel.formTooltip.appendTo('#disburse-wallet-form');// add the change event listener to listen for changes in the bank account number combo box
utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.addEventListener("change",function(){var accountObj=this.getDataByValue(this.value);// get the object that matches the selected value
if(accountObj){// update the bank selection dropdown
utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.value=accountObj["BANKCODE"];utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.enabled=false;// update the account nickname input
$('#disburse-wallet-page #disburse-wallet-account-name').val(accountObj.RECIPIENTNAME);$('#disburse-wallet-page #disburse-wallet-account-name').attr("readonly",true);}else{// update the bank selection dropdown
utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.enabled=true;utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.value=null;utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.text=null;// update the account nickname input
$('#disburse-wallet-page #disburse-wallet-account-name').val("");$('#disburse-wallet-page #disburse-wallet-account-name').removeAttr("readonly");}// update the bank selection dropdown
utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.dataBind();});// initialise the amount field
utopiasoftware.ally.controller.disburseWalletPageViewModel.amountFieldValidator=$('#disburse-wallet-amount').parsley({value:function value(parsley){// convert the amount back to a plain text without the thousand separator
var parsedNumber=kendo.parseFloat($('#disburse-wallet-amount',$thisPage).val());return parsedNumber?parsedNumber:$('#disburse-wallet-amount',$thisPage).val();}});// initialise the form validation
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator=$('#disburse-wallet-form').parsley();// attach listener for the disburse wallet button on the page
$('#disburse-wallet-disburse-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.whenValidate();};// listen for the form field validation failure event
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);$(fieldInstance.$element).attr("title",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");$(fieldInstance.$element).removeAttr("title");});// listen for the form validation success
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidated);// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#disburse-wallet-form',$thisPage).css('display',"block");// hide the loader
$('#loader-modal').get(0).hide();}).catch(function(){// hide the page preloader
$('.page-preloader',$thisPage).css('display',"none");// display the form
$('#disburse-wallet-form',$thisPage).css('display',"block");// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"some content could be loaded without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});});}},/**
         * method is triggered when page is shown
         *
         * @param event
         */pageShow:function pageShow(event){},/**
         * method is triggered when the page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// remove any tooltip being displayed on all forms on the page
$('#disburse-wallet-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#disburse-wallet-page [title]').removeAttr("title");$('#disburse-wallet-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// remove any tooltip being displayed on all forms on the page
$('#disburse-wallet-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#disburse-wallet-page [data-hint]').removeAttr("title");$('#disburse-wallet-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.disburseWalletPageViewModel.amountFieldValidator.destroy();utopiasoftware.ally.controller.disburseWalletPageViewModel.formValidator.destroy();// destroy other form components
utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.destroy();utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.destroy();utopiasoftware.ally.controller.disburseWalletPageViewModel.formTooltip.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         */formValidated:function formValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"ALLY wallet disbursal cannot be performed without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}// create the form data to be submitted
var formData={amount:kendo.parseFloat($('#disburse-wallet-page #disburse-wallet-amount').val()),phone:utopiasoftware.ally.model.appUserDetails.phone,accountno:utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.text.substring(utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.text.length-10,utopiasoftware.ally.controller.disburseWalletPageViewModel.accountNumberComboBox.text.length),bankcode:utopiasoftware.ally.controller.disburseWalletPageViewModel.banksDropDownList.value};// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Completing Wallet Disbursal...");// forward the form data & show loader
Promise.all([formData,Promise.resolve($('#hour-glass-loader-modal').get(0).show())]).then(function(dataArray){// submit the form data
return Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/transfer-wallet-to-account.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:dataArray[0]// data to submit to server
}));}).then(function(serverResponse){serverResponse+="";serverResponse=JSON.parse(serverResponse.trim());// get the response object
// check if any error occurred
if(serverResponse.status!="success"){// an error occured
throw serverResponse.message||serverResponse.data.message;// throw the error message attached to this error
}return serverResponse;// forward the server response
}).then(function(serverResponse){// hide the loader
return Promise.all([serverResponse,$('#hour-glass-loader-modal').get(0).hide()]);}).then(function(responseArray){// ask user for transaction otp
return Promise.all([responseArray[0],ons.notification.prompt({title:"ALLY Secure PIN Confirmation",id:'pin-security-check2',messageHTML:'<div><ons-icon icon="ion-lock-combination" size="24px"\n                    style="color: #30a401; float: left; width: 26px;"></ons-icon>\n                    <span style="float: right; width: calc(100% - 26px);">\n                    '+(responseArray[0].accountno.length>1?'ACCOUNT: '+responseArray[0].accountno+'<br>':'')+'\n                    TRANSFER FEE: '+kendo.toString(kendo.parseFloat(responseArray[0].appfee),'n2')+'<br>\n                    AMOUNT TO CHARGE: '+kendo.toString(kendo.parseFloat(responseArray[0].total),'n2')+'<br>\n                    Confirm wallet disbursal by providing your ALLY Secure PIN</span></div>',cancelable:false,placeholder:"Secure PIN",inputType:"number",defaultValue:"",autofocus:false,submitOnEnter:true})]);}).then(function(responseArray){// display the loader message to indicate that account is being created;
$('#hour-glass-loader-modal .modal-message').html("Authorizing Wallet Disbursal...");return Promise.all([].concat(_toConsumableArray(responseArray),[$('#hour-glass-loader-modal').get(0).show()]));}).then(function(responseArray){// create the data to be sent for confirm of wallet transfer
var confirmationData=responseArray[0];confirmationData.lock=responseArray[1];confirmationData.saveaccount=$('#disburse-wallet-page #disburse-wallet-save-account-details').get(0).checked;confirmationData.recipientnickname=$('#disburse-wallet-page #disburse-wallet-account-name').val();// submit the data
return Promise.all([Promise.resolve($.ajax({url:utopiasoftware.ally.model.ally_base_url+"/mobile/transfer-wallet-to-account-confirm.php",type:"post",contentType:"application/x-www-form-urlencoded",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("X-ALLY-APP","mobile");},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:confirmationData// data to submit to server
})),responseArray[0]]);}).then(function(serverResponse){// NOTE: serverResponse is an array
serverResponse[0]=JSON.parse((serverResponse[0]+"").trim());// get the new user object
// check if any error occurred
if(serverResponse[0].status=="error"){// an error occured
throw serverResponse.message;// throw the error message attached to this error
}return serverResponse;// forward the serverResponse i.e the user details object
}).then(function(responseDetailsArray){// the parameter contains 2 items. item 1 - userDetails; item 2- details of the wallet disbursal
// forward details of the wallet-disbursal; also save the user details to encrypted storage;
return Promise.all([responseDetailsArray[1],utopiasoftware.ally.saveUserAppDetails(responseDetailsArray[0])]);}).then(function(dataArray){// update local copy of user app details
utopiasoftware.ally.model.appUserDetails=dataArray[1];// forward details of the wallet-transfer and the user details
return Promise.all([$('#hour-glass-loader-modal').get(0).hide()]);}).then(function(){return Promise.all([ons.notification.toast("Wallet Disbursal Successful!",{timeout:4000}),$('#app-main-navigator').get(0).popPage({data:{refresh:true}})]);// conclude wallet disbursal process
}).catch(function(err){if(typeof err!=="string"){// if err is NOT a String
err="Sorry. Your ALLY wallet disbursal could not be completed. Please retry";}$('#hour-glass-loader-modal').get(0).hide();// hide loader
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> Wallet Disbursal Failed',messageHTML:'<span>'+err+'</span>',cancelable:false});});},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// remove this page form the main navigator stack
$('#app-main-navigator').get(0).popPage();}},/**
     * object is view-model for dashboard page
     */paymentsPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// listen for the back button event
$thisPage.get(0).onDeviceBackButton=utopiasoftware.ally.controller.paymentsPageViewModel.backButtonClicked;// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(event){var $thisPage=$(event.target);// get the current page shown
// disable the swipeable feature for the app splitter
$('ons-splitter-side').removeAttr("swipeable");},/**
         * method is triggered when page is hidden
         */pageHide:function pageHide(){},/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){},/**
         * method is triggered when back button or device back button is clicked
         */backButtonClicked:function backButtonClicked(){// check if the side menu is open
if($('ons-splitter').get(0).right.isOpen){// side menu open, so close it
$('ons-splitter').get(0).right.close();return;// exit the method
}// get the payments button segment object
var paymentsButtonSegment=$('#payments-page #payments-segments').get(0);// check which button in the button segment is active
if(paymentsButtonSegment.getActiveButtonIndex()==0){// the 1st button in the segment is active
// move to the previous tab in the menu-tabbar
$('#menu-tabbar').get(0).setActiveTab(0);return;}else{// the 2nd button is active, move to the 1st button's page
paymentsButtonSegment.setActiveButton(0);// move to the 1st button's page
}}},/**
     * object is view-model for payments-ally-scan page
     */paymentsAllyScanPageViewModel:{/**
         * used to hold the parsley form validation object for the page
         */formValidator:null,/**
         * used to hold the parsley validator for the Amount field
         */amountFieldValidator:null,/**
         * property is used to track whether there is an active ongoing payment.
         * A value of true means there is an active payment; any other value means there is none
         */activePayment:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();//function is used to initialise the page if the app is fully ready for execution
function loadPageOnAppReady(){// check to see if onsen is ready and if all app loading has been completed
if(!ons.isReady()||utopiasoftware.ally.model.isAppReady===false){setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return;}// initialise the 'active payment' status to false i.e. no active payment
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.activePayment=false;// initialise the amount field
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.amountFieldValidator=$('#payments-ally-scan-amount').parsley({value:function value(parsley){// convert the amount back to a plain text without the thousand separator
var parsedNumber=kendo.parseFloat($('#payments-ally-scan-amount',$thisPage).val());return parsedNumber?parsedNumber:$('#payments-ally-scan-amount',$thisPage).val();}});// initialise the form validation
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator=$('#payments-ally-scan-form').parsley();// attach listener for the pay button on the page
$('#payments-ally-scan-pay-button').get(0).onclick=function(){// run the validation method for the form
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.whenValidate();};// listen for the form field validation failure event
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
$(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).attr("data-hint",fieldInstance.getErrorsMessages()[0]);$(fieldInstance.$element).attr("title",fieldInstance.getErrorsMessages()[0]);});// listen for the form field validation success event
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.on('field:success',function(fieldInstance){// remove tooltip from element
$(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$(fieldInstance.$element).removeAttr("data-hint");$(fieldInstance.$element).removeAttr("title");});// listen for the form validation success
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.on('form:success',utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidated);// hide the loader
$('#loader-modal').get(0).hide();}},/**
         * method is triggered when page is shown
         *
         * @param event
         */pageShow:function pageShow(event){},/**
         * method is triggered when the page is hidden
         * @param event
         */pageHide:function pageHide(event){try{// disable the webview transparency
QRScanner.hide(function(status){// hide the "PAY" button
$('#payments-ally-scan-pay-button').css("transform","scale(0)");// flag that no active payment is taking place
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.activePayment=false;// remove the transparency from the webpage
$('html, body').removeClass('ally-transparent');$('#payments-page').removeClass('transparent');$('#payments-ally-scan-page').removeClass('transparent');// replace the content of the preview box
$('#payments-ally-scan-page #payments-ally-scan-box').html('<ons-icon icon="fa-qrcode" size="180px"></ons-icon>');});// remove any tooltip being displayed on all forms on the page
$('#payments-ally-scan-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#payments-ally-scan-page [title]').removeAttr("title");$('#payments-ally-scan-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.reset();// reset the form
$('#payments-ally-scan-page #payments-ally-scan-form').get(0).reset();}catch(err){}},/**
         * method is triggered when the page is destroyed
         * @param event
         */pageDestroy:function pageDestroy(event){try{// destroy the current state of the QR Scanner &disable the webview transparency
QRScanner.destroy(function(status){// hide the "PAY" button
$('#payments-ally-scan-pay-button').css("transform","scale(0)");// flag that no active payment is taking place
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.activePayment=false;// remove the transparency from the webpage
$('html, body').removeClass('ally-transparent');$('#payments-page').removeClass('transparent');$('#payments-ally-scan-page').removeClass('transparent');// replace the content of the preview box
$('#payments-ally-scan-page #payments-ally-scan-box').html('<ons-icon icon="fa-qrcode" size="180px"></ons-icon>');});// remove any tooltip being displayed on all forms on the page
$('#payments-ally-scan-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#payments-ally-scan-page [title]').removeAttr("title");$('#payments-ally-scan-page [data-hint]').removeAttr("data-hint");// destroy the form validator objects on the page
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.amountFieldValidator.destroy();utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.destroy();}catch(err){}},/**
         * method is triggered when the form is successfully validated
         */formValidated:function formValidated(){// check if Internet Connection is available before proceeding
if(navigator.connection.type===Connection.NONE){// no Internet Connection
// inform the user that they cannot proceed without Internet
window.plugins.toast.showWithOptions({message:"merchant payment cannot be made without an Internet Connection",duration:4000,position:"top",styling:{opacity:1,backgroundColor:'#ff0000',//red
textColor:'#FFFFFF',textSize:14}},function(toastEvent){if(toastEvent&&toastEvent.event=="touch"){// user tapped the toast, so hide toast immediately
window.plugins.toast.hide();}});return;// exit method immediately
}},/**
         * method is triggered when the SCAN button is clicked
         */scanButtonClicked:function scanButtonClicked(){// remove any tooltip being displayed on all forms on the page
$('#payments-ally-scan-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");$('#payments-ally-scan-page [title]').removeAttr("title");$('#payments-ally-scan-page [data-hint]').removeAttr("data-hint");// reset the form validator object on the page
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.reset();// reset the form
$('#payments-ally-scan-page #payments-ally-scan-form').get(0).reset();// make page transparent in preparation for QR code scanning
$('html, body').addClass('ally-transparent');$('#payments-page').addClass('transparent');$('#payments-ally-scan-page').addClass('transparent');// start video display
QRScanner.resumePreview(function(status){// empty the view preview box and make the webview transparent
$('#payments-ally-scan-page #payments-ally-scan-box').html("");QRScanner.show(function(status){// make webview transparent
QRScanner.scan(function(err,qrCode){// begin scanning QR code
if(err){// an error occurred, so inform the user
// inform the user of the error
ons.notification.alert({title:'<ons-icon icon="md-close-circle-o" size="32px" '+'style="color: red;"></ons-icon> ALLY Payment Error',messageHTML:'<span>'+'Sorry, Merchant QR Code could not be scanned.<br> '+'You can try again OR proceed to ALLY Direct as an alternative'+'</span>',cancelable:false});// hide the "PAY" button
$('#payments-ally-scan-pay-button').css("transform","scale(0)");// flag that no active payment is taking place
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.activePayment=false;return;// exit after handling error
}// end of error section
// if code gets to this section below, then there was no error
// show the "PAY" button
var animatePayButton=new ej.base.Animation({name:'ZoomIn',duration:1000});animatePayButton.addEventListener("end",function(){// listener for when animation is completed
$('#payments-ally-scan-pay-button').css("transform","scale(1)");console.log("ANIMATION ENDS");});animatePayButton.animate('#payments-ally-scan-pay-button');// flag that an active payment is taking place
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.activePayment=true;// pause the video preview
QRScanner.pausePreview(function(status){// get each content of the QR Code
var qrCodeSegmentsArray=(qrCode+"").trim().split("|");// update the contents of the payment form with the qrCodeSegmentsArray
$('#payments-ally-scan-page #payments-ally-scan-merchant-name').val(qrCodeSegmentsArray[0]);$('#payments-ally-scan-page #payments-ally-scan-merchant-code').val(qrCodeSegmentsArray[1]);$('#payments-ally-scan-page #payments-ally-scan-merchant-phone').val(qrCodeSegmentsArray[2]);// manually trigger form validation
utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.formValidator.whenValidate();});});});});}}};

//# sourceMappingURL=controller-compiled.js.map