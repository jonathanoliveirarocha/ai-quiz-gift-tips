@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Presente Certo

echo.
echo  ==========================================
echo    Presente Certo - iniciando o projeto
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado. Instale a versao LTS em https://nodejs.org e rode de novo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/3] Instalando dependencias ^(so na primeira vez^)...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo [ERRO] Falha ao instalar as dependencias.
    pause
    exit /b 1
  )
) else (
  echo [1/3] Dependencias ja instaladas.
)

echo [2/3] Conferindo configuracao...
call node scripts\setup.mjs
if errorlevel 1 (
  pause
  exit /b 1
)

echo [3/3] Subindo backend ^(porta 3001^) e frontend ^(porta 5173^)...
echo        O navegador abre sozinho em http://localhost:5173
echo        Para encerrar, feche esta janela ou aperte Ctrl+C.
echo.
call npm run dev
pause
