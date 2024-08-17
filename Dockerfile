FROM node:22

# USER root
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

# Expose Application Port
EXPOSE 3000

# Run The Application
CMD ["npm", "start"]