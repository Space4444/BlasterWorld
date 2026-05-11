function io() {
    const ssl = window.location.protocol === 'https:';
    const protocol = ssl ? 'wss' : 'ws';
    const ws = new WebSocket(protocol + '://' + location.host + '/websocket');

    const socket = {
        callbacks: new Map()
    };
    socket.on = (label, callback) => socket.callbacks.set(label, callback);
    socket.once = (label, callback) => socket.callbacks.set(label, callback);
    socket.emit = (label, data) => ws.send( JSON.stringify({label, data}) );

    ws.addEventListener('message', (event) => {
        handleWebSocketMessage(socket, event.data);
    });

    return socket;
}


function handleWebSocketMessage(socket, message) {
    const {label, data} = JSON.parse(message);
    const callback = socket.callbacks.get(label);
    callback?.(data);
}
