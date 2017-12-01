"use strict";

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

  ally_app_share_link: "",

  /**
   * holds details about the currently logged in user
   */
  appUserDetails: null
};

// register the event listener for when all Hybrid plugins and document DOM are ready
document.addEventListener("app.Ready", utopiasoftware.ally.controller.appReady, false);

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

// listen for the initialisation of the Dashboard page
$(document).on("init", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageInit);

// listen for when the Dashboard page is shown
$(document).on("show", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageShow);

// listen for when the Dashboard page is hidden
$(document).on("hide", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageHide);

// listen for when the Dashboard page is destroyed
$(document).on("destroy", "#dashboard-page", utopiasoftware.ally.controller.dashboardPageViewModel.pageDestroy);

// listen for the initialisation of the Account page
$(document).on("init", "#account-page", utopiasoftware.ally.controller.accountPageViewModel.pageInit);

// listen for when the Account page is shown
$(document).on("show", "#account-page", utopiasoftware.ally.controller.accountPageViewModel.pageShow);

// listen for when the Account page is hidden
$(document).on("hide", "#account-page", utopiasoftware.ally.controller.accountPageViewModel.pageHide);

// listen for when the Account page is destroyed
$(document).on("destroy", "#account-page", utopiasoftware.ally.controller.accountPageViewModel.pageDestroy);

// listen for the initialisation of the Wallet page
$(document).on("init", "#wallet-page", utopiasoftware.ally.controller.walletPageViewModel.pageInit);

// listen for when the Wallet page is shown
$(document).on("show", "#wallet-page", utopiasoftware.ally.controller.walletPageViewModel.pageShow);

// listen for when the Wallet page is hidden
$(document).on("hide", "#wallet-page", utopiasoftware.ally.controller.walletPageViewModel.pageHide);

// listen for when the Wallet page is destroyed
$(document).on("destroy", "#wallet-page", utopiasoftware.ally.controller.walletPageViewModel.pageDestroy);

// listen for the initialisation of the Fund Wallet page
$(document).on("init", "#fund-wallet-page", utopiasoftware.ally.controller.fundWalletPageViewModel.pageInit);

// listen for when the Fund Wallet page is shown
$(document).on("show", "#fund-wallet-page", utopiasoftware.ally.controller.fundWalletPageViewModel.pageShow);

// listen for when the Fund Wallet page is hidden
$(document).on("hide", "#fund-wallet-page", utopiasoftware.ally.controller.fundWalletPageViewModel.pageHide);

// listen for when the Fund Wallet page is destroyed
$(document).on("destroy", "#fund-wallet-page", utopiasoftware.ally.controller.fundWalletPageViewModel.pageDestroy);

// listen for the initialisation of the Add Card page
$(document).on("init", "#add-card-page", utopiasoftware.ally.controller.addCardPageViewModel.pageInit);

// listen for when the Add Card page is shown
$(document).on("show", "#add-card-page", utopiasoftware.ally.controller.addCardPageViewModel.pageShow);

// listen for when the Add Card page is hidden
$(document).on("hide", "#add-card-page", utopiasoftware.ally.controller.addCardPageViewModel.pageHide);

// listen for when the Add Card page is destroyed
$(document).on("destroy", "#add-card-page", utopiasoftware.ally.controller.addCardPageViewModel.pageDestroy);

// listen for the initialisation of the Wallet Transfer page
$(document).on("init", "#wallet-transfer-page", utopiasoftware.ally.controller.walletTransferPageViewModel.pageInit);

// listen for when the Wallet Transfer page is shown
$(document).on("show", "#wallet-transfer-page", utopiasoftware.ally.controller.walletTransferPageViewModel.pageShow);

// listen for when the Wallet Transfer page is hidden
$(document).on("hide", "#wallet-transfer-page", utopiasoftware.ally.controller.walletTransferPageViewModel.pageHide);

// listen for when the Wallet Transfer page is destroyed
$(document).on("destroy", "#wallet-transfer-page", utopiasoftware.ally.controller.walletTransferPageViewModel.pageDestroy);

//# sourceMappingURL=model-compiled.js.map