// Connect to redis
const keys = require('./keys');
const redis = require('redis');

// Logic to get our connextion over to our redis server
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // If connection to redis server is lost, attempt reconnetion once every 1 mils
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

// Logic to calculate fibo given an index
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}
// watch redis for any time we get a new value, and then run our fib func 
// (similar to signalR in C#)
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');