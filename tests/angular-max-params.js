/**
 * @fileoverview Enforce a maximum number or parameters in functions definitions, except if it's an angular function
 *               (with dependency injection).
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/angular-max-params');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const MESSAGE = {
    first: 'This function has too many parameters (',
    second: '). Maximum allowed is ',
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('angular-max-params', rule, {
    invalid: [
        {
            code: 'function toto1(a, b, c, d) {}',
            errors: [{
                message: MESSAGE.first + '4' + MESSAGE.second + '3.',
            }],
        }, {
            code: 'function toto2(a, b, c, d, e) {}',
            errors: [{
                message: MESSAGE.first + '5' + MESSAGE.second + '4.',
            }],
            options: [4],
        }, {
            code: 'function toto3(a, b, c, d, e) {}',
            errors: [{
                message: MESSAGE.first + '5' + MESSAGE.second + '4.',
            }],
            options: [{
                max: 4,
            }],
        }, {
            code: 'function toto4(a, b, c, d, e) {}',
            errors: [{
                message: MESSAGE.first + '5' + MESSAGE.second + '4.',
            }],
            options: [{
                maximum: 4,
            }],
        }, {
            code: '/* @ngInject */\nfunction toto5(a, b, c, d) {}',
            errors: [{
                message: MESSAGE.first + '4' + MESSAGE.second + '3.',
            }],
            options: [{
                ignoreAngularDI: false,
            }],
        }, {
            code: 'ngInject(function toto6(a, b, c, d) {});',
            errors: [{
                message: MESSAGE.first + '4' + MESSAGE.second + '3.',
            }],
            options: [{
                ignoreAngularDI: false,
            }],
        }, {
            code: 'function toto7(a, b, c, d) {\n    \'ngInject\';\n}',
            errors: [{
                message: MESSAGE.first + '4' + MESSAGE.second + '3.',
            }],
            options: [{
                ignoreAngularDI: false,
            }],
        }, {
            code: 'function toto8(a, b, c, d, e) {\n    "ngInject";\n}',
            errors: [{
                message: MESSAGE.first + '5' + MESSAGE.second + '4.',
            }],
            options: [{
                ignoreAngularDI: false,
                maximum: 4,
            }],
        },
    ],

    valid: [
        'function toto1(a, b, c) {}',
        {
            code: 'function toto2(a, b, c, d) {}',
            options: [4],
        },
        {
            code: 'function toto3(a, b, c, d) {}',
            options: [{
                max: 4,
            }],
        },
        {
            code: 'function toto4(a, b, c, d) {}',
            options: [{
                maximum: 4,
            }],
        },
        {
            code: 'function toto5(a, b, c) {}',
            options: [{
                ignoreAngularDI: false,
            }],
        },
        '/* @ngInject */\nfunction toto6(a, b, c, d) {}',
        {
            code: '/* @ngInject */\nfunction toto7(a, b, c, d) {}',
            options: [{
                ignoreAngularDI: false,
                max: 4,
            }],
        },
        'ngInject(function toto8(a, b, c, d) {});',
        {
            code: 'ngInject(function toto9(a, b, c) {});',
            options: [{
                ignoreAngularDI: false,
            }],
        },
        'function toto10(a, b, c, d) {\n    \'ngInject\';\n}',
        {
            code: 'function toto11(a, b, c, d, e) {\n    \'ngInject\';\n}',
            options: [{
                ignoreAngularDI: false,
                max: 5,
            }],
        },
        'function toto12(a, b, c, d) {\n    "ngInject";\n}',
        {
            code: 'function toto13(a, b, c, d) {\n    "ngInject";\n}',
            options: [{
                ignoreAngularDI: false,
                max: 4,
            }],
        },
    ],
});
