FROM node:14.16.1-slim

ENV USER=SalmaneBot

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove
	
# create Salmanebot user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/salmane -r -g ${USER} ${USER}
	
# set up volume and user
USER ${USER}
WORKDIR /home/SalmaneBot

COPY package*.json ./
RUN npm install
VOLUME [ "/home/SalmaneBot" ]

COPY . .

ENTRYPOINT [ "node", "index.js" ]
