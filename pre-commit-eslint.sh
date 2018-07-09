#!/bin/bash

cd "$(git rev-parse --show-toplevel)"
ESLINT="node_modules/.bin/eslint"
if [ ! -x "$ESLINT" ]; then
	echo "pre-commit: eslint is not installed" 1>&2
	exit 1
fi

STAGED_FILES=($(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\?$"))
if [ "$STAGED_FILES" == "" ]; then
	exit 0
fi

$ESLINT "${STAGED_FILES[@]}" --fix
ESLINT_EXIT="$?"
# Re-add files since they may have been fixed
git add "${STAGED_FILES[@]}"

GIT_EXIT="$?"
if [[ "${ESLINT_EXIT}" != 0 ]]; then
	echo "pre-commit: fix eslint errors" 1>&2
	exit 1
fi

exit $GIT_EXIT
