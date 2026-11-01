@echo off
chcp 65001 > nul
title DAW StudyHub - Servidor Local de Edición en Vivo

echo ===================================================================
echo   Iniciando Plataforma de Estudio con Modo Edición en Vivo...
echo ===================================================================
echo.
echo   Abriendo navegador en http://localhost:8000 ...
echo   Cualquier cambio que guardes se actualizará permanentemente
echo   en el código HTML del disco.
echo.
echo   Presiona Ctrl+C para cerrar el servidor cuando termines.
echo ===================================================================
echo.

start http://localhost:8000
python server.py

pause
