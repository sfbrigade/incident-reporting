

// This toGeojson function was made from
// lovingly borrowed code from the inimitable
// chelm (https://github.com/chelm and the socrata-koop
// project: https://github.com/chelm/koop-socrata

function toGeojson(json, locationField){
    if (!json || !json.length){
      console.log('Failed to get data');
    } else {
      var geojson = {type: 'FeatureCollection', features: []};
      var geojsonFeature;
      json.forEach(function(feature, i){
        geojsonFeature = {type: 'Feature', geometry: {}, id: i+1};
        if (feature && locationField){
          if (feature[locationField] && feature[locationField].latitude && feature[locationField].longitude){
            geojsonFeature.geometry.coordinates = [parseFloat(feature[locationField].longitude), parseFloat(feature[locationField].latitude)];
            geojsonFeature.geometry.type = 'Point';
            delete feature.location;
            geojsonFeature.properties = feature;
            geojson.features.push( geojsonFeature );
          }
        } else if ( feature && feature.latitude && feature.longitude ){
           geojsonFeature.geometry.coordinates = [parseFloat(feature.longitude), parseFloat(feature.latitude)];
           geojsonFeature.geometry.type = 'Point';
           geojsonFeature.properties = feature;
           geojson.features.push( geojsonFeature );
        } else {
          geojsonFeature.geometry = null;
          geojsonFeature.properties = feature;
          geojson.features.push( geojsonFeature );
        }
      });
      return geojson;
    }
};

function getDataUrl(daysAgo) {
    var now = new Date();
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - daysAgo);
    var oneWeekAgoISO = oneWeekAgo.toISOString();
    var dataUrl = "https://data.sfgov.org/resource/vw6y-z8j6.json?$where=opened > '" + oneWeekAgoISO + "'&$order=opened DESC&$limit=5000";
    return dataUrl;
};

function getOpacity(d, breaks) {
    var opacity = {
        '0': 0,
        '1': 0.16,
        '2': 0.32,
        '3': 0.48,
        '4': 0.64,
        '5': 0.8
    };
    return d > breaks[4] ? opacity[5] :
                 d > breaks[3] ? opacity[4] :
                 d > breaks[2] ? opacity[3] :
                 d > breaks[1] ? opacity[2] :
                 d > breaks[0] ? opacity[1] : opacity[0];
}

L.mapbox.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoid0pibFBCdyJ9.xAls22npVNFVBEEFfL1vnQ';
var map = L.mapbox.map('map', 'lyzidiamond.kp20mhf6').setView([37.753141, -122.43858], 11);
var callLayer = new L.layerGroup().addTo(map);

var dataUrl = getDataUrl(7);
var breaks;

updateInfo();

var json_311;
var geojson_311;
$.getJSON(dataUrl, function(data) {

    json_311 = toGeojson(data, 'point');
    
    var per_neighborhood = turf.count(neighborhoods, json_311, 'total');

    breaks = turf.jenks(per_neighborhood, 'total', 5);
    addLegend(breaks);

    var per_neighborhood_layer = L.mapbox.featureLayer().setGeoJSON(per_neighborhood).addTo(map);
    map.fitBounds(per_neighborhood_layer.getBounds());

    per_neighborhood_layer.on('mouseover', function(e) {
        updateInfo(e.layer.feature.properties, e.layer.toGeoJSON());
    });
    per_neighborhood_layer.on('mouseout', function(e) {
        updateInfo();
    });
    per_neighborhood_layer.on('click', function(e) {
        map.fitBounds(e.layer.getBounds());
    });

    per_neighborhood_layer.eachLayer(function (layer) {
        layer.setStyle({
            fillColor: '#bd0026',
            fillOpacity: getOpacity(layer.feature.properties.total, breaks),
            weight: 0.5
        });
    });
    var labels = L.mapbox.tileLayer('morganherlocker.c278fa86').addTo(map);
});

function updateInfo (props, neighborhood) {
    if(!props) {
        $('#total-calls').text('');
        $('#neighborhood-name').text('');
        $('#calls-label').text('');
        $('#issues').hide();
    } else {
        $('#calls-label').text(' Calls');
        $('#neighborhood-name').text(props.name);
        $('#total-calls').text(props.total);
        $('#issues').show();

        $('#issue-list').empty()
        var calls = turf.within(json_311, turf.featurecollection([neighborhood]))
        //get a unique hash of category counts
        var categories = {};
        calls.features.forEach(function(pt){
            if(!categories[pt.properties.category]) categories[pt.properties.category] = 1;
            else categories[pt.properties.category]++;
        });
        //map hash keys to an array
        categories = Object.keys(categories).map(function(category){
            return {name: category, count: categories[category]};
        });
        //sort categories in descending order
        categories.sort(function(a, b){
            return b.count - a.count;
        })
        for(var i = 0; i < 5; i++) {
            if(categories[i] && categories[i].name) 
                $('#issue-list').append('<li><span class="issue">'+categories[i].name+
                    '</span> <span class="issue-count">'+categories[i].count+'</span></li>');
        }
    }
};

function addLegend (breaks) {
    var legend = '';
    labels = [];
    for (var i = 0; i < breaks.length; i++) {
        if (i === 0) {
            legend +=
                '<i style="opacity:' + getOpacity(breaks[i], breaks) + '"></i> ' + breaks[i] + '<br>';
        } else {
            legend +=
                '<i style="opacity:' + getOpacity(breaks[i], breaks) + '"></i> ' + (breaks[i - 1] + 1) + (breaks[i + 1] ? ' &dash; ' + breaks[i] + '<br>' : '+');
        }
    }
    $('#ramp').html(legend)
}

$('#show-calls').click(toggleCalls)
var callsShowing = false
function toggleCalls () {
    if(!callsShowing) {
        geojson_311 = L.geoJson(json_311, {
            onEachFeature: function (feature, layer) {
                var dateOpened = new Date(feature.properties.opened);
                layer.bindPopup('<strong>Case ID:</strong> ' + feature.properties.case_id + '<br><strong>Category:</strong> ' + feature.properties.category + '<br><strong>Request Type:</strong> ' + feature.properties.request_type + '<br><strong>Request Details:</strong> ' + feature.properties.request_details + '<br><strong>Status:</strong> ' + feature.properties.status + '<br><strong>Date Opened:</strong> ' + dateOpened);
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: '#555',
                    radius: 5,
                    stroke: false,
                    fillOpacity: 0.8
                });
            }
        });
        geojson_311.on('mouseover', function(e) {
            e.layer.openPopup();
        });
        geojson_311.on('mouseout', function(e) {
            e.layer.closePopup();
        });
        geojson_311.addTo(callLayer);
    } else {
        callLayer.clearLayers();
    }
    if(callsShowing) callsShowing = false;
    else callsShowing = true;
}
