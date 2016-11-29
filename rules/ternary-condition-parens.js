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
    type: 'object',
    properties: {},
    additionalProperties: false,
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
module.exports = function(context) {
    const sourceCode = context.getSourceCode();

    const parentheses = context.options[0] !== "never";

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Determines if a node is surrounded by parentheses.
     *
     * @param  {SourceCode} sourceCode The ESLint source code object
     * @param  {ASTNode}    node       The node to be checked.
     * @return {boolean}    True if the node is parenthesised.
     */
    function isParenthesised(sourceCode, node) {
        const previousToken = sourceCode.getTokenBefore(node),
            nextToken = sourceCode.getTokenAfter(node);

        return Boolean(previousToken && nextToken) &&
            previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
            nextToken.value === ")" && nextToken.range[0] >= node.range[1];
    }

    /**
     * Report an error with a ternary.
     *
     * @param {ASTNode} node       The node to report.
     * @param {ASTNode} parentNode The parent of the node to report.
     * @param {boolean} expected   Whether parentheses around condition was expected or not.
     */
    function reportError(node, parentNode, expected) {
        context.report({
            node,
            message: "{{expected}} parentheses around condition of ternary expression.",
            data: {
                expected: (expected) ? "Expected" : "Unexpected",
            }
        });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
        ConditionalExpression(node) {
            const isConditionSurroundedByParentheses = isParenthesised(sourceCode, node.test);

            if (!parentheses) {
                if (isConditionSurroundedByParentheses) {
                    reportError(node.test, node, false);
                }
            } else {
                if (!isConditionSurroundedByParentheses) {
                    reportError(node.test, node, true);
                }
            }
        }
    };
};
