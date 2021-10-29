FROM nginx:mainline

RUN apt-get update && apt-get --assume-yes --no-install-recommends install curl \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# Add nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy build artifacts
COPY dist /usr/share/nginx/html
