/**
 * @fileoverview Enforce that comments are correct sentences.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const FIRST_LETTER_PATTERN = require('eslint/lib/util/patterns/letters');
const PUNCTUATION = /[!.?]\s*$/;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const WHITESPACE = /\s/g;
const MAYBE_URL = /^\s*[^:/?#\s]+:\/\/[^?#]/;

const SPACE_ERROR_MESSAGE = 'Not starting by spaces.';
const UPPERCASE_ERROR_MESSAGE = 'Not starting by an uppercase letter while it should.';
const LOWERCASE_ERROR_MESSAGE = 'Starting by an uppercase letter while it should not.';
const PUNCTUATION_ERROR_MESSAGE = 'Line does not end by a punctuation.';

/*
 * Base schema body for defining the basic pattern, a pattern to ignore and if we want to ignore inline comments values.
 * This can be used in a few different ways in the actual schema.
 *
 * @type {Object}
 */
const SCHEMA_BODY = {
    additionalProperties: false,
    properties: {
        ignoreInlineComments: {
            type: 'boolean',
        },
        ignorePattern: {
            type: 'string',
        },
    },
    type: 'object',
};

const DEFAULTS = {
    ignoreInlineComments: false,
    ignorePattern: null,
};
const DEFAULT_IGNORE_PATTERN = /^\s*((?:eslint|istanbul|jscs|jshint|globals?|exported)\b|@([^ ]+|.+\})$)/;

/**
 * Get all the variables of the global scope and all child scopes of the current context.
 *
 * @param {Object} scope The scope in which we want to list the variables (recursively).
 * @param {Object} into  Where we want to store the found variables.
 */
