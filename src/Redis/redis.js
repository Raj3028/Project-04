//=====================Importing Module and Packages=====================//
const redis = require('redis')
const { promisify } = require('util')



//===================== Connect to Redis =====================//
const redisClient = redis.createClient(
    10282,
    "redis-10282.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    //"redis-11500.c264.ap-south-1-1.ec2.cloud.redislabs.com",UQZxoZN35xqOEab95z7P1g2JCwEH1wTo
    { no_ready_check: true }
);
redisClient.auth("eKZgPvpPIOl7k2z6Boosp2XqggdUlMX1", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//===================== Connection setup for Redis =====================//
const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



//=====================Module Export=====================//
module.exports = { GET_ASYNC, SET_ASYNC };
