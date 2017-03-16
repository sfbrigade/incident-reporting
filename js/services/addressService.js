var addressService = (function(window, $) {

    var MAPZEN_API_KEY = resourceTokensModule.MAPZEN_API_KEY;
    var MAPBOX_ACCESS_TOKEN = resourceTokensModule.MAPBOX_ACCESS_TOKEN;

    var MAPZEN_API_ADDRESS_SUGGESTIONS_URL =
        resourceEndpointsModule.MAPZEN_API_ADDRESS_SUGGESTIONS_URL;
    var MAPZEN_API_ADDRESS_SEARCH_URL =
        resourceEndpointsModule.MAPZEN_API_ADDRESS_SEARCH_URL;
    var MAPBOX_API_REVERSE_GEOLOCATION_URL =
        resourceEndpointsModule.MAPBOX_API_REVERSE_GEOLOCATION_URL;

    function _getAddressSuggestions(partialAddress, callback) {
        var params = {
            api_key: MAPZEN_API_KEY,
            text: partialAddress,
            'focus.point.lat': 37.76,
            'focus.point.lon': -122.43
        };

        $.getJSON(MAPZEN_API_ADDRESS_SUGGESTIONS_URL, params, function(data) {
            var response = [];
            $.each(data.features, function(key, val) {
                response.push({
                    idx: key,
                    name: val.properties.label,
                    latitude: val.geometry.coordinates[1],
                    longitude: val.geometry.coordinates[0]
                });
            });

            callback(response);
        });
    }

    function _getAddress(addressSearchText, callback) {
        var params = {
            api_key: MAPZEN_API_KEY,
            text: addressSearchText
        };

        $.get(MAPZEN_API_ADDRESS_SEARCH_URL, params, callback);
    }

    function _getAddressFromCoordinates(latitude, longitude, callback) {
        var params = { access_token: MAPBOX_ACCESS_TOKEN };

        $.get(MAPBOX_API_REVERSE_GEOLOCATION_URL
            + '/' + longitude + ',' + latitude + '.json', params, callback);
    }

    return {
        getAddressSuggestions: _getAddressSuggestions,
        getAddress: _getAddress,
        getAddressFromCoordinates: _getAddressFromCoordinates
    };

})(window, jQuery);

