FROM registry.aiaipool.com/game/devops:nginx-static-latest

ADD dist /etc/nginx/html

RUN find /etc/nginx/html -type d -exec chmod 755 {} \;
RUN find /etc/nginx/html -type f -exec chmod 644 {} \;

EXPOSE 80
