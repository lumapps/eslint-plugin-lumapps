/**
 * @fileoverview Enforce a specific file format.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const COMMENTS_REGEXP = /^\s*(([/]{2,}\s*.*)|([/]+[*]+\s*.*\s*[*]+[/]+)|([/][*]+)|([*]+\s*[^/]*)|[*]+[/])\s*$/;

const FIRST_LINE = '(function IIFE() {';
const FIRST_LINE_REGEXP = /^\s*\(function IIFE\(\) \{\s*$/;
const FIRST_LINE_MESSAGE = 'First line of the file must be the IIFE function.';

const EMPTY_LINE_MESSAGE = 'The file must end with an empty line.';

const LAST_LINE = '})();';
const LAST_LINE_REGEXP = /^\s*\}\)\(\);\s*$/;
const LAST_LINE_MESSAGE = 'Last line (before the empty one) must be the call of the IIFE.';

const USE_STRICT = "'use strict';";
const USE_STRICT_REGEXP = /^\s*'use strict';\s*$/;
const MISSING_STRICT_MESSAGE = `Expected ${USE_STRICT} to be the first statement of the IIFE.`;

const SEPARATOR = '/////////////////////////////';
const EMPTY_SEPARATOR = '//                         //';
const SEPARATOR_REGEXP = /^\s*\/{29}\s*$/;
const EMPTY_SEPARATOR_REGEXP = /^\s*\/\/\s{25}\/\/\s*$/;
const MISSING_SEPARATOR_MESSAGE = `Expected a separator after the ${USE_STRICT} statement.`;

const SEPARATORS = {
    EVENTS: /^\s*\/\/          Events         \/\/\s*$/,
    PRIVATE_ATTRIBUTES: /^\s*\/\/    Private attributes   \/\/\s*$/,
    PRIVATE_FUNCTIONS: /^\s*\/\/    Private functions    \/\/\s*$/,
    PUBLIC_ATTRIBUTES: /^\s*\/\/    Public attributes    \/\/\s*$/,
    PUBLIC_FUNCTIONS: /^\s*\/\/     Public functions    \/\/\s*$/,
    WATCHERS: /^\s*\/\/        Watchers         \/\/\s*$/,
};
const SEPARATORS_REGEXP = {
    EVENTS: /^\s*\/\/\s*Events\s*\/\/\s*$/,
    PRIVATE_ATTRIBUTES: /^\s*\/\/\s*Private attributes\s*\/\/\s*$/,
    PRIVATE_FUNCTIONS: /^\s*\/\/\s*Private functions\s*\/\/\s*$/,
    PUBLIC_ATTRIBUTES: /^\s*\/\/\s*Public attributes\s*\/\/\s*$/,
    PUBLIC_FUNCTIONS: /^\s*\/\/\s*Public functions\s*\/\/\s*$/,
    WATCHERS: /^\s*\/\/\s*Watchers\s*\/\/\s*$/,
};
const SEPARATOR_FORMAT_MESSAGE = 'Stub separator is not at the right format.';

const MISSING_STUB_SEPARATOR_MESSAGE = {
    EVENTS: 'Expected to see the events stub separator.',
    PRIVATE_ATTRIBUTES: 'Expected to see the private attributes stub separator.',
    PRIVATE_FUNCTIONS: 'Expected to see the private functions stub separator.',
    PUBLIC_ATTRIBUTES: 'Expected to see the public attributes stub separator.',
    PUBLIC_FUNCTIONS: 'Expected to see the public functions stub separator.',
    WATCHERS: 'Expected to see the watchers stub separator.',
};
const PRIVATE_VARIABLE_PREFIXED = 'Expected private variable to be prefixed by "_".';

/*
 * Base schema body for defining if we want to ignore the private variable format and a pattern of allowed private
 * variables that doesn't match the format.
 * This can be used in a few different ways in the actual schema.
 *
 * @type {Object}
 */
const SCHEMA_BODY = {
    additionalProperties: false,
    properties: {
        ignorePrivateFormat: {
            type: 'boolean',
        },
        ignorePrivatePattern: {
            type: 'string',
        },
    },
    type: 'object',
};

