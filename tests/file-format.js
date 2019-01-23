/**
 * @fileoverview Enforce a specific file format.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const dedent = require('dedent-js');

const rule = require('../rules/file-format');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const EMPTY_LINE_MESSAGE = `The file must end with an empty line.`;
const SEPARATOR_FORMAT_MESSAGE = `Stub separator is not at the right format.`;
const MISSING_STUB_SEPARATOR_MESSAGE = {
    EVENTS: `Expected to see the events stub separator.`,
    PRIVATE_ATTRIBUTES: `Expected to see the private attributes stub separator.`,
    PRIVATE_FUNCTIONS: `Expected to see the private functions stub separator.`,
    PUBLIC_ATTRIBUTES: `Expected to see the public attributes stub separator.`,
    PUBLIC_FUNCTIONS: `Expected to see the public functions stub separator.`,
    WATCHERS: `Expected to see the watchers stub separator.`,
};
const PRIVATE_VARIABLE_PREFIXED = `Expected private variable to be prefixed by "_".`;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('file-format', rule, {
    invalid: [
        {
            code: dedent`

            function TestFunction() {
                var _toto = 2;
                console.log(_toto);
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                var _toto = 4;
                console.log(_toto);
            }
            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }, {
                message: EMPTY_LINE_MESSAGE,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                var _toto = 5;

                /////////////////////////////
                //    Private functions    //
                /////////////////////////////
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }, {
                message: SEPARATOR_FORMAT_MESSAGE,
            }],
        },

        {
            code: dedent`

            function TestFunction() {

                /////////////////////////////
                //    Private functions    //
                /////////////////////////////

                var _toto = 6;
            }

            `,

            errors: [{
                message: SEPARATOR_FORMAT_MESSAGE,
            }, {
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                var vm = this;

                vm.toto = 7;
                console.log(vm.toto);
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_ATTRIBUTES,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                function _toto() {
                    console.log('coucou 1');
                }
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_FUNCTIONS,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                function toto() {
                    console.log('coucou 2');
                }
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_FUNCTIONS,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                vm.toto = function toto() {
                    console.log('coucou 2');
                };
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_FUNCTIONS,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                this.toto = function toto() {
                    console.log('coucou 2');
                };
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_FUNCTIONS,
            }],
        },

        {
            code: dedent`

            function TestFunction($scope) {
                $scope.$on('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.EVENTS,
            }],
        },

        {
            code: dedent`

            function TestFunction($rootScope) {
                $rootScope.$on('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.EVENTS,
            }],
        },

        {
            code: dedent`

            function TestFunction($scope) {
                $scope.$watchCollection('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        },

        {
            code: dedent`

            function TestFunction($rootScope) {
                $rootScope.$watchCollection('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        },

        {
            code: dedent`

            function TestFunction($scope) {
                $scope.$watch('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        },

        {
            code: dedent`

            function TestFunction($rootScope) {
                $rootScope.$watch('toto', function() {
                    console.log('toto');
                });
            }

            `,

            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                var service = {};

                /////////////////////////////
                //                         //
                //     Public functions    //
                //                         //
                /////////////////////////////

                function toto() {
                    console.log('Toto');
                }
                function titi() {
                    console.log('Titi');
                }

                /////////////////////////////

                service.toto = toto;
                service.tata = tata;
                service.titi = titi;
            }

            `,
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_ATTRIBUTES,
            }],
        },

        {
            code: dedent`

            function TestFunction() {
                /////////////////////////////
                //                         //
                //    Private attributes   //
                //                         //
                /////////////////////////////

                var toto = 102;

                /////////////////////////////
                //                         //
                //    Private functions    //
                //                         //
                /////////////////////////////
            }

            `,

            errors: [{
                message: PRIVATE_VARIABLE_PREFIXED,
            }],
        },
    ],

    valid: [
        dedent`

        var toto = 1;
        console.log(toto);

        `,

        dedent`

        var _toto = 3;
        console.log(_toto);

        `,

        dedent`

        function TestFunction() {
            var vm = this;
            var service = {};
            var svc = {};
            var serviceTest = {};

            /////////////////////////////
            //                         //
            //    Private attributes   //
            //                         //
            /////////////////////////////

            var _toto = 101;

            /////////////////////////////
            //                         //
            //    Public attributes    //
            //                         //
            /////////////////////////////

            vm.titi = 1011;
            ctrl.titi = 1012;
            service.titi = 1013;
            svc.titi = 1014;
            serviceTest.titi = 1015;

            /////////////////////////////
            //                         //
            //    Private functions    //
            //                         //
            /////////////////////////////

            function _titi() {
                console.log(vm.titi);
            }

            /////////////////////////////
            //                         //
            //     Public functions    //
            //                         //
            /////////////////////////////

            function toto() {
                console.log(_toto);
            }

            /////////////////////////////

            vm.toto = toto;
            ctrl.toto = toto;
            service.toto = toto;
            svc.toto = toto;
            serviceTest.toto = toto;

            /////////////////////////////

            /**
             * Initialize the controller.
             */
            function init() {
                console.log('Init');
            }

            init();
        }

        `,

        dedent`

        function TestFunction() {
            /////////////////////////////
            //                         //
            //    Private attributes   //
            //                         //
            /////////////////////////////

            var _toto = 102;

            /////////////////////////////
            //                         //
            //    Private functions    //
            //                         //
            /////////////////////////////
        }

        `,

        dedent`

        function TestFunction() {
            var service = {};

            /////////////////////////////
            //                         //
            //     Public functions    //
            //                         //
            /////////////////////////////

            function toto() {
                console.log('Toto');
            }
            function titi() {
                console.log('Titi');
            }

            /////////////////////////////

            service.toto = toto;
            service.titi = titi;
        }

        `,

        dedent`

        /* eslint-disable lumapps/file-format */
        'use strict';

        /////////////////////////////

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        var _toto = 102;

        `,

        dedent`

        function TestFunction($scope) {
            /////////////////////////////
            //                         //
            //        Watchers         //
            //                         //
            /////////////////////////////

            $scope.$watch('toto', function() {
                console.log('toto');
            });
        }

        `,

        dedent`

        function TestFunction($scope) {
            /////////////////////////////
            //                         //
            //          Events         //
            //                         //
            /////////////////////////////

            $scope.$on('toto', function() {
                console.log('toto');
            });
        }

        `,

        dedent`

        // Toto.
        /* Tata. */
        /**
         * Titi.
         * Toto.
         */

        // This is a comment.

        `,

        dedent`

        // Toto.
        /* Tata. */
        /**
         * Titi.
         * Toto.
         */

        // This is a comment.

        `,

        dedent`

        /* @ngInject */
        function TestFunction() {
            var testService2 = {};
        }

        `,

        {
            code: dedent`

            /* eslint-disable lumapps/file-format */
            /* @ngInject */
            function TestFunction() {
                /////////////////////////////
                //                         //
                //    Private attributes   //
                //                         //
                /////////////////////////////

                var toto = 102;
            }

            `,

            options: [{
                ignorePrivateFormat: true,
            }],
        },

        dedent`

        /* @ngInject */
        function TestFunction() {
            /**
             * Initialize the controller.
             */
            function init() {
                console.log('Coucou 0');
            }

            init();
        }

        `,

        dedent`

        /* @ngInject */
        function TestFunction() {
            var vm = this;

            /////////////////////////////

            /**
             * Initialize the controller.
             */
            vm.init = function init() {
                console.log('Coucou 1');
            };

            vm.init();
        }

        `,

        dedent`

        /* @ngInject */
        function TestFunction() {
            /**
             * Initialize the controller.
             */
            this.init = function init() {
                console.log('Coucou 2');
            };

            this.init();
        }

        `,

        dedent`

        /* @ngInject */
        function TestFunction() {
            var vm = this;

            /////////////////////////////
            //                         //
            //     Public functions    //
            //                         //
            /////////////////////////////

            vm.toto = function toto() {
                console.log('Coucou 3');
            };
        }

        `,

        dedent`

        /* @ngInject */
        function TestFunction() {
            /////////////////////////////
            //                         //
            //     Public functions    //
            //                         //
            /////////////////////////////

            this.toto = function toto() {
                console.log('Coucou 4');
            };
        }

        `,
    ],
});
