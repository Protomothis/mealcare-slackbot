FROM node:18-alpine
ARG SLACK_BOT_TOKEN
ARG SLACK_SIGNING_SECRET
ARG APP_TOKEN
ENV SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN
ENV SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET
ENV APP_TOKEN=$APP_TOKEN
# 도커 컨테이너 내부의 작업 디렉토리 결정하기. 원하는 대로 정하면 됩니다.
WORKDIR /usr/src/app
# 외부 패키지 설치를 위해 package.json과 yarn.lock 파일 복사
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "yarn", "serve" ]
