'use strict'
const pug = require('pug');
const Cookies = require('cookies');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ['query']});
const crypto = require('node:crypto');
const oneTimeTokenMap = new Map();
const { currentThemeKey } = require('../config');
const util = require('./handler-utils');
const postsHandle = require('./posts-handler');

async function handleProfile(req, res) {
  const cookies = new Cookies(req, res);
  const currentTheme = cookies.get(currentThemeKey) || 'light';
  const MyName = req.user;
  const pageUser = req.username;
  switch(req.method) {
    case 'GET':
      res.writeHead(200, {
        'Contents-type': 'text/html; charset=utf-8',
      });
      console.log(MyName);
      console.log(pageUser);
      const userData = await prisma.User.findUnique({
        where: {
          username: pageUser
        }
      });
      const bio = userData.bio;
      const email = userData.email;
      
      const oneTimeToken = crypto.randomBytes(8).toString('hex');
      oneTimeTokenMap.set(req.user, oneTimeToken);
      res.end(pug.renderFile('./views/profile_template.pug', { currentTheme, MyName, pageUser, bio, email, oneTimeToken}));
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const newBio = params.get('bio');
        const newEmail = params.get('e-mail');
        const requestedOneTimeToken = params.get('oneTimeToken');
        if (!requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        if (oneTimeTokenMap.get(req.user) !== requestedOneTimeToken) {
          util.handleBadRequest(req, res)
          return;
        }
        console.info(`送信されました: ${newBio}`);
        console.info(`送信されました: ${newEmail}`);
        await prisma.user.update({
          where: {
            username: MyName
          },
          data: {
            bio: newBio,
            email: newEmail
          }
        });
        postsHandle.handleRedirectPosts(req, res)
      });
      break;
  }
}

async function handleRedirectMyProfile(req, res) {
    const MyName = req.user;
  await res.writeHead(303,{
    'Loation' : `/profile/${MyName}`
  });
  res.end();
}

module.exports = {
  handleProfile,
}