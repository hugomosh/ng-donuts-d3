'use strict';

describe('Module: ngDonutsD3', function() {
    var scope, $sandbox, $compile, $timeout;

    // load the controller's module
    beforeEach(module('hugomosh.ngDonutsD3'));

    beforeEach(inject(function($injector, $rootScope, _$compile_, _$timeout_) {
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
        scope.$digest();
        return $element;
    }

    it('should correctly display hello world', function() {
        var elm = compileDirective();
        expect(elm.text()).toBe('hello world');
    });

    it('should display values of donout directive', function() {
        var elm = compileDirective('donout1');
        console.log(elm.isolateScope().total);
        expect(elm.isolateScope().value).toBe(50);
        expect(elm.isolateScope().total).toBe(100);
    });

    it('should have 3d library', function() {
        var elm = compileDirective('donout2');
        console.log(elm.link());
        expect(elm.isolateScope().total).toBe(80);
        expect(elm.isolateScope().value).toBe(20);
        expect(elm.text()).toBe('20 - 80');
    });

});
