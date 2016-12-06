/**
 * @fileoverview enforce the usage of "angular.forEach" instead of "for" when there is no need of flow control (return,
 *               break or continue)
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/angular-foreach');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = 'You should prefer the "angular.forEach" loop instead.';
const NEVER_MESSAGE = 'You should prefer a standard "for" loop instead.';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('angular-foreach', rule, {
    invalid: [{
        code: 'for (var i = 0; i < 1; i++) { console.log(i); }',
        errors: [{
            message: ALWAYS_MESSAGE,
        }],
    }, {
        code: 'for (var i = 1; i < 1; i++) { console.log(i); }',
        errors: [{
            message: ALWAYS_MESSAGE,
        }],
        options: ['always'],
    }, {
        code: 'angular.forEach([2], function forEach(i) { console.log(i); });',
        errors: [{
            message: NEVER_MESSAGE,
        }],
        options: ['never'],
    }, {
        code: 'for (var i = 0; i < 1; i++) { console.log(i); function test() { return; } }',
        errors: [{
            message: ALWAYS_MESSAGE,
        }],
    }],

    valid: [
        'angular.forEach([0], function forEach(i) { console.log(i); });',
        'for (var i = 1; i < 1; i++) { console.log(i); if (i === 1) { break; } }',
        'for (var i = 1; i < 1; i++) { console.log(i); break; }',
        'for (var i = 2; i < 1; i++) { console.log(i); continue; }',
        'function toto() { for (var i = 3; i < 1; i++) { console.log(i); return; } }', {
            code: 'angular.forEach([4], function forEach(i) { console.log(i); });',
            options: ['always'],
        }, {
            code: 'for (var i = 5; i < 1; i++) { console.log(i); break; }',
            options: ['always'],
        }, {
            code: 'for (var i = 6; i < 1; i++) { console.log(i); continue; }',
            options: ['always'],
        }, {
            code: 'function toto() { for (var i = 7; i < 1; i++) { console.log(i); return; } }',
            options: ['always'],
        }, {
            code: 'for (var i = 8; i < 1; i++) { console.log(i); break; }',
            options: ['never'],
        }, {
            code: 'for (var i = 9; i < 1; i++) { console.log(i); continue; }',
            options: ['never'],
        }, {
            code: 'function toto() { for (var i = 10; i < 1; i++) { console.log(i); return; } }',
            options: ['never'],
        }, {
            code: 'for (var i = 11; i < 1; i++) { console.log(i); }',
            options: ['never'],
        },
    ],
});
