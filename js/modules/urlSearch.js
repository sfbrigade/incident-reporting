var urlSearchModule = (function() {

    var LOAD_INCIDENT_DATA_OPTIONS = { pushState: false };

    function _initializeViewModelFromUrlParameters() {
        var params = new URI().query(true);

        $.extend(true, viewModelModule, params);

        viewModelModule.searchShapeType = _getSearchShapeType(params);
        viewModelModule.searchGeoJson = params.searchGeoJson
            ? JSON.parse(params.searchGeoJson) : null;

       if(params.searchAddress && !(params.latitude && params.longitude)) {
           addressService.getAddressSuggestions(params.searchAddress, _afterGetAddressSuggestions);
       } else {
           pageModule.loadIncidentData(LOAD_INCIDENT_DATA_OPTIONS);
       }
    }

    function _afterGetAddressSuggestions(addressSuggestions) {
        var firstAddress = addressSuggestions.length ? addressSuggestions[0] : {};
        viewModelModule.latitude = firstAddress.latitude;
        viewModelModule.longitude = firstAddress.longitude;
        viewModelModule.searchAddress = firstAddress.name;
        $('#input-address').val(firstAddress.name);

        pageModule.loadIncidentData(LOAD_INCIDENT_DATA_OPTIONS);
    }

    function _getSearchShapeType(params) {
        if(params.searchAddress || (params.latitude && params.longitude)) {
            return 'radial';
        } else if(params.searchGeoJson) {
            return 'polygon';
        } else {
            return viewModelModule.defaults.searchShapeType;
        }
    }

    return {
        initializeViewModelFromUrlParameters: _initializeViewModelFromUrlParameters
    };
})();
