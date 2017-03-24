(function() {
    function seekBar($document) {

        /**
        * @function calculatePercent
        * @desc Calculates the horizontal percent along the seek bar where the event (passed in from the view as  $event) occurred.
        * @param {Object} seekBar, event
        * @return offsetXPercent
        */

        var calculatePercent = function(seekBar, event) {

            /**
            * @desc Holds distance between event click and left edge of seek bar
            * @type {Object}
            */

            var offsetX = event.pageX - seekBar.offset().left;

            /**
            * @desc Holds seek bar width
            * @type {Object}
            */

            var seekBarWidth = seekBar.width();

            /**
            * @desc Holds distance between event click and left edge of seek bar as a percent of tatal seek bar width
            * @type {Object}
            */

            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attributes) {
                scope.value = 0;
                scope.max = 100;

                /**
                * @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object so we can call jQuery methods on it.
                * @type {Object}
                */

                var seekBar = $(element);

                /**
                * @function percentString
                * @desc Calculates a percent based on the value and maximum value of a seek bar.
                */

                var percentString = function () {

                    /**
                    * @desc Holds the value of the seek bar, such as the currently playing song time or the current volume. Default value is 0.
                    * @type {Object}
                    * @return percent + "%"
                    */

                    var value = scope.value;

                    /**
                    * @desc Holds the maximum value of the song and volume seek bars. Default value is 100.
                    * @type {Object}
                    */

                    var max = scope.max;

                    /**
                    * @desc Holds value of percentage of current song and volume in seek bars
                    * @type {Object}
                    */

                    var percent = value / max * 100;
                    return percent + "%";
                };

                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                scope.onClickSeekBar = function(event) {

                    /**
                    * @desc Holds value of percentage of current song and volume in seek bars
                    * @type {Object}
                    */

                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };

                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {

                        /**
                        * @desc Holds value of percentage of current song and volume in seek bars
                        * @type {Object}
                        */

                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
