FROM node:18.13 as builder

# set working directory
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN apt update
RUN apt install -y netcat
RUN npm install -g npm@8.3.1
RUN npm install -g @angular/cli
RUN npm install -g pnpm
RUN mkdir -p /app
RUN chown 1000:1000 /app
USER node
WORKDIR /app
