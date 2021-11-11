require("./types");
const config = require("./config");

const express = require("express");
const crypto = require("crypto");
const { Server, Socket } = require("socket.io");

const app = express();

const server = app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})

const io = new Server(server);

/** @type Object.<string, Object.<string, Client>> */
let subscriptions = {};

class Client {
    constructor(sock) {
        /** @type Socket */
        this.sock = sock;
        // List of all subscriptions created.
        this.subs = [];
        this.uuid = crypto.randomUUID();

        this.sock.on("disconnect", () => this.destructor());

        this.sock.onevent = (packet) => {
            var args = packet.data || [];
            if(packet.data == []) return;
            switch(args[0]){
            case "subscribe":
                this.subscribe(args[1]);
                break;
            case "unsubscribe":
                this.unsubscribe(args[1]);
                break;
            default:
                // If there's a listener for the event, call it
                if(listeners[args[0]]){
                    let res = listeners[args[0]](this, args[1], args[2] ?? "")
                    if(res != undefined) emit(args[0], res);
                }
            }
        }
    }

    destructor(){
        if(this.subs == undefined || this.subs == null) return;
        for(let s of this.subs){
            this.unsubscribe(s);
        }
    }

    async emit(event, payload) {
        this.sock.emit(event, payload);
    }

    subscribe(str) {
        // If the input is an array, subscribe to all
        if(Array.isArray(str)){
            for(let s of str) this.subscribe(s);
            return;
        }
        if(this.subs.indexOf(str) > 0) return;
        this.subs.push(str)
        if(subscriptions[str] == undefined || subscriptions[str] == null){
            subscriptions[str] = {};
        }
        subscriptions[str][this.uuid] = this;
    }
    
    unsubscribe(str) {
        // If the input is an array, unsubscribe from all
        if(Array.isArray(str)){
            for(let s of str) this.unsubscribe(s);
            return;
        }
        
        // Try to remove from subscription, if it's not found then do nothing
        try{
            delete subscriptions[str][this.uuid];
            if(str in this.subs){
                this.subs.splice(this.subs.indexOf(str), 1);
            }
        } catch {}
    }
}

// Register new clients on connection
io.on("connection", (sock) => new Client(sock));

async function emit(event, payload){
    let subs = subscriptions[event]
    if(subs != undefined && subs != null){
        for(let [uuid, c] of Object.entries(subs)){
            c.emit(event, payload)
        }
    }
}

/** @type Object.<string, (client:Client, payload:any, auth:string?)=>any> */
var listeners = {};

/** 
 * Register a handler for an incoming event from any client.
 * The value returned by the function will be sent back to the client with the same event name
 * If undefined is returned then no response will be sent
 * Note that only one function can be registered to each handle
 * 
 * @param {string} handle
 * @param {(client:Client, payload, auth:string?)=>any} func
 */
function on(handle, func){
    listeners[handle] = func;
}

module.exports = {
    express, app, server, io, config, emit, on
}