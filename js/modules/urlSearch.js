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
            });
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
