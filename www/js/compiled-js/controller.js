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
        StatusBar.backgroundColorByHexString("#38A465");

        // prepare the inapp browser plugin
        window.open = cordova.InAppBrowser.open;

        // use Promises to load the other cordova plugins
        new Promise(function(resolve, reject){
            // this promise  just sets the promise chain in motion
            window.setTimeout(function(){
                resolve(); // resolve the promise
            }, 0);
        }).
        then(function(){

            // run the Microsoft Code-Push plugin
            /*codePush.sync(null, {updateDialog: {updateTitle: "Updated Content",
                mandatoryUpdateMessage: "The app has updated content. Press 'Continue' to retrieve content and restart app"},
                installMode: InstallMode.IMMEDIATE, mandatoryInstallMode: InstallMode.IMMEDIATE}); */

            return;
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
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton = function(){
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
         * method is used to listen for click events of the main menu items
         *
         * @param label
         */
        mainMenuButtonsClicked: function(label){

            if(label == "events schedule"){ // 'events schedule' button was clicked

                $('#app-main-navigator').get(0).pushPage("events-schedule-page.html", {}); // navigate to the events schedule page

                return;
            }


            if(label == "hotels"){ // intro button was clicked

                $('#app-main-navigator').get(0).pushPage("hotels-page.html", {}); // navigate to the page

                return;
            }


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

                    $(event.originalEvent.tabItem).attr("label", "Transfers"); // update the label of the to-be displayed tab

                    break;

                case 3:
                    $('#menu-tabbar ons-tab').removeAttr("label"); // remove all displaced labels

                    $(event.originalEvent.tabItem).attr("label", "Profile"); // update the label of the to-be displayed tab

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
         * method is used to listen for click events of the main menu items
         *
         */
        signupButtonClicked: function(){

            $('#onboarding-navigator').get(0).pushPage("signup-page.html", {}); // navigate to the signup page


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
         * method is used to listen for click events of the main menu items
         *
         */
        signupButtonClicked: function(){

            $('#onboarding-navigator').get(0).pushPage("signup-page.html", {}); // navigate to the signup page


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



    }

};
