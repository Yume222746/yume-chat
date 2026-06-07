'use strict';
const pug = require('pug');
const fs = require('node:fs');
const Cookies = require('cookies');
const { currentThemeKey } = require('../config');
const crypto = require('node:crypto');
const oneTimeTokenMap = new Map();

function handleLogout(req, res) {
  res.writeHead(401, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/logout.pug'));
}

function handleFavicon(req, res) {
  res.writeHead(200, {
    'Content-Type': 'image/vnd.microsoft.icon',
    'Cache-Control': 'public, max-age=604800'
  });
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
}

function handleChangeTheme(req, res) {
  const cookies = new Cookies(req, res);
  const currentTheme = (cookies.get(currentThemeKey) !== 'light' ? 'light' : 'dark');
  cookies.set(currentThemeKey, currentTheme);
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function handleStyleCssFile(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/css'
  });
  const StyleCssFile = fs.readFileSync('./public/style.css');
  res.end(StyleCssFile);
}

function handleJsFile(req, res) {
    res.writeHead(200, {
    'Content-Type': 'text/javascript'
  });
  const JSFile = fs.readFileSync('./public/nn-chat.js');
  res.end(JSFile);
}

function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/404.pug'));
}

function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('無効なリクエストです');
}



module.exports = {
  handleLogout,
  handleFavicon,
  handleChangeTheme,
  handleStyleCssFile,
  handleJsFile,
  handleNotFound,
  handleBadRequest,
};

