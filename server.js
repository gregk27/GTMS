require("./types");
const config = require("./config");

const express = require("express");
const crypto = require("crypto");
const { Server } = require("socket.io");

const app = express();

const server = app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})

const io = new Server(server);

/** @type Object.<string, Object.<string, Client>> */
let subscriptions = {};

class Client {
    constructor(sock) {
        this.sock = sock;
        // List of all subscriptions created.
        this.subs = [];
        this.uuid = crypto.randomUUID();

        this.sock.on("disconnect", () => this.destructor());
        this.sock.on("subscribe", (str) => this.subscribe(str));
        this.sock.on("unsubscribe", (str) => this.unsubscribe(str));
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

io.on("subscribe", (str) => console.log(str));

async function emit(event, payload){
    let subs = subscriptions[event]
    if(subs != undefined && subs != null){
        for(let [uuid, c] of Object.entries(subs)){
            c.emit(event, payload)
        }
    }
}


module.exports = {
    express, app, server, io, config, emit
}