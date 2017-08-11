/**
 * @fileoverview Enforce the correct format and alignment of the JSDoc.
 * @author Clément P.
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const PARAM_TOO_MANY_SPACES_ERROR_MESSAGE = 'Too many spaces before the param (no return in the JSDoc)';
const RETURN_TOO_MANY_SPACES_ERROR_MESSAGE = 'Too many spaces before the return type';
// eslint-disable-next-line max-len
const PARAM_TOO_FEW_SPACES_ERROR_MESSAGE = 'Not enough spaces before the param type (param type should be aligned with return type)';
const TYPE_BADLY_FORMATTED = 'Type is badly formatted';
// eslint-disable-next-line max-len
const PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE = 'Params name should be aligned (with other param names and with return description).';
const RETURN_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE = 'Return description should be aligned with params names.';
const NAME_BADLY_FORMATTED = "Name is missing, badly formatted or doesn't follow convention";
const PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE = 'Params description should be aligned.';

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

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Check a comment to determine if it is valid for this rule.
         *
         * @param  {ASTNode} comment   The comment node to process.
         * @return {boolean} True if the comment is valid, the error otherwise.
         */
        function isCommentValid(comment) {
            // 1. Check if it's a JSDoc comment.
            if (comment === undefined || (comment.type || '').toLowerCase() !== 'block' ||
                (comment.value || '').length === 0) {
                return true;
            }

            // 2. Check if it contains @param or @return tags.
            const hasParam = comment.value.indexOf('@param') !== -1;
            const hasReturn = comment.value.indexOf('@return') !== -1;
            if (!hasParam && !hasReturn) {
                return true;
            }

            const neededSpacesAfterParam = (hasReturn) ? 2 : 1;

            let lines = comment.value.split('\n') || [comment.value];
            lines = lines.filter(function filterNonTagLines(line) {
                return line.indexOf('@param') !== -1 || line.indexOf('@return') !== -1;
            });
            const len = lines.length;

            let numberOfParams = 0;

            let longuestType = 0;
            let longuestName = 0;
            lines.forEach(function forEachLines(line) {
                const typeLength = line.indexOf('}') - line.indexOf('{') - 1;
                longuestType = (typeLength > longuestType) ? typeLength : longuestType;

                if (line.indexOf('@param') > -1) {
                    numberOfParams++;

                    line = line.substring(line.indexOf('}') + 1).replace(/^\s*/, '');

                    const nameLength = (line.indexOf('[') === 0) ? line.indexOf(']') + 1 : line.indexOf(' ');
                    longuestName = (nameLength > longuestName) ? nameLength : longuestName;
                }
            });

            let message;
            let col;
            let lineNumber;

            let i = 0;
            for (i = 0; i < len; i++) {
                let line = lines[i].replace(/^\s*\* /, '');

                const isParam = line.indexOf('@param') !== -1;
                const isReturn = line.indexOf('@return') !== -1;

                if (!isParam && !isReturn) {
                    continue;
                }

                // 3. Check the alignment (and number of space) right after the tag (and before the type).
                line = line.replace(/@(param|return)/, '');
                const spacesNumberAfterTag = line.search(/\S|$/);

                if (isReturn && spacesNumberAfterTag > 1) {
                    message = RETURN_TOO_MANY_SPACES_ERROR_MESSAGE;
                } else if (isParam) {
                    if (spacesNumberAfterTag > neededSpacesAfterParam) {
                        message = PARAM_TOO_MANY_SPACES_ERROR_MESSAGE;
                    } else if (spacesNumberAfterTag < neededSpacesAfterParam) {
                        message = PARAM_TOO_FEW_SPACES_ERROR_MESSAGE;
                    }
                }

                if (message !== undefined && message.length > 0) {
                    lineNumber = i;
                    col = lines[i].length - line.length;
                    break;
                }

                // 5. Check the format of the type.
                line = line.replace(/^\s*/, '');
                const endOfType = line.indexOf('}');
                if (line.indexOf('{') !== 0 || endOfType <= 1) {
                    message = TYPE_BADLY_FORMATTED;
                    lineNumber = i;
                    col = lines[i].length - line.length;
                    break;
                }

                // 5. Check the alignment of the name of the params or of the description of the return with the names.
                line = line.substring(endOfType + 1);
                const spacesBeforeName = line.search(/\S|$/);

                if ((endOfType + spacesBeforeName) !== (longuestType + 2)) {
                    message = (isReturn) ?
                        RETURN_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE : PARAMS_NAME_ALIGNMENT_ERROR_MESSAGE;
                    lineNumber = i;
                    col = lines[i].length - line.length;
                    break;
                }

                // If we are checking a return tag, no need to check further.
                if (isReturn) {
                    continue;
                }

                // 6. Check the format of the name.
                line = line.replace(/^\s*/, '');
                const isOptionalParam = line.indexOf('[') !== -1;
                const endOfName = (isOptionalParam) ? line.indexOf(']') : line.indexOf(' ');
                if ((isOptionalParam && endOfName <= 1) ||
                    (!isOptionalParam && ((/^[A-Z]/).test(line) || line.indexOf(']') !== -1))) {
                    message = NAME_BADLY_FORMATTED;
                    lineNumber = i;
                    col = lines[i].length - line.length;
                    break;
                }

                // If there is only one params, there is no point to check for description alignement.
                if (numberOfParams === 1) {
                    continue;
                }

                // 7. Check the alignment of the descriptions.
                line = line.substring(endOfName + 1);
                const spacesBeforeDescription = line.search(/\S|$/);

                if ((endOfName + spacesBeforeDescription) !== longuestName) {
                    message = PARAMS_DESCRIPTION_ALIGNMENT_ERROR_MESSAGE;
                    lineNumber = i;
                    col = lines[i].length - line.length;
                    break;
                }
            }

            lineNumber = (lineNumber === undefined) ? i : lineNumber;

            return (message !== undefined && message.length > 0) ? {
                data: {
                    column: col,
                    commentLine: lines[lineNumber],
                    line: lineNumber + 1,
                },
                message: message,
            } : true;
        }

        /**
         * Process a comment to determine if it needs to be reported.
         *
         * @param {ASTNode} comment   The comment node to process.
         */
        function processComment(comment) {
            const commentValid = isCommentValid(comment);

            if (commentValid !== true) {
                context.report({
                    data: commentValid.data,
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

                comments.forEach(function forEachComments(comment) {
                    processComment(comment);
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
