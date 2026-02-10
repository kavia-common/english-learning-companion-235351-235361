#!/bin/bash
cd /home/kavia/workspace/code-generation/english-learning-companion-235351-235361/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

