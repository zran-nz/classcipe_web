FROM nginx:1.19.5-alpine
COPY dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf