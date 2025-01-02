# Base image
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production

# Install all dependencies
RUN npm install

# Bundle app source
COPY . .

# Build app
RUN npm run build

# Expose the port the app runs in
EXPOSE 8080

# Serve the app
CMD ["npm", "run", "serve"]
