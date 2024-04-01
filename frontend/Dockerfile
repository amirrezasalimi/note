# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install -f

# Copy all app files to the container
COPY . .

# Build your Vite app
RUN npm run build

# Expose the port that the app will run on
EXPOSE 8080


# Command to run your app
CMD ["npm", "run", "preview"]