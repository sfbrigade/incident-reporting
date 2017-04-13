var pageModule = (function(window, $) {

    var METERS_PER_FOOT = 0.3048;
    var LOAD_INCIDENT_DATA_OPTION_DEFAULTS = {
        pushState: true,
        reverseGeocoding: shouldApplyReverseGeocoding
    };

    function _loadIncidentData(options) {
        options = $.extend(true, {}, LOAD_INCIDENT_DATA_OPTION_DEFAULTS, options || {});

        switch(viewModelModule.searchShapeType) {
            case 'polygon': _loadPolygonIncidentData(options); break;
            case 'radial': _loadRadialIncidentData(options); break;

            default: _loadRadialIncidentData(options); break;
        }
    }

    function _loadPolygonIncidentData(options) {
        var params = _buildPolygonIncidentSearchParameters();

        var query = incidentService.buildPolygonIncidentDataQuery(params);
        datasetLinksModule.refreshDownloadButtonUrls(query);

        if(options.pushState) {
            historyModule.saveSearchUrl();
        }

        _showLoader();
        incidentService.findIncidentsWithPolygonSearch(params, function(incidentsJson) {
            _hideLoader();
            incidentsJson = tableModule.csCategoryCheck(incidentsJson);
            mapModule.drawPolygonIncidents(_convertJsonToGeoJson(incidentsJson));
            tableModule.loadDataToTable(incidentsJson);
        });
    }

    function _buildPolygonIncidentSearchParameters() {
        return {
            startDate: viewModelModule.startDate,
            endDate: viewModelModule.endDate,
            searchGeoJson: viewModelModule.searchGeoJson
        };
    }

    function _loadRadialIncidentData(options) {
        var params = _buildRadialIncidentSearchParameters();

        var query = incidentService.buildRadialIncidentDataQuery(params);
        datasetLinksModule.refreshDownloadButtonUrls(query);

        if(options.pushState) {
            historyModule.saveSearchUrl();
        }

        var shouldApplyAddressFromCoordinates =
            typeof options.reverseGeocoding === 'function'
            ? options.reverseGeocoding() : options.reverseGeocoding;

        if(shouldApplyAddressFromCoordinates) {
            _applyAddressFromViewModelCoordinates();
        }

        _applySearchRadiusFromViewModel();

        _showLoader();
        incidentService.findIncidentsWithRadialSearch(params, function(incidentsJson) {
            _hideLoader();
            /*write something here to call cscategory function to add it to JSON*/
            incidentsJson = tableModule.csCategoryCheck(incidentsJson);
            mapModule.drawRadialIncidents(_convertJsonToGeoJson(incidentsJson));
            tableModule.loadDataToTable(incidentsJson);
        });
    }

    function _buildRadialIncidentSearchParameters() {
        return {
            startDate: viewModelModule.startDate,
            endDate: viewModelModule.endDate,
            longitude: viewModelModule.longitude,
            latitude: viewModelModule.latitude,
            searchRadius: _convertFromFeetToMeters(viewModelModule.searchRadius)
        };
    }

    function _applyAddressFromViewModelCoordinates() {
        var latitude = viewModelModule.latitude;
        var longitude = viewModelModule.longitude;
        addressService.getAddressFromCoordinates(latitude, longitude, function(address) {
            $('#input-address').val(address.features[0].place_name);
        });
    }

    function _applySearchRadiusFromViewModel() {
        $('#range-slider-input').val(parseInt(viewModelModule.searchRadius));
    }

    function _convertJsonToGeoJson(json) {
        var geoJson = { type: 'FeatureCollection', features: [] };
        json.forEach(function(incidentJson) {
            var incidentGeometry = incidentJson.location;
            delete incidentJson.location;
            var incidentProperties = incidentJson;
            geoJson.features.push({
                type: 'Feature',
                geometry: incidentGeometry,
                properties: incidentProperties
            });
        });

        return geoJson;
    }

    function _convertFromFeetToMeters(feet) {
        return feet * METERS_PER_FOOT;
    }

    function shouldApplyReverseGeocoding() {
        return !viewModelModule.searchAddress
            || viewModelModule.searchShapeType === 'polygon';
    }

    function _showLoader() {
        $('.loading').show();
    }

    function _hideLoader() {
        $('.loading').hide();
    }

    return {
        loadIncidentData: _loadIncidentData
    };

})(window, jQuery);
