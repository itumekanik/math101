@echo off
setlocal
cd /d "%~dp0"

set "NODE_EXE="
if exist "C:\Program Files\nodejs\node.exe" set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if "%NODE_EXE%"=="" (
  for /f "delims=" %%i in ('where node 2^>nul') do if "%NODE_EXE%"=="" set "NODE_EXE=%%i"
)

if not exist "dist\index.html" (
  if not "%NODE_EXE%"=="" (
    echo Building the site...
    "%NODE_EXE%" scripts\build.mjs
  )
)

if not "%NODE_EXE%"=="" (
  echo Starting Mathematics Learning Platform at http://127.0.0.1:4173/
  start "" "http://127.0.0.1:4173/"
  "%NODE_EXE%" scripts\serve.mjs dist 4173
) else (
  echo Opening offline copy dist\index.html...
  start "" "dist\index.html"
)