const DEFAULTS = {
    ignorePrivateFormat: false,
    ignorePrivatePattern: null,
};

/**
 * Get normalized options for from the given user-provided options.
 *     - If the user-provided options is an object, then a normalized option set is returned. Options specified in
 *       overrides will take priority over options specified in the main options object, which will in turn take
 *       priority over the rule's defaults.
 *
 * @param  {Object|string} rawOptions The user-provided options.
 * @return {Object}        The normalized options.
 */
function getNormalizedOptions(rawOptions) {
    if (rawOptions === undefined) {
        return Object.assign({}, DEFAULTS);
    }

    return Object.assign({}, DEFAULTS, rawOptions);
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
         * Process a file to determine if it has the right format.
         */
        function checkFileFormat() {
            const lines = sourceCode.lines;

            var lineIndex = 0;
            let firstLine = lines[lineIndex];
            while ((COMMENTS_REGEXP.test(firstLine) || firstLine === undefined || firstLine.length === 0) &&
                lineIndex < lines.length) {
                lineIndex++;
                firstLine = lines[lineIndex];
            }
            if (lineIndex === lines.length) {
                return;
            }

            if (!FIRST_LINE_REGEXP.test(firstLine)) {
                context.report({
                    data: `Expected "${FIRST_LINE}"`,
                    loc: {
                        end: {
                            line: 1,
                        },
                        start: {
                            line: 1,
                        },
                    },
                    message: FIRST_LINE_MESSAGE,

                    node: null,
                });
            }

            let lastLine = lines[lines.length - 1];
            if (lastLine.length === 0) {
                let lastTextLine = lines[lines.length - 2];
                if (!LAST_LINE_REGEXP.test(lastTextLine)) {
                    context.report({
                        data: `Expected "${LAST_LINE}"`,
                        loc: {
                            end: {
                                line: lines.length - 1,
                            },
                            start: {
                                line: lines.length - 1,
                            },
                        },
                        message: LAST_LINE_MESSAGE,

                        node: null,
                    });
                }
            } else {
                context.report({
                    data: `Expected an empty line`,
                    loc: {
                        end: {
                            line: lines.length,
                        },
                        start: {
                            line: lines.length,
                        },
                    },
                    message: EMPTY_LINE_MESSAGE,

                    node: null,
                });
            }

            let line;
            let i = lineIndex;
            let len = lines.length;
            for (i = (lineIndex + 1); i < len; i++) {
                line = lines[i];
                if ((COMMENTS_REGEXP.test(line) || line === undefined || line.length === 0)) {
                    continue;
                }

                if (!USE_STRICT_REGEXP.test(line)) {
                    context.report({
                        data: `Expected "${USE_STRICT}"`,
                        loc: {
                            end: {
                                line: i + 1,
                            },
                            start: {
                                line: i + 1,
                            },
                        },
                        message: MISSING_STRICT_MESSAGE,

                        node: null,
                    });

                    return;
                }

                break;
            }

            i++;
            let j = 0;
            let error = false;
            for (j = 0; j < len; j++) {
                line = lines[i];
                if ((COMMENTS_REGEXP.test(line) || line === undefined || line.length === 0)) {
                    continue;
                }

                if ((j === 0 || j === 2) && line.length !== 0) {
                    error = true;
                    break;
                } else if (j === 1 && !SEPARATOR_REGEXP.test(line)) {
                    error = true;
                    break;
                }

                if (j > 2) {
                    break;
                }

                i++;
            }
            if (error) {
                context.report({
                    data: `Expected "${SEPARATOR}"`,
                    loc: {
                        end: {
                            line: i + 1,
                        },
                        start: {
                            line: i + 1,
                        },
                    },
                    message: MISSING_SEPARATOR_MESSAGE,

                    node: null,
                });
            }

            let seen = {
                EVENTS: false,
                PRIVATE_ATTRIBUTES: false,
                PRIVATE_FUNCTIONS: false,
                PUBLIC_ATTRIBUTES: false,
                PUBLIC_FUNCTIONS: false,
                WATCHERS: false,
            };
            let first = {
                EVENTS: true,
                PRIVATE_ATTRIBUTES: true,
                PRIVATE_FUNCTIONS: true,
                PUBLIC_ATTRIBUTES: true,
                PUBLIC_FUNCTIONS: true,
                WATCHERS: true,
            };
            const regexp = {
                EVENTS: /^\s{8}\$(rootScope|scope)\.\$on\(/,
                PRIVATE_ATTRIBUTES: /^\s{8}(var|let) _[a-z][^ ;]*( = [^;]+)?;?$/,
                PRIVATE_FUNCTIONS: /^\s{8}function _[a-z][^(]*\([^)]*\)\s*{?/,
                PUBLIC_ATTRIBUTES: /^\s{8}[a-z][^. ]*\.[a-z][^ ]* = [^;]+;?$/,
                PUBLIC_FUNCTIONS: /^\s{8}function [a-z][^(]*\([^)]*\)\s*{?/,
                WATCHERS: /^\s{8}\$(rootScope|scope)\.\$watch(Collection)?\(/,
            };

            for (let k = lineIndex; k < len; k++) {
                error = false;
                line = lines[k];

                // eslint-disable-next-line no-loop-func
                Object.keys(regexp).forEach(function forEachRegexp(regexpName) {
                    if (!seen[regexpName] && SEPARATORS_REGEXP[regexpName].test(line)) {
                        if (!SEPARATORS[regexpName].test(line) ||
                            !SEPARATOR_REGEXP.test(lines[k - 2]) || !EMPTY_SEPARATOR_REGEXP.test(lines[k - 1]) ||
                            !SEPARATOR_REGEXP.test(lines[k + 2]) || !EMPTY_SEPARATOR_REGEXP.test(lines[k + 1])) {
                            error = true;

                            let expectedSeparator =
                                `${SEPARATOR}\n${EMPTY_SEPARATOR}\n${line.trim()}\n${EMPTY_SEPARATOR}${SEPARATOR}\n`;
                            context.report({
                                data: `Expected "${expectedSeparator}" before and after`,
                                loc: {
                                    end: {
                                        line: k + 1,
                                    },
                                    start: {
                                        line: k + 1,
                                    },
                                },
                                message: SEPARATOR_FORMAT_MESSAGE,

                                node: null,
                            });
                        }

                        if (!error) {
                            seen[regexpName] = true;

                            k += 3;
                        }

                        return;
                    }

                    if (first[regexpName]) {
                        if (regexp[regexpName].test(line)) {
                            first[regexpName] = false;

                            if (!seen[regexpName]) {
                                context.report({
                                    loc: {
                                        end: {
                                            line: k + 1,
                                        },
                                        start: {
                                            line: k + 1,
                                        },
                                    },
                                    message: MISSING_STUB_SEPARATOR_MESSAGE[regexpName],

                                    node: null,
                                });
                            }
                        }
                    }
                });

                if (normalizedOptions.ignorePrivateFormat === true) {
                    continue;
                }

                if ((/^\s{8}(var|let) [a-z][^ ]* = /).test(line) &&
                    (normalizedOptions.ignorePrivatePattern === undefined ||
                    normalizedOptions.ignorePrivatePattern === null ||
                    !RegExp(normalizedOptions.ignorePrivatePattern).test(line))) {
                    context.report({
                        data: `Expected private variable to be prefixed by "_"`,
                        loc: {
                            end: {
                                line: k + 1,
                            },
                            start: {
                                line: k + 1,
                            },
                        },
                        message: PRIVATE_VARIABLE_PREFIXED,

                        node: null,
                    });
                }
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Program: function Program() {
                checkFileFormat();
            },
        };
    },

    meta: {
        docs: {
            category: 'Stylistic Issues',
            description: 'Enforce a specific file format.',
            recommended: false,
        },
        fixable: null,
        schema: [
            SCHEMA_BODY,
        ],
    },
};
