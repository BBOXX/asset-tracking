r = require('rethinkdb');
async = require('async');
fs = require('fs');
server = require('./server.js');
data = '';
table = '';

username = process.env.API_USER;
password = process.env.API_PWD;

var connectDb = function connectDb(next) {
    r.connect({
        host: 'ec2-35-177-71-121.eu-west-2.compute.amazonaws.com',
        port: 28015,
        db: 'Tracking',
        user: username.toString(),
        password: password.toString()
    }, function connectionCallback(err, conn) {
        if (err) throw err;
        module.exports.conn = conn;
        // writeFile('../data/lastConnected', 'asset-current-locations', 'current');
        // writeFile('../data/signup', 'asset-signup-locations', 'sign up');
        // writeFile('../data/upgrade', 'asset-upgrade-locations', 'upgrade');
        // writeFile('../data/autoPush', 'asset-historic-locations', 'auto push');
        next(err);
    });
};

var pushTablesData = function pushTablesData(name) {
    r.db('Tracking').table(name).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        cursor.each(function (err, row) {
            var dataLoad;
            if (err) throw err;
            // console.log('load');
            dataLoad = JSON.stringify(row);
            // console.log(dataLoad.data);
            if (dataLoad !== null || dataLoad !== undefined) {
                server.meanData(dataLoad, name);
            }
        });
    });
};

var sendFinalData = function sendFinalData(err, results) {
    if (err) throw err;
    // console.log('final data' + results);
}

var pushChangesTablesData = function pushChangesTablesData(name, next) {
    r.db('Tracking').table(name).changes().run(exports.conn, function (err, cursor) {
        if (err) throw err;
        cursor.each(function (err, row) {
            r.db('Tracking').table(name).update(function (item) {
                return {
                    'data': item('data').map(function (data) {
                        return data.merge({
                            'location': r.point(data('lng'), data('lat'))
                        })
                    })
                }
            }).run(exports.conn, function (err, cursor) {
                if (err) throw err;
            })
            var dataChange;
            if (err) throw err;
            // console.log('changes');
            dataChange = JSON.stringify(row);
            if (dataChange !== null || dataChange !== undefined) {
                // console.log(dataChange);
                server.meanData(dataChange, name);
            }
        });
        next(err, cursor);
    });
};

function callback(err, res) {
    if (err) throw err;
    // console.log(res);
}

var pushTables = function pushTables(parentNext) {
    r.db('Tracking').tableList().run(exports.conn, function (err, result) {
        if (err) throw err;
        result.forEach(function (item) {
            // console.log(item);
            var iterateArr = [];
            if (item === 'lastConnected') {
                iterateArr.push(item);
                async.waterfall({
                    data: async.map(iterateArr, pushTablesData, sendFinalData),
                    change: async.map(iterateArr, pushChangesTablesData, parentNext)
                })
            } else {
                iterateArr.push(item);
                async.map(iterateArr, pushChangesTablesData);
            }
        });
    })

};
async.series({
    connect: connectDb,
    table: pushTables
}, callback);

// function connectionCallback(err, conn, next) {
//     if (err) throw err;
//     module.exports.conn = conn;
//     next(err);
//     saveFile('data.json', 'data', '01', conn, callback);
//     saveData(conn, callback);
// }

module.exports.getAsset = function getAsset(query, callback) {
    r.db('Tracking').table('signup')
        .filter({asset_id: query})('data')
        .union(r.db('Tracking').table('upgrade')
            .filter({asset_id: query})('data'))
        .union(r.db('Tracking').table('autopush')
            .filter({asset_id: query})('data'))
        .concatMap(function (item) {
            return item;
        })
        .run(exports.conn, function (err, cursor) {
            if (err) throw err;
            cursor.toArray(function (err, results) {
                if (err) throw err;
                if (results.length > 0) {
                    callback(results);
                } else {
                    callback(null);
                }
            });
        })
};

module.exports.getAssetSignUp = function getAssetSignUp(query, callback) {
    r.table('signup').get(query).run(exports.conn, function (err, resultItem) {
        if (err) throw err;
        callback(resultItem.data);
    })
};

