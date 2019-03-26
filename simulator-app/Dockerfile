FROM node:10.9.0

COPY ./wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

COPY ./start.sh /start.sh
RUN chown -R node:node /start.sh
RUN chmod +x /start.sh


USER node
WORKDIR /usr/src/app