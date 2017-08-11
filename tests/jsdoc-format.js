/**
 * @fileoverview Enforce the correct format and alignment of the JSDoc.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/jsdoc-format');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const PARAM_TOO_MANY_SPACES_ERROR_MESSAGE = 'Too many spaces before the param (no return in the JSDoc)';
const RETURN_TOO_MANY_SPACES_ERROR_MESSAGE = 'Too many spaces before the return type';
// eslint-disable-next-line max-len
const PARAM_TOO_FEW_SPACES_ERROR_MESSAGE = 'Not enough spaces before the param type (param type should be aligned with return type)';
const TYPE_BADLY_FORMATTED = 'Type is badly formatted';
// eslint-disable-next-line max-len
const PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE = 'Params name should be aligned (with other param names and with return description).';
const RETURN_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE = 'Return description should be aligned with params names.';
const NAME_BADLY_FORMATTED = "Name is missing, badly formatted or doesn't follow convention";
const PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE = 'Params description should be aligned.';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('jsdoc-format', rule, {
    invalid: [
        {
            // eslint-disable-next-line max-len
            code: '/**\n * Description of the function 1.\n *\n * @param  {string} toto Description of the first parameter.\n */',
            errors: [{
                message: PARAM_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param  {string} toto2 Description of the first parameter.\n */',
            errors: [{
                message: PARAM_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * Description of the function 2.\n *\n * @param  {string} toto Description of the first parameter.\n * @param  {string} titi Description of the second parameter.\n */',
            errors: [{
                message: PARAM_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param  {string} toto3 Description of the first parameter.\n * @param  {string} titi Description of the second parameter.\n */',
            errors: [{
                message: PARAM_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * Description of the function 3.\n *\n * @param {string} toto Description of the first parameter.\n * @return {string} Descrition of the return.\n */',
            errors: [{
                message: PARAM_TOO_FEW_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string} toto4 Description of the first parameter.\n * @return {string} Descrition of the return.\n */',
            errors: [{
                message: PARAM_TOO_FEW_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * Description of the function 4.\n *\n * @return  {string} Description of the return.\n */',
            errors: [{
                message: RETURN_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @return  {string} Description of the return 1.\n */',
            errors: [{
                message: RETURN_TOO_MANY_SPACES_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {} toto5 Description of the param.\n */',
            errors: [{
                message: TYPE_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param string} toto6 Description of the param.\n */',
            errors: [{
                message: TYPE_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string toto7 Description of the param.\n */',
            errors: [{
                message: TYPE_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string} toto8 Description of the first param.\n * @param {boolean} titi Description of the second param.\n */',
            errors: [{
                message: PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {boolean} toto9 Description of the first param.\n * @param {string} titi Description of the second param.\n */',
            errors: [{
                message: PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param  {boolean} toto10 Description of the first param.\n * @return {string} Description of the return.\n */',
            errors: [{
                message: RETURN_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param  {string} toto11 Description of the first param.\n * @return {boolean} Description of the return.\n */',
            errors: [{
                message: PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string} Description of the param 1.\n */',
            errors: [{
                message: NAME_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string} [toto12 Description of the param.\n */',
            errors: [{
                message: NAME_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string} toto13] Description of the param.\n */',
            errors: [{
                message: NAME_BADLY_FORMATTED,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string}  toto13 Description of the first param.\n * @param {boolean} longerToto Description of the second param.\n */',
            errors: [{
                message: PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {boolean} longerToto Description of the first param.\n * @param {string}  toto15 Description of the second param.\n */',
            errors: [{
                message: PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE,
            }],
        }, {
            // eslint-disable-next-line max-len
            code: '/**\n * @param {string}  toto16     Description of the first param.\n * @param {boolean} longerToto Description of the second param.\n * @param {boolean} titi Description of the third param.\n */',
            errors: [{
                message: PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE,
            }],
        },
    ],

    valid: [
        // eslint-disable-next-line max-len
        '/**\n * Description of the function.\n *\n * @param  {string}  toto     Description of the first parameter.\n * @param  {boolean} titi     Description of the second parameter.\n * @param  {number}  longName Description of the third parameter.\n * @return {boolean} Description of the return.\n */',
        // eslint-disable-next-line max-len
        '/**\n * Description of the function.\n *\n * @param  {string}  toto      Description of the first parameter.\n * @param  {boolean} titi      Description of the second parameter.\n * @param  {number}  longName  Description of the third parameter.\n * @param  {Array}   [tutu=12] Description of the fourth parameter.\n * @return {boolean} Description of the return.\n */',
        // eslint-disable-next-line max-len
        '/**\n * Description of the function.\n *\n * @param {string}  toto Description of the first parameter.\n * @param {boolean} titi Description of the second parameter.\n */',
        '// This is not a JSDoc comment.',
        '/* This is not a JSDoc comment. */',
        '/* This is not a JSDoc comment. */',
        '/** This is not a JSDoc comment. */',
        '/** @param {Is} a Valid JSDoc. */',
        '/** @return {Is} A valid JSDoc. */',
        '/** This is not\n * a JSDoc comment. */',
        '/** This is not\n * a JSDoc comment.\n */',
        '/**\n * This is not a JSDoc comment.\n */',
        "/**\n * @description This JSDoc comment don't need to be checked.\n */",
        '/**\n * @param {This} jsDoc Comment is valid.\n */',
        '/**\n * @return {This} JSDoc comment is valid.\n */',
    ],
});
