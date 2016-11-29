/**
 * @fileoverview Lumapps customized ESLint rules.
 * @author Clément P.
 */
'use strict';

module.exports = {
    rules: {
        'comments-sentences': require('./rules/comments-sentences'),
        'ternary-condition-parens': require('./rules/ternary-condition-parens')
    }
};
