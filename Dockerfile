FROM node:alpine

# Install git, zip, and bash
RUN apk add git zip bash

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./



# Install dependencies
RUN npm install


# Copy app files
COPY . .

RUN chmod +x script/backup.sh
# RUN chmod +x /etc/crontab

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
