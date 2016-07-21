var mapModule = (function(window,$){

	/*Global variables within the module scope*/
    var _mapContainer;
	var _mapboxBaseMapCode = 'datasf.j9b9ihf0';
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
        L.mapbox.accessToken = 'pk.eyJ1IjoiZGF0YXNmIiwiYSI6Ilo3bVlHRDQifQ.7gkiPnZtioL8CnCvJ5z9Bg';

		//Create our map instance
		_components["map"] = L.mapbox.map(_mapContainer.prop("id"), _mapboxBaseMapCode).setView([37.767806, -122.438153], 12);
		_components["layers"]["searchradius"] = L.circle([37.767806, -122.438153], 402.3).addTo(_components["map"]);

		//Plot the initial user location
		_components["layers"]["user"].setGeoJSON({ "type": "Feature","properties": {"marker-size": "large"}, "geometry": {"type": "Point", "coordinates": [-122.438153,37.767806]}});

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

                var popupContent = feature.properties.category;

                marker.bindPopup(popupContent);
            });

			_components["map"].addLayer(_components["cluster"]);

			_components["layers"]["incidents"].clearLayers();
		}
		else
		{
		    //We received no results from the API, delete map contents
			_components["layers"]["incidents"].clearLayers();
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
	    _components["layers"]["user"].setGeoJSON(feature);
		_components["layers"]["searchradius"].setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
		_components["layers"]["searchradius"].setRadius(_getUserSearchRadius());
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
  		getUserLocation: _getUserLocation,
  		drawApiResponse:_drawApiResponse,
  		showLoader: _showLoader,
  		hideLoader: _hideLoader
    };

})(window, jQuery);
