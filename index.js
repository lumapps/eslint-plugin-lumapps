/**
 * @fileoverview Lumapps customized ESLint rules.
 * @author Clément P.
 */
'use strict';

module.exports = {
    rules: {
        'angular-foreach': require('./rules/angular-foreach'),
        'comments-sentences': require('./rules/comments-sentences'),
        'file-format': require('./rules/file-format'),
        'ternary-condition-parens': require('./rules/ternary-condition-parens'),
        'underscore-isempty': require('./rules/underscore-isempty'),
    },
};
