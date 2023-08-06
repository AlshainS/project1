# syntax=docker/dockerfile:1

FROM node:18-alpine
RUN mkdir /code
WORKDIR /code
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i
COPY . .
CMD ["npm", "run", "build"]
CMD ["npm", "run", "start"]