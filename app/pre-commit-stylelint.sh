#!/bin/bash

cd "$(git rev-parse --show-toplevel)"
STYLELINT="node_modules/.bin/stylelint"
if [ ! -x "$STYLELINT" ]; then
	echo "pre-commit: stylelint is not installed" 1>&2
	exit 1
fi

STAGED_FILES=($(git diff --cached --name-only --diff-filter=ACM | grep ".[ps]?css$"))
if [ "$STAGED_FILES" == "" ]; then
	exit 0
fi

$STYLELINT "${STAGED_FILES[@]}" --fix
STYLELINT_EXIT="$?"
# Re-add files since they may have been fixed
git add "${STAGED_FILES[@]}"

GIT_EXIT="$?"
if [[ "${STYLELINT_EXIT}" != 0 ]]; then
	echo "pre-commit: fix stylelint errors" 1>&2
	exit 1
fi

exit $GIT_EXIT
