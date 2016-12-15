/**
 * @fileoverview Enforce the usage of "angular.is[Un]defined[AndFilled|OrEmpty]" instead of "_.isEmpty".
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/underscore-isempty');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_DEFINED_MESSAGE = 'You should use "angular.isDefinedAndFilled" instead.';
const ALWAYS_UNDEFINED_MESSAGE = 'You should use "angular.isUndefinedOrEmpty" instead.';
const NEVER_MESSAGE = 'You should use "_.isEmpty" instead.';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('underscore-isempty', rule, {
    invalid: [
        {
            code: 'if (_.isEmpty(toto1)) { console.log(toto); }',
            errors: [{
                message: ALWAYS_UNDEFINED_MESSAGE,
            }],
        }, {
            code: 'if (_.isEmpty(toto2)) { console.log(toto); }',
            errors: [{
                message: ALWAYS_UNDEFINED_MESSAGE,
            }],
            options: ['always'],
        }, {
            code: 'if (!_.isEmpty(toto3)) { console.log(toto); }',
            errors: [{
                message: ALWAYS_DEFINED_MESSAGE,
            }],
        }, {
            code: 'if (!_.isEmpty(toto4)) { console.log(toto); }',
            errors: [{
                message: ALWAYS_DEFINED_MESSAGE,
            }],
            options: ['always'],
        }, {
            code: 'if (angular.isDefinedAndFilled(toto5)) { console.log(toto); }',
            errors: [{
                message: NEVER_MESSAGE,
            }],
            options: ['never'],
        }, {
            code: 'if (angular.isUndefinedOrEmpty(toto6)) { console.log(toto); }',
            errors: [{
                message: NEVER_MESSAGE,
            }],
            options: ['never'],
        }, {
            code: 'if (toto7.length) { console.log(toto); }',
            errors: [{
                message: ALWAYS_DEFINED_MESSAGE,
            }],
            options: ['always'],
        }, {
            code: 'if (toto8.length > 0) { console.log(toto); }',
            errors: [{
                message: ALWAYS_DEFINED_MESSAGE,
            }],
            options: ['always'],
        }, {
            code: 'if (toto8.length === 0) { console.log(toto); }',
            errors: [{
                message: ALWAYS_UNDEFINED_MESSAGE,
            }],
            options: ['always'],
        },
    ],

    valid: [
        'if (angular.isDefinedAndFilled(toto1)) { console.log(toto); }',
        {
            code: 'if (angular.isDefinedAndFilled(toto2)) { console.log(toto); }',
            options: ['always'],
        },
        'if (angular.isUndefinedOrEmpty(toto3)) { console.log(toto); }',
        {
            code: 'if (angular.isUndefinedOrEmpty(toto4)) { console.log(toto); }',
            options: ['always'],
        }, {
            code: 'if (_.isEmpty(toto5)) { console.log(toto); }',
            options: ['never'],
        }, {
            code: 'if (!_.isEmpty(toto6)) { console.log(toto); }',
            options: ['never'],
        }, {
            code: 'if (toto7.length) { console.log(toto); }',
            options: ['never'],
        }, {
            code: 'if (toto7.length > 0) { console.log(toto); }',
            options: ['never'],
        }, {
            code: 'if (toto7.length === 0) { console.log(toto); }',
            options: ['never'],
        }, {
            code: 'if (toto8.length > 1) { console.log(toto); }',
            options: ['always'],
        },
    ],
});
