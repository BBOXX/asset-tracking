const sinon = require('sinon');
const db = require('../server/db.js');
const express = require('express');
const app = express();
const request = require('request');
const server = require('../server/server');
const http = require('http');

describe('GET', function () {
    const responseData = [{
        'asset_id': "1",
        'data': [{
            "asset_id": "1",
            "asset_time": 2,
            "connection_type": "3g",
            "gps_time": 2,
            "lat": 3,
            "lng": 4,
            "power": 0,
            "signal": 1,
            "type": "auto push"
        }]
    }];


    let callback = {
        'getCallback': function (response) {
            console.log(response);
        }
    };

    const getEndPoint = "http://localhost:3030/",
        getAssetEndPoint = "http://localhost:3030/asset?asset_id=114fe7e30b946fe1",
        getWrongAssetEndPoint = "http://localhost:3030/asset?asset_id=114fe7e30b946fe6",
        getNullAssetEndPoint = "http://localhost:3030/asset?asset_id=",
        getAssetSignUpEndPoint = "http://localhost:3030/assetSignUp?asset_id=114fe7e30b946fe1",
        getNullAssetSignUpEndPoint = "http://localhost:3030/assetSignUp?asset_id=",
        getAssetsSignUpConnEndPoint = "http://localhost:3030/assetsSignUpConnection?connection_type=2g",
        getAssetsNullSignUpConnEndPoint = "http://localhost:3030/assetsSignUpConnection?connection_type=",
        getAssetSignUpConnEndPoint = "http://localhost:3030/assetSignUpConnection?connection_type=3g&asset_id=114fe7e30b946fe1",
        getAssetNullSignUpConnEndPoint = "http://localhost:3030/assetSignUpConnection?connection_type=&asset_id=114fe7e30b946fe1",
        getNullAssetSignUpConnEndPoint = "http://localhost:3030/assetSignUpConnection?connection_type=3g&asset_id=",
        getAssetsSignUpFilterEndPoint = "http://localhost:3030/assetsSignUpFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z",
        getAssetsNullSignUpFilterEndPoint = "http://localhost:3030/assetsSignUpFilter?startDate=&endDate=",
        getAssetsWrongSignUpFilterEndPoint = "http://localhost:3030/assetsSignUpFilter?startDate=2018-01-31T00:00:00Z&endDate=2018-01-01T00:00:00Z",
        getAssetSignUpFilterEndPoint = "http://localhost:3030/assetSignUpFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=114fe7e30b946fe1",
        getAssetNullSignUpFilterEndPoint = "http://localhost:3030/assetSignUpFilter?startDate=&endDate=&asset_id=114fe7e30b946fe1",
        getNullAssetSignUpFilterEndPoint = "http://localhost:3030/assetSignUpFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=",
        getAssetUpgradeEndPoint = "http://localhost:3030/assetUpgrade?asset_id=114fe7e30b946fe1",
        getNullAssetUpgradeEndPoint = "http://localhost:3030/assetUpgrade?asset_id=",
        getAssetsUpgradeConnEndPoint = "http://localhost:3030/assetsUpgradeConnection?connection_type=2g",
        getAssetsNullUpgradeConnEndPoint = "http://localhost:3030/assetsUpgradeConnection?connection_type=",
        getAssetUpgradeConnEndPoint = "http://localhost:3030/assetUpgradeConnection?connection_type=3g&asset_id=114fe7e30b946fe1",
        getAssetNullUpgradeConnEndPoint = "http://localhost:3030/assetUpgradeConnection?connection_type=&asset_id=114fe7e30b946fe1",
        getNullAssetUpgradeConnEndPoint = "http://localhost:3030/assetUpgradeConnection?connection_type=3g&asset_id=",
        getAssetsUpgradeFilterEndPoint = "http://localhost:3030/assetsUpgradeFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z",
        getAssetsNullUpgradeFilterEndPoint = "http://localhost:3030/assetsUpgradeFilter?startDate=&endDate=",
        getAssetUpgradeFilterEndPoint = "http://localhost:3030/assetUpgradeFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=114fe7e30b946fe1",
        getAssetNullUpgradeFilterEndPoint = "http://localhost:3030/assetUpgradeFilter?startDate=&endDate=&asset_id=114fe7e30b946fe1",
        getNullAssetUpgradeFilterEndPoint = "http://localhost:3030/assetUpgradeFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=",
        getAssetAutoPushEndPoint = "http://localhost:3030/assetAutoPush?asset_id=114fe7e30b946fe1",
        getNullAssetAutoPushEndPoint = "http://localhost:3030/assetAutoPush?asset_id=",
        getAssetsAutoPushConnEndPoint = "http://localhost:3030/assetsAutoPushConnection?connection_type=2g",
        getAssetsNullAutoPushConnEndPoint = "http://localhost:3030/assetsAutoPushConnection?connection_type=",
        getAssetAutoPushConnEndPoint = "http://localhost:3030/assetAutoPushConnection?connection_type=3g&asset_id=114fe7e30b946fe1",
        getAssetNullAutoPushConnEndPoint = "http://localhost:3030/assetAutoPushConnection?connection_type=&asset_id=114fe7e30b946fe1",
        getNullAssetAutoPushConnEndPoint = "http://localhost:3030/assetAutoPushConnection?connection_type=3g&asset_id=",
        getAssetsAutoPushFilterEndPoint = "http://localhost:3030/assetsAutoPushFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z",
        getAssetsNullAutoPushFilterEndPoint = "http://localhost:3030/assetsAutoPushFilter?startDate=&endDate=",
        getAssetAutoPushFilterEndPoint = "http://localhost:3030/assetAutoPushFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=114fe7e30b946fe1",
        getAssetNullAutoPushFilterEndPoint = "http://localhost:3030/assetAutoPushFilter?startDate=&endDate=&asset_id=114fe7e30b946fe1",
        getNullAssetAutoPushFilterEndPoint = "http://localhost:3030/assetAutoPushFilter?startDate=2018-01-01T00:00:00Z&endDate=2018-01-31T00:00:00Z&asset_id=",
        getAssetTotalDistanceEndPoint = "http://localhost:3030/totalDistance?asset_id=1dbe8d13a54816ff",
        getNullAssetTotalDistanecEndPoint = "http://localhost:3030/totalDistance?asset_id=",
        getDistanceEndPoint = "http://localhost:3030/distance";

    let originalTimeout, server1;
    beforeEach(function (done) {
        // server1 = http.createServer(app);
        // server1.listen(3030);
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
        done();
    });

    afterEach(function (done) {
        // server1.close();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        done();
    });
    it('GET /asset', function (done) {
        request.get(getAssetEndPoint, function (error, response) {
            spyOn(db, 'getAsset').and.callFake(function (id, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /asset', function (done) {
        request.get(getAssetEndPoint, function (error, response) {
            spyOn(db, 'getAsset').and.callFake(function (id, callback) {
                callback.getCallback([]);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /asset', function (done) {
        request.get(getWrongAssetEndPoint, function (error, response) {
            spyOn(db, 'getAsset').and.callFake(function (id, callback) {
                callback.getCallback([]);
            });
            expect(response.statusCode).toEqual(422);
            done();
        });
    }, 16000);

    it('GET /asset', function (done) {
        request.get(getNullAssetEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetSignUp', function (done) {
        request.get(getAssetSignUpEndPoint, function (error, response) {
            spyOn(db, 'getAssetSignUp').and.callFake(function (id, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetSignUp', function (done) {
        request.get(getNullAssetSignUpEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetsSignUpConnection', function (done) {
        request.get(getAssetsSignUpConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetsSignUpConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetsSignUpConnection', function (done) {
        request.get(getAssetsNullSignUpConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);


    it('GET /assetSignUpConnection', function (done) {
        request.get(getAssetSignUpConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetSignUpConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetSignUpConnection', function (done) {
        request.get(getAssetNullSignUpConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetSignUpConnection', function (done) {
        request.get(getNullAssetSignUpConnEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetsSignUpFilter', function (done) {
        request.get(getAssetsSignUpFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetsSignUpFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetsSignUpFilter', function (done) {
        request.get(getAssetsNullSignUpFilterEndPoint, function (error, response) {
            const date = null
            expect(date).toBeNull();
            done();
        });
    }, 11000);

    it('GET /assetsSignUpFilter', function (done) {
        request.get(getAssetsWrongSignUpFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetsSignUpFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(400);
            done();
        });
    }, 11000);

    it('GET /assetSignUpFilter', function (done) {
        request.get(getAssetSignUpFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetSignUpFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetSignUpFilter', function (done) {
        request.get(getAssetNullSignUpFilterEndPoint, function (error, response) {
            const date = '';
            expect(date).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetSignUpFilter', function (done) {
        request.get(getNullAssetSignUpFilterEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetUpgrade', function (done) {
        request.get(getAssetUpgradeEndPoint, function (error, response) {
            spyOn(db, 'getAssetUpgrade').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetUpgrade', function (done) {
        request.get(getNullAssetUpgradeEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);


    it('GET /assetsUpgradeConnection', function (done) {
        request.get(getAssetsUpgradeConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetsUpgradeConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetsUpgradeConnection', function (done) {
        request.get(getAssetsNullUpgradeConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetUpgradeConnection', function (done) {
        request.get(getAssetUpgradeConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetUpgradeConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetUpgradeConnection', function (done) {
        request.get(getAssetNullUpgradeConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetUpgradeConnection', function (done) {
        request.get(getNullAssetUpgradeConnEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetsUpgradeFilter', function (done) {
        request.get(getAssetsUpgradeFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetsUpgradeFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetsUpgradeFilter', function (done) {
        request.get(getAssetsNullUpgradeFilterEndPoint, function (error, response) {
            const date = '';
            expect(date).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetUpgradeFilter', function (done) {
        request.get(getAssetUpgradeFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetSignUpFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetUpgradeFilter', function (done) {
        request.get(getAssetNullUpgradeFilterEndPoint, function (error, response) {
            const date = '';
            expect(date).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetUpgradeFilter', function (done) {
        request.get(getNullAssetUpgradeFilterEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetAutoPush', function (done) {
        request.get(getAssetAutoPushEndPoint, function (error, response) {
            spyOn(db, 'getAssetAutoPush').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetAutoPush', function (done) {
        request.get(getNullAssetAutoPushEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);


    it('GET /assetsAutoPushConnection', function (done) {
        request.get(getAssetsAutoPushConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetsAutoPushConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetsAutoPushConnection', function (done) {
        request.get(getAssetsNullAutoPushConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetAutoPushConnection', function (done) {
        request.get(getAssetAutoPushConnEndPoint, function (error, response) {
            spyOn(db, 'getAssetAutoPushConnection').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetAutoPushConnection', function (done) {
        request.get(getAssetNullAutoPushConnEndPoint, function (error, response) {
            const connection = '';
            expect(connection).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetAutoPushConnection', function (done) {
        request.get(getNullAssetAutoPushConnEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetsAutoPushFilter', function (done) {
        request.get(getAssetsAutoPushFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetsAutoPushFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 16000);

    it('GET /assetsAutoPushFilter', function (done) {
        request.get(getAssetsNullAutoPushFilterEndPoint, function (error, response) {
            const date = '';
            expect(date).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetAutoPushFilter', function (done) {
        request.get(getAssetAutoPushFilterEndPoint, function (error, response) {
            spyOn(db, 'getAssetSignUpFilter').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetAutoPushFilter', function (done) {
        request.get(getAssetNullAutoPushFilterEndPoint, function (error, response) {
            const date = '';
            expect(date).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetAutoPushFilter', function (done) {
        request.get(getNullAssetAutoPushFilterEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('GET /assetTotalDistance', function (done) {
        request.get(getAssetTotalDistanceEndPoint, function (error, response) {
            spyOn(db, 'getAssetTotalDistance').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('GET /assetTotalDistance', function (done) {
        request.get(getNullAssetTotalDistanecEndPoint, function (error, response) {
            const id = '';
            expect(id).toEqual('');
            done();
        });
    }, 11000);

    it('POST /distance', function (done) {
        var requestBody = [
            {
                'lng': 34.59247666666667,
                'lat': -0.7440616666666667
            },
            {
                'lng': 34.67839166666667,
                'lat': -0.35666499999999995
            }
        ];
        request.post(getDistanceEndPoint, {json: true, body: {'req': requestBody}}, function (error, response) {
            spyOn(db, 'getDistance').and.callFake(function (connection, callback) {
                callback.getCallback(responseData);
            });
            expect(response.statusCode).toEqual(200);
            done();
        });
    }, 11000);

    it('POST /distance', function (done) {
        var requestBody = [
            {
                'lng': 634.59247666666667,
                'lat': -0.7440616666666667
            },
            {
                'lng': 34.67839166666667,
                'lat': -0.35666499999999995
            }
        ];
        request.post(getDistanceEndPoint, {json: true, body: {'req': requestBody}}, function (error, response) {
            const value = null;
            expect(value).toBeNull();
            done();
        });
    }, 11000);


    it('GET /', function (done) {
        request.get(getEndPoint, function (error, response) {
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('server working');
            done();
        });
    }, 9000);

})



