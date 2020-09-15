FROM node:10-stretch-slim

WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN yarn build

CMD ["yarn", "start"]