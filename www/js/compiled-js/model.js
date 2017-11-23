/**
 * Created by UTOPIA SOFTWARE on 3/11/2017.
 */

/**
 * file contains the model data of the app.
 *
 * The 'utopiasoftware.ally' namespace has being defined in the base js file.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the model namespace
utopiasoftware.ally.model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the special device ready event triggered by the
     * intel xdk (i.e. app.Ready) to set the flag.
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false,

    /**
     * property is used to hold the base url for communicating with ALLY app server
     */
    ally_base_url: "https://myallyapp.com",


    /**
     * holds details about the currently logged in user
     */
    appUserDetails: null
};


// register the event listener for when all Hybrid plugins and document DOM are ready
document.addEventListener("app.Ready", utopiasoftware.ally.controller.appReady, false) ;

// listen for the initialisation of the Onboarding page
$(document).on("init", "#onboarding-page", utopiasoftware.ally.controller.onboardingPageViewModel.pageInit);

// listen for when the Onboarding page is shown
$(document).on("show", "#onboarding-page", utopiasoftware.ally.controller.onboardingPageViewModel.pageShow);

// listen for when the Onboarding page is hidden
$(document).on("hide", "#onboarding-page", utopiasoftware.ally.controller.onboardingPageViewModel.pageHide);

// used to listen for 'onboarding-carousel' carousel items/slide changes on the onboarding page
$(document).on("postchange", "#onboarding-carousel", utopiasoftware.ally.controller.onboardingPageViewModel.carouselPostChange);

// listen for the initialisation of the Signup page
$(document).on("init", "#signup-page", utopiasoftware.ally.controller.signupPageViewModel.pageInit);

// listen for when the Signup page is hidden
$(document).on("hide", "#signup-page", utopiasoftware.ally.controller.signupPageViewModel.pageHide);

// listen for when the Signup page is destroyed
$(document).on("destroy", "#signup-page", utopiasoftware.ally.controller.signupPageViewModel.pageDestroy);

// listen for the initialisation of the Login page
$(document).on("init", "#login-page", utopiasoftware.ally.controller.loginPageViewModel.pageInit);

// listen for when the Login page is shown
$(document).on("show", "#login-page", utopiasoftware.ally.controller.loginPageViewModel.pageShow);

// listen for when the Login page is hidden
$(document).on("hide", "#login-page", utopiasoftware.ally.controller.loginPageViewModel.pageHide);

// listen for when the Login page is destroyed
$(document).on("destroy", "#login-page", utopiasoftware.ally.controller.loginPageViewModel.pageDestroy);

// listen for the initialisation of the Forgot-PIN page
$(document).on("init", "#forgot-pin-page", utopiasoftware.ally.controller.forgotPinPageViewModel.pageInit);

// listen for when the Forgot-PIN page is shown
$(document).on("show", "#forgot-pin-page", utopiasoftware.ally.controller.forgotPinPageViewModel.pageShow);

// listen for when the Forgot-PIN page is hidden
$(document).on("hide", "#forgot-pin-page", utopiasoftware.ally.controller.forgotPinPageViewModel.pageHide);

// listen for when the Forgot-PIN page is destroyed
$(document).on("destroy", "#forgot-pin-page", utopiasoftware.ally.controller.forgotPinPageViewModel.pageDestroy);

// listen for the initialisation of the Main-Menu page
$(document).on("init", "#main-menu-page", utopiasoftware.ally.controller.mainMenuPageViewModel.pageInit);

// listen for when the Main-Menu page is shown
$(document).on("show", "#main-menu-page", utopiasoftware.ally.controller.mainMenuPageViewModel.pageShow);

// listen for when the Main-Menu page is hidden
$(document).on("hide", "#main-menu-page", utopiasoftware.ally.controller.mainMenuPageViewModel.pageHide);

// used to listen for 'menu-tabbar' tabbar tab changes on the "main menu" page
$(document).on("prechange", "#menu-tabbar", utopiasoftware.ally.controller.mainMenuPageViewModel.tabbarPreChange);


$(document).on("init", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageInit);

// listen for when the Main-Menu page is shown
$(document).on("show", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageShow);

// listen for when the Main-Menu page is hidden
$(document).on("hide", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageHide);

// listen for when the Main-Menu page is destroyed
$(document).on("destroy", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageDestroy);