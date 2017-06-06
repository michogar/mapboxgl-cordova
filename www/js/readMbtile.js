function readTile(z, x, y, callback) {
    if ('sqlitePlugin' in window) {
        copyDatabaseFile('barcelona_spain.mbtiles').then(function () {
            var db = sqlitePlugin.openDatabase('barcelona_spain.mbtiles');
            db.transaction(function (txn) {
                txn.executeSql('SELECT tile_data FROM tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?', [z, x, y], function (tx, res) {
                    var str = res.rows.item(0).tile_data;
                    var blob = new Blob([str]);
                    callback(blob);
                });
            }, function (error) {
                console.log(error);
            });
        }).catch(function (err) {
            // error! :(
            console.log(err);
        });
    } else {
        console.log("sqlitePlugin not installed");
    }
}

function copyDatabaseFile(dbName) {
    var sourceFileName = cordova.file.applicationDirectory + 'www/data/' + dbName;
    var targetDirName = cordova.file.dataDirectory;
    return Promise.all([
        new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
        }),
        new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(targetDirName, resolve, reject);
        })
    ]).then(function (files) {
        var sourceFile = files[0];
        var targetDir = files[1];
        return new Promise(function (resolve, reject) {
            targetDir.getFile(dbName, {}, resolve, reject);
        }).then(function () {
            console.log("file already copied");
        }).catch(function () {
            console.log("file doesn't exist, copying it");
            return new Promise(function (resolve, reject) {
                sourceFile.copyTo(targetDir, dbName, resolve, reject);
            }).then(function () {
                console.log("database file copied");
            });
        });
    });
}
