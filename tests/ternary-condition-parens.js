/**
 * @fileoverview enforce a given pattern for comments
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/ternary-condition-parens');
const RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = 'Expected parentheses around condition of ternary expression.';
const NEVER_MESSAGE = 'Unexpected parentheses around condition of ternary expression.';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('ternary-condition-parens', rule, {
    valid: [
        '(true) ? true : false', {
            code: '(true) ? true : false',
            options: ['always'],
        }, {
            code: 'true ? true : false',
            options: ['never'],
        },
    ],

    invalid: [{
        code: 'true ? true : false',
        errors: [{
            message: ALWAYS_MESSAGE,
        }, ],
    }, {
        code: 'true ? true : false',
        options: ['always'],
        errors: [{
            message: ALWAYS_MESSAGE,
        }, ],
    }, {
        code: '(true) ? true : false',
        options: ['never'],
        errors: [{
            message: NEVER_MESSAGE,
        }, ],
    }, ],
});
