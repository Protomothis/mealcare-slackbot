FROM node:19-alpine
RUN --mount=type=secret,id=SLACK_BOT_TOKEN \
  cat /run/secrets/SLACK_BOT_TOKEN \
RUN --mount=type=secret,id=SLACK_SIGNING_SECRET \
  cat /run/secrets/SLACK_SIGNING_SECRET \
RUN --mount=type=secret,id=APP_TOKEN \
  cat /run/secrets/APP_TOKEN \
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "yarn", "serve" ]
