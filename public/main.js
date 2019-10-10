const {
    app,
    BrowserWindow
} = require('electron');
const express = require('express');
const url = require('url');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadURL(url.format({
        pathname: 'http://localhost:3000/'
    }));
}

app.on('ready', createWindow);