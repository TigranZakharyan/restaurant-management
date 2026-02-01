FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Step 5: Set to production AFTER the build is done
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]