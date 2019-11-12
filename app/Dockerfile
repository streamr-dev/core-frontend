FROM node:8.16.0-stretch-slim
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq python git make g++ bash autoconf automake nginx

RUN npm i -g npm@^6.9.0

WORKDIR /streamr-platform/app

# Helps to cache modules
COPY ./app/package-lock.json /streamr-platform/app
COPY ./app/package.json /streamr-platform/app
# Install libs
RUN npm ci
COPY ./app /streamr-platform/app
COPY ./.git /streamr-platform/.git/
RUN npm run build
# A plugin needs the git information but this should be removed from the image once its not needed
RUN rm -rf /streamr-platform/.git
COPY default /etc/nginx/sites-enabled/
RUN cat /etc/nginx/sites-enabled/*
EXPOSE 8180
CMD ["nginx", "-g", "daemon off;"]