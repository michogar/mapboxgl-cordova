# Extract mbtiles to a filesystem structure 

## Install tilelive and its drivers


## Convert from mbtiles to filesystem

Install tilelive:

    npm install -g tilelive
    npm install -g  mbtiles tilelive-file

Convert:

    tilelive-copy barcelona_spain.mbtiles file:openmaptiles?filetype=pbf.gz
    gunzip -r openmaptiles/
    

## Convert from geojson to mbtiles

Checkout and compile tippecanoe:

    git clone git@github.com:mapbox/tippecanoe.git
    cd tippecanoe/
    make
    sudo make install

Get geojson files (make sure they are in EPSG:4326) and convert them:

    wget "http://localhost:8080/geoserver/TMB/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TMB:VIEW_FT_NIVELLS_ELEMENT&outputFormat=application%2Fjson&srsName=EPSG:4326" -O nivells.geojson
    wget "http://localhost:8080/geoserver/TMB/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TMB:VIEW_FT_DINFRA_A&outputFormat=application%2Fjson&srsName=EPSG:4326" -O infra.geojson
    tippecanoe -z 22 -o nivells.mbtiles nivells.geojson
    tippecanoe -z 22 -o infra.mbtiles infra.geojson
    
    tilelive-copy nivells.mbtiles file:nivells?filetype=pbf.gz
    tilelive-copy infra.mbtiles file:infra?filetype=pbf.gz
    gunzip -r nivells/
    gunzip -r infra/

