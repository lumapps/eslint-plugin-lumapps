/**
 * @fileoverview enforce a given pattern for comments
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/comments-sentences');
const RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const SPACE_ERROR_MESSAGE = 'Not starting by spaces';
const UPPERCASE_ERROR_MESSAGE = 'Not starting by an uppercase letter while it should';
const LOWERCASE_ERROR_MESSAGE = 'Starting by an uppercase letter while it should not';
const PUNCTUATION_ERROR_MESSAGE = 'Line does not end by a punctuation';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('comments-sentences', rule, {
    valid: [
        '// This is a valid comment.',
        '// 29 is a valid comment.',
        '// @description This is a valid comment.',
        '//@description This is a valid comment.',
        '// @description This is a valid comment',
        '// "This" is a valid comment.',
        '// \'This\' is a valid comment.',
        '// +42 is a valid comment.',
        '// _myVar is a valid comment.',
        '/*\n * This is a valid comment.\n */',
        '/*\n * This is a valid comment.\n * That has multiple sentences.\n */',
        '/**\n * This is a valid comment.\n */',
        '/**\n * This is a valid comment.\n * That has multiple sentences.\n */',
        '/**\n * This is a valid comment,\n * with one long sentence.\n */',
        '/*\n * This is a valid comment,\n * with one long sentence.\n */',
        '////////',
        '/*******/',
    ],

    invalid: [{
        code: '// this is not a valid comment.',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }],
    }, {
        code: '// This is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '//This is not a valid comment.',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, {
        code: '//this is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, {
        code: '// this is not a valid comment',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }],
    }, {
        code: '// 29 is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '// +42 is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '//_myVar is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, {
        code: '//"This" is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, {
        code: '// \'This\' is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '// \'This\' is not a valid comment,\n// that spans on multi-line.',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, {
            message: UPPERCASE_ERROR_MESSAGE,
        }],
    }, {
        code: '/* 42 is not a valid comment,\n * That spans on multi-line.\n */',
        errors: [{
            message: LOWERCASE_ERROR_MESSAGE,
        }],
    }, {
        code: '/* _myVar is not a valid comment.\n * that spans on multi-line.\n */',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }],
    }, {
        code: '/* This is not a valid comment.\n * It spans on multi-line\n */',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '/* This is not a valid comment,\n * it spans on multi-line\n */',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }],
    }, {
        code: '/* This is not a valid comment,\n *it spans on multi-line.\n */',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, {
        code: '/* This is not a valid comment.\n *Tt spans on multi-line.\n */',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }],
    }, ],
});
