// // const rethinkdb = require('rethinkdb-mock');
// //
// // const mock = require('mock-require');
// //
// // mock('rethinkdbdash', rethinkdb)
// //
// // const r = rethinkdb({
// //     name: 'Tracking'
// // })
//
// const jasmine = require('jasmine');
//
// const rethinkmock = require('rethink-mock');
// const db = require('../server/db.js');
//
//
// describe('single asset functions', () => {
//     let r;
//     beforeEach(() => {
//         r = rethinkmock.mock();
//         // r.init({
//         //     autopush: [{
//         //         'asset_id': "1",
//         //         'data': [{
//         //             "asset_id": "1",
//         //             "asset_time": 2,
//         //             "connection_type": "3g",
//         //             "gps_time": 2,
//         //             "lat": 3,
//         //             "lng": 4,
//         //             "power": 0,
//         //             "signal": 1,
//         //             "type": "auto push"
//         //         }]
//         //     }],
//         //     lastConnected: [{
//         //         'asset_id': "2",
//         //         'data': [{
//         //             "asset_id": "2",
//         //             "asset_time": 2,
//         //             "connection_type": "3g",
//         //             "gps_time": 2,
//         //             "lat": 3,
//         //             "lng": 4,
//         //             "power": 0,
//         //             "signal": 1,
//         //             "type": "auto push"
//         //         }]
//         //     }],
//         //     signup: [{
//         //         'asset_id': "3",
//         //         'data': [{
//         //             "asset_id": "1",
//         //             "asset_time": 2,
//         //             "connection_type": "3g",
//         //             "gps_time": 2,
//         //             "lat": 3,
//         //             "lng": 4,
//         //             "power": 0,
//         //             "signal": 1,
//         //             "type": "sign up"
//         //         }]
//         //     }],
//         //     upgrade: [{
//         //         'asset_id': "4",
//         //         'data': [{
//         //             "asset_id": "1",
//         //             "asset_time": 2,
//         //             "connection_type": "3g",
//         //             "gps_time": 2,
//         //             "lat": 3,
//         //             "lng": 4,
//         //             "power": 0,
//         //             "signal": 1,
//         //             "type": "upgrade"
//         //         }]
//         //     }]
//         // });
//     });
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
//
//     describe('get historic data for single asset', function() {
//         var callback,
//             records,
//             originalTimeout;
//
//         beforeEach(function(done){
//             originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
//             jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//             callback = jasmine.createSpy('callback');
//             setTimeout(function() {
//                 done();
//             }, 9000);
//             this.records = [{
//                         'asset_id': "1",
//                         'data': [{
//                             "asset_id": "1",
//                             "asset_time": 2,
//                             "connection_type": "3g",
//                             "gps_time": 2,
//                             "lat": 3,
//                             "lng": 4,
//                             "power": 0,
//                             "signal": 1,
//                             "type": "auto push"
//                         }]
//                     }];
//             spyOn(db, 'getAsset').and.callFake(function () {
//                 callback(records);
//             });
//             db.getAsset('1', callback(records));
//         });
//         //
//         //
//         // it('call get Asset', function() {
//         //     expect(db.getAsset).toHaveBeenCalled();
//         // })
//
//         // it('should get data from db', function(done) {
//         //     db.getAsset('1', (err, data) => {
//         //         expect(data).toEqual(this.data);
//         //         done();
//         //     })
//         // })
//         //
//         // it('should throw an error when data cannot be recieved', function(done) {
//         //     db.getAsset('1', (err, data) => {
//         //         expect(data).toBeUndefined();
//         //         done();
//         //     })
//         // })
//
//         it('call callback', function() {
//             expect(callback).toHaveBeenCalled();
//         })
//
//         it('call callback with records', function() {
//             expect(callback).toHaveBeenCalledWith(records);
//         })
//
//         it('match key value pair in data', function() {
//             this.records.forEach(function(item){
//                 expect(item).toEqual(jasmine.objectContaining({
//                     'data': [{
//                         "asset_id": "1",
//                         "asset_time": 2,
//                         "connection_type": "3g",
//                         "gps_time": 2,
//                         "lat": 3,
//                         "lng": 4,
//                         "power": 0,
//                         "signal": 1,
//                         "type": "auto push"
//                     }]
//                 }))
//             });
//         })
//
//         it('call callback with nothing', function() {
//             this.records = null;
//             expect(callback).toHaveBeenCalledWith(records);
//         })
//
//         it('get Asset throw error', function(){
//             db.getAsset.and.stub();
//             db.getAsset.and.throwError("quux");
//
//             expect(db.getAsset).toThrowError('quux');
//         })
//
//         afterEach(function() {
//             jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
//         });
//
//     })
// })