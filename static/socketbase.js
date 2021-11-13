export const socket = io();
window.socket = socket;
var subscriptions = null;

var callback = [() => {}];

socket.on('connect', ()=>{
    if(subscriptions != null){
        console.log(subscriptions);
        socket.emit("subscribe", subscriptions)
    }
    for(let c of callback)
        if(c) c();
})
socket.on('reconnect', ()=>{
    if(subscriptions != null){
            socket.emit("subscribe", subscriptions)
    }
    for(let c of callback)
        if(c) c();
})

/**
 * Initialise subscriptions for the socket
 * @param {string[]} subs 
 */
export function init(subs, onConnect) {
    callback.push(onConnect);
    if(socket.connected){
        console.log(subs);
        socket.emit("subscribe", subs);
    }
    if(subscriptions == null)
        subscriptions = subs;
    else
        subscriptions = subscriptions.concat(subs);
}