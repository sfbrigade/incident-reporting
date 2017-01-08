var addressService = (function(window, $) {

    var _lastAutocompleteQueryTime = moment();

    function _getAddressSuggestions(partialAddress, callback) {
        var params = {
            api_key: 'search-kz-89WY',
            text: partialAddress,
            'focus.point.lat': 37.76,
            'focus.point.lon': -122.43
        };

        var timeDifference = moment(_lastAutocompleteQueryTime).diff(moment(), "milliseconds") * -1;

        if (timeDifference < 150) {
            return false;
        }

        _lastAutocompleteQueryTime = moment();

        $.getJSON("//search.mapzen.com/v1/autocomplete", params, function(data) {
            var response = [];
            $.each(data.features, function(key, val) {
                response.push({
                    idx: key,
                    name: val.properties.label
                });
            });

            callback(response);
        });
    }

    function _getAddress(addressSearchText, callback) {
        var params = {
            api_key: 'search-kz-89WY',
            text: addressSearchText
        };

        $.get("//search.mapzen.com/v1/search", params, callback);
    }

    return {
        getAddressSuggestions: _getAddressSuggestions,
        getAddress: _getAddress
    };

})(window, jQuery);

