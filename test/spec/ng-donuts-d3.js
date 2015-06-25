'use strict';

describe('Module: ngDonutsD3', function() {
    var scope, $sandbox, $compile, $timeout, $window;

    // load the controller's module
    beforeEach(module('ngDonutsD3'));

    beforeEach(inject(function($injector, $rootScope, _$compile_, _$timeout_, _$window_) {
        $window = _$window_;
        scope = $rootScope;
        $compile = _$compile_;
        $timeout = _$timeout_;

        $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    }));

    afterEach(function() {
        $sandbox.remove();
        scope.$destroy();
    });

    var templates = {
        'default': {
            scope: {},
            element: '<div my-directive></div>'
        },
        'donout1': {
            scope: {},
            element: '<div donout-chart></div>'
        },
        'donout2': {
            scope: {},
            element: '<div donout-chart value="20" total="80"></div>'
        }
    };

    function compileDirective(template) {
        template = template ? templates[template] : templates['default'];
        angular.extend(scope, template.scope || templates['default'].scope);
        var $element = $(template.element).appendTo($sandbox);
        $element = $compile($element)(scope);
        //scope.$digest();
        scope.$apply();
        return $element;
    }

    it('should correctly display hello world', function() {
        var element = compileDirective();
        expect(element.text()).toBe('hello world');
    });

    it('should display values of donout directive', function() {
        var element = compileDirective('donout1');
        expect(element.isolateScope().value).toBe(50);
        expect(element.isolateScope().total).toBe(100);
    });

    it('should have 3d library', function() {
        var element = compileDirective('donout2');
        expect(element.isolateScope().total).toBe(80);
        expect(element.isolateScope().value).toBe(20);
    });

    it('should contain an svg', function() {
        var element = compileDirective('donout2');
        //console.log(elm.find('svg'));
        expect(element.find('svg').length).toBe(1);
    });

    it('should have width == height', function() {
        var element = compileDirective('donout2');
        console.log(element.prop('offsetWidth'), element.prop('offsetHeight'));

        expect(element.prop('offsetHeight')).toBe(element.prop('offsetWidth'));
    });

});
