db = require('./db');
validation = require('./validation');
moment = require('moment');
data = {};
port = process.env.NODE_PORT;

validConnections = ['2g', '3g', '4g', 'wifi', 'offline']
function run() {
    http = require('http');
    path = require('path');
    fs=require('fs');
    express = require('express');
    jwt = require('jsonwebtoken');
    bodyParser = require('body-parser');

    app = express();
    app.use(express.static(__dirname));

    server = http.createServer(app);
    io = require('socket.io')(server);

    if(process.env.NODE_ENV !== 'test') {
        app.set('port', port || 10000);
    }

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(function (req, res, next) {

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Content-Type", "application/json");

        next();
    });

    server.listen(app.get('port'));

    // server.on('close', function() {
    //     console.log('closed');
    // })


    return server;
}

// server creation


run();

// api calls

app.get('/', function (req, res) {
    res.send('server working');
    // res.sendFile(path.join(__dirname,'../client/dist/index.html'))
});

app.get('/asset?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
            db.getAsset(
                req.query.asset_id,
                function (responseData) {
                    if (responseData !== null && responseData !== undefined) {
                        res.status(200).json(responseData);
                    }
                    else {
                        res.status(400).json([{
                            'statusText': 'No data found'
                        }]);
                    }
                });
        });
    }
});

app.get('/assetSignUp?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
            db.getAssetSignUp(
                req.query.asset_id,
                function (responseData) {
                    if (responseData !== null && responseData !== undefined) {
                        res.status(200).json(responseData);
                    }
                    else {
                        res.status(400).json([{
                            'statusText': 'No data found'
                        }]);
                    }
                });
        });
    }
});

app.get('/assetsSignUpConnection?', function(req, res){
    const connection = exports.checkValidConnection(req.query.connection_type, res);
    if(connection !== null) {
        db.getAssetsSignUpConnection(
            req.query.connection_type,
            function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
    }
});

app.get('/assetSignUpConnection?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const connection = exports.checkValidConnection(req.query.connection_type, res);
        if (connection !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetSignUpConnection(
                    req.query.asset_id,
                    req.query.connection_type,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            });
        }
    }
});

app.get('/assetsSignUpFilter?', function(req, res){
    const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
    if(date !== null) {
        db.getAssetsSignUpFilter(
            req.query.startDate,
            req.query.endDate,
            function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
    }
});

app.get('/assetSignUpFilter?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
        if (date !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetSignUpFilter(
                    req.query.startDate,
                    req.query.endDate,
                    req.query.asset_id,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            });
        }
    }
});


app.get('/assetUpgrade?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
            db.getAssetUpgrade(
                req.query.asset_id,
                function (responseData) {
                    if (responseData !== null && responseData !== undefined) {
                        res.status(200).json(responseData);
                    }
                    else {
                        res.status(400).json([{
                            'statusText': 'No data found'
                        }]);
                    }
                });
        });
    }
});

app.get('/assetsUpgradeConnection?', function(req, res){
    const connection = exports.checkValidConnection(req.query.connection_type, res);
    if(connection !== null) {
        db.getAssetsUpgradeConnection(
            req.query.connection_type,
            function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
    }
});

app.get('/assetUpgradeConnection?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const connection = exports.checkValidConnection(req.query.connection_type, res);
        if (connection !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetUpgradeConnection(
                    req.query.connection_type,
                    req.query.asset_id,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            });
        }
    }
});

app.get('/assetsUpgradeFilter?', function(req, res){
    const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
    if(date !== null) {
        db.getAssetsUpgradeFilter(
            req.query.startDate,
            req.query.endDate,
            function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
    }
});

app.get('/assetUpgradeFilter?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
        if (date !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetUpgradeFilter(
                    req.query.startDate,
                    req.query.endDate,
                    req.query.asset_id,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            });
        }
    }
});

app.get('/assetAutoPush?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
            db.getAssetAutoPush(req.query.asset_id, function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
        });
    }
});

app.get('/assetsAutoPushConnection?', function(req, res){
    const connection = exports.checkValidConnection(req.query.connection_type, res);
    if(connection !== null) {
        db.getAssetsAutoPushConnection(req.query.connection_type, function (responseData) {
            if (responseData !== null && responseData !== undefined) {
                res.status(200).json(responseData);
            }
            else {
                res.status(400).json([{
                    'statusText': 'No data found'
                }]);
            }
        });
    }
});

app.get('/assetAutoPushConnection?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const connection = exports.checkValidConnection(req.query.connection_type, res);
        if(connection !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetAutoPushConnection(
                    req.query.connection_type,
                    req.query.asset_id,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            });
        }
    }
});

