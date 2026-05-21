FROM node:24-alpine
RUN apk add --no-cache openssl
WORKDIR /transcendence
COPY package*.json ./
RUN npm install 
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD npx prisma db push && npm run dev