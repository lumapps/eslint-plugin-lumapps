/**
 * @fileoverview Enforce the usage of "angular.forEach" instead of "for" when there is no need of flow control (return,
 *               break or continue).
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
 * Base schema body for defining the property "always"/"never" of the rule.
 *
 * @type {Object}
 */
const SCHEMA_BODY = {
    'enum': [
        'always',
        'never',
    ],
};
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    create: function create(context) {
        const sourceCode = context.getSourceCode();

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
            if (node.type === 'Function' || node.type === 'FunctionDeclaration') {
                return false;
            }

            var loopOver = [];

            if (node.body !== undefined && node.body !== null) {
                if (!Array.isArray(node.body)) {
                    return hasControlledFlow(node.body);
                }
                loopOver = node.body;
            }

            if (node.consequent !== undefined && node.consequent !== null) {
                if (!Array.isArray(node.consequent)) {
                    return hasControlledFlow(node.consequent);
                }
                loopOver = node.consequent;
            }
            if (node.alternate !== undefined && node.alternate !== null) {
                return hasControlledFlow(node.alternate);
            }

            if (node.cases !== undefined && node.cases !== null) {
                loopOver = node.cases;
            }

            if (node.block !== undefined && node.block !== null) {
                return hasControlledFlow(node.block);
            }
            if (node.handler !== undefined && node.handler !== null) {
                return hasControlledFlow(node.handler);
            }
            if (node.finalizer !== undefined && node.finalizer !== null) {
                return hasControlledFlow(node.finalizer);
            }

            if (loopOver.length > 0) {
                for (var i = 0, len = loopOver.length; i < len; i++) {
                    var bodyNode = node.body[i];

                    if (bodyNode.type === 'ReturnStatement' ||
                        bodyNode.type === 'BreakStatement' ||
                        bodyNode.type === 'ContinueStatement' ||
                        hasControlledFlow(bodyNode)) {
                        return true;
                    }
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
                    let sourceCodeText = sourceCode.getText(node);
                    if (sourceCodeText.indexOf('.length') > -1) {
                        reportError(node, true);
                    }
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
            description: 'Enforce the usage of "angular.forEach" instead of "for" when there is no need of execution\
                          control (return, break or continue).',
            recommended: false,
        },
        fixable: null,
        schema: [
            SCHEMA_BODY,
        ],
    },
};
