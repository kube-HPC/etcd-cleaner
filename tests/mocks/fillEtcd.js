const Etcd = require('@hkube/etcd');
const main = async () => {
    const SERVICE_NAME = 'my-test-service';
    const config = { host: 'localhost', port: '4001', serviceName: SERVICE_NAME };
    etcd = new Etcd(config);

    const prefix = '/workers';
    const count = 10;
    const dataSize = 80;
    const data = Buffer.alloc(dataSize, 'x');
    const array = Array.from(Array(count).keys());
    await Promise.all(array.map(a => etcd._client.put(`${prefix}/${a}`, { timestamp: 1, data })));
};

main();