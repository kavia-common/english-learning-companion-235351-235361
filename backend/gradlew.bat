@echo off
REM Minimal stub gradle wrapper for CI environments that expect gradlew.bat to exist.
REM This backend-only project does not use Gradle; return success to avoid false failures.
echo gradlew stub (backend): no Gradle project here; skipping.
exit /b 0
