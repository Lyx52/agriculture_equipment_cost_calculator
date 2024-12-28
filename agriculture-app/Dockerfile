FROM node:18-slim
WORKDIR /usr/app
COPY . .
RUN npm install
ENTRYPOINT ["npm", "run", "build"]