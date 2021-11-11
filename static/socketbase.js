export const socket = io();
window.socket = socket;
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
 * Initialise subscriptions for the socket
 * @param {string[]} subs 
 */
export function init(subs) {
    if(socket.connected){
        console.log(subs);
        socket.emit("subscribe", subs);
    }
    if(subscriptions == null)
        subscriptions = subs;
    else
        subscriptions = subscriptions.concat(subs);
}