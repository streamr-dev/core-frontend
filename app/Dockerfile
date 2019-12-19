FROM nginx:alpine

# Install nodejs for running healthcheck.js
RUN apk add --update nodejs

# Add nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy build artifacts
COPY dist /usr/share/nginx/html
