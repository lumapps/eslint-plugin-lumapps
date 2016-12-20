/**
 * @fileoverview Enforce the usage of "angular.is[Un]defined[AndFilled|OrEmpty]" instead of "_.isEmpty" or length
 *               checking.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
const ALWAYS_DEFINED_MESSAGE = 'You should use "angular.isDefinedAndFilled" instead.';
const ALWAYS_UNDEFINED_MESSAGE = 'You should use "angular.isUndefinedOrEmpty" instead.';
const NEVER_MESSAGE = 'You should use "_.isEmpty" instead.';

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

        const angularVersion = context.options[0] !== 'never';

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression: function MemberExpression(node) {
                if (node.object.type === 'Identifier' &&
                    ((node.object.name === '_' && node.property.name === 'isEmpty') ||
                    node.property.name === 'length') &&
                    angularVersion) {
                    let checkIsUndefined = false;

                    if (node.property.name === 'isEmpty') {
                        checkIsUndefined = sourceCode.getTokenBefore(node).value !== '!';
                    } else if (node.property.name === 'length') {
                        if (node.parent.type === 'BinaryExpression') {
                            const otherHand = (node.parent.left === node) ? node.parent.right : node.parent.left;

                            if (otherHand.value !== 0 || node.parent.operator === '=') {
                                return;
                            }

                            if (node.parent.operator.indexOf('==') > -1) {
                                checkIsUndefined = otherHand.value === 0;
                            }
                        } else {
                            if (node.parent.type === 'AssignmentExpression' ||
                                node.parent.type === 'CallExpression' ||
                                node.parent.type === 'VariableDeclarator') {
                                return;
                            }

                            checkIsUndefined = false;
                        }
                    }

                    context.report(node, (checkIsUndefined) ? ALWAYS_UNDEFINED_MESSAGE : ALWAYS_DEFINED_MESSAGE, {});
                } else if (node.object.type === 'Identifier' && node.object.name === 'angular' &&
                    (node.property.name === 'isDefinedAndFilled' || node.property.name === 'isUndefinedOrEmpty') &&
                    !angularVersion) {
                    context.report(node, NEVER_MESSAGE, {});
                }
            },
        };
    },

    meta: {
        docs: {
            category: 'Best Practices',
            description: 'Enforce the usage of "angular.is[Un]defined[AndFilled|OrEmpty]" instead of "_.isEmpty" or\
                          length checking.',
            recommended: false,
        },
        fixable: null,
        schema: [
            SCHEMA_BODY,
        ],
    },
};
