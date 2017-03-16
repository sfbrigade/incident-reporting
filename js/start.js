$(document).ready(function() {
    init();

    function init() {
        moment.suppressDeprecationWarnings = true;

        window.addEventListener('popstate',
            urlSearchModule.initializeViewModelFromUrlParameters);

        urlSearchModule.initializeViewModelFromUrlParameters();
        formModule.init();
        mapModule.init();
        tableModule.init();
    }
});
