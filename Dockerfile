FROM nginx

# Copy the static files to the nginx directory

COPY . /usr/share/nginx/html
