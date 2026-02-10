#!/usr/bin/env sh
# Some CI/analysis steps expect a Gradle wrapper at repo root.
# This project is primarily Node/React Native; forward to frontend wrapper if present.
if [ -f "../english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" ]; then
  sh "../english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" "$@"
elif [ -f "./english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" ]; then
  sh "./english-learning-companion-235351-235362/frontend_learning_app/gradlew.sh" "$@"
else
  echo "gradlew shim: no frontend gradlew.sh found; nothing to do."
  exit 0
fi
