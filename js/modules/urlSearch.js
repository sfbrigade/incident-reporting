var urlSearchModule = (function() {

    var DEFAULT_LATITUDE = 37.768;
    var DEFAULT_LONGITUDE = -122.438;
    var DEFAULT_RADIUS = 402.3;
    var DEFAULT_START_DATE = moment().subtract(29, 'days').format('YYYY-MM-DD');
    var DEFAULT_END_DATE = moment().format('YYYY-MM-DD');
    var DEFAULT_SEARCH_ADDRESS = '';
    var DEFAULT_SHAPE_TYPE = 'radial';

    function _initializeViewModelFromUrlParameters() {
        var query = new URI().query(true);
        var params = query.state ? JSON.parse(query.state) : {};

        var addressSearchText =
            [ params.searchAddress, params.searchCity, params.searchState, params.searchZip ].join(', ');

        addressService.getAddress(addressSearchText, function(address) {
            var firstFeature = address.features[0];
            var latitude = firstFeature && firstFeature.coordinates ? firstFeature.coordinates[1] : DEFAULT_LATITUDE;
            var longitude = firstFeature && firstFeature.coordinates ? firstFeature.coordinates[0] : DEFAULT_LONGITUDE;
            var radius = params.radius || DEFAULT_RADIUS;
            var startDate = params.startDate || DEFAULT_START_DATE;
            var endDate = params.endDate || DEFAULT_END_DATE;
            var shapeType = params.searchShapeType || DEFAULT_SHAPE_TYPE;

            viewModelModule.latitude = latitude;
            viewModelModule.longitude = longitude;
            viewModelModule.searchRadius = radius;
            viewModelModule.startDate = startDate;
            viewModelModule.endDate = endDate;
            viewModelModule.searchAddress = params.searchAddress || null;
            viewModelModule.searchCity = params.searchCity || null;
            viewModelModule.searchState = params.searchState || null;
            viewModelModule.searchZip = params.searchZip || null;
            viewModelModule.searchShapeType = shapeType;
            viewModelModule.searchGeoJson = params.searchGeoJson || null;

            $('#inputAddress').val(firstFeature ? firstFeature.properties.label : '');

            pageModule.loadIncidentData();
        });
    }

    return {
        initializeViewModelFromUrlParameters: _initializeViewModelFromUrlParameters
    };
})();
