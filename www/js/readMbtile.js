function readTile(z, x, y, callback) {
    if ('sqlitePlugin' in window) {
        copyDatabaseFile('barcelona_spain.mbtiles').then(function () {
            var db = sqlitePlugin.openDatabase({name: 'barcelona_spain.mbtiles', location: 'default'});
            db.transaction(function (txn) {
                txn.executeSql('SELECT BASE64(tile_data) AS data FROM tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?', [z, x, y], function (tx, res) {
                    var pbf_gz = convertBase64ToUint8Array(res.rows.item(0).data);
                    var pbf = pako.inflate(pbf_gz);
                    callback(pbf);
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

function convertBase64ToUint8Array(base64) {
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
}

function copyDatabaseFile(dbName) {
    var sourceFileName = cordova.file.applicationDirectory + 'www/data/' + dbName;

    return Promise.all([
        new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
        }),
        new Promise(function (resolve, reject) {
            // If android
            resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dir) {
                dir.getDirectory('databases', {create: true}, function (subdir) {
                    resolve(subdir);
                });
            }, reject);
            // Else if ios
            //resolveLocalFileSystemURL(cordova.file.documentsDirectory, resolve, reject);
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
