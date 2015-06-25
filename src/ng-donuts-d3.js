'use strict';


angular.module('ngDonutsD3', [])
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
    .directive('arcod3', function($window) {
        return {
            template: '<svg></svg>',
            restrict: 'EA',
            scope: {
                porcentaje: '=',
                funcioncolor: '=?',
                texto: '=?'
            },
            link: function postLink(scope, element, attrs) {
                var τ = 2 * Math.PI;
                if (!scope.porcentaje) {
                    scope.porcentaje = 50;
                }
                if (!scope.funcioncolor) {
                    scope.funcioncolor = function funcionColor(color) {
                        return 'purple';
                    };
                }


                var d3 = $window.d3; //Obtener objeto d3
                console.log(d3);
                var rawSvg = element.find('svg')[0];
                var svg = d3.select(rawSvg);
                if (!element.height()) {
                    element.height(element.width());
                }
                //console.log(element.width() + ' <W | H> ' + element.height());
                var largo = Math.min(element.width(), element.height());
                if (!largo || largo === 0) {
                    largo = 100;
                }
                svg.style('width', '100%')
                    .style('height', '100%')
                    .attr('viewBox', '0, 0, ' + largo + ', ' + largo)
                    .attr('preserveAspectRatio', 'xMinYMin');
                var arco, resu, textoCentro;
                var amplitud = largo * 0.05;
                var dAmplitud = Math.ceil(amplitud * 0.3);
                var radio = (largo / 2) - dAmplitud;

                var arc = d3.svg.arc()
                    .innerRadius(radio - amplitud)
                    .outerRadius(radio)
                    .startAngle(0);

                function arcTween(transition, newAngle) {
                    transition.attrTween('d', function(d) {
                        var interpolate = d3.interpolate(d.endAngle, newAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);
                        };
                    });
                }

                var build = function build() {
                    svg.select('g').remove();
                    var g = svg.append('g')
                        .attr('transform', 'translate(' + largo / 2 + ',' + largo / 2 + ')');



                    var arcoFondo = d3.svg.arc()
                        .startAngle(0)
                        .endAngle(τ)
                        .innerRadius(radio - amplitud + dAmplitud)
                        .outerRadius(radio - dAmplitud);

                    arco = d3.svg.arc()
                        .startAngle(0)
                        .endAngle(0)
                        .innerRadius(radio - amplitud)
                        .outerRadius(radio);
                    // .cornerRadius(20);//modified d3 api only


                    //Añadir primero el arco de fondo
                    g.append('path')
                        .attr('d', arcoFondo)
                        .attr('fill', function() {
                            return '#eee';
                        });

                    //Añadir arco con porcentaje
                    resu = g.append('path')
                        .datum({
                            endAngle: 0
                        })
                        .attr('d', arco)
                        .attr('fill', function() {
                            return scope.funcioncolor(scope.porcentaje);
                        });
                    //Añadir texto
                    if (scope.texto) {

                        var fontSize = (largo / 4);
                        /*if (!textoCentro) {*/
                        textoCentro = g.append('text')
                            .text(scope.texto)
                            .attr('text-anchor', 'middle')
                            .attr('dx', 2)
                            .attr('class', 'arcod3-texto');
                        fontSize = textoCentro.style('font-size').replace('px', '');
                        textoCentro.attr('dy', fontSize / 3);
                        //textoCentro.select(this).attr('dy',fontSize/3 );
                        //console.log();

                        /*  } else {
                                textoCentro.text(scope.texto);
                            }*/
                    }
                    /*Arco animacion*/

                    resu.transition()
                        .duration(2000)
                        .call(arcTween, scope.porcentaje / 100 * τ);

                    /*Arco animacion*/
                };

                build();
                scope.$watch('porcentaje', function(newValue, oldValue) {
                    if (newValue) {
                        console.log('Build arc3');
                        build();
                    }

                });


            }
        };
    })
    .directive('donoutChart', function($window) {
        var τ = 2 * Math.PI;
        var linkFunction = function link(scope, element, attrs) {
            if (!scope.value) {
                scope.value = 50;
            }
            if (!scope.total || scope.total === 0) {
                scope.total = 100;
            }
            scope.percentage = scope.value / scope.total;
            console.log(scope.colorfun);
            console.log(Object.prototype.toString.call(scope.colorfun));
            if (scope.colorfun && Object.prototype.toString.call(scope.colorfun) !== '[object Function]') {
                scope.colorfun = function funcionColor() {
                    return scope.colorfun.removeDiacritics();
                };
            } else if (!scope.colorfun) {
                scope.colorfun = function funcionColor(color) {
                    return 'orange';
                };
            }

            function arcTween(transition, newAngle) {
                transition.attrTween('d', function(d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
            }


            var d3 = $window.d3;

            //Get the svg created on the template
            var rawSvg = element.find('svg')[0];

            //Get the manipulable object
            var svg = d3.select(rawSvg);

            console.log(element.height() + ' ' + element.prop('offsetHeight'));


            element.on('click', function() {
                element.css({
                    'background-color': 'azure'
                });
            });
            var minLength = Math.min(element.width(), element.height());
            if (!minLength || minLength === 0) {
                minLength = 100;
            }
            svg.style('width', '100%')
                .style('height', '100%')
                .attr('viewBox', '0, 0, ' + minLength + ', ' + minLength)
                .attr('preserveAspectRatio', 'xMinYMin');

            var arco, resu, textoCentro;
            var frontArc, result, textoCentro;


            var breadthPercentage = 0.05;
            var breadth = minLength * breadthPercentage;

            var paddingRadius = Math.ceil(breadth * 0.3); // TODO custum

            var radius = (minLength / 2) - paddingRadius;

            // var arc = d3.svg.arc()
            //     .innerRadius(radio - amplitud)
            //     .outerRadius(radio)
            //     .startAngle(0);


            var arc = d3.svg.arc()
                .innerRadius(radius - breadth)
                .outerRadius(radius)
                .startAngle(0); //Todo, remove

            var drawDout = function build() {
                svg.select('g').remove(); //todo refactor
                var g = svg.append('g')
                    .attr('transform', 'translate(' + minLength / 2 + ',' + minLength / 2 + ')');

                var backgroundArc = d3.svg.arc()
                    .startAngle(0)
                    .endAngle(τ)
                    .innerRadius(radius + paddingRadius - breadth)
                    .outerRadius(radius - paddingRadius); //TOdo

                var frontArc = d3.svg.arc()
                    .startAngle(0)
                    .endAngle(τ)
                    .innerRadius(radius - breadth)
                    .outerRadius(radius); //TOdo

                //Append bacgroundArc first
                g.append('path')
                    .attr('d', backgroundArc)
                    .attr('fill', function() {
                        return '#eee'; // Todo, customize
                    });

                //Append arc with percentage
                result = g.append('path')
                    .datum({
                        endAngle: 0
                    })
                    .attr('d', frontArc)
                    .attr('fill', function() {
                        return scope.colorfun(scope.percentage);
                    });
                result.transition()
                    .duration(2000) //Todo , customize
                    .call(arcTween, scope.percentage * τ);
            };
            drawDout();


        };

        return {
            restrict: 'EAC',
            scope: {
                value: '=',
                total: '=',
                colorfun: '=?',
            },
            template: '<svg class="donout-chart-svg"></svg>',
            link: linkFunction,
        };
    });


// Basado en http://www.ng-newsletter.com/posts/d3-on-angular.html
