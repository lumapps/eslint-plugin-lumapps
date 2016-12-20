/**
 * @fileoverview Enforce a specific file format.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/file-format');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const FIRST_LINE_MESSAGE = 'First line of the file must be the IIFE function.';
const EMPTY_LINE_MESSAGE = 'The file must end with an empty line.';
const LAST_LINE_MESSAGE = 'Last line (before the empty one) must be the call of the IIFE.';
const MISSING_STRICT_MESSAGE = 'Expected \'use strict\'; to be the first statement of the IIFE.';
const MISSING_SEPARATOR_MESSAGE = 'Expected a separator after the \'use strict\'; statement.';
const SEPARATOR_FORMAT_MESSAGE = 'Stub separator is not at the right format.';
const MISSING_STUB_SEPARATOR_MESSAGE = {
    EVENTS: 'Expected to see the events stub separator.',
    PRIVATE_ATTRIBUTES: 'Expected to see the private attributes stub separator.',
    PRIVATE_FUNCTIONS: 'Expected to see the private functions stub separator.',
    PUBLIC_ATTRIBUTES: 'Expected to see the public attributes stub separator.',
    PUBLIC_FUNCTIONS: 'Expected to see the public functions stub separator.',
    WATCHERS: 'Expected to see the watchers stub separator.',
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('file-format', rule, {
    invalid: [
        {
            code: "'use strict';\nvar toto = 1;\nconsole.log(toto);\n",
            errors: [{
                message: FIRST_LINE_MESSAGE,
            }, {
                message: MISSING_STRICT_MESSAGE,
            }, {
                message: LAST_LINE_MESSAGE,
            }],
        }, {
            code: "(function IIFE() {\n    'use strict';\n        var _toto = 2;\n        console.log(_toto);\n})\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }, {
                message: MISSING_SEPARATOR_MESSAGE,
            }, {
                message: LAST_LINE_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '(function IIFE() {\n\n    /////////////////////////////\n\n    var _toto = 3;\n    console.log(_toto);\n})();\n',
            errors: [{
                message: MISSING_STRICT_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        var _toto = 4;\n    console.log(_toto);\n})();",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }, {
                message: EMPTY_LINE_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        var _toto = 5;\n\n    /////////////////////////////\n    //    Private functions    //\n    /////////////////////////////\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }, {
                message: SEPARATOR_FORMAT_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    /////////////////////////\n    //  Private functions  //\n    /////////////////////////\n\n        var _toto = 6;\n})();\n",
            errors: [{
                message: SEPARATOR_FORMAT_MESSAGE,
            }, {
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_ATTRIBUTES,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        var vm = this;\n\n        vm.toto = 7;\n    console.log(vm.toto);\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_ATTRIBUTES,
            }],
            options: [{
                ignorePrivatePattern: '\\s*(([^ ]+S|s)(ervice|vc)[^ ]*\\s*=\\s*{}|([^ ]+)\\s*=\\s*this);$',
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        function _toto() { console.log('coucou 1'); }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PRIVATE_FUNCTIONS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        function toto() { console.log('coucou 2'); }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.PUBLIC_FUNCTIONS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($scope) {\n        $scope.$on('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.EVENTS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($rootScope) {\n        $rootScope.$on('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.EVENTS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($scope) {\n        $scope.$watchCollection('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($rootScope) {\n        $rootScope.$watchCollection('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($scope) {\n        $scope.$watch('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($rootScope) {\n        $rootScope.$watch('toto', function() { console.log('toto'); });\n    }\n})();\n",
            errors: [{
                message: MISSING_STUB_SEPARATOR_MESSAGE.WATCHERS,
            }],
        },
    ],

    valid: [
        {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    /////////////////////////////\n    //                         //\n    //    Private attributes   //\n    //                         //\n    /////////////////////////////\n\n        var _toto = 101;\n    var ctrl = this;\n    var service1 = {};\n    console.log(_toto);\n})();\n",
            options: [{
                ignorePrivatePattern: '\\s*(([^ ]+S|s)(ervice|vc)[^ ]*\\s*=\\s*{}|(.+)\\s*=\\s*this);$',
            }],
        },
        // eslint-disable-next-line max-len
        "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    /////////////////////////////\n\n    /////////////////////////////\n    //                         //\n    //    Private attributes   //\n    //                         //\n    /////////////////////////////\n\n        var _toto = 102;\n\n    /////////////////////////////\n    //                         //\n    //    Private functions    //\n    //                         //\n    /////////////////////////////\n})();\n",
        // eslint-disable-next-line max-len
        "/* eslint-disable lumapps/file-format */\n'use strict';\n\n    /////////////////////////////\n\n    /////////////////////////////\n\n    /////////////////////////////\n    //                         //\n    //    Private attributes   //\n    //                         //\n    /////////////////////////////\n\n        var _toto = 102;\n\n    /////////////////////////////\n    //                         //\n    //    Private functions    //\n    //                         //\n    /////////////////////////////\n",
        // eslint-disable-next-line max-len
        "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($scope) {\n        /////////////////////////////\n        //                         //\n        //        Watchers         //\n        //                         //\n        /////////////////////////////\n\n        $scope.$watch('toto', function() { console.log('toto'); });\n    }\n})();\n",
        // eslint-disable-next-line max-len
        "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n    function toto($scope) {\n        /////////////////////////////\n        //                         //\n        //          Events         //\n        //                         //\n        /////////////////////////////\n\n        $scope.$on('toto', function() { console.log('toto'); });\n    }\n})();\n",
        // eslint-disable-next-line max-len
        "// Toto.\n/* Tata. */\n/**\n * Titi.\n * Toto.\n */\n\n(function IIFE() {\n    // This is a comment.\n\n    'use strict';\n\n    /////////////////////////////\n})();\n",
        {
            // eslint-disable-next-line max-len
            code: "(function IIFE() {\n    'use strict';\n\n    /////////////////////////////\n\n        var testService2 = {};\n\n    /////////////////////////////\n\n    /////////////////////////////\n    //                         //\n    //    Private attributes   //\n    //                         //\n    /////////////////////////////\n\n    /////////////////////////////\n    //                         //\n    //    Private functions    //\n    //                         //\n    /////////////////////////////\n})();\n",
            options: [{
                ignorePrivatePattern: '\\s*(([^ ]+S|s)(ervice|vc)[^ ]*\\s*=\\s*{}|([^ ]+)\\s*=\\s*this);$',
            }],
        },
    ],
});
