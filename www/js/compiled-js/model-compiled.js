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

// define the _model namespace
utopiasoftware.ally._model = {

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
    ally_base_url: "https://myallyapp.com", // "https://myallyapp.com/test",


    /**
     * property holds the google app share/dynamic link for this app
     */
    ally_app_share_link: "https://dg86m.app.goo.gl/mVFa",

    /**
     * holds details about the currently logged in user
     */
    appUserDetails: null,

    /**
     * holds the cached app secure pin for the logged in user
     */
    appSecurePin: null
};

// define the proxy object for the _model namespace object
utopiasoftware.ally.model = new Proxy(utopiasoftware.ally._model, {
    set: function set(target, prop, value) {
        target[prop] = value; // update the target object property with the specified value

        if (prop == 'appUserDetails') {
            // use this block to update the name of the logged in user on the side menu

            window.plugins.OneSignal.sendTags(value); // set the tags for the push notification service

            // update the app side menu 'name' segment with the provided value
            $('#side-menu #side-menu-username').html(value.firstname + " " + value.lastname);
            // update the 'name' display on the wallet balance page
            $('#wallet-page #wallet-owner-name').html(value.firstname + " " + value.lastname);

            // update the wallet balance on every page it is being displayed
            $('#dashboard-page #dashboard-ally-wallet').html("&#8358;" + kendo.toString(kendo.parseFloat(value.balance), "n2"));
            $('#wallet-page #wallet-balance').html(kendo.toString(kendo.parseFloat(value.balance), "n2"));
            $('#account-page #account-wallet-balance').html(kendo.toString(kendo.parseFloat(value.balance), "n2"));
        }

        return true; // return true to signal that proxy updating was successful
    }
});

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

// listen for the initialisation of the Disburse Wallet page
$(document).on("init", "#disburse-wallet-page", utopiasoftware.ally.controller.disburseWalletPageViewModel.pageInit);

// listen for when the Disburse Wallet page is shown
$(document).on("show", "#disburse-wallet-page", utopiasoftware.ally.controller.disburseWalletPageViewModel.pageShow);

// listen for when the Disburse Wallet page is hidden
$(document).on("hide", "#disburse-wallet-page", utopiasoftware.ally.controller.disburseWalletPageViewModel.pageHide);

// listen for when the Disburse Wallet page is destroyed
$(document).on("destroy", "#disburse-wallet-page", utopiasoftware.ally.controller.disburseWalletPageViewModel.pageDestroy);

// listen for the initialisation of the Payments page
$(document).on("init", "#payments-page", utopiasoftware.ally.controller.paymentsPageViewModel.pageInit);

// listen for when the Payments page is shown
$(document).on("show", "#payments-page", utopiasoftware.ally.controller.paymentsPageViewModel.pageShow);

// listen for when the Payments page is hidden
$(document).on("hide", "#payments-page", utopiasoftware.ally.controller.paymentsPageViewModel.pageHide);

// listen for when the Payments page is destroyed
$(document).on("destroy", "#payments-page", utopiasoftware.ally.controller.paymentsPageViewModel.pageDestroy);

// listen for the initialisation of the Payments-Ally-Scan page
$(document).on("init", "#payments-ally-scan-page", utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.pageInit);

// listen for when the Payments-Ally-Scan page is shown
$(document).on("show", "#payments-ally-scan-page", utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.pageShow);

// listen for when the Payments-Ally-Scan page is hidden
$(document).on("hide", "#payments-ally-scan-page", utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.pageHide);

// listen for when the Payments-Ally-Scan page is destroyed
$(document).on("destroy", "#payments-ally-scan-page", utopiasoftware.ally.controller.paymentsAllyScanPageViewModel.pageDestroy);

// listen for the initialisation of the Payments-Ally-Direct page
$(document).on("init", "#payments-ally-direct-page", utopiasoftware.ally.controller.paymentsAllyDirectPageViewModel.pageInit);

// listen for when the Payments-Ally-Direct page is shown
$(document).on("show", "#payments-ally-direct-page", utopiasoftware.ally.controller.paymentsAllyDirectPageViewModel.pageShow);

// listen for when the Payments-Ally-Direct page is hidden
$(document).on("hide", "#payments-ally-direct-page", utopiasoftware.ally.controller.paymentsAllyDirectPageViewModel.pageHide);

// listen for when the Payments-Ally-Direct page is destroyed
$(document).on("destroy", "#payments-ally-direct-page", utopiasoftware.ally.controller.paymentsAllyDirectPageViewModel.pageDestroy);

