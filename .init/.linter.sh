#!/bin/bash
cd /home/kavia/workspace/code-generation/anime-viewer-plus-159710-159720/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

