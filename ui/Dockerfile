FROM node:alpine

ARG ENV
#Install and cache node_modules
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install --frozen-lockfile && \
    mkdir -p /app && \
    mv /tmp/node_modules /app/

WORKDIR /app
COPY ./ /app

RUN yarn build 

EXPOSE 3000

RUN npx next telemetry disable

CMD if [ "$ENV" = "dev" ] ; then yarn dev ; else yarn start ; fi