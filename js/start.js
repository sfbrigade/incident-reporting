$(document).ready(function() {
    init();

    function init() {
        window.incidentService = new IncidentService(config.incidentServiceOptions);

        formModule.init();
        mapModule.init();
        tableModule.init();
        urlSearchModule.initializeViewModelFromUrlParameters();
    }
});
