"use strict";

/**
 * Created by UTOPIA SOFTWARE on 3/11/2017.
 */

/**
 * file provides the "base" framework/utilities required to launch the app. E.g. file creates the base namespace which
 * the app is built on.
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 **/

var utopiasoftware = {
    ally: {

        /**
         * method is used to verify a user's phone number. it returns a Promise object. a resolved promise
         * means the phone number was verified; a rejected promise means phone number verification failed.
         *
         * @param phoneNumber
         * @returns {Promise}
         */
        validatePhoneNumber: function validatePhoneNumber(phoneNumber) {

            phoneNumber = "" + phoneNumber; // ensure phone number is seen as a string

            var phoneVerificationAnimate = null; // holds the animation object for the verification code timer

            var resolvePromise = null; // holds the resolve function of the main Promise object

            var rejectPromise = null; // holds the reject function of the main Promise object

            if (phoneNumber.startsWith("0")) {
                // the phone number starts with 0, replace it with international dialing code
                phoneNumber = phoneNumber.replace("0", "+234");
            }
            // show a loader message
            $('#hour-glass-loader-modal .modal-message').html("Verifying Phone Number...");
            $('#hour-glass-loader-modal').get(0).show(); // show loader

            // create the Promise object which will indicate if a phone was verified or not
            var phoneNumberVerifiedPromise = new Promise(function (resolve, reject) {
                resolvePromise = resolve;
                rejectPromise = reject;

                // sent message to twilio to verify provide phone number
                Promise.resolve($.ajax({
                    url: 'https://api.authy.com/protected/json/phones/verification/start',
                    type: "post",
                    contentType: "application/x-www-form-urlencoded",
                    beforeSend: function beforeSend(jqxhr) {
                        jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: true,
                    data: { api_key: 'j8B13Xqi57LtUgDhZe4xclf7Km56FPhH',
                        via: 'sms',
                        country_code: 234,
                        phone_number: phoneNumber } // data to submit to server
                })).then(function (verificationResponse) {
                    // get the verification response
                    if (verificationResponse.success !== true) {
                        // the generating verification code failed
                        throw verificationResponse; // throw an error containing the verification response
                    }

                    return verificationResponse; // return verification response
                }).then(function (verificationResponse) {
                    // compare the generated code with the user input

                    // set a timer to enable phone call verification if SMS should fail
                    window.setTimeout(function () {
                        // display the 'make a call' button
                        $('#phone-verification-code-check .phone-verification-make-call').css('display', "inline-block");
                    }, Math.round(verificationResponse.seconds_to_expire * 1000 / 4));

                    // instantiate the phoneVerificationAnimate object
                    phoneVerificationAnimate = anime({
                        targets: verificationResponse,
                        seconds_to_expire: [{ value: 0 }],
                        duration: verificationResponse.seconds_to_expire * 1000,
                        easing: 'linear',
                        round: true,
                        direction: 'normal',
                        autoplay: false,
                        update: function update() {
                            $('#phone-verification-code-check .phone-verification-timer').html(verificationResponse.seconds_to_expire);
                        },
                        complete: function complete() {
                            $('#phone-verification-code-check').get(0).hide();
                            $('#phone-verification-code-check').remove();
                            $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                            rejectPromise("phone verification code timed out");
                        }
                    });
                    phoneVerificationAnimate.play(); // start the animated timer
                    return ons.notification.prompt({ title: "Phone Number Verification",
                        id: 'phone-verification-code-check',
                        messageHTML: "<div><ons-icon icon=\"md-ally-icon-code-equal\" size=\"24px\"\n                    style=\"color: #30a401; float: left; width: 26px;\"></ons-icon>\n                    <span style=\"float: right; width: calc(100% - 26px);\">\n                    Please enter the verification code you received<br>\n                    Code Expires In: <span class=\"phone-verification-timer\"\n                    style=\"display: inline-block; font-weight: bold; margin-top: 1.5em;\">" + verificationResponse.seconds_to_expire + "</span> seconds<br>\n                    <span class=\"phone-verification-make-call\" style=\"display: none\">Haven't received your SMS?\n                    <ons-button modifier=\"quiet\" style=\"color: #30A401; min-height: 14px; line-height: 14px;\n                    padding: 0 1.2em; text-align: center; font-size: 14px;\"\n                    onclick=\"utopiasoftware.ally.makeACall('" + phoneNumber + "')\">make a call</ons-button></span></span></div>",
                        cancelable: false, placeholder: "CODE", inputType: "tel", defaultValue: "", autofocus: false,
                        submitOnEnter: true
                    });
                }).then(function (userInput) {
                    // get the verification code inputed by the user
                    phoneVerificationAnimate.pause(); // pause the animated timer
                    if (!userInput) {
                        // user input is null or undefined
                        throw "error";
                    }

                    // call the code used to verify the inputed user verification code
                    return new Promise(function (resolve3, reject3) {

                        // make the request to validate user verification code using background http request
                        cordovaHTTP.get("https://api.authy.com/protected/json/phones/verification/check", {
                            api_key: window.encodeURIComponent('j8B13Xqi57LtUgDhZe4xclf7Km56FPhH'),
                            country_code: window.encodeURIComponent('234'),
                            phone_number: window.encodeURIComponent(phoneNumber),
                            verification_code: window.encodeURIComponent(userInput.trim())
                        }, {}, resolve3, reject3);
                    });
                }).then(function (verificationResponse) {
                    // check if user verification code matched
                    verificationResponse = JSON.parse(verificationResponse.data);
                    if (verificationResponse.success !== true) {
                        // verification code failed
                        throw verificationResponse;
                    }

                    $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                    resolvePromise(); // phone verification code completed
                }).catch(function (err) {
                    phoneVerificationAnimate.pause(); // start the animated timer
                    $('#hour-glass-loader-modal').get(0).hide(); // hide loader

                    if (err && err.message) {
                        rejectPromise(err.message);
                    } else if (err && err.responseText) {
                        err = JSON.parse(err.responseText);
                        rejectPromise(err.message);
                    } else if (err && err.error) {
                        err = JSON.parse(err.error);
                        rejectPromise(err.message);
                    } else {
                        rejectPromise("phone number verification failed");
                    }
                });
            });

            return phoneNumberVerifiedPromise;
        },

        /**
         * this is a helper method which initiates phone number verification
         * via twilio phone call
         */
        makeACall: function makeACall(phoneNumber) {
            Promise.resolve($.ajax({
                url: 'https://api.authy.com/protected/json/phones/verification/start',
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                beforeSend: function beforeSend(jqxhr) {
                    jqxhr.setRequestHeader("X-ALLY-APP", "mobile");
                },
                dataType: "json",
                timeout: 240000, // wait for 4 minutes before timeout of request
                processData: true,
                data: { api_key: 'j8B13Xqi57LtUgDhZe4xclf7Km56FPhH',
                    via: 'call',
                    country_code: 234,
                    phone_number: phoneNumber } // data to submit to server
            }));
        },


        /**
         * method returns a Promise which saves the app details of the current user (in encrypted persistent storage) OR
         * the Promise rejects with an error object
         *
         * @param userDetails {Object} contains the user details to be saved in encrypted storage
         *
         * @returns {Promise}
         */
        saveUserAppDetails: function saveUserAppDetails(userDetails) {

            return new Promise(function (resolve, reject) {

                // check if a timestamp has been appended to the user details
                if (!userDetails._lastUpdatedDate) {
                    // no timestamp, so attach one
                    userDetails._lastUpdatedDate = Date.now(); // attach timestamp
                }

                // write the provided user details to encrypted storage
                Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(userDetails) })).then(function (instanceId) {

                    return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-user-details", "instanceID": instanceId }));
                }).then(function () {
                    resolve(userDetails); // return the provided userDetails parameter back to the caller and resolve the Promise
                }).catch(function (err) {
                    reject(err); // reject the Promise with the provided error
                });
            });
        },

        /**
         * method returns a Promise which contains the cached app details of the current user OR
         * the Promise rejects with an error object
         *
         * @returns {Promise}
         */
        loadUserCachedAppDetails: function loadUserCachedAppDetails() {

            return new Promise(function (resolve, reject) {

                // read the cached data from encrypted storage
                Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-user-details' })).then(function (instanceId) {

                    return Promise.resolve(intel.security.secureData.getData(instanceId));
                }).then(function (userDetails) {
                    resolve(JSON.parse(userDetails)); // return the cached app details and resolve the Promise
                }).catch(function (err) {
                    reject(err); // reject the Promise with the provided error
                });
            });
        },

        /**
         * method is used to sort the collection of Nigerian Banks returned by MoneyWave.
         * Banks objects are sorted in ascending order of bank name.
         */
        banksData: function banksData() {
            // return the Promise object
            return new Promise(function (resolve, reject) {
                // retrieve the list of banks
                Promise.resolve($.ajax({
                    url: "banks.json",
                    type: "get",
                    dataType: "json",
                    timeout: 240000 // wait for 4 minutes before timeout of request

                })).then(function (banksData) {
                    // get the banks object
                    var banksArray = []; // holds the banks array
                    // convert each property and value of the banks object to an object
                    // and store each object in a 'banks array'
                    for (var prop in banksData) {
                        // create the bank object
                        var bankObject = {};
                        bankObject["code"] = prop;
                        bankObject["name"] = banksData[prop];
                        // add bank object to banks array
                        banksArray.push(bankObject);
                    }

                    return banksArray; // return the banks array
                }).then(function (bankArrayData) {
                    // receive the bank array
                    resolve(bankArrayData); // resolve the promise with the bank array
                }).catch();
            });
        },

        /**
         * object holds the methods used to operate the cached chart data for the Dashboard page
         */
        dashboardCharts: {

            /**
             * method is used to save/cache the data for the wallet transfers-in chart
             *
             * @param chartDataArray {Array} the chart data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveWalletTransferInData: function saveWalletTransferInData(chartDataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!chartDataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        chartDataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(chartDataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-chart-transfer-in", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(chartDataArray); // return the provided chartDataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached wallet transfer-in data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadWalletTransferInData: function loadWalletTransferInData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-chart-transfer-in' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached chart data from the deive
             *
             * @returns {Promise}
             */
            deleteWalletTransferInData: function deleteWalletTransferInData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-chart-transfer-in' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            },

            /**
             * method is used to save/cache the data for the wallet transfers-out chart
             *
             * @param chartDataArray {Array} the chart data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveWalletTransferOutData: function saveWalletTransferOutData(chartDataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!chartDataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        chartDataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(chartDataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-chart-transfer-out", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(chartDataArray); // return the provided chartDataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached wallet transfer-out data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadWalletTransferOutData: function loadWalletTransferOutData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-chart-transfer-out' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); //resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached chart data from the device
             *
             * @returns {Promise}
             */
            deleteWalletTransferOutData: function deleteWalletTransferOutData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-chart-transfer-out' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            },

            /**
             * method is used to save/cache the data for the wallet payments-in chart
             *
             * @param chartDataArray {Array} the chart data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            savePaymentInData: function savePaymentInData(chartDataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!chartDataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        chartDataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(chartDataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-chart-payment-in", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(chartDataArray); // return the provided chartDataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached wallet payment-in data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadPaymentInData: function loadPaymentInData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-chart-payment-in' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached chart data from the device
             *
             * @returns {Promise}
             */
            deletePaymentInData: function deletePaymentInData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-chart-payment-in' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            },

            /**
             * method is used to save/cache the data for the wallet payments-out chart
             *
             * @param chartDataArray {Array} the chart data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            savePaymentOutData: function savePaymentOutData(chartDataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!chartDataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        chartDataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(chartDataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-chart-payment-out", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(chartDataArray); // return the provided chartDataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached wallet payment-out data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadPaymentOutData: function loadPaymentOutData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-chart-payment-out' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached chart data from the device
             *
             * @returns {Promise}
             */
            deletePaymentOutData: function deletePaymentOutData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-chart-payment-out' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            },

            /**
             * method is used to save/cache the data for the expense tracker chart
             *
             * @param chartDataArray {Array} the chart data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveExpenseTrackerData: function saveExpenseTrackerData(chartDataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!chartDataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        chartDataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(chartDataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-dashboard-chart-expense-tracker", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(chartDataArray); // return the provided chartDataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached expense tracker chart data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadExpenseTrackerData: function loadExpenseTrackerData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-dashboard-chart-expense-tracker' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached expense tracker chart data from the device
             *
             * @returns {Promise}
             */
            deleteExpenseTrackerData: function deleteExpenseTrackerData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-dashboard-chart-expense-tracker' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            }
        },

        /**
         * object holds the methods used to operate the cached chart data for the Transaction History page
         */
        transactionHistoryCharts: {

            /**
             * method is used to save/cache the data for the transaction history grid
             *
             * @param gridDataArray {Array} the grid data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveTransactionHistoryData: function saveTransactionHistoryData(dataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!dataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        dataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(dataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-transaction-history", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(dataArray); // return the provided dataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached transaction history data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadTransactionHistoryData: function loadTransactionHistoryData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-transaction-history' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (dataArray) {
                        resolve(JSON.parse(dataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve([]); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached transaction data from the device
             *
             * @returns {Promise}
             */
            deleteTransactionHistoryData: function deleteTransactionHistoryData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-transaction-history' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            }
        },

        /**
         * object holds the methods used to operate the cached expense grid data for the Expense Tracker page
         */
        expenseTrackerGrid: {

            /**
             * method is used to save/cache the data for the expense tracker
             *
             * @param dataArray {Array} the grid data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveExpenseTrackerData: function saveExpenseTrackerData(dataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!dataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        dataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(dataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-grid-expense-tracker", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(dataArray); // return the provided dataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached expense tracker data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadExpenseTrackerData: function loadExpenseTrackerData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-grid-expense-tracker' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached expense tracker data from the device
             *
             * @returns {Promise}
             */
            deleteExpenseTrackerData: function deleteExpenseTrackerData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-grid-expense-tracker' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            }
        },

        /**
         * object holds the methods used to operate the cached expense chart data for the Expense Tracker page
         */
        expenseTrackerChart: {

            /**
             * method is used to save/cache the data for the expense tracker
             *
             * @param dataArray {Array} the grid data to be saved
             *
             * @return {Promise} returns a promise that resolves to the data being saved
             */
            saveExpenseTrackerData: function saveExpenseTrackerData(dataArray) {

                return new Promise(function (resolve, reject) {

                    // check if a timestamp has been appended to the data being saved
                    if (!dataArray._lastUpdatedDate) {
                        // no timestamp, so attach one
                        dataArray._lastUpdatedDate = Date.now(); // attach timestamp
                    }

                    // write the provided chart data to encrypted storage
                    Promise.resolve(intel.security.secureData.createFromData({ "data": JSON.stringify(dataArray) })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureStorage.write({ "id": "ally-chart-expense-tracker", "instanceID": instanceId }));
                    }).then(function () {
                        resolve(dataArray); // return the provided dataArray parameter back to the caller and resolve the Promise
                    }).catch(function (err) {
                        reject(err); // reject the Promise with the provided error
                    });
                });
            },

            /**
             * method returns a Promise which contains the cached expense tracker data OR
             * the Promise rejects with an error object
             *
             * @returns {Promise}
             */
            loadExpenseTrackerData: function loadExpenseTrackerData() {

                return new Promise(function (resolve, reject) {

                    // read the cached data from encrypted storage
                    Promise.resolve(intel.security.secureStorage.read({ 'id': 'ally-chart-expense-tracker' })).then(function (instanceId) {

                        return Promise.resolve(intel.security.secureData.getData(instanceId));
                    }).then(function (chartDataArray) {
                        resolve(JSON.parse(chartDataArray)); // return the cached app chart data and resolve the Promise
                    }).catch(function (err) {
                        resolve({}); // resolve the Promise with an empty object
                    });
                });
            },

            /**
             * method returns a Promise which deletes the cached expense tracker data from the device
             *
             * @returns {Promise}
             */
            deleteExpenseTrackerData: function deleteExpenseTrackerData() {

                return new Promise(function (resolve, reject) {
                    // delete the user app details from secure storage if it exists
                    Promise.resolve(intel.security.secureStorage.delete({ 'id': 'ally-chart-expense-tracker' })).then(function () {
                        resolve();
                    }, function () {
                        resolve();
                    }); // ALWAYS resolve the promise
                });
            }
        }
    }
};

//# sourceMappingURL=base-compiled.js.map