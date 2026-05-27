const redis=require('redis');

const redisClient=redis.createClient({
    username: 'default',
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: `${process.env.REDIS_HOST_URL}`,
        port: 14691
    }
})

module.exports=redisClient;