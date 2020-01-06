FROM node:12.13.1
WORKDIR /server
COPY . .
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "dev"]