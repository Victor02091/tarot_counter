FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app
COPY . .

# Expose frontend port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
