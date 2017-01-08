$(document).ready(function() {
    init();

    function init() {
        formModule.init();
        mapModule.init();
        tableModule.init();
        urlSearchModule.initializeViewModelFromUrlParameters();
    }
});
