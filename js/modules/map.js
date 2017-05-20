var mapModule = (function(window,$) {

    var MAPBOX_ACCESS_TOKEN = resourceTokensModule.MAPBOX_ACCESS_TOKEN;
    var MAPBOX_MAP_STYLE_ID = 'lightfox.1n10e3dp';
    var MAP_CONTAINER_ELEMENT_ID = 'map';

    var SEARCH_MARKER_GEOJSON = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { 'marker-size': 'large' }
    };
/*the following objects sets the custom marker icons for each CSCategory*/
    var iconArray= ["crimeIcon", "assaultIcon","arsonIcon","burglaryIcon","datingIcon","domesticIcon",
    "drugsIcon",'hateIcon',"liquorIcon","motorIcon", "robberyIcon", "sexIcon", "stalkingIcon","weaponsIcon"];

    for(i=0; i<iconArray.length; i++){
      iconArray[i]= L.icon(
          {
              iconUrl: './gfx/' + iconArray[i] + '.svg',
              iconSize: [40,40],
              iconAnchor: [12.31],
              popupAnchor: [-3,-22]
          }
        )
      }

/*the following is old code using built in Mapbox Maki icons
    var INCIDENT_MARKER_PROPERTIES = {
        'marker-color': '#000080',
        'marker-symbol': 'police',
        'marker-size': 'small'
    };*/

    var SHAPE_STYLE_SETTINGS = {
        color: '#0033ff',
        fillColor: '#0033ff',
        weight: 5,
        fillOpacity: 0.2,
        opacity: 0.5
    };

    var DRAW_CONTROL_SETTINGS = {
        draw: {
            polyline: false,
            polygon: { shapeOptions: SHAPE_STYLE_SETTINGS },
            rectangle: { shapeOptions: SHAPE_STYLE_SETTINGS },
            circle: { shapeOptions: SHAPE_STYLE_SETTINGS }
        }
    };

    var INCIDENT_CLUSTER_LAYER_SETTINGS = {
        showCoverageOnHover: false
    };

    var METERS_PER_FOOT = 0.3048;

    var searchAreaGroup = L.featureGroup();
    var incidentLayer, incidentClusterGroup;

    var map;

    function _init() {
        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
        map = L.mapbox.map(MAP_CONTAINER_ELEMENT_ID, MAPBOX_MAP_STYLE_ID);

        var drawControl = new L.Control.Draw(DRAW_CONTROL_SETTINGS).addTo(map);
        searchAreaGroup.addTo(map);

        map.on('draw:created', _afterDraw);
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<div> <button type="button" id="legend-button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myLegend">'+
                        'Legend </button></div>'
         return div;
         };
         legend.addTo(map);
         }

    function _afterDraw(e) {
        switch(e.layerType) {
            case 'polygon':
            case 'rectangle': _afterDrawPolygon(e);
                break;
            case 'circle': _afterDrawCircle(e);
                break;
            case 'marker': _afterDrawMarker(e);
                break;
        }
    }

    function _afterDrawPolygon(e) {
        viewModelModule.searchShapeType = 'polygon';
        viewModelModule.searchGeoJson = e.layer.toGeoJSON();
        pageModule.loadIncidentData({ reverseGeocoding: false });
    }

    function _afterDrawCircle(e) {
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.latitude = e.layer._latlng.lat;
        viewModelModule.longitude = e.layer._latlng.lng;
        viewModelModule.searchRadius = _convertFromMetersToFeet(e.layer._mRadius);
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _afterDrawMarker(e) {
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.latitude = e.layer._latlng.lat;
        viewModelModule.longitude = e.layer._latlng.lng;
        viewModelModule.searchAddress = null;
        pageModule.loadIncidentData();
    }

    function _drawPolygonIncidents(incidentGeoJson) {
        _drawPolygonSearchArea();
        _drawIncidents(incidentGeoJson);
    }

    function _drawRadialIncidents(incidentGeoJson) {
        _drawRadialSearchArea();
        _drawIncidents(incidentGeoJson);
    }

    function _drawPolygonSearchArea() {
        var searchAreaGeoJson = viewModelModule.searchGeoJson;
        var searchAreaLayer = L.mapbox.featureLayer(searchAreaGeoJson)
            .setStyle(SHAPE_STYLE_SETTINGS);

        searchAreaGroup.clearLayers()
            .addLayer(searchAreaLayer);
    }

    function _drawRadialSearchArea() {
        var latitude = viewModelModule.latitude,
            longitude = viewModelModule.longitude,
            radius = _convertFromFeetToMeters(viewModelModule.searchRadius);

        var searchMarkerGeoJson = $.extend(true, {}, SEARCH_MARKER_GEOJSON, {
            geometry: { coordinates: [ longitude, latitude ] }
        });

        var searchMarkerLayer = L.mapbox.featureLayer(searchMarkerGeoJson);
        var searchAreaLayer = L.circle([latitude, longitude], radius);

        searchAreaGroup.clearLayers()
            .addLayer(searchMarkerLayer)
            .addLayer(searchAreaLayer);
    }
    /*_drawIncident function is the actual rendering process of putting a incdidentGeoJson on
    to a map*/
    function _drawIncidents(incidentGeoJson) {
        if(incidentLayer) {
            map.removeLayer(incidentLayer)
        }

        if(incidentClusterGroup) {
            map.removeLayer(incidentClusterGroup);
        }
        /*makes a MapBox featurelayer that adds geojson to a map read lyzidiamond.com/posts/external-geojson-mapbox*/
        incidentLayer = L.mapbox.featureLayer();
        /*maker clustering with leaflet read: asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps*/
        incidentClusterGroup = new L.MarkerClusterGroup(INCIDENT_CLUSTER_LAYER_SETTINGS);
        /*the below code is the old way of assigning icon to a incident using built in mapbox Maki icons*/
        /*$.each(incidentGeoJson.features, function(index, feature) {
            $.extend(feature.properties, INCIDENT_MARKER_PROPERTIES);
        });*/
        /*the following is the actual descision making process of assigning icons to a certain CSCategory*/
        incidentLayer.setGeoJSON(incidentGeoJson).eachLayer(function(layer) {
          //this line below changes icon using leaflet Icon objects.
          switch(true) {
          case (layer.feature.properties.cscategory==="AGGRAVATED ASSAULT"):
              layer.setIcon(iconArray[1]);
              break;
          case(layer.feature.properties.cscategory==="ARSON"):
              layer.setIcon(iconArray[2]);
              break;
          case (layer.feature.properties.cscategory==="BURGLARY"):
              layer.setIcon(iconArray[3]);
              break;
          case (layer.feature.properties.cscategory==="DATING VIOLENCE"):
              layer.setIcon(iconArray[4]);
              break;
          case(layer.feature.properties.cscategory==="DOMESTIC VIOLENCE"):
              layer.setIcon(iconArray[5]);
              break;
          case(layer.feature.properties.cscategory==="DRUG-RELATED VIOLATIONS"):
              layer.setIcon(iconArray[6]);
              break;
          case(layer.feature.properties.cscategory==="HATE CRIMES"):
              layer.setIcon(iconArray[7])
              break;
          case(layer.feature.properties.cscategory==="LIQUOR LAW"):
              layer.setIcon(iconArray[8]);
              break;
          case(layer.feature.properties.cscategory==="MOTOR VEHICLE THEFT"):
              layer.setIcon(iconArray[9]);
              break;
          case(layer.feature.properties.cscategory==="ROBBERY"):
              layer.setIcon(iconArray[10]);
              break;
          case(layer.feature.properties.cscategory==="SEX OFFENSES"):
              layer.setIcon(iconArray[11]);
              break;
          case(layer.feature.properties.cscategory==="STALKING"):
              layer.setIcon(iconArray[12]);
              break;
          case(layer.feature.properties.cscategory==="WEAPONS POSSESION"):
              layer.setIcon(iconArray[13]);
              break;

            default:
              layer.setIcon(iconArray[0]);
            break;
          }

            incidentClusterGroup.addLayer(layer);
            layer.bindPopup(_buildIncidentPopupContent(layer.feature.properties));
        });
        incidentLayer.clearLayers();

        map.addLayer(incidentLayer)
            .addLayer(incidentClusterGroup)
            .fitBounds(searchAreaGroup.getBounds());
    }

    function _buildIncidentPopupContent(properties) {
        var newDate = properties.date;
        var formattedDate = newDate.slice(5,7) + "/" + newDate.slice(8,10) + "/" + newDate.slice(0,4);
        return properties.descript + " on " + formattedDate;
    }

    function _convertFromFeetToMeters(feet) {
        return feet * METERS_PER_FOOT;
    }

    function _convertFromMetersToFeet(meters) {
        return meters / METERS_PER_FOOT;
    }

    return {
        init: _init,
        drawPolygonIncidents: _drawPolygonIncidents,
        drawRadialIncidents: _drawRadialIncidents
    };

})(window, jQuery);
