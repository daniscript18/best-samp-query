const dgram = require("dgram");
const iconv = require("iconv-lite")

function query (options) {
    return new Promise((resolve, reject) => {
        let response = { online: 0 };

        options.port = options.port || 7777;
        options.timeout = options.timeout || 1000;

        if(!options.host) return reject("Invalid \"host\" passed");
        if(!isFinite(options.port) || options.port < 1 || options.port > 65535) return reject(`Invalid port "${options.port}". Port mus"t be larger than 1 and less than 65535`);

        request(options, "i").then((information) => {
            response.address = options.host;
            response.port = options.port;
            response.hostname = information.hostname;
            response.gamemode = information.gamemode;
            response.mapname = information.mapname;
            response.passworded = Boolean(information.passworded);
            response.maxplayers = information.maxplayers;
            response.online = information.players;
        
            request(options, "r").then((rules) => {
                rules.lagcomp = rules.lagcomp === "On" ? true : false;
                rules.weather = parseInt(rules.weather, 10);
                response.rules = rules;

                if(response.online > 100) {
                    response.players = []
                    return resolve(response);
                }
                else {
                    request(options, "d").then((players) => {
                        response.players = players;
                        return resolve(response);
                    }).catch((e) => {
                        return reject(e);
                    });
                }
            }).catch((e) => {
                return reject(e);
            });
        }).catch((e) => {
            return reject(e);
        });
    });
};
    
function request (options, opcode) {
    return new Promise((resolve, reject) => {
        let socket = dgram.createSocket("udp4");
        let packet = Buffer.alloc(11);
        
        packet.write("SAMP");
        
        for(let i = 0; i < 4; ++i) packet[i + 4] = options.host.split(".")[i];
        
        packet[8] = options.port & 0xff;
        packet[9] = (options.port >> 8) & 0xff;
        packet[10] = opcode.charCodeAt(0);
        
        try {
            socket.send(packet, 0, packet.length, options.port, options.host, function (error, bytes) {
                if(error) return reject(error);
            });
        } catch (error) {
            return reject(error);
        }
        
        let controller = undefined;
        
        let onTimeOut = () => {
            socket.close();
            return reject("Socket timed out.");
        };
        
        controller = setTimeout(onTimeOut, options.timeout);
        
        socket.on("message", function (message) {
            if(controller) clearTimeout(controller);
            if(message.length < 11) return reject("Socket invalid");
            else {
                socket.close();
        
                message = message.slice(11);
        
                let object = {};
                let array = [];
                let strlen = 0;
                let offset = 0;
        
                try {
                    if(opcode == "i") {
                        object.passworded = message.readUInt8(offset); offset += 1;
                        object.players = message.readUInt16LE(offset); offset += 2;
                        object.maxplayers = message.readUInt16LE(offset); offset += 2;
                        strlen = message.readUInt16LE(offset); offset += 4;
                        object.hostname = decode(message.slice(offset, (offset += strlen)));
                        strlen = message.readUInt16LE(offset); offset += 4;
                        object.gamemode = decode(message.slice(offset, (offset += strlen)));
                        strlen = message.readUInt16LE(offset); offset += 4;
                        object.mapname = decode(message.slice(offset, (offset += strlen)));
                        return resolve(object);
                    }
                    if(opcode == "r") {
                        let rulecount = message.readUInt16LE(offset); offset += 2;
                        let property, value = undefined;
                
                        while(rulecount) {
                            strlen = message.readUInt8(offset); ++offset;
                            property = decode(message.slice(offset, (offset += strlen)));
                            strlen = message.readUInt8(offset); ++offset;
                            value = decode(message.slice(offset, (offset += strlen)));
                            object[property] = value;
                            --rulecount;
                        }
                        return resolve(object);
                    }
        
                    if (opcode == "d") {
                        let playercount = message.readUInt16LE(offset); offset += 2;
                        let player = undefined;
                
                        while(playercount) {
                            player = {};
                            player.id = message.readUInt8(offset); ++offset;
                            strlen = message.readUInt8(offset); ++offset;
                            player.name = decode(message.slice(offset, (offset += strlen)));
                            player.score = message.readUInt32LE(offset); offset += 4;
                            player.ping = message.readUInt16LE(offset); offset += 4;
                            array.push(player); --playercount;
                        }
                        return resolve(array);
                    }
                } catch (exception) {
                    return reject(exception);
                }
            }
        });
    });
};
    
function decode (buffer) {
    return iconv.decode(buffer, "win1251");
};
    
module.exports = query;