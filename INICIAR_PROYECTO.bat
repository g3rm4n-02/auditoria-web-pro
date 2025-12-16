@echo off
title INICIADOR PROYECTO FULL STACK
echo ===============================
echo INICIADOR DEL PROYECTO
echo ===============================
echo.

echo Comprobando Node.js...
where node
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Node.js NO esta instalado.
    echo Se abrira la pagina para descargarlo.
    start https://nodejs.org
    echo.
    echo Instala Node.js LTS, REINICIA el PC
    echo y vuelve a ejecutar este archivo.
    pause
    exit
)

echo ✅ Node.js detectado
echo.

echo Comprobando NPM...
where npm
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ NPM no encontrado
    pause
    exit
)

echo ✅ NPM detectado
echo.

echo Entrando al backend...
cd backend || (
    echo ❌ No se encuentra la carpeta backend
    pause
    exit
)

echo Instalando dependencias...
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en npm install
    pause
    exit
)

echo.
echo Arrancando servidor...
npm start

echo.
echo Si ves este mensaje, el servidor se cerro.
pause