module.exports.getAssetsSignUpConnection = function getAssetsSignUpConnection(query, callback) {
    r.db('Tracking').table('signup').concatMap(function (data) {
        return data('data').filter({connection_type: query});
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetSignUpConnection = function getAssetSignUpConnection(id, connection, callback) {
    r.db('Tracking').table('signup').get(id)('data').filter(function (item) {
        return item('connection_type').eq(connection);
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetSignUpFilter = function getAssetSignUpFilter(startDate, endDate, id, callback) {
    r.db('Tracking').table('signup').get(id)('data').filter(function (item) {
        return r.epochTime(
            r.expr(item('gps_time')).div(1000))
            .during(
                r.ISO8601(startDate).date(),
                r.ISO8601(endDate).date()
            )
    })
        .run(exports.conn, function (err, cursor) {
            if (err) throw err;
            // console.log(cursor);
            cursor.toArray(function (err, results) {
                if (err) throw err;
                if (results.length > 0) {
                    callback(results);
                } else {
                    callback(null);
                }
            });
        });
};

module.exports.getAssetsSignUpFilter = function getAssetsSignUpFilter(startDate, endDate, callback) {
    r.db('Tracking').table('signup').concatMap(function (data) {
        return data('data').filter(function (item) {
            return r.epochTime(
                r.expr(item('gps_time')).div(1000))
                .during(
                    r.ISO8601(startDate).date(),
                    r.ISO8601(endDate).date()
                )
        });
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};


module.exports.getAssetUpgrade = function getAssetUpgrade(query, callback) {
    r.table('upgrade').get(query).run(exports.conn, function (err, resultItem) {
        if (err) throw err;
        callback(resultItem.data);
    })
};

module.exports.getAssetsUpgradeConnection = function getAssetsUpgradeConnection(query, callback) {
    r.db('Tracking').table('upgrade').concatMap(function (data) {
        return data('data').filter({connection_type: query});
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetUpgradeConnection = function getAssetUpgradeConnection(connection, id, callback) {
    r.db('Tracking').table('upgrade').get(id)('data').filter(function (item) {
        return item('connection_type').eq(connection);
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetsUpgradeFilter = function getAssetsUpgradeFilter(startDate, endDate, callback) {
    r.db('Tracking').table('upgrade').concatMap(function (data) {
        return data('data').filter(function (item) {
            return r.epochTime(
                r.expr(item('gps_time')).div(1000))
                .during(
                    r.ISO8601(startDate).date(),
                    r.ISO8601(endDate).date()
                )
        });
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetUpgradeFilter = function getAssetUpgradeFilter(startDate, endDate, id, callback) {
    r.db('Tracking').table('upgrade').get(id)('data').filter(function (item) {
        return r.epochTime(
            r.expr(item('gps_time')).div(1000))
            .during(
                r.ISO8601(startDate).date(),
                r.ISO8601(endDate).date()
            )
    })
        .run(exports.conn, function (err, cursor) {
            if (err) throw err;
            // console.log(cursor);
            cursor.toArray(function (err, results) {
                if (err) throw err;
                if (results.length > 0) {
                    callback(results);
                } else {
                    callback(null);
                }
            });
        });
};

module.exports.getAssetAutoPush = function getAssetAutoPush(query, callback) {
    r.table('autopush').get(query).run(exports.conn, function (err, resultItem) {
        if (err) throw err;
        callback(resultItem.data);
    })
};

module.exports.getAssetsAutoPushConnection = function getAssetsAutoPushConnection(query, callback) {
    r.db('Tracking').table('autopush').concatMap(function (data) {
        return data('data').filter({connection_type: query});
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetAutoPushConnection = function getAssetAutoPushConnection(connection, id, callback) {
    r.db('Tracking').table('autopush').get(id)('data').filter(function (item) {
        return item('connection_type').eq(connection);
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetsAutoPushFilter = function getAssetsAutoPushFilter(startDate, endDate, callback) {
    r.db('Tracking').table('autopush').concatMap(function (data) {
        return data('data').filter(function (item) {
            return r.epochTime(
                r.expr(item('gps_time')).div(1000))
                .during(
                    r.ISO8601(startDate).date(),
                    r.ISO8601(endDate).date()
                )
        });
    }).run(exports.conn, function (err, cursor) {
        if (err) throw err;
        // console.log(cursor);
        cursor.toArray(function (err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    });
};

module.exports.getAssetAutoPushFilter = function getAssetAutoPushFilter(startDate, endDate, id, callback) {
    r.db('Tracking').table('autopush').get(id)('data').filter(function (item) {
        return r.epochTime(
            r.expr(item('gps_time')).div(1000))
            .during(
                r.ISO8601(startDate).date(),
                r.ISO8601(endDate).date()
            )
    })
        .run(exports.conn, function (err, cursor) {
            if (err) throw err;
            // console.log(cursor);
            cursor.toArray(function (err, results) {
                if (err) throw err;
                if (results.length > 0) {
                    callback(results);
                } else {
                    callback(null);
                }
            });
        });
};

module.exports.getAssetTotalDistance = function getAssetTotalDistance(id, callback) {
    r.db('Tracking').table('signup')
        .filter({asset_id: '1dbe8d13a54816ff'})('data')
        .union(r.db('Tracking').table('upgrade')
            .filter({asset_id: '1dbe8d13a54816ff'})('data'))
        .union(r.db('Tracking').table('autopush')
            .filter({asset_id: '1dbe8d13a54816ff'})('data'))
        .concatMap(function (item) {
            return item;
        })
        .map(function (item) {
            return {
                'time': r.point(item('lng'), item('lat'))
            }
        })
        .coerceTo('array')
        .fold([], function (prev, next) {
            return (r.expr([next])).add(r.expr(prev));
        }, {
            emit: function (prev, next, new_prev) {
                return r.branch(new_prev.count().gt(1),
                    [r.do(new_prev, function (value1) {
                        return value1.nth(0)('time').distance(value1.nth(1)('time'))
                    })],
                    []);
            }
        })
        .sum()
        .run(exports.conn, function (err, results) {
            if (err) throw err;
            // console.log(results);
            if (results > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });

}

module.exports.getDistance = function getDistance(requestBody, callback) {
    r.map(requestBody, function (item) {
        return {
            'time': r.point(item('lng'), item('lat'))
        }
    })
        .coerceTo('array')
        .fold([], function (prev, next) {
            return (r.expr([next])).add(r.expr(prev));
        }, {
            emit: function (prev, next, new_prev) {
                return r.branch(new_prev.count().gt(1),
                    [r.do(new_prev, function (value1) {
                        return value1.nth(0)('time').distance(value1.nth(1)('time'))
                    })],
                    []);
            }
        }).sum()
        .run(exports.conn, function (err, results) {
            if (err) throw err;
            // console.log(results);
            if (results > 0) {
                callback({
                    'distance': results
                });
            } else {
                callback(null);
            }
        });
}


// old code for write file net in node js used for api

// function saveFile(filePath, saveName, userId, conn, callback) {
//   fs.readFile(filePath, function(err, contents) {
//     if (err) return callback(err);
//     r.db('Tracking').table('signup').insert({
//       userId: userId,
//       filename: saveName,
//       file: contents // contents is a buffer, so we do not need to wrap it in `r.binary`
//     }).run(conn, callback)
//   });
// }

// var server = net.createServer(function(client){
//     console.log(data);
//     writeData(client, data.toString())
// }, this);

// server.listen(8080, 'localhost', function() {
//     console.log('server listening' + JSON.stringify(server.address()));
// });


// function writeData(socket, data) {
//     var success = !socket.write(data);
//     if(!success) {
//         (function(socket, data){
//             socket.once('drain', function(){
//                 writeData(socket, data);
//             })
//         })(socket, data);
//     }
// }


// scripts for structuring and copying data to a json file

// function writeFile(fileName, dataName, type) {
//     console.log(server.words);
//     var data = modifyData(server.words[dataName], type);
//     fs.writeFile(fileName + ".json", JSON.stringify(data), function(err) {
//         if(err) {
//             return console.log(err);
//         }
//
//         console.log("The file was saved!");
//     });
// }

// function modifyData(data, type) {
//     console.log(data);
//     let parentArr = [];
//     for(let count in data) {
//         // console.log(data[count]);
//         let subArr = [],
//             parentObj = {};
//         for(let i in data[count]) {
//             if(type !== 'current') {
//                 if(data[count][i]['type'] === type) {
//                     subArr.push(data[count][i]);
//                 }
//             } else {
//                 subArr.push(data[count][i]);
//             }
//         }
//         data[count] = subArr;
//         parentObj['asset_id'] = count;
//         parentObj['data'] = data[count];
//
//
//         parentArr.push(parentObj);
//         // r.db('Tracking').table(type.replace(/ /g,'')).insert(parentObj).run(exports.conn, callback);
//     }
//     // console.log(data);
//     return parentArr;
// }

