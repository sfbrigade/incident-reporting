<<<<<<< HEAD
var mapModule = (function(window,$){

	/*Global variables within the module scope*/
    var _mapContainer;
    var _mapDesignID = 'mapbox.streets';
    var _mapboxAccessToken = 'pk.eyJ1IjoiY3JpbWVkYXRhc2YiLCJhIjoiY2l2Y296YTl2MDE2bTJ0cGI1NGoyY2RzciJ9.DRX-7gKkJy4FT2Q1Qybb2w';
	var _components = {
	    "map": null,
		"layers": {
		    "user": L.mapbox.featureLayer(),
			"searchradius": null,
			"incidents": L.mapbox.featureLayer()
		},
		"cluster": new L.MarkerClusterGroup({"showCoverageOnHover": false})
	};

    /**
      * @param {object} domContainer
    */
	function _init(domContainer){

	    //Initialize the module here
		if(!!domContainer){
		    //Yeah - it does exist
           _mapContainer = domContainer;
           _drawMap();
		}
		else
		{
		    //Error
		    alert("Sidebar container doesn't exist");
		}
	}

	function _enableAllLayers(){
	    for(i in _components["layers"]){
			console.log();
			_components["layers"][i].addTo(_components["map"]);
		}
	}

    function _drawMap(){
        L.mapbox.accessToken = _mapboxAccessToken;

		//Create our map instance
		_components["map"] = L.mapbox.map(_mapContainer.prop("id"), _mapDesignID, {
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
				}).setView([37.767806, -122.438153], 12);
		_components["layers"]["searchradius"] = L.circle([37.767806, -122.438153], 402.3).addTo(_components["map"]);

		//Plot the initial user location
        _setUserLocation({ "type": "Feature","properties": {"marker-size": "large"}, "geometry": {"type": "Point", "coordinates": [-122.438153,37.767806]}});

		//Add all layers to the map instance
		_enableAllLayers();

	}

    /**
      * @param {object} response
    */
	function _drawApiResponse(response){
	    if(response["features"].length>0){
		    //Color all incident records to RED
			for(i=0;i<response["features"].length;i++){
			    response["features"][i]["properties"] = $.extend({}, response["features"][i]["properties"], {"marker-color": "#000080", "marker-symbol": "police", "marker-size": "small"});
			}

			//Clear the cluster contents
			_components["cluster"].clearLayers();

			//Set the map content based on the information coming from the API response
			_components["layers"]["incidents"].setGeoJSON(response);

            _components["layers"]["incidents"].eachLayer(function(layer) {
                _components["cluster"].addLayer(layer);
                var marker = layer;
                var feature = marker.feature;

                var popupContent = feature.properties.descript + "; INCIDENT #: " + feature.properties.incidntnum;
                 // + "; Resolution: " + feature.properties.resolution

                marker.bindPopup(popupContent);
            });

			_components["map"].addLayer(_components["cluster"]);

			_components["layers"]["incidents"].clearLayers();
		}
		else
		{
		    //We received no results from the API, delete map contents
			_components["layers"]["incidents"].clearLayers();
			
			//Clear the clusters from the map as well, not just the feature layer
			_components["cluster"].clearLayers();
			
		}

		//Set map bounds to the bounds of the search radius
		_components["map"].fitBounds(_components["layers"]["searchradius"].getBounds());

		//Hide the loader screen
		_hideLoader();
	}

    /**
      * @param {object} feature
    */
	function _plotUserLocation(feature){
        _setUserLocation(feature);
		_components["layers"]["searchradius"].setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
		_components["layers"]["searchradius"].setRadius(_getUserSearchRadius());
	}

	function _setUserLocation(geoJson){
	    _components["layers"]["user"].setGeoJSON(geoJson);
    }

	function _getUserLocation(){
	    return _components["layers"]["user"].getGeoJSON();
	}

    /**
      * @param {object} feature
    */
	function _centerMapOnLocation(feature){
	    _components["map"].setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
	}

    /**
      * @param {number} meters
    */
	function _setUserSearchRadius(meters){
	    _components["layers"]["searchradius"].setRadius(parseFloat(meters));
		return _components["layers"]["searchradius"].getRadius();
	}

	function _getUserSearchRadius(){
		return _components["layers"]["searchradius"].getRadius();
	}

	function _setComponents(components){
        _components = components;
    }

	function _getComponents(){
		return _components;
	}

    function _getMapboxAccessToken() {
        return _mapboxAccessToken;
    }

	function _showLoader(){
        _mapContainer.find(".loading").show();
	}

	function _hideLoader(){
        _mapContainer.find(".loading").hide();
	}

    return {
	    init: _init,
  		plotUserLocation: _plotUserLocation,
  		centerMapOnLocation: _centerMapOnLocation,
  		getUserSearchRadius:_getUserSearchRadius,
  		setUserSearchRadius:_setUserSearchRadius,
  		setUserLocation: _setUserLocation,
  		getUserLocation: _getUserLocation,
  		setComponents: _setComponents,
  		getComponents: _getComponents,
        getMapboxAccessToken: _getMapboxAccessToken,
  		drawApiResponse:_drawApiResponse,
  		showLoader: _showLoader,
  		hideLoader: _hideLoader
=======
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
        map = L.mapbox.map(MAP_CONTAINER_ELEMENT_ID, MAPBOX_MAP_STYLE_ID);

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
>>>>>>> dev
    };

})(window, jQuery);
