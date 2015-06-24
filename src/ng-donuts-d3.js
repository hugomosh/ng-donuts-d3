'use strict';

angular.module('hugomosh.ngDonutsD3', [])
    .directive('myDirective', function() {

        return {
            restrict: 'EAC',
            scope: true,
            compile: function compile(tElement, tAttrs, transclude) {
                tElement.html('<span>hello {{name}}</span>');
                return function postLink(scope, iElement, iAttrs, controller) {
                    scope.name = 'world';
                };
            }
        };
    })
    .directive('donoutChart', function() {
        function link(scope, element, attrs) {
            var format,
                timeoutId;

            function updateTime() {
                element.text(dateFilter(new Date(), format));
            }

            scope.$watch(attrs.myCurrentTime, function(value) {
                format = value;
                updateTime();
            });

            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
                updateTime(); // update DOM
            }, 1000);
        }

        return {
            restrict: 'EAC',
            scope: {
                value: '=',
                total: '=',
            },
            template: '<span>{{value||50}} - {{total||100}}</span>'
                /*compile: function compile(tElement, tAttrs, transclude) {
                    tElement.html('<span>{{value||50}} {{total||100}}</span>');
                    return function postLink(scope, iElement, iAttrs, controller) {
                        scope.name = 'world';
                    };
                }*/
        };
    });
