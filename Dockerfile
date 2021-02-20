FROM node:14

ENV NODE_ENV="production"

WORKDIR /src/app

COPY . .

RUN cd ./client && npm ci --only=production && npm run build && cd ..

RUN cd ./server && npm ci --only=production  && cd ..

RUN cp -r ./client/build/* ./server/public/

WORKDIR  /src/app/server

EXPOSE 8080

CMD [ "npm", "run", "run" ]
