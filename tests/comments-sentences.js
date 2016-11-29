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
        '// This is a valid comment //', {
            code: '/**\n * Translation Service.\n * Allow to translate a string using pascalprecht angular translate module or using an array of string.\n *\n * You must have angular-translate (pascalprecht.translate) module available to use this service.\n * Remember to declare your language in angular-translate:\n *      $translateProvider.translations("<langCode: en/fr/es, ...>",\n *      {\n *          // Your translations here.\n *      };\n *\n * Remember also to set a default, preferred and fallback language:\n *      // Set the preferred language the same that the browser language.\n *      ($translateProvider.preferredLanguage((navigator.language != null)) ?\n *          navigator.language :\n *          navigator.browserLanguage).split("_")[0].split("-")[0]);\n *\n *      // Default language to display of any other is not available.\n *      $translateProvider.fallbackLanguage("en");\n *\n *\n * You can then use this service to translate:\n *     - an array containing languages: content["en"] = "Test English"; content["fr"] = "Test Français";\n *     - an angular-translate token ("SITE_TITLE");\n */',
            options: [{
                ignorePattern: ';\s*$',
            }, ],
        }
    ],

    invalid: [{
        code: '// this is not a valid comment.',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// This is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '//This is not a valid comment.',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '//this is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// this is not a valid comment',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// 29 is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// +42 is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '//_myVar is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '//"This" is not a valid comment',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// \'This\' is not a valid comment',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '// \'This\' is not a valid comment,\n// that spans on multi-line.',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, {
            message: UPPERCASE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* 42 is not a valid comment,\n * That spans on multi-line.\n */',
        errors: [{
            message: LOWERCASE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* _myVar is not a valid comment.\n * that spans on multi-line.\n */',
        errors: [{
            message: UPPERCASE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* This is not a valid comment.\n * It spans on multi-line\n */',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* This is not a valid comment,\n * it spans on multi-line\n */',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* This is not a valid comment,\n *it spans on multi-line.\n */',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/* This is not a valid comment.\n *It spans on multi-line.\n */',
        errors: [{
            message: SPACE_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/**\n * Return the placeholder for a translatable object.\n * If the translatable content has no translation, display a fixed placeholder.\n * Else display the value of the translatable content in the "checkLanguage".\n * Else, display the first available translation\n *\n * @param  {string|Object} content            The translatable content.\n * @param  {string|Object} defaultPlaceholder The placeholder to use if the translatable content has no\n *                                            translations.\n * @param  {string}        [lang=current]     The lang to use.\n * @return {string}        The placeholder.\n */',
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ],
    }, {
        code: '/**\n * Translation Service.\n * Allow to translate a string using pascalprecht angular translate module or using an array of string\n *\n * You must have angular-translate (pascalprecht.translate) module available to use this service.\n * Remember to declare your language in angular-translate:\n *      $translateProvider.translations("<langCode: en/fr/es, ...>",\n *      {\n *          // Your translations here.\n *      };\n *\n * Remember also to set a default, preferred and fallback language:\n *      // Set the preferred language the same that the browser language.\n *      ($translateProvider.preferredLanguage((navigator.language != null)) ?\n *          navigator.language :\n *          navigator.browserLanguage).split("_")[0].split("-")[0]);\n *\n *      // Default language to display of any other is not available.\n *      $translateProvider.fallbackLanguage("en");\n *\n *\n * You can then use this service to translate:\n *     - an array containing languages: content["en"] = "Test English"; content["fr"] = "Test Français";\n *     - an angular-translate token ("SITE_TITLE");\n */',
        options: [{
            ignorePattern: ';\s*$',
        }, ],
        errors: [{
            message: PUNCTUATION_ERROR_MESSAGE,
        }, ]
    }],
});
