FROM node:lts AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy all files
COPY package.json ./
COPY yarn.lock ./
COPY config/ ./config/
COPY src/ ./src/
COPY tsconfig*.json ./

RUN npm install -g yarn
RUN yarn
RUN ls .
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:lts

# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/ ./dist/
COPY --from=builder /usr/src/app/config/ ./config/
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 3000
ENTRYPOINT [ "npm","run", "start:prod" ]