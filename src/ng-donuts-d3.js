'use strict';


// Basado en http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('module.d3', [])
    .factory('d3Service', ['$document', '$q', '$rootScope',
        function($document, $q, $rootScope) {
            var d = $q.defer();

            function onScriptLoad() {
                    // Load client in the browser
                    $rootScope.$apply(function() {
                        d.resolve(window.d3);
                    });
                }
                // Create a script tag with d3 as the source
                // and call our onScriptLoad callback when it
                // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'http://d3js.org/d3.v3.min.js';
            scriptTag.onreadystatechange = function() {
                if (this.readyState == 'complete') onScriptLoad();
            }
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return {
                d3: function() {
                    return d.promise;
                }
            };
        }
    ]);

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
    .directive('donoutChart', function($window) {
        function link(scope, element, attrs) {
            //Obtener objeto d3
            var d3 = $window.d3;


            // var format,
            //     timeoutId;

            // function updateTime() {
            //     element.text(dateFilter(new Date(), format));
            // }

            // scope.$watch(attrs.myCurrentTime, function(value) {
            //     format = value;
            //     updateTime();
            // });

            // element.on('$destroy', function() {
            //     $interval.cancel(timeoutId);
            // });

            // // start the UI update process; save the timeoutId for canceling
            // timeoutId = $interval(function() {
            //     updateTime(); // update DOM
            // }, 1000);



        }

        return {
            restrict: 'EAC',
            scope: {
                value: '=',
                total: '=',
            },
            template: '<svg class="donout-chart-svg"></svg>',
            link: link,
            //template: '<span>{{value||50}} - {{total||100}}</span>'
            /*compile: function compile(tElement, tAttrs, transclude) {
                tElement.html('<span>{{value||50}} {{total||100}}</span>');
                return function postLink(scope, iElement, iAttrs, controller) {
                    scope.name = 'world';
                };
            }*/
        };
    });
