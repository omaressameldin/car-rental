FROM node:10.9.0-alpine

COPY ./start.sh /start.sh
RUN chown -R node:node /start.sh
RUN chmod +x /start.sh

USER node
WORKDIR /usr/src/app
EXPOSE 3000