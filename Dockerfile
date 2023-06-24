FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine As production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

HEALTHCHECK --interval=3m --timeout=30s --start-period=15s --retries=3 CMD curl -f http://localhost:8080/api/heartbeat || exit 1

CMD ["node", "dist/main.js"]