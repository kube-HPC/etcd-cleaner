ARG BASE_PRIVATE_REGISTRY=""
FROM ${BASE_PRIVATE_REGISTRY}hkube/base-node:v1.0.0
LABEL maintainer="yehiyam@gmail.com"
RUN mkdir /hkube
COPY . /hkube/etcd-cleaner
RUN cd /hkube/etcd-cleaner
WORKDIR /hkube/etcd-cleaner
CMD ["node", "app.js"]
