FROM node:13-alpine

ENV NODE_ENV=production

RUN mkdir  -p /home/app

COPY ./admin/ /home/app

CMD ["node", "/home/app/bin/www"]