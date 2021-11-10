export const socket = io();
var subscriptions = null;

socket.on('connect', ()=>{
    if(subscriptions != null){
        console.log(subscriptions);
        socket.emit("subscribe", subscriptions)
    }
})
socket.on('reconnect', ()=>{
    if(subscriptions != null){
        socket.emit("subscribe", subscriptions)
    }
})

/**
 * Initialise subscriptions for the socket, can only be done once
 * @param {string[]} subs 
 */
export function init(subs) {
    if(subscriptions == null){
        if(socket.connected){
            console.log(subs);
            socket.emit("subscribe", subs);
        }
        subscriptions = subs;
    }
}