FROM php:8.3-apache

# Install system packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/*


# Copy project
COPY . /var/www/html/

WORKDIR /var/www/html

# Apache configuration
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80