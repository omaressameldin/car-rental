FROM node:10.9.0-alpine

RUN npm i -g create-react-app

COPY ./start.sh /start.sh
RUN chown -R node:node /start.sh
RUN chmod +x /start.sh

USER node
WORKDIR /usr/src/app

EXPOSE 3000