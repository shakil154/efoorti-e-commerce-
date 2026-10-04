FROM php:8.3-cli
RUN apt-get update && apt-get install -y --no-install-recommends libpng-dev libjpeg-dev libfreetype6-dev libwebp-dev libicu-dev libzip-dev unzip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j$(nproc) pdo_mysql gd intl zip bcmath exif \
 && rm -rf /var/lib/apt/lists/*
RUN echo "upload_max_filesize=64M\npost_max_size=64M\nmemory_limit=512M" > /usr/local/etc/php/conf.d/local.ini
WORKDIR /var/www/html
