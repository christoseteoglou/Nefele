FROM node:lts

RUN mkdir -p /nefele
WORKDIR /nefele

COPY package.json /nefele

RUN npm install 

COPY . /nefele

EXPOSE 3000

CMD npm run dev