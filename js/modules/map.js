var mapModule = (function(window,$){

	/*Global variables within the module scope*/
    var _mapContainer;
    var _mapboxID = 'lightfox.1n10e3dp';
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

        var defaultCoordinates = [37.767806, -122.438153];

		//Create our map instance
		_components["map"] = L.mapbox.map(_mapContainer.prop("id"), _mapboxID).setView(defaultCoordinates, 12);
		_components["layers"]["searchradius"] = L.circle(defaultCoordinates, 402.3);

		//Plot the initial user location
        _setUserCoordinates(defaultCoordinates);

		//Add all layers to the map instance
		_enableAllLayers();

	}

    function _locateUser(){
        return new Promise(function(resolve, reject) {
            _components["map"].once('locationfound', function(locationEvent){
                resolve([locationEvent.latlng.lat, locationEvent.latlng.lng]);
            });
            _components["map"].once('locationerror', reject);
            _components["map"].locate();
        });
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
	function _setUserLocation(feature){
	    _components["layers"]["user"].setGeoJSON(feature);
        _components["layers"]["searchradius"].setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
    }

    function _setUserCoordinates(coordinates){
        var geoJson = {
            "type": "Feature",
            "properties": {"marker-size": "large"},
            "geometry": {
                "type": "Point",
                "coordinates": [coordinates[1], coordinates[0]]
            }
        };
        _setUserLocation(geoJson);
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
  		plotUserLocation: _setUserLocation,
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
  		hideLoader: _hideLoader,
        locateUser: _locateUser
    };

})(window, jQuery);
