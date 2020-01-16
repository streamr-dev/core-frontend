FROM nginx:alpine

# Install curl for running healthcheck
RUN apk add --update curl

# Add nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy build artifacts
COPY dist /usr/share/nginx/html
