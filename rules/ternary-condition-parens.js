/**
 * @fileoverview enforce parentheses around ternary's conditions
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/*
 * Base schema body.
 * This can be used in a few different ways in the actual schema.
 *
 * @type {Object}
 */
const SCHEMA_BODY = {
    additionalProperties: false,
    properties: {},
    type: 'object',
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
// {
// meta: {
//     docs: {
//         description: 'enforce ternary\'s condition parentheses surrounding',
//         category: 'Stylistic Issues',
//         recommended: false
//     },
//     fixable: null,
//     schema: [{
//         enum: ["always", "never"]
//     }]
// },

// create
module.exports = function exportsFunction(context) {
    const sourceCode = context.getSourceCode();

    const parentheses = context.options[0] !== 'never';

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const astUtils = require('eslint/lib/ast-utils');

    /**
     * Report an error with a ternary.
     *
     * @param {ASTNode} node       The node to report.
     * @param {ASTNode} parentNode The parent of the node to report.
     * @param {boolean} expected   Whether parentheses around condition was expected or not.
     */
    function reportError(node, parentNode, expected) {
        context.report({
            data: {
                expected: (expected) ? 'Expected' : 'Unexpected',
            },
            message: '{{expected}} parentheses around condition of ternary expression.',
            node: node,
        });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
        ConditionalExpression: function ConditionalExpression(node) {
            const isConditionSurroundedByParentheses = astUtils.isParenthesised(sourceCode, node.test);

            if (parentheses) {
                if (!isConditionSurroundedByParentheses) {
                    reportError(node.test, node, true);
                }
            } else if (isConditionSurroundedByParentheses) {
                reportError(node.test, node, false);
            }
        },
    };
};
