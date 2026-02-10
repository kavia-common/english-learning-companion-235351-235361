#!/usr/bin/env sh
# Workspace-level Gradle wrapper shim for tooling that runs from this workspace root.
if [ -f "./backend/../gradlew" ] && [ "$0" != "./gradlew" ]; then
  sh "./gradlew" "$@"
  exit $?
fi

# Prefer forwarding to the frontend wrapper if present.
if [ -f "../english-learning-companion-235351-235362/frontend_learning_app/gradlew" ]; then
  sh "../english-learning-companion-235351-235362/frontend_learning_app/gradlew" "$@"
  exit $?
fi

if [ -f "../english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" ]; then
  sh "../english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" "$@"
  exit $?
fi

echo "workspace gradlew shim: no frontend gradle wrapper found; nothing to do."
exit 0