// listen for the initialisation of the Change-Pin page
$(document).on("init", "#change-pin-page", utopiasoftware.ally.controller.changePinPageViewModel.pageInit);

// listen for when the Change-Pin page is shown
$(document).on("show", "#change-pin-page", utopiasoftware.ally.controller.changePinPageViewModel.pageShow);

// listen for when the Change-Pin page is hidden
$(document).on("hide", "#change-pin-page", utopiasoftware.ally.controller.changePinPageViewModel.pageHide);

// listen for when the Change-Pin page is destroyed
$(document).on("destroy", "#change-pin-page", utopiasoftware.ally.controller.changePinPageViewModel.pageDestroy);

// listen for the initialisation of the Transaction History page
$(document).on("init", "#transaction-history-page", utopiasoftware.ally.controller.transactionHistoryPageViewModel.pageInit);

// listen for when the Transaction History page is shown
$(document).on("show", "#transaction-history-page", utopiasoftware.ally.controller.transactionHistoryPageViewModel.pageShow);

// listen for when the Transaction History page is hidden
$(document).on("hide", "#transaction-history-page", utopiasoftware.ally.controller.transactionHistoryPageViewModel.pageHide);

// listen for when the Transaction History page is destroyed
$(document).on("destroy", "#transaction-history-page", utopiasoftware.ally.controller.transactionHistoryPageViewModel.pageDestroy);

// listen for the initialisation of the Add-Card-Wallet-Transfer page
$(document).on("init", "#add-card-wallet-transfer-page", utopiasoftware.ally.controller.addCardWalletTransferPageViewModel.pageInit);

// listen for when the Add-Card-Wallet-Transfer page is shown
$(document).on("show", "#add-card-wallet-transfer-page", utopiasoftware.ally.controller.addCardWalletTransferPageViewModel.pageShow);

// listen for when the Add-Card-Wallet-Transfer page is hidden
$(document).on("hide", "#add-card-wallet-transfer-page", utopiasoftware.ally.controller.addCardWalletTransferPageViewModel.pageHide);

// listen for when the Add-Card-Wallet-Transfer page is destroyed
$(document).on("destroy", "#add-card-wallet-transfer-page", utopiasoftware.ally.controller.addCardWalletTransferPageViewModel.pageDestroy);

// listen for the initialisation of the Add-Card-Merchant-Payment page
$(document).on("init", "#add-card-merchant-payment-page", utopiasoftware.ally.controller.addCardMerchantPaymentPageViewModel.pageInit);

// listen for when the Add-Card-Merchant-Payment page is shown
$(document).on("show", "#add-card-merchant-payment-page", utopiasoftware.ally.controller.addCardMerchantPaymentPageViewModel.pageShow);

// listen for when the Add-Card-Merchant-Payment page is hidden
$(document).on("hide", "#add-card-merchant-payment-page", utopiasoftware.ally.controller.addCardMerchantPaymentPageViewModel.pageHide);

// listen for when the Add-Card-Merchant-Payment page is destroyed
$(document).on("destroy", "#add-card-merchant-payment-page", utopiasoftware.ally.controller.addCardMerchantPaymentPageViewModel.pageDestroy);

// listen for the initialisation of the Expense-Tracker page
$(document).on("init", "#expense-tracker-page", utopiasoftware.ally.controller.expenseTrackerPageViewModel.pageInit);

// listen for when the Expense-Tracker page is shown
$(document).on("show", "#expense-tracker-page", utopiasoftware.ally.controller.expenseTrackerPageViewModel.pageShow);

// listen for when the Expense-Tracker page is hidden
$(document).on("hide", "#expense-tracker-page", utopiasoftware.ally.controller.expenseTrackerPageViewModel.pageHide);

// listen for when the Expense-Tracker page is destroyed
$(document).on("destroy", "#expense-tracker-page", utopiasoftware.ally.controller.expenseTrackerPageViewModel.pageDestroy);

// listen for the initialisation of the Add Expense page
$(document).on("init", "#add-expense-page", utopiasoftware.ally.controller.addExpensePageViewModel.pageInit);

// listen for when the Add Expense page is shown
$(document).on("show", "#add-expense-page", utopiasoftware.ally.controller.addExpensePageViewModel.pageShow);

// listen for when the Add Expense page is hidden
$(document).on("hide", "#add-expense-page", utopiasoftware.ally.controller.addExpensePageViewModel.pageHide);

// listen for when the Add Expense page is destroyed
$(document).on("destroy", "#add-expense-page", utopiasoftware.ally.controller.addExpensePageViewModel.pageDestroy);

//# sourceMappingURL=model-compiled.js.map