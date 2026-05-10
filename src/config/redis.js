const redis=require('redis');

const redisClient=redis.createClient({
    username: 'default',
    password: '6negELhHvJOhL2mPC08T4WrakEbxNgAo',
    socket: {
        host: 'redis-14691.c8.us-east-1-3.ec2.cloud.redislabs.com',
        port: 14691
    }
})

module.exports=redisClient;