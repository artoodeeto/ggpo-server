FROM node:12.13.1
WORKDIR /server

# need this because of bcrpty elm error
COPY package.json /server

RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]