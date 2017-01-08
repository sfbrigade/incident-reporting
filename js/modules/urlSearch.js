<<<<<<< HEAD
var urlSearch = (function() {

    function _runURLsearch() {
        var uri = new URI();
        uri = uri.query(true);

        var search = uri.address + ", " + uri.city + ", " + uri.state;

        //Assign the returned autocomplete values to a variable
        var addressCall = resourcesModule.getJustAddress(search);

        addressCall.done(function(data){
            //Use the map module to change the user pin's location
            mapModule.plotUserLocation(data.features[0]);
            mapModule.centerMapOnLocation(data.features[0]);
            mapModule.setUserSearchRadius(uri.radius);

            //assign the selected values to the address and radius fields
            $('#inputAddress').val(search);

            controlsModule.searchCrime();
        });
    }

    function _pushIntoUrl(userLocation, dates, radius) {
        var newSearch = null;
        var uri = new URI();
        var searchInput = {};

        if (userLocation) {
            searchInput = Object.assign(searchInput, {
                address: userLocation.properties.name,
                city: userLocation.properties.locality,
                state: userLocation.properties.region,
                zip: userLocation.properties.postalcode
            })
        }
        if (dates) {
            searchInput = Object.assign(searchInput, dates);
        }
        if (radius) {
            radius = radius.toFixed(0);
            searchInput = Object.assign(searchInput, {radius: radius});
        }

        uri.setSearch(searchInput);
        newSearch = uri.build();

        history.pushState(null, '', newSearch);
    }

    function _getStartDate() {
        var uri = new URI();
        uri = uri.search(true);
        var date = uri.startDate ? moment(uri.startDate) : moment().subtract(29, 'days');
        return date;
    }

    function _getEndDate() {
        var uri = new URI();
        uri = uri.search(true);
        return moment(uri.endDate);
    }

    function _getRadius(unit){
        var result = null;
        var uri = new URI();
        uri = uri.search(true);
        if (uri.radius) {
            result = (unit === "ft") ? uri.radius * 3.28084 : uri.radius;
            result = result.toFixed(0);
        } else {
            result = 1320;
        }
        return result;
    }

    return {
        runURLsearch: _runURLsearch,
        pushIntoUrl: _pushIntoUrl,
        getStartDate: _getStartDate,
        getEndDate: _getEndDate,
        getRadius: _getRadius
    }
})(window, jQuery);
=======
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
>>>>>>> dev
