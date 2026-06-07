'use strict';
const http = require('node:http');
const auth = require('http-auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('./lib/router');

const basic = auth.basic({
  realm: 'Enter username and password',
  file: './users.htpasswd'
});
const server = http.createServer(basic.check(async (req,res) => {
  const username = req.user;

  let user = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username
        }
      });
    }
  router.route(req, res);
}))
.on('error', e => {
  console.error('Server Error', e);
})
.on('clientError', e => {
  console.error('Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});