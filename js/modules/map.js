var mapModule = (function(window,$) {

    var MAPBOX_ACCESS_TOKEN = resourceTokensModule.MAPBOX_ACCESS_TOKEN;
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

    function _drawIncidents(incidentGeoJson) {
        if(incidentLayer) {
            map.removeLayer(incidentLayer)
        }

        if(incidentClusterGroup) {
            map.removeLayer(incidentClusterGroup);
        }

        incidentLayer = L.mapbox.featureLayer();
        incidentClusterGroup = new L.MarkerClusterGroup(INCIDENT_CLUSTER_LAYER_SETTINGS);

        $.each(incidentGeoJson.features, function(index, feature) {
            $.extend(feature.properties, INCIDENT_MARKER_PROPERTIES);
        });

        incidentLayer.setGeoJSON(incidentGeoJson).eachLayer(function(layer) {
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
