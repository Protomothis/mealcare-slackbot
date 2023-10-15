FROM node:19-alpine
RUN --mount=type=secret,id=SLACK_BOT_TOKEN \
  --mount=type=secret,id=SLACK_SIGNING_SECRET \
  --mount=type=secret,id=APP_TOKEN \
  export SLACK_BOT_TOKEN=$(cat /run/secrets/SLACK_BOT_TOKEN) && \
  export SLACK_SIGNING_SECRET=$(cat /run/secrets/SLACK_SIGNING_SECRET) && \
  export APP_TOKEN=$(cat /run/secrets/APP_TOKEN)
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "yarn", "start" ]
