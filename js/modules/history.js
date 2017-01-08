var historyModule = (function() {

    function _saveSearchUrl() {
        var uri = new URI();
        var params = { state: JSON.stringify(getState()) };
        uri.setSearch(params);
        history.pushState(null, '', uri.build());
    }

    function getState() {
        var state = {};
        Object.keys(viewModelModule).forEach(function(key) {
            var value = viewModelModule[key];
            if(value !== undefined && value !== null) {
                state[key] = value;
            }
        });

        return state;
    }

    return {
        saveSearchUrl: _saveSearchUrl
    }
})();
