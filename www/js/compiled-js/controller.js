/**
 * Created by UTOPIA SOFTWARE on 3/11/2017.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware.ally' namespace has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */


// define the controller namespace
utopiasoftware.ally.controller = {

    /**
     * method is used to handle the special event created by the intel xdk developer library. The special event (app.Ready)
     * is triggered when ALL the hybrid app plugins have been loaded/readied and also the document DOM content is ready
     */
    appReady: () => {

        // initialise the onsen library
        ons.ready(function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function(){
                // does nothing for now!!
            });


            if(utopiasoftware.ally.model.isAppReady === false){ // if app has not completed loading
                // displaying prepping message
                $('#loader-modal-message').html("Loading App...");
                $('#loader-modal').get(0).show(); // show loader
            }

            // check if the user is currently logged in
            if(window.localStorage.getItem("app-status") && window.localStorage.getItem("app-status") != ""){ // user is logged in
                //set the first page to be displayed to be the login page
                $('ons-splitter').get(0).content.load("login-template");
            }
            else{ // user has NOT been logged in
                // set the first page to be displayed to be the onboarding page
                $('ons-splitter').get(0).content.load("onboarding-template");
            }

            // set the content page for the app
            //$('ons-splitter').get(0).content.load("app-main-template");


        });
        // END OF ONSEN LIBRARY READY EVENT


        // add listener for when the Internet network connection is offline
        document.addEventListener("offline", function(){

            // display a toast message to let user no there is no Internet connection
            window.plugins.toast.showWithOptions({
                message: "No Internet Connection. App functionality may be limited",
                duration: 4000, // 4000 ms
                position: "bottom",
                styling: {
                    opacity: 1,
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    textSize: 14
                }
            });

        }, false);


        try {
            // lock the orientation of the device to 'PORTRAIT'
            screen.lockOrientation('portrait');
        }
        catch(err){}

        // set status bar color
        StatusBar.backgroundColorByHexString("#2C8E01");

        // prepare the inapp browser plugin
        window.open = cordova.InAppBrowser.open;

        // use Promises to load the other cordova plugins
        new Promise(function(resolve, reject){
            // this promise  just sets the promise chain in motion
            window.setTimeout(function(){
                resolve(); // resolve the promise
            }, 0);
        }).
        then(function(){ // load the securely stored / encrypted data into the app
            // check if the user is currently logged in
            if(! window.localStorage.getItem("app-status") || window.localStorage.getItem("app-status") == ""){ // user is not logged in
                return null;
            }

            return Promise.resolve(intel.security.secureStorage.read({"id": "ally-user-details"}));
        }).
        then(function(instanceId){
            if(instanceId == null){ // user is not logged in
                return null;
            }

            return Promise.resolve(intel.security.secureData.getData(instanceId));
        }).
        then(function(secureData){

            if(secureData == null){ // user is not logged in
                return null;
            }

            utopiasoftware.ally.model.appUserDetails = JSON.parse(secureData); // transfer the collected user details to the app
            // update the first name being displayed in the side menu
            //$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);
            return null;
        }).
        then(function(){
            // notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
            utopiasoftware.ally.model.isAppReady = true;
            // hide the splash screen
            navigator.splashscreen.hide();
        }).
        catch(function(err){

            // notify the app that the app has been successfully initialised and is ready for further execution (set app ready flag to true)
            utopiasoftware.ally.model.isAppReady = true;
            // hide the splash screen
            navigator.splashscreen.hide();

            // display a toast message to let user no there is no Internet connection
            window.plugins.toast.showWithOptions({
                message: "Startup Error. App functionality may be limited. Always update the app to " +
                "get the best secure experience. Please contact us if problem continues",
                duration: 5000, // 5000 ms
                position: "bottom",
                styling: {
                    opacity: 1,
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF',
                    textSize: 14
                }
            });
        });

    },


    /**
     * object is the view-model for the app side menu
     */
    sideMenuViewModel : {

        /**
         * method is used to listen for when the list
         * items in the side menu is clicked
         *
         * @param label {String} label represents clicked list item in the side-menu
         */
        sideMenuListClicked: function(label) {


            if(label == "events schedule"){ // 'events schedule' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().
                then(function(){
                    $('#app-main-navigator').get(0).bringPageTop("events-schedule-page.html", {}); // navigate to the specified page
                }).catch(function(){});

                return;
            }

            if(label == "hotels"){ // 'hotels' button was clicked

                // close the side menu
                $('ons-splitter').get(0).left.close().
                then(function(){
                    $('#app-main-navigator').get(0).bringPageTop("hotels-page.html", {}); // navigate to the specified page
                }).catch(function(){});

                return;
            }

        }
    },


    /**
     * object is view-model for main-menu page
     */
    mainMenuPageViewModel: {


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                /*$('#app-main-navigator').get(0).topPage.onDeviceBackButton = function(){
                    ons.notification.confirm('Do you want to close the app?', {title: 'Exit',
                            buttonLabels: ['No', 'Yes']}) // Ask for confirmation
                        .then(function(index) {
                            if (index === 1) { // OK button
                                navigator.app.exitApp(); // Close the app
                            }
                        });
                }; */

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
            $('#menu-tabbar .tabbar__border').css("visibility", "hidden");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // stop the rotating animation on main menu page
            //$('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
        },



        /**
         * method is used to track changes on the tabbar tabs
         * @param event
         */
        tabbarPreChange(event){

            // determine the tab that was clicked
            switch(event.originalEvent.index){
                case 0:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Dashboard"); // update the label of the to-be displayed tab

                    break;

                case 1:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Payments"); // update the label of the to-be displayed tab

                    break;

                case 2:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Wallet"); // update the label of the to-be displayed tab

                    break;

                case 3:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Account"); // update the label of the to-be displayed tab

                    break;

                case 4:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Menu"); // update the label of the to-be displayed tab

                    break;
            }
        }



    },

    /**
     * object is view-model for onboarding page
     */
    onboardingPageViewModel: {


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#onboarding-navigator').get(0).topPage.onDeviceBackButton = function(){
                    ons.notification.confirm('Do you want to close the app?', {title: 'Exit',
                            buttonLabels: ['No', 'Yes']}) // Ask for confirmation
                        .then(function(index) {
                            if (index === 1) { // OK button
                                navigator.app.exitApp(); // Close the app
                            }
                        });
                };

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
        },


        /**
         * method is used to listen for click events of the "Sign Up" button
         *
         */
        signupButtonClicked: function(){

            $('#onboarding-navigator').get(0).pushPage("signup-page.html", {}); // navigate to the signup page


        },

        /**
         * method is used to listen for click events of the "Login" button
         *
         */
        loginButtonClicked: function(){

            $('ons-splitter').get(0).content.load('login-template'); // navigate to the login page


        },

        /**
         * method is used to track changes on the carousel slides
         * @param event
         */
        carouselPostChange(event){

            // change the carousel counter indicator based on the currently active and previously active carousel slides
            $('#onboarding-page .carousel-counter').eq(event.originalEvent.lastActiveIndex).removeClass('active');
            $('#onboarding-page .carousel-counter').eq(event.originalEvent.activeIndex).addClass('active');
        }



    },


    /**
     * object is view-model for login page
     */
    loginPageViewModel: {

        /**
         * used to hold the parsley form validation object for the sign-in page
         */
        formValidator: null,


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#login-navigator').get(0).topPage.onDeviceBackButton = function(){

                    $('ons-splitter').get(0).content.load('onboarding-template');
                };

                // check if the user is currently logged in
                if(window.localStorage.getItem("app-status") && window.localStorage.getItem("app-status") != ""){ // user is logged in
                    // display the user's save phone number on the login page phonenumber input
                    $('#login-page #login-phone-number').val(utopiasoftware.ally.model.appUserDetails.phone);
                }

                // initialise the login form validation
                utopiasoftware.ally.controller.loginPageViewModel.formValidator = $('#login-form').parsley();

                // attach listener for the log in button click event on the login page
                $('#login-signin').get(0).onclick = function(){
                    // run the validation method for the sign-in form
                    utopiasoftware.ally.controller.loginPageViewModel.formValidator.whenValidate();
                };

                // listen for log in form field validation failure event
                utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for log in form field validation success event
                utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for log in form validation success
                utopiasoftware.ally.controller.loginPageViewModel.formValidator.on('form:success',
                    utopiasoftware.ally.controller.loginPageViewModel.loginFormValidated);

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){

            try {
                // remove any tooltip being displayed on all forms in the login page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object in the sign-in page
                utopiasoftware.ally.controller.loginPageViewModel.formValidator.reset();
            }
            catch(err){}
        },

        /**
         * method is triggered when the page is destroyed
         * @param event
         */
        pageDestroy: (event) => {
            try{
                // remove any tooltip being displayed on all forms in the login page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // destroy the form validator objects in the login page
                utopiasoftware.ally.controller.loginPageViewModel.formValidator.destroy();
            }
            catch(err){}
        },


        /**
         * method is triggered when sign-in form is successfully validated
         *
         */
        loginFormValidated: function(){

            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "user cannot login to ALLY account without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function(toastEvent){
                    if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            // create the form data to be submitted
            var formData = {
                lock: $('#login-page #login-pin').val(),
                phone: $('#login-page #login-phone-number').val().startsWith("0") ?
                    $('#login-page #login-phone-number').val().replace("0", "+234"):$('#login-page #login-phone-number').val()
            };


            // begin login process
            Promise.resolve().
            then(function(){
                // display the loader message to indicate that account is being created;
                $('#loader-modal-message').html("Completing User Login...");
                return Promise.resolve($('#loader-modal').get(0).show()); // show loader
            }).
            then(function(){ // clear all data belonging to previous user
                var promisesArray = []; // holds all the Promise objects for all data being deleted

                var promiseObject = new Promise(function(resolve, reject){
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.
                    delete({'id':'ally-user-details'})).
                    then(function(){resolve();},function(){resolve();}); // ALWAYS resolve the promise
                });

                // add the promise object to the promise array
                promisesArray.push(promiseObject);

                // return promise when all operations have completed
                return Promise.all(promisesArray);
            }).
            then(function(){
                // clear all data in the device local/session storage
                window.localStorage.clear();
                window.sessionStorage.clear();
                return null;
            }).
            then(function(){
                // upload the user details to the server
                return Promise.resolve($.ajax(
                    {
                        url: utopiasoftware.ally.model.ally_base_url + "/mobile/login.php",
                        type: "post",
                        contentType: "application/x-www-form-urlencoded",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                        },
                        dataType: "text",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: formData
                    }
                ));

            }).
            then(function(serverResponseText){
                serverResponseText +=  "";
                var newUser = JSON.parse(serverResponseText.trim()); // get the new user object
                // add a timestamp for the last time user details was updated
                newUser._lastUpdatedDate = Date.now();

                // check if any error occurred
                if(newUser.status == "error"){ // an error occured
                    throw newUser.message; // throw the error message attached to this error
                }

                // store user data
                utopiasoftware.ally.model.appUserDetails = newUser; // store the user details

                return newUser; // return user data

            }).
            then(function(newUser){
                // create a cypher data of the user details
                return Promise.resolve(intel.security.secureData.
                createFromData({"data": JSON.stringify(newUser)}));
            }).
            then(function(instanceId){
                // store the cyphered data in secure persistent storage
                return Promise.resolve(
                    intel.security.secureStorage.write({"id": "ally-user-details", "instanceID": instanceId})
                );
            }).
            then(function(){

                // set app-status local storage (as user phone number)
                window.localStorage.setItem("app-status", utopiasoftware.ally.model.appUserDetails.phone);

                // update the first name being displayed in the side menu
                //$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);

                return $('#loader-modal').get(0).hide(); // hide loader
            }).
            then(function(){ // navigate to the main menu page
                return $('ons-splitter').get(0).content.load("app-main-template");
            }).
            then(function(){
                ons.notification.toast("Login complete! Welcome", {timeout:3000});
            }).
            catch(function(err){
                if(typeof err !== "string"){ // if err is NOT a String
                    err = "Sorry. Login could not be completed"
                }
                $('#loader-modal').get(0).hide(); // hide loader
                ons.notification.alert({title: '<ons-icon icon="md-close-circle-o" size="32px" ' +
                'style="color: red;"></ons-icon> Log In Failed',
                    messageHTML: '<span>' + err + '</span>',
                    cancelable: false
                });
            });

        }



    },

    /**
     * object is view-model for forgot-pin page
     */
    forgotPinPageViewModel: {

        /**
         * used to hold the parsley form validation object for the page
         */
        formValidator: null,


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#login-navigator').get(0).topPage.onDeviceBackButton = function(){

                    $('#login-navigator').get(0).popPage({});
                };


                // initialise the form validation
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator = $('#forgot-pin-form').parsley();

                // attach listener for the log in button click event on the login page
                $('#forgot-pin-reset').get(0).onclick = function(){
                    // run the validation method for the sign-in form
                    utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.whenValidate();
                };

                // listen for log in form field validation failure event
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for log in form field validation success event
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for log in form validation success
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.on('form:success',
                    utopiasoftware.ally.controller.forgotPinPageViewModel.forgotPinFormValidated);

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){

            try {
                // remove any tooltip being displayed on all forms in the page
                $('#forgot-pin-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#forgot-pin-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object in the page
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.reset();
            }
            catch(err){}
        },

        /**
         * method is triggered when the page is destroyed
         * @param event
         */
        pageDestroy: (event) => {
            try{
                // remove any tooltip being displayed on all forms in the page
                $('#forgot-pin-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#forgot-pin-page [data-hint]').removeAttr("data-hint");
                // destroy the form validator objects in the page
                utopiasoftware.ally.controller.forgotPinPageViewModel.formValidator.destroy();
            }
            catch(err){}
        },


        /**
         * method is triggered when the form is successfully validated
         *
         */
        forgotPinFormValidated: function(){

            $('#login-navigator').get(0).popPage({});


        }



    },

    /**
     * object is view-model for signup page
     */
    signupPageViewModel: {

        /**
         * used to hold the parsley form validation object for the page
         */
        formValidator: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#onboarding-navigator').get(0).topPage.onDeviceBackButton = function(){
                    // move to the onboarding page
                    $('#onboarding-navigator').get(0).popPage({});
                };

                // initialise the create-account form validation
                utopiasoftware.ally.controller.signupPageViewModel.formValidator = $('#signup-form').parsley();

                // attach listener for the sign up button on the page
                $('#signup-signup-button').get(0).onclick = function(){
                    // run the validation method for the form
                    utopiasoftware.ally.controller.signupPageViewModel.formValidator.whenValidate();
                };

                // listen for log in form field validation failure event
                utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for the form field validation success event
                utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for the form validation success
                utopiasoftware.ally.controller.signupPageViewModel.formValidator.on('form:success',
                    utopiasoftware.ally.controller.signupPageViewModel.signupFormValidated);

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when the signup page is hidden
         * @param event
         */
        pageHide: (event) => {
            try {
                // remove any tooltip being displayed on all forms on the page
                $('#signup-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#signup-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware.ally.controller.signupPageViewModel.formValidator.reset();
            }
            catch(err){}
        },

        /**
         * method is triggered when the signup page is destroyed
         * @param event
         */
        pageDestroy: (event) => {
            try{
                // remove any tooltip being displayed on all forms on the page
                $('#signup-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#signup-page [data-hint]').removeAttr("data-hint");
                // destroy the form validator objects on the page
                utopiasoftware.ally.controller.signupPageViewModel.formValidator.destroy();
            }
            catch(err){}
        },

        /**
         * method is triggered when sign-up form is successfully validated
         */
        signupFormValidated: function(){

            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "ALLY account cannot be created without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function(toastEvent){
                    if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            // create the form data to be submitted
            var createAcctFormData = {
                firstName: $('#signup-page #signup-firstname').val(),
                lastName: $('#signup-page #signup-lastname').val(),
                lock: $('#signup-page #signup-secure-pin').val(),
                phone: $('#signup-page #signup-phone-number').val().startsWith("0") ?
                    $('#signup-page #signup-phone-number').val().replace("0", "+234"):$('#signup-page #signup-phone-number').val()
            };


            // tell the user that phone number verification is necessary
            new Promise(function(resolve, reject){
                ons.notification.confirm('To complete sign up, your phone number must be verified. <br>' +
                        'Usual SMS charge from your phone network provider will apply.<br> ' +
                        'Please ensure you have sufficient airtime to send/receive one SMS', {title: 'Verify Phone Number',
                        buttonLabels: ['Cancel', 'Ok']}) // Ask for confirmation
                    .then(function(index) {
                        if (index === 1) { // OK button
                            resolve();
                        }
                        else{
                            reject("your phone number could not be verified");
                        }
                    });
            }).
            then(function(){ // verify the user's phone number

                //return null;
                return utopiasoftware.ally.validatePhoneNumber($('#signup-page #signup-phone-number').val());
            }).
            then(function(){
                // display the loader message to indicate that account is being created;
                $('#loader-modal-message').html("Completing Sign Up...");
                return Promise.resolve($('#loader-modal').get(0).show()); // show loader
            }).
            then(function(){ // clear all data belonging to previous user
                var promisesArray = []; // holds all the Promise objects for all data being deleted

                var promiseObject = new Promise(function(resolve, reject){
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.
                    delete({'id':'ally-user-details'})).
                    then(function(){resolve();},function(){resolve();}); // ALWAYS resolve the promise
                });

                // add the promise object to the promise array
                promisesArray.push(promiseObject);

                // return promise when all operations have completed
                return Promise.all(promisesArray);
            }).
            then(function(){
                // clear all data in the device local/session storage
                window.localStorage.clear();
                window.sessionStorage.clear();
                return null;
            }).
            then(function(){
                // upload the user details to the server
                return Promise.resolve($.ajax(
                    {
                        url: utopiasoftware.ally.model.ally_base_url + "/mobile/signup.php",
                        type: "post",
                        contentType: "application/x-www-form-urlencoded",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                        },
                        dataType: "text",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: createAcctFormData
                    }
                ));

            }).
            then(function(serverResponseText){
                serverResponseText +=  "";
                var newUser = JSON.parse(serverResponseText.trim()); // get the new user object
                // add a timestamp for the last time user details was updated
                newUser._lastUpdatedDate = Date.now();

                // check if any error occurred
                if(newUser.status == "error"){ // an error occured
                    throw newUser.message; // throw the error message attached to this error
                }

                // store user data
                utopiasoftware.ally.model.appUserDetails = newUser;

                return newUser;

            }).
            then(function(newUser){
                // create a cypher data of the user details
                return Promise.resolve(intel.security.secureData.
                createFromData({"data": JSON.stringify(newUser)}));
            }).
            then(function(instanceId){
                // store the cyphered data in secure persistent storage
                return Promise.resolve(
                    intel.security.secureStorage.write({"id": "ally-user-details", "instanceID": instanceId})
                );
            }).
            then(function(){

                // set app-status local storage (as user phone number)
                window.localStorage.setItem("app-status", utopiasoftware.ally.model.appUserDetails.phone);

                // update the first name being displayed in the side menu
                //$('#side-menu-username').html(utopiasoftware.saveup.model.appUserDetails.firstName);

                return $('#loader-modal').get(0).hide(); // hide loader
            }).
            then(function(){
                return $('ons-splitter').get(0).content.load("app-main-template");
            }).
            then(function(){
                ons.notification.toast("Sign Up complete! Welcome", {timeout:3000});
            }).
            catch(function(err){
                if(typeof err !== "string"){ // if err is NOT a String
                    err = "Sorry. Sign Up could not be completed"
                }
                $('#loader-modal').get(0).hide(); // hide loader
                ons.notification.alert({title: '<ons-icon icon="md-close-circle-o" size="32px" ' +
                'style="color: red;"></ons-icon> Sign Up Failed',
                    messageHTML: '<span>' + err + '</span>',
                    cancelable: false
                });
            });
        },

        /**
         * method is triggered when the PIN visibility button is clicked.
         * It toggles pin visibility
         *
         * @param buttonElement
         */
        pinVisibilityButtonClicked: function(buttonElement){
            if($(buttonElement).attr("data-ally-visible") === "no"){ // pin is not visible, make it visible
                $('#signup-secure-pin input').css("-webkit-text-security", "none"); // change the text-security for the input field
                $(buttonElement).find('ons-icon').attr("icon", "md-eye-off"); // change the icon associated with the input
                $(buttonElement).attr("data-ally-visible", "yes"); // flag the pin is now visible
            }
            else{ // make the pin not visible
                $('#signup-secure-pin input').css("-webkit-text-security", "disc"); // change the text-security for the input field
                $(buttonElement).find('ons-icon').attr("icon", "md-eye"); // change the icon associated with the input
                $(buttonElement).attr("data-ally-visible", "no"); // flag the pin is now invisible
            }
        },


        /**
         * method is used to change the value for the Verify Phone Number based on the checkbox state.
         * This change is used to enable validation for the input
         *
         * @param inputElement
         */
        verifyPhoneNumberClicked: function(inputElement){
            if(inputElement.checked){ // input is checked
                // update the input value
                inputElement.value = "checked"
            }
            else{ // input is NOT checked
                // reset the input value
                inputElement.value = ""
            }
        }

    },


    /**
     * object is view-model for dashboard page
     */
    dashboardPageViewModel: {


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $thisPage.get(0).onDeviceBackButton = utopiasoftware.ally.controller.dashboardPageViewModel.backButtonClicked;

                // initialise the DropDownList
                let dropDownListObject = new ej.dropdowns.DropDownList({});

                // render initialized DropDownList
                dropDownListObject.appendTo('#dashboard-period-select');

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // stop the rotating animation on main menu page
            //$('.rotating-infinite-ease-in-1').addClass('rotating-infinite-ease-in-1-paused');
        },


        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

        },


        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            ons.notification.confirm('Do you want to close the app?', {title: 'Exit',
                    buttonLabels: ['No', 'Yes']}) // Ask for confirmation
                .then(function(index) {
                    if (index === 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                });
        }

    },

    /**
     * object is view-model for account page
     */
    accountPageViewModel: {

        /**
         * used to hold the parsley form validation object for the page
         */
        formValidator: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $thisPage.get(0).onDeviceBackButton = utopiasoftware.ally.controller.accountPageViewModel.backButtonClicked;

                $('#account-preloading-fab', $thisPage).css("display", "inline-block"); // display page preloader

                // initialise the form validation
                utopiasoftware.ally.controller.accountPageViewModel.formValidator = $('#account-page #account-form').parsley();

                // listen for form field validation failure event
                utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for the form field validation success event
                utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for the form validation success
                utopiasoftware.ally.controller.accountPageViewModel.formValidator.on('form:success',
                    utopiasoftware.ally.controller.accountPageViewModel.accountFormValidated);

                // load the user data
                utopiasoftware.ally.controller.accountPageViewModel.loadUserAccountData().
                then(function(userDetails){ // save the returned user details in app cache
                    return utopiasoftware.ally.saveUserAppDetails(userDetails);
                }).
                then(function(userDetails){ // update the page with the collect data details

                    // update user data on app
                    utopiasoftware.ally.model.appUserDetails = userDetails;

                    $('#account-wallet-balance', $thisPage).
                    html(kendo.toString(kendo.parseFloat(userDetails.balance), "n2"));
                    $('#account-last-updated', $thisPage).
                    html(kendo.toString(new Date(userDetails._lastUpdatedDate), "MMM d yyyy, h:mmtt"));
                    $('#account-firstname', $thisPage).val(userDetails.firstname);
                    $('#account-lastname', $thisPage).val(userDetails.lastname);
                    $('#account-phone-number', $thisPage).val(userDetails.phone);
                    $('#account-email', $thisPage).val((userDetails.email && userDetails.email != "") ? userDetails.email : "");

                    // display the necessary page components
                    $('#account-list', $thisPage).css("display", "block");
                    $('#account-reload-fab', $thisPage).css("display", "inline-block");
                    $('#account-edit-fab', $thisPage).css("display", "inline-block");

                    // hide necessary page components
                    $('#account-save', $thisPage).css("display", "none");
                    $('#account-page-error', $thisPage).css("display", "none");
                    // hide page preloader
                    $('#account-preloading-fab', $thisPage).css("display", "none");

                    // hide the loader
                    $('#loader-modal').get(0).hide();
                }).
                catch(function(){ // an error occurred when trying to load the user data

                    // hide the necessary page components
                    $('#account-list', $thisPage).css("display", "none");
                    $('#account-save', $thisPage).css("display", "none");
                    $('#account-edit-fab', $thisPage).css("display", "none");

                    // display necessary page components
                    $('#account-page-error', $thisPage).css("display", "block");
                    $('#account-reload-fab', $thisPage).css("display", "inline-block");

                    // hide page preloader
                    $('#account-preloading-fab', $thisPage).css("display", "none");

                    // hide the loader
                    $('#loader-modal').get(0).hide();
                });


            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            try{
                // remove any tooltip being displayed on all forms on the page
                $('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#account-page [data-hint]').removeAttr("data-hint");
                // reset the form validator objects on the page
                utopiasoftware.ally.controller.accountPageViewModel.formValidator.reset();
            }
            catch(err){}
        },


        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            try{
                // remove any tooltip being displayed on all forms on the page
                $('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#account-page [data-hint]').removeAttr("data-hint");
                // destroy the form validator objects on the page
                utopiasoftware.ally.controller.accountPageViewModel.formValidator.destroy();
            }
            catch(err){}
        },


        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            // check if the menu tabbar exists
            if($('#menu-tabbar').get(0)){ // the menu tabbar object exists
                // move to the previous tab
                $('#menu-tabbar').get(0).setActiveTab(2);
            }
        },


        /**
         * method is triggered when the Edit Account fab button is clicked
         */
        editAccountButtonClicked(){

            // remove the the readonly attributes, so the form  elements can be editable
            $('#account-page [data-ally-readonly-field]').removeAttr('readonly');
            // hide the edit account button
            $('#account-page #account-edit-fab').css("display", "none");
            // show the save account button
            $('#account-page #account-save').css("display", "inline-block");
            // display the instruction for running the account edit
            ons.notification.toast("you can edit your account", {timeout:3000});
        },


        /**
         * method is triggered when the Refresh Account fab button is clicked
         */
        refreshAccountButtonClicked(){

            // add the the readonly attributes, so the form  elements cannot be editable
            $('#account-page [data-ally-readonly-field]').attr('readonly', true);
            // hide the edit account button
            $('#account-page #account-edit-fab').css("display", "none");
            // hide the save account button
            $('#account-page #account-save').css("display", "none");
            // remove any tooltip being displayed on all forms on the page
            $('#account-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
            $('#account-page [data-hint]').removeAttr("data-hint");
            // reset the form validator objects on the page
            utopiasoftware.ally.controller.accountPageViewModel.formValidator.reset();

            // display the page preloader
            $('#account-page #account-preloading-fab').css("display", "inline-block");

            // load the user data
            utopiasoftware.ally.controller.accountPageViewModel.loadUserAccountData().
            then(function(userDetails){ // save the returned user details in app cache
                return utopiasoftware.ally.saveUserAppDetails(userDetails);
            }).
            then(function(userDetails){ // update the page with the collected data details

                // update user data on app
                utopiasoftware.ally.model.appUserDetails = userDetails;

                $('#account-page #account-wallet-balance').
                html(kendo.toString(kendo.parseFloat(userDetails.balance), "n2"));
                $('#account-page #account-last-updated').
                html(kendo.toString(new Date(userDetails._lastUpdatedDate), "MMM d yyyy, h:mmtt"));
                $('#account-page #account-firstname').val(userDetails.firstname);
                $('#account-page #account-lastname').val(userDetails.lastname);
                $('#account-page #account-phone-number').val(userDetails.phone);
                $('#account-page #account-email').val((userDetails.email && userDetails.email != "") ? userDetails.email : "");

                // display the necessary page components
                $('#account-page #account-list').css("display", "block");
                $('#account-page #account-reload-fab').css("display", "inline-block");
                $('#account-page #account-edit-fab').css("display", "inline-block");

                // hide necessary page components
                $('#account-page #account-save').css("display", "none");
                $('#account-page #account-page-error').css("display", "none");
                // hide page preloader
                $('#account-page #account-preloading-fab').css("display", "none");

            }).
            catch(function(){ // an error occurred when trying to load the user data

                // hide the necessary page components
                $('#account-page #account-list').css("display", "none");
                $('#account-page #account-save').css("display", "none");
                $('#account-page #account-edit-fab').css("display", "none");

                // display necessary page components
                $('#account-page #account-page-error').css("display", "block");
                $('#account-page #account-reload-fab').css("display", "inline-block");

                // hide page preloader
                $('#account-page #account-preloading-fab').css("display", "none");

            });
        },


        /**
         * method is triggered when the Save Account fab button is clicked
         */
        saveAccountButtonClicked(){

            // run the validation method for the sign-in form
            utopiasoftware.ally.controller.accountPageViewModel.formValidator.whenValidate();
            console.log("SAVE BUTTON CLICKED");
        },


        /**
         * method is triggered when form is successfully validated
         */
        accountFormValidated(){
            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
                // inform the user that they cannot proceed without Internet
                window.plugins.toast.showWithOptions({
                    message: "ALLY account cannot be updated without an Internet Connection",
                    duration: 4000,
                    position: "top",
                    styling: {
                        opacity: 1,
                        backgroundColor: '#ff0000', //red
                        textColor: '#FFFFFF',
                        textSize: 14
                    }
                }, function(toastEvent){
                    if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            // ask user for secure PIN before proceeding. secure pin MUST match
            ons.notification.prompt({title: '<ons-icon icon="ion-lock-combination" size="28px" ' +
            'style="color: #30a401;"></ons-icon> Security Check', id: "pin-security-check",
                messageHTML: '<div><span>' +
                'Please enter your ALLY Secure PIN to proceed</span></div>',
                cancelable: true, placeholder: "Secure PIN", inputType: "number", defaultValue: "", autofocus: false,
                submitOnEnter: true
            }).
            then(function(userInput){ // collect user secure PIN and submit the rest of the form data

                // add the the readonly attributes, so the form  elements cannot be editable
                $('#account-page [data-ally-readonly-field]').attr('readonly', true);
                // hide the edit account button
                $('#account-page #account-edit-fab').css("display", "none");
                // hide the save account button
                $('#account-page #account-save').css("display", "none");


                // create the form data to be submitted
                var formData = {
                    firstName: $('#account-page #account-firstname').val(),
                    lastName: $('#account-page #account-lastname').val(),
                    lock: userInput,
                    phone: $('#account-page #account-phone-number').val(),
                    email: $('#account-page #account-email').val()
                };


                // display the loader message to indicate that account is being created;
                $('#hour-glass-loader-modal .modal-message').html("Saving Account Details...");
                // forward the form data &show loader
                return Promise.all([formData, Promise.resolve($('#hour-glass-loader-modal').get(0).show())]);

            }).
            then(function(dataArray){
                // submit the form data
                return Promise.resolve($.ajax(
                    {
                        url: utopiasoftware.ally.model.ally_base_url + "/mobile/update-profile.php",
                        type: "post",
                        contentType: "application/x-www-form-urlencoded",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                        },
                        dataType: "text",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: dataArray[0] // data to submit to server
                    }
                ));
            }).
            then(function(serverResponseText){
                serverResponseText +=  "";
                var userAcctDetails = JSON.parse(serverResponseText.trim()); // get the new user object
                // add a timestamp for the last time user details was updated
                userAcctDetails._lastUpdatedDate = Date.now();

                // check if any error occurred
                if(userAcctDetails.status == "error"){ // an error occured
                    throw userAcctDetails.message; // throw the error message attached to this error
                }

                return utopiasoftware.ally.saveUserAppDetails(userAcctDetails); // cache the returned account details
            }).
            then(function(userAcctDetails){
               // update the user data on the app
                utopiasoftware.ally.model.appUserDetails = userAcctDetails;
                return userAcctDetails;
            }).
            then(function(){

                // display the necessary page components
                $('#account-page #account-list').css("display", "block");
                $('#account-page #account-reload-fab').css("display", "inline-block");
                $('#account-page #account-edit-fab').css("display", "inline-block");

                // hide necessary page components
                $('#account-page #account-save').css("display", "none");
                $('#account-page #account-page-error').css("display", "none");
                // hide page preloader
                $('#account-page #account-preloading-fab').css("display", "none");

                return $('#hour-glass-loader-modal').get(0).hide(); // hide loader
            }).
            then(function(){
                ons.notification.toast("Account Details Updated!", {timeout:3000});
            }).
            catch(function(err){
                if(typeof err !== "string"){ // if err is NOT a String
                    err = "Sorry. Your account details could not be updated. Please retry"
                }

                // remove the readonly attributes, so the form  elements can be editable
                $('#account-page [data-ally-readonly-field]').removeAttr('readonly', true);
                // hide the edit account button
                $('#account-page #account-edit-fab').css("display", "none");
                // show the save account button
                $('#account-page #account-save').css("display", "inline-block");

                $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                ons.notification.alert({title: '<ons-icon icon="md-close-circle-o" size="32px" ' +
                'style="color: red;"></ons-icon> Account Update Failed',
                    messageHTML: '<span>' + err + '</span>',
                    cancelable: false
                });
            });

        },


        /**
         * method is used to load the user account data either from
         * the locally cached data OR directly from the remote server
         */
        loadUserAccountData(){
            return new Promise(function(resolve, reject){

                // check if there is internet connection
                if(navigator.connection.type === Connection.NONE){ // no internet connection
                    // inform the user that cached data will be displayed in the absence of internet
                    window.plugins.toast.showWithOptions({
                        message: "No Internet Connection. Previously cached data will be displayed",
                        duration: 4000,
                        position: "top",
                        styling: {
                            opacity: 1,
                            backgroundColor: '#008000',
                            textColor: '#FFFFFF',
                            textSize: 14
                        }
                    }, function(toastEvent){
                        if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                            window.plugins.toast.hide();
                        }
                    });
                    // no internet connection, so use local cache of data
                    resolve(utopiasoftware.ally.loadUserCachedAppDetails());
                }
                else{ // there's internet, so make request for new data

                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware.ally.model.ally_base_url + "/mobile/get-profile.php",
                            type: "post",
                            contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                            },
                            dataType: "text",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {phone: utopiasoftware.ally.model.appUserDetails.phone} // data to submit to server
                        }
                    )).
                    then(function(serverResponseText){
                        serverResponseText +=  "";
                        var userDetailsData = JSON.parse(serverResponseText.trim()); // get the new user object
                        // add a timestamp for the last time user details was updated
                        userDetailsData._lastUpdatedDate = Date.now();

                        // check if any error occurred
                        if(userDetailsData.status == "error"){ // an error occurred
                            throw userDetailsData.message; // throw the error message attached to this error
                        }


                        resolve(userDetailsData); // return user data and resolve the Promise

                    }).catch(function(err){
                        reject(err); // reject the Promise error
                    });
                }
            });
        }

    },

    /**
     * object is view-model for wallet page
     */
    walletPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware.ally.model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $thisPage.get(0).onDeviceBackButton = utopiasoftware.ally.controller.walletPageViewModel.backButtonClicked;

                $('#wallet-preloading-fab', $thisPage).css("display", "inline-block"); // display page preloader

                // load the user data
                utopiasoftware.ally.controller.walletPageViewModel.loadUserAccountData().
                then(function(userDetails){ // save the returned user details in app cache
                    return utopiasoftware.ally.saveUserAppDetails(userDetails);
                }).
                then(function(userDetails){ // update the page with the collect data details

                    // update user data on app
                    utopiasoftware.ally.model.appUserDetails = userDetails;

                    $('#wallet-balance', $thisPage).
                    html(kendo.toString(kendo.parseFloat(userDetails.balance), "n2"));

                    $('#wallet-owner-name', $thisPage).val(userDetails.firstname + " " + userDetails.lastname);

                    // display the necessary page components
                    $('#wallet-list', $thisPage).css("display", "block");
                    $('#wallet-reload-fab', $thisPage).css("display", "inline-block");

                    // hide page preloader
                    $('#wallet-preloading-fab', $thisPage).css("display", "none");

                    // hide the loader
                    $('#loader-modal').get(0).hide();
                }).
                catch(function(){ // an error occurred when trying to load the user data

                    // display the necessary page components
                    $('#wallet-list', $thisPage).css("display", "block");

                    // display necessary page components
                    $('#wallet-reload-fab', $thisPage).css("display", "inline-block");

                    // hide page preloader
                    $('#wallet-preloading-fab', $thisPage).css("display", "none");

                    // hide the loader
                    $('#loader-modal').get(0).hide();
                });


            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){

        },


        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

        },


        /**
         * method is triggered when back button or device back button is clicked
         */
        backButtonClicked: function(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            // check if the menu tabbar exists
            if($('#menu-tabbar').get(0)){ // the menu tabbar object exists
                // move to the previous tab
                $('#menu-tabbar').get(0).setActiveTab(1);
            }
        },


        /**
         * method is triggered when the Refresh Account fab button is clicked
         */
        refreshAccountButtonClicked(){

            // display the page preloader
            $('#wallet-page #wallet-preloading-fab').css("display", "inline-block");

            // load the user data
            utopiasoftware.ally.controller.walletPageViewModel.loadUserAccountData().
            then(function(userDetails){ // save the returned user details in app cache
                return utopiasoftware.ally.saveUserAppDetails(userDetails);
            }).
            then(function(userDetails){ // update the page with the collected data details

                // update user data on app
                utopiasoftware.ally.model.appUserDetails = userDetails;

                $('#wallet-page #wallet-balance').
                html(kendo.toString(kendo.parseFloat(userDetails.balance), "n2"));

                $('#wallet-page #wallet-owner-name').val(userDetails.firstname + " " + userDetails.lastname);

                // display the necessary page components
                $('#wallet-page #wallet-list').css("display", "block");
                $('#wallet-page #wallet-reload-fab').css("display", "inline-block");

                // hide page preloader
                $('#wallet-page #wallet-preloading-fab').css("display", "none");

            }).
            catch(function(){ // an error occurred when trying to load the user data

                // display the necessary page components
                $('#wallet-page #wallet-list').css("display", "none");

                // display necessary page components
                $('#wallet-page #wallet-reload-fab').css("display", "inline-block");

                // hide page preloader
                $('#wallet-page #wallet-preloading-fab').css("display", "none");

            });
        },


        /**
         * method is used to load the user account data either from
         * the locally cached data OR directly from the remote server
         */
        loadUserAccountData(){
            return new Promise(function(resolve, reject){

                // check if there is internet connection
                if(navigator.connection.type === Connection.NONE){ // no internet connection
                    // inform the user that cached data will be displayed in the absence of internet
                    window.plugins.toast.showWithOptions({
                        message: "No Internet Connection. Previously cached data will be displayed",
                        duration: 4000,
                        position: "top",
                        styling: {
                            opacity: 1,
                            backgroundColor: '#008000',
                            textColor: '#FFFFFF',
                            textSize: 14
                        }
                    }, function(toastEvent){
                        if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                            window.plugins.toast.hide();
                        }
                    });
                    // no internet connection, so use local cache of data
                    resolve(utopiasoftware.ally.loadUserCachedAppDetails());
                }
                else{ // there's internet, so make request for new data

                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware.ally.model.ally_base_url + "/mobile/get-profile.php",
                            type: "post",
                            contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                            },
                            dataType: "text",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {phone: utopiasoftware.ally.model.appUserDetails.phone} // data to submit to server
                        }
                    )).
                    then(function(serverResponseText){
                        serverResponseText +=  "";
                        var userDetailsData = JSON.parse(serverResponseText.trim()); // get the new user object
                        // add a timestamp for the last time user details was updated
                        userDetailsData._lastUpdatedDate = Date.now();

                        // check if any error occurred
                        if(userDetailsData.status == "error"){ // an error occurred
                            throw userDetailsData.message; // throw the error message attached to this error
                        }


                        resolve(userDetailsData); // return user data and resolve the Promise

                    }).catch(function(err){
                        reject(err); // reject the Promise error
                    });
                }
            });
        }

    }

};
