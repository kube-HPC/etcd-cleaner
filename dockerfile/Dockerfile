ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}node:14.5.0 as install
ADD ./package-lock.json ./package.json /hkube/etcd-cleaner/
WORKDIR /hkube/etcd-cleaner
RUN npm ci --production

ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}hkube/base-node:v1.2.0
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /hkube
COPY . /hkube/etcd-cleaner
COPY --from=install /hkube/etcd-cleaner/node_modules /hkube/etcd-cleaner/node_modules
WORKDIR /hkube/etcd-cleaner
CMD ["node", "app.js"]
