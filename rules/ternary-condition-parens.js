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

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    create: function create(context) {
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
         * @param {boolean} expected   Whether parentheses around condition was expected or not.
         */
        function reportError(node, expected) {
            context.report({
                data: {
                    expected: (expected) ? 'Expected' : 'Unexpected',
                },
                fix: function fix(fixer) {
                    return fixer.replaceText(node, `(${sourceCode.getText(node)})`);
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

                if (parentheses && !isConditionSurroundedByParentheses) {
                    reportError(node.test, true);
                } else if (!parentheses && isConditionSurroundedByParentheses) {
                    reportError(node.test, false);
                }
            },
        };
    },

    meta: {
        docs: {
            category: 'Stylistic Issues',
            description: 'enforce ternary\'s condition parentheses surrounding',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            {
                'enum': [
                    'always',
                    'never',
                ],
            },
        ],
    },
};
