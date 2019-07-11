# base image
FROM node:latest as build-stage

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# install and cache app dependencies
COPY . /usr/src/app


RUN yarn install

RUN yarn run build


FROM nginx:latest
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]