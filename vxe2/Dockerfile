FROM nginx:latest

# Add the project to the container
RUN mkdir /app
COPY ./ /app

 WORKDIR "/app"

RUN \
    # update & install curl
    apt-get -y update && apt-get -y install curl

RUN \
    # get install script and pass it to execute:
    curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN \
    # and install node
    apt-get install -y nodejs