function fillVariables(scope, into) {
    if (scope === undefined) {
        return;
    }

    if (scope.variables !== undefined && scope.variables.length > 0) {
        (scope.variables || []).forEach(function forEachVariables(variable) {
            into[variable.name] = true;
        });
    }

    if (scope.childScopes !== undefined && scope.childScopes.length > 0) {
        (scope.childScopes || []).forEach(function forEachChildScopes(childScope) {
            fillVariables(childScope, into);
        });
    }
}

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
         * Checks whether a comment is an inline comment.
         *
         * For the purpose of this rule, a comment is inline if:
         *     1. The comment is preceded by a token on the same line; and
         *     2. The command is followed by a token on the same line.
         *
         * Note that the comment itself need not be single-line!
         *
         * Also, it follows from this definition that only block comments can be considered as possibly inline. This is
         * because line comments would consume any following tokens on the same line as the comment.
         *
         * @param  {ASTNode} comment The comment node to check.
         * @return {boolean} True if the comment is an inline comment, false otherwise.
         */
        function isInlineComment(comment) {
            const previousToken = sourceCode.getTokenOrCommentBefore(comment);
            const nextToken = sourceCode.getTokenOrCommentAfter(comment);

            return Boolean(
                previousToken &&
                nextToken &&
                comment.loc.start.line === previousToken.loc.end.line &&
                comment.loc.end.line === nextToken.loc.start.line
            );
        }

        /**
         * Check a comment to determine if it is valid for this rule.
         *
         * @param  {ASTNode} comment   The comment node to process.
         * @param  {Object}  options   The options for checking this comment.
         * @param  {Object}  variables The list of variables in the scope.
         * @return {boolean} True if the comment is valid, the error otherwise.
         */
        function isCommentValid(comment, options, variables) {
            let col = 0;
            let lineNumber;
            let message;
            let more;

            // 1. Check for inline comments.
            if (options.ignoreInlineComments === true && isInlineComment(comment)) {
                return true;
            }

            // 2. Check that the comment is globally a correct sentence.
            let lines = comment.value.split('\n') || [comment.value];

            let line;
            let isIgnored = true;
            let wasIgnored = true;
            let isEmpty = true;
            let wasEmpty = true;
            let isEndingByPunctuation = true;
            let wasEndingByPunctuation = true;

            let i = 0;
            let len = lines.length;
            for (i = 0; i < len; i++) {
                wasIgnored = isIgnored;
                if (!wasIgnored) {
                    wasEmpty = isEmpty;
                    wasEndingByPunctuation = isEndingByPunctuation;
                }
                isEmpty = false;

                // Remove any asterisk from the comment line.
                line = lines[i].replace(/\s*\*/g, '');

                isIgnored = true;

                // 2.1. Check for default ignore pattern.
                if (DEFAULT_IGNORE_PATTERN.test(line)) {
                    continue;
                }

                // 2.2. Check for custom ignore pattern.
                if (options.ignorePattern !== undefined && options.ignorePattern !== null &&
                    RegExp(options.ignorePattern).test(line)) {
                    continue;
                }

                // 2.3. Does the comment line start with a possible URL?
                if (MAYBE_URL.test(line)) {
                    continue;
                }

                isIgnored = false;

                // Remove all whitespaces from the comment.
                const commentWordCharsOnly = line.replace(WHITESPACE, '');
                // 2.4. Is the comment line empty (or only whitespaces)
                if (commentWordCharsOnly.length === 0) {
                    isEmpty = true;

                    if (!wasEmpty && !wasIgnored && !wasEndingByPunctuation) {
                        message = PUNCTUATION_ERROR_MESSAGE;
                        more = 'Next line is empty';
                        lineNumber = i - 1;
                        col = line.length + 1;
                        break;
                    }

                    continue;
                }


                // 2.5. Check that the comment start with a single space or multiple (at least 2) "/".
                if (!(/^(\s+|\/{2,})/).test(line)) {
                    message = SPACE_ERROR_MESSAGE;
                    break;
                }

                // Remove the useless first space.
                line = line.substring(1);

                // 2.6. Is the initial word character a letter?
                const firstWord = (line.split(' ') || [''])[0];
                const firstWordChar = line[0];
                if (FIRST_LETTER_PATTERN.test(firstWordChar) && !variables[firstWord]) {
                    // 2.6.1. Check that if the previous line ended with a punctuation or was ignored, the first letter is
                    // uppercase.
                    if ((wasEndingByPunctuation || wasIgnored || wasEmpty) &&
                        firstWordChar !== firstWordChar.toLocaleUpperCase()) {
                        message = UPPERCASE_ERROR_MESSAGE;
                        col = 1;
                        break;
                    }

                    // 2.6.1. Check that if the previous line was not ending with a punctuation or was not ignored, the
                    // first letter is lowercase.
                    if (!wasEndingByPunctuation && !wasIgnored && !wasEmpty &&
                        firstWordChar !== firstWordChar.toLocaleLowerCase()) {
                        message = LOWERCASE_ERROR_MESSAGE;
                        col = 1;
                        break;
                    }
                }

                // 2.7. Check if the comment line end with a punctuation.
                isEndingByPunctuation = PUNCTUATION.test(line) || (/\/\/$/).test(line);
            }

            if (!isIgnored) {
                wasEmpty = isEmpty;
                wasEndingByPunctuation = isEndingByPunctuation;
            }

            if ((message === undefined || message.length === 0) &&
                ((isEmpty && !wasIgnored && !wasEndingByPunctuation) ||
                    (!isEmpty && !isIgnored && !isEndingByPunctuation))) {
                message = PUNCTUATION_ERROR_MESSAGE;
                more = 'Last line';
                col = line.length + 1;

                if (i === len) {
                    i--;
                }
            }

            lineNumber = (lineNumber === undefined) ? i : lineNumber;

            return (message !== undefined && message.length > 0) ? {
                data: {
                    column: col,
                    commentLine: lines[lineNumber],
                    line: lineNumber + 1,
                    more: more,
                },
                message: message,
            } : true;
        }

        /**
         * Process a comment to determine if it needs to be reported.
         *
         * @param {ASTNode} comment   The comment node to process.
         * @param {Object}  variables The list of variables in the scope.
         */
        function processComment(comment, variables) {
            const commentValid = isCommentValid(comment, normalizedOptions, variables);

            if (commentValid !== true) {
                context.report({
                    data: commentValid.data,

                    fix: function fix(fixer) {
                        let newComment;
                        let commentLine;
                        let firstLetterIndex;
                        let newCommentLine;
                        switch (commentValid.message) {
                            case SPACE_ERROR_MESSAGE:
                                return fixer.insertTextBefore(comment, ' ');

                            case UPPERCASE_ERROR_MESSAGE:
                                commentLine = (comment.type === 'Line' || comment.value.indexOf('\n') === -1) ?
                                    commentValid.data.commentLine.trim() : commentValid.data.commentLine;

                                firstLetterIndex = (/[a-z]/i).exec(commentLine).index;
                                newCommentLine = commentLine.substring(0, firstLetterIndex) +
                                    commentLine.charAt(firstLetterIndex).toUpperCase() +
                                    commentLine.substring(firstLetterIndex + 1);

                                newComment = comment.value.replace(
                                    commentValid.data.commentLine,
                                    newCommentLine
                                );
                                break;

                            case LOWERCASE_ERROR_MESSAGE:
                                commentLine = (comment.type === 'Line' || comment.value.indexOf('\n') === -1) ?
                                    commentValid.data.commentLine.trim() : commentValid.data.commentLine;

                                firstLetterIndex = (/[a-z]/i).exec(commentLine).index;
                                newCommentLine = commentLine.substring(0, firstLetterIndex) +
                                    commentLine.charAt(firstLetterIndex).toLowerCase() +
                                    commentLine.substring(firstLetterIndex + 1);

                                newComment = comment.value.replace(
                                    commentValid.data.commentLine,
                                    newCommentLine
                                );
                                break;

                            case PUNCTUATION_ERROR_MESSAGE:
                                if (comment.type === 'Line' || comment.value.indexOf('\n') === -1) {
                                    newComment = comment.value.trim() + '.';
                                } else {
                                    newComment = comment.value.replace(/\s*$/, function replace(match) {
                                        return '.' + match;
                                    });
                                }
                                break;

                            default:
                                break;
                        }

                        if (newComment === undefined) {
                            return undefined;
                        }

                        if (comment.type === 'Line') {
                            newComment = '// ' + newComment;
                        } else if (comment.value.indexOf('\n') === -1) {
                            newComment = '/* ' + newComment + ' */';
                        } else {
                            newComment = '/*' + newComment + '*/';
                        }

                        return fixer.replaceText(comment, newComment);
                    },

                    loc: comment.loc,
                    message: commentValid.message,
                    node: null,

                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Program: function Program() {
                const comments = sourceCode.getAllComments();
                const scope = context.getScope();

                const variables = {};
                fillVariables(scope, variables);

                comments.forEach(function forEachComments(comment) {
                    processComment(comment, variables);
                });
            },
        };
    },

    meta: {
        docs: {
            category: 'Stylistic Issues',
            description: 'Enforce that comments are correct sentences (basically starting with an upper case letter and\
                          ending with a dot.',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            SCHEMA_BODY,
        ],
    },
};
