var mapModule = (function(window,$) {

    var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY3JpbWVkYXRhc2YiLCJhIjoiY2l2Y296YTl2MDE2bTJ0cGI1NGoyY2RzciJ9.DRX-7gKkJy4FT2Q1Qybb2w';
    var MAPBOX_MAP_STYLE_ID = 'lightfox.1n10e3dp';
    var MAP_CONTAINER_ELEMENT_ID = 'map';
    
    var SEARCH_MARKER_GEOJSON = {
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: { 'marker-size': 'large' }
    };

    var INCIDENT_MARKER_PROPERTIES = {
        'marker-color': '#000080',
        'marker-symbol': 'police',
        'marker-size': 'small'
    };

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
            circle: false,
            marker: false
        }
    };

    var searchAreaGroup = L.featureGroup();
    var incidentLayer = L.mapbox.featureLayer();
    var incidentClusterGroup = new L.MarkerClusterGroup({ showCoverageOnHover: false });

    var map;

    function _init() {
        L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
        map = L.mapbox.map(MAP_CONTAINER_ELEMENT_ID, MAPBOX_MAP_STYLE_ID, {
					//True by default, false if you want a wild map
				  sleep: true,
				  //time(ms) for the map to fall asleep upon mouseout
					sleepTime: 750,
				  //time(ms) until map wakes on mouseover
					wakeTime: 750,
				  //Defines whether or not the user is prompted on how to wake map
					sleepNote: false,
				  //Allows ability to override note styling
					sleepNoteStyle: { color: 'red' },
				  //Should hovering wake the map? (clicking always will)
					hoverToWake: true,
					//A message to inform users of waking map
					wakeMessage: 'Click to Wake',
				  //Opacity (between 0 and 1) of inactive map
					sleepOpacity: 1 
				});

        var drawControl = new L.Control.Draw(DRAW_CONTROL_SETTINGS).addTo(map);
        searchAreaGroup.addTo(map);
        incidentLayer.addTo(map);
        incidentClusterGroup.addTo(map);

        map.on('draw:created', _afterDraw);
    }

    function _afterDraw(e) {
        viewModelModule.searchShapeType = 'polygon';
        viewModelModule.searchGeoJson = e.layer.toGeoJSON();
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
            radius = viewModelModule.searchRadius;

        var searchMarkerGeoJson = $.extend(true, {}, SEARCH_MARKER_GEOJSON, {
            geometry: { coordinates: [ longitude, latitude ] }
        });

        var searchMarkerLayer = L.mapbox.featureLayer(searchMarkerGeoJson);
        var searchAreaLayer = L.circle([latitude, longitude], radius);

        searchAreaGroup.clearLayers()
            .addLayer(searchMarkerLayer)
            .addLayer(searchAreaLayer);
    }

    function _drawIncidents(incidentGeoJson) {
        incidentClusterGroup.clearLayers();

        $.each(incidentGeoJson.features, function(index, feature) {
            $.extend(feature.properties, INCIDENT_MARKER_PROPERTIES);
        });

        incidentLayer.setGeoJSON(incidentGeoJson).eachLayer(function(layer) {
            incidentClusterGroup.addLayer(layer);
            layer.bindPopup(_buildIncidentPopupContent(layer.feature.properties));
        });

        incidentLayer.clearLayers();
        map.fitBounds(searchAreaGroup.getBounds());
    }

    function _buildIncidentPopupContent(properties) {
        return properties.descript + '; INCIDENT #: ' + properties.incidntnum;
    }

    return {
        init: _init,
        drawPolygonIncidents: _drawPolygonIncidents,
        drawRadialIncidents: _drawRadialIncidents
    };

})(window, jQuery);
