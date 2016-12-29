var alertsModule = (function(window, $) {
    function _makeAlert(alertType, message) {
        var $alert = $('<div>');
        $alert.addClass('alert');
        $alert.addClass('alert-dismissable');
        $alert.addClass('alert-' + alertType);
        $alert.attr('role', 'alert');
        $alert.text(message);

        var $button = $('<button>');
        $button.addClass('close');
        $button.attr('type', 'button');
        $button.attr('data-dismiss', 'alert');
        $button.html('&times;');

        $alert.prepend($button);
        return $alert;
    }

    function showAlert(alertType, message) {
        var $alert = _makeAlert(alertType, message);
        $('#alert-row').append($alert);
    }

    return {
        showAlert: showAlert
    };
})(window, jQuery);
