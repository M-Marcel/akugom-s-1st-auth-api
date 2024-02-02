# Use an official Node runtime as the base image
FROM node:16.18-buster-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# generate prisma
# RUN npx prisma generate

# Expose port 3000 for the application
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "run", "start:dev"]
