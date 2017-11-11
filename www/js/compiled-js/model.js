/**
 * Created by UTOPIA SOFTWARE on 3/11/2017.
 */

/**
 * file contains the model data of the app.
 *
 * The 'utopiasoftware.heritage' namespace has being defined in the base js file.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the model namespace
utopiasoftware.heritage.model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the special device ready event triggered by the
     * intel xdk (i.e. app.Ready) to set the flag.
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false
};


// register the event listener for when all Hybrid plugins and document DOM are ready
document.addEventListener("app.Ready", utopiasoftware.heritage.controller.appReady, false) ;

// listen for the initialisation of the Onboarding page
$(document).on("init", "#onboarding-page", utopiasoftware.heritage.controller.onboardingPageViewModel.pageInit);

// listen for when the Onboarding page is shown
$(document).on("show", "#onboarding-page", utopiasoftware.heritage.controller.onboardingPageViewModel.pageShow);

// listen for when the Onboarding page is hidden
$(document).on("hide", "#onboarding-page", utopiasoftware.heritage.controller.onboardingPageViewModel.pageHide);

// used to listen for 'onboarding-carousel' carousel items/slide changes
$(document).on("postchange", "#onboarding-carousel", utopiasoftware.heritage.controller.onboardingPageViewModel.carouselPostChange);

// listen for the initialisation of the Main-Menu page
$(document).on("init", "#main-menu-page", utopiasoftware.heritage.controller.onboardingPageViewModel.pageInit);

// listen for when the Main-Menu page is shown
$(document).on("show", "#main-menu-page", utopiasoftware.heritage.controller.mainMenuPageViewModel.pageShow);

// listen for when the Main-Menu page is hidden
$(document).on("hide", "#main-menu-page", utopiasoftware.heritage.controller.mainMenuPageViewModel.pageHide);

// used to listen for 'menu-tabbar' tabbar tab changes
$(document).on("prechange", "#menu-tabbar", utopiasoftware.heritage.controller.mainMenuPageViewModel.tabbarPreChange);