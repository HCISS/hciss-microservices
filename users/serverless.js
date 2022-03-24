const serverlessExpress = require('@vendia/serverless-express')
const app = require('./app')
// @ts-ignore
exports.handler = serverlessExpress({ app })