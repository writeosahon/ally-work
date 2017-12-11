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

            var smsWatcherTimer = null; // holds the timer used to stop the sms watcher

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
                rejectPromise = reject;
                var randomNumber = ""; //holds the random number to be sent in the sms

                // start listening to the user's sms inbox
                new Promise(function (resolve2, reject2) {
                    SMS.startWatch(resolve2, reject2);
                }).then(function () {
                    // intercept any incoming sms
                    return new Promise(function (res, rej) {
                        SMS.enableIntercept(true, res, rej);
                    });
                }).then(function () {
                    // sms watch of the user's inbox has been started
                    // add listener for new arriving sms
                    document.addEventListener('onSMSArrive', function (smsEvent) {
                        var sms = smsEvent.data;
                        if (sms.address == phoneNumber && sms.body == "ALLY " + randomNumber) {
                            clearTimeout(smsWatcherTimer); // stop the set timer
                            SMS.stopWatch(function () {}, function () {}); // stop sms watch
                            SMS.enableIntercept(false, function () {}, function () {}); // stop sms intercept
                            document.removeEventListener('onSMSArrive'); // remove sms arrival listener
                            $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                            resolve(); // resolve promise
                        }
                    });

                    // return a Promise object which sends sms to the phoneNumber parameter
                    return new Promise(function (resolve3, reject3) {

                        var randomGen = new Random(Random.engines.nativeMath); // random number generator

                        for (var i = 0; i < 6; i++) {
                            randomNumber += "" + randomGen.integer(0, 9);
                        }
                        SMS.sendSMS(phoneNumber, "ALLY " + randomNumber, resolve3, function () {
                            reject3("SMS sending failed. Please ensure you have sufficient airtime on the specified phone number"); // flag an error that sms verification code could not be sent
                        });
                    });
                }).then(function () {
                    smsWatcherTimer = setTimeout(function () {
                        SMS.stopWatch(function () {}, function () {});
                        SMS.enableIntercept(false, function () {}, function () {}); // stop sms intercept
                        document.removeEventListener('onSMSArrive');
                        $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                        rejectPromise("phone number verification failed"); // reject the promise i.e. verification failed
                    }, 31000);
                }).catch(function (error) {
                    try {
                        clearTimeout(smsWatcherTimer);
                    } catch (err) {}
                    SMS.stopWatch(function () {}, function () {});
                    SMS.enableIntercept(false, function () {}, function () {}); // stop sms intercept
                    document.removeEventListener('onSMSArrive');
                    $('#hour-glass-loader-modal').get(0).hide(); // hide loader
                    if (error && typeof error == "string") {
                        reject(error);
                    }
                    reject("phone number verification failed");
                });
            });

            return phoneNumberVerifiedPromise;
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
                        reject(err); // reject the Promise with the provided error
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
                        reject(err); // reject the Promise with the provided error
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
            }

        }
    }
};

//# sourceMappingURL=base-compiled.js.map