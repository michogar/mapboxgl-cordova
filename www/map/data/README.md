# Extract mbtiles to a filesystem structure 

## Install tilelive and its drivers

    npm install -g tilelive
    npm install -g  mbtiles tilelive-file

## Convert and uncompress

    tilelive-copy barcelona_spain.mbtiles file:openmaptiles?filetype=pbf.gz
    gunzip -r openmaptiles/
