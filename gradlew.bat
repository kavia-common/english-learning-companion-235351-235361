@echo off
REM Minimal stub gradle wrapper for CI environments that expect gradlew.bat to exist.
REM This backend-only repository does not use Gradle; return success to avoid false failures.
echo gradlew stub: no Gradle project in this container; skipping.
exit /b 0
