/**
 * @fileoverview Lumapps customized ESLint rules.
 * @author Clément P.
 */
'use strict';

module.exports = {
    rules: {
        'angular-foreach': require('./rules/angular-foreach'),
        'angular-isdefined': require('./rules/angular-isdefined'),
        'comments-sentences': require('./rules/comments-sentences'),
        'file-format': require('./rules/file-format'),
        'max-params': require('./rules/max-params'),
        'ternary-condition-parens': require('./rules/ternary-condition-parens'),
    },
};
