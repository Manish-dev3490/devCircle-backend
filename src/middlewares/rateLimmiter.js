const redisClient = require('../config/redis');


async function rateLimmiter(req, res, next) {
    try {
        const ip = req.ip;
        const numberOfRequest = await redisClient.incr(ip);

        if (numberOfRequest == 1) {
            await redisClient.expire(ip,3600);
        }

        else if (numberOfRequest > 60) throw new Error("Too many request ");

        next();
    }
    catch (error) {
        res.status(429).send("Error " + error.message);
    }
}

module.exports = rateLimmiter;