app.get('/assetsAutoPushFilter?', function(req, res){
    const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
    if(date !== null) {
        db.getAssetsAutoPushFilter(
            req.query.startDate,
            req.query.endDate,
            function (responseData) {
                if (responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json([{
                        'statusText': 'No data found'
                    }]);
                }
            });
    }
});

app.get('/assetAutoPushFilter?', function(req, res){
    const id = exports.checkValidAssetId(req.query.asset_id, res);
    if(id !== null) {
        const date = exports.checkValidDate(req.query.startDate, req.query.endDate, res)
        if(date !== null) {
            exports.checkValidAssetIdDb(req.query.asset_id, res, function () {
                db.getAssetAutoPushFilter(
                    new Date(req.query.startDate).toISOString(),
                    new Date(req.query.endDate).toISOString(),
                    req.query.asset_id,
                    function (responseData) {
                        if (responseData !== null && responseData !== undefined) {
                            res.status(200).json(responseData);
                        }
                        else {
                            res.status(400).json([{
                                'statusText': 'No data found'
                            }]);
                        }
                    });
            })
        }
    }

});

app.get('/totalDistance?', function(req, res){
    let status = exports.checkValidAssetId(req.query.asset_id, res);
    if(status !== null) {
        exports.checkValidAssetIdDb(status, res, function() {
            db.getAssetTotalDistance(
                req.query.asset_id,
                function(responseData){
                    if(responseData !== null && responseData !== undefined) {
                        res.status(200).send({
                            'distance': responseData
                        });
                    }
                    else {
                        res.status(400).json([{
                            'statusText': 'No data found'
                        }]);
                    }
                });
        });
    }
})

app.post('/distance', function(req, res){
    let value = exports.checkValidLatLng(req.body, res);
    if( value !== null ) {
        db.getDistance(
            value,
            function(responseData){
                if(responseData !== null && responseData !== undefined) {
                    res.status(200).json(responseData);
                }
                else {
                    res.status(400).json({
                        'statusText': 'No data found'
                    });
                }
            });
    }

})

// validations

exports.checkValidDate = function checkValidDate(start, end, res) {
    if(moment(start).isValid() && moment(end).isValid()) {
        // console.log(new Date(start));
        const {error, value} = validation.validateDate(start, end);
        if(error) {
            let errorContainer = [];
            error.details.forEach(function(item) {
                errorContainer.push({
                    'statusText': item.message
                })
            })
            res.status(400).json(errorContainer);
            return null;
        } else {
            return value;
        }
    } else {
        res.status(400).json([{
            'statusText': 'Invalid Date'
        }]);
        return null;
    }
}

exports.checkValidAssetId = function checkValidAssetId(data, res) {
    const {error, value} = validation.validateAssetId(data);
    if(error) {
        let errorContainer = [];
        error.details.forEach(function(item) {
            errorContainer.push({
                'statusText': item.message
            })
        })
        res.status(415).json(errorContainer);
        return null;
    } else {
        return value;
    }
}

exports.checkValidLatLng = function checkValidLatLng(data, res) {
    const {error, value} = validation.validateLatLng(data);
    // console.log(error);
    if(error) {
        let errorContainer = [];
        error.details.forEach(function(item) {
            errorContainer.push({
                'statusText': item.message
            })
        })
        res.status(415).json(errorContainer);
        return null;
    } else {
        return value.req;
    }
}

exports.checkValidConnection = function checkValidConnection(data, res) {
    const connection = data.toLowerCase();

    if(validConnections.indexOf(connection) >= 0) {
        return data;
    } else {
        res.status(422).json([{
            'statusText': 'Invalid Connection Type'
        }]);
        return null;
    }
}

exports.checkValidAssetIdDb = function checkValidAssetIdDb (value, res, callback) {
    db.getAsset(value, function(responseData){
        // console.log('data' + responseData);
        if(responseData !== null && responseData !== undefined) {
            callback();
        }
        else {
            res.status(422).json([{
                'statusText': 'Asset Id not valid'
            }])
        }
    });
}

exports.meanData = function meanData(data, name) {
    // console.log('data' + data);
    module.exports.data = data;

    io.on('connection', function (socket) {
        // console.log('in socket connection');
        socket.setMaxListeners(20);
        // console.log(data);
        socket.emit('msg', data);
        socket.on('disconnect', function () {
            // console.log('disconnected');
            socket.removeAllListeners();
        })
    });
    // console.log(exports.data);
    // console.log('outside socket connection');
    if(name === 'lastConnected') {
        io.emit('msg', data);
    }
}

// export server run

exports.run = run;
exports.runningServer = server;


