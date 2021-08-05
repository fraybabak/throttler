const Redis =  require("ioredis");
const listEndpoints = require("express-list-endpoints");
const { pathToRegexp} = require("path-to-regexp");



class Throttler {
    constructor(option){
        this.redis = new Redis(option.redis_address);
        this.limit = option.limit
        this.cooldown =  option.cooldown
    }
    setup(app){
        return listEndpoints(app).map(async route => await this.redis.set(`throttler:${pathToRegexp(route.path)}`, this.limit ? this.limit : "*"))
    }
    async guard(req, res, next){
        let throttle_route = await this.redis.get(`throttler:${pathToRegexp(req.path)}`);
        if(throttle_route){
            let incoming =  Buffer.from(`${req.socket.remoteAddress}${req.headers['user-agent']}_${req.path}${req.method}`, 'utf8').toString("hex");
            let record = await this.redis.get(incoming);
            if(!record){
                await this.redis.set(incoming, 0, "EX", this.cooldown)
            }
            if(throttle_route > (record? record: 0 )){
                await this.redis.incr(incoming);
                next()
            }else{
                return res.status(403).send({message: "forbiden"})
            }
    
        }
        next()
    }
    
}
module.exports = Throttler;