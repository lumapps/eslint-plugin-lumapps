/**
 * @fileoverview enforce the usage of "angular.forEach" instead of "for" when there is no need of flow control (return,
 *               break or continue)
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
        const angularForEach = context.options[0] !== 'never';

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Check if a node contains a control flow statement (return, break or continue).
         *
         * @param  {ASTNode} node The node to check.
         * @return {boolean} If there is a control flow statement inside the loop.
         */
        function hasControlledFlow(node) {
            if (node.body === undefined && (!Array.isArray(node.body) || node.body.length === 0)) {
                return false;
            }

            if (!Array.isArray(node.body)) {
                return hasControlledFlow(node.body);
            }

            for (var i = 0, len = node.body.length; i < len; i++) {
                var bodyNode = node.body[i];
                if (bodyNode.type === 'ReturnStatement' ||
                    bodyNode.type === 'BreakStatement' ||
                    bodyNode.type === 'ContinueStatement' ||
                    hasControlledFlow(bodyNode)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Report an error with a for statement.
         *
         * @param {ASTNode} node       The node to report.
         * @param {boolean} expected   Whether we should use angular.forEach or not.
         */
        function reportError(node, expected) {
            context.report({
                fix: function fix(fixer) {
                    // console.log(node);
                },
                message: (expected) ? 'You should prefer the "angular.forEach" loop instead.' :
                    'You should prefer a standard "for" loop instead.',
                node: node,
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ForInStatement: function ForInStatement(node) {
                const hasControlledFlowInside = hasControlledFlow(node);

                if (angularForEach && !hasControlledFlowInside) {
                    reportError(node, true);
                }
            },
            ForStatement: function ForStatement(node) {
                const hasControlledFlowInside = hasControlledFlow(node);

                if (angularForEach && !hasControlledFlowInside) {
                    reportError(node, true);
                }
            },
            MemberExpression: function MemberExpression(node) {
                if (!angularForEach && node.object.type === 'Identifier' && node.object.name === 'angular' &&
                    node.property.name === 'forEach') {
                    reportError(node, false);
                }
            },
        };
    },

    meta: {
        docs: {
            category: 'Best Practices',
            description: 'enforce the usage of "angular.forEach" instead of "for" when there is no need of execution\
                          control (return, break or continue)',
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
