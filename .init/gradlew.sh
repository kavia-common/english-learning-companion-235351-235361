#!/usr/bin/env sh
# Workspace CI helper directory shim: scripts may run from this .init and invoke ./gradlew.sh.
if [ -f "../gradlew.sh" ]; then
  sh "../gradlew.sh" "$@"
  exit $?
fi

echo "workspace .init gradlew.sh shim: ../gradlew.sh not found; nothing to do."
exit 0
