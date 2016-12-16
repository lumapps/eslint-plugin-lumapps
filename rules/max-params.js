/**
 * @fileoverview Enforce a maximum number or parameters in functions definitions, except if it's an angular function
 *               (with dependency injection).
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
 * Base schema body for defining the maximum number of parameter and if we want to ignore angular DI functions.
 * This can be used in a few different ways in the actual schema.
 *
 * @type {Object}
 */
const SCHEMA_BODY = {
    oneOf: [
        {
            minimum: 0,
            type: 'integer',
        },
        {
            additionalProperties: false,
            properties: {
                ignoreAngularDI: {
                    type: 'boolean',
                },
                max: {
                    minimum: 0,
                    type: 'integer',
                },
                maximum: {
                    minimum: 0,
                    type: 'integer',
                },
            },
            type: 'object',
        },
    ],
};
const DEFAULTS = {
    ignoreAngularDI: true,
    maximum: 3,
};

/**
 * Get normalized options for either block or line comments from the given user-provided options.
 *     - If the user-provided options is just a string, returns a normalized set of options using default values for all
 *       other options.
 *     - If the user-provided options is an object, then a normalized option set is returned. Options specified in
 *       overrides will take priority over options specified in the main options object, which will in turn take
 *       priority over the rule's defaults.
 *
 * @param  {Object|string} rawOptions The user-provided options.
 * @return {Object}        The normalized options.
 */
function getNormalizedOptions(rawOptions) {
    let normalizedOptions = Object.assign({}, DEFAULTS);

    if (typeof rawOptions === 'number') {
        normalizedOptions.maximum = rawOptions;
    } else if (typeof rawOptions === 'object') {
        normalizedOptions = Object.assign({}, DEFAULTS, rawOptions);

        if (typeof normalizedOptions.max === 'number') {
            normalizedOptions.maximum = normalizedOptions.max;
            delete normalizedOptions.max;
        }
    }


    return normalizedOptions;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    create: function create(context) {
        const normalizedOptions = getNormalizedOptions(context.options[0]);

        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Checks a function to see if it has too many parameters.
         *
         * @param {ASTNode} node The function node to check.
         */
        function checkFunction(node) {
            if (node.params.length > normalizedOptions.maximum) {
                if (normalizedOptions.ignoreAngularDI) {
                    const comments = sourceCode.getComments(node);
                    for (let i = (((comments || {}).leading || []).length - 1); i >= 0; i--) {
                        const commentBlock = ((comments || {}).leading || [])[i] || {};

                        if (commentBlock.type === 'Block' &&
                            (commentBlock.value || '').toLowerCase().trim() === '@nginject') {
                            return;
                        }
                    }

                    const parentCallName = (((node.parent || {}).callee || {}).name || '')
                        .toLowerCase().trim();
                    if (node.parent.type === 'CallExpression' && parentCallName === 'nginject') {
                        return;
                    }

                    const firstStatement = (((((node.body || {}).body || [])[0] || {}).expression || {}).value || '')
                        .toLowerCase().trim();

                    if (firstStatement === 'nginject') {
                        return;
                    }
                }

                context.report({
                    data: {
                        count: node.params.length,
                        max: normalizedOptions.maximum,
                    },
                    message: 'This function has too many parameters ({{count}}). Maximum allowed is {{max}}.',
                    node: node,
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ArrowFunctionExpression: checkFunction,
            FunctionDeclaration: checkFunction,
            FunctionExpression: checkFunction,
        };
    },

    meta: {
        docs: {
            category: 'Best Practices',
            description: 'Enforce a maximum number or parameters in functions definitions, except if it\'s an angular\
                          function (with dependency injection).',
            recommended: false,
        },
        fixable: null,

        schema: [
            SCHEMA_BODY,
        ],
    },
};
