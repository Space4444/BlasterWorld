class WebRTC {
  constructor(socket, player) {
    console.log('webrtc constructor');
    Object.assign(this, {
      pc: null,
      offer: null,
      answer: null,
      remoteReceived: false,
      socket: socket.UDPsocket,
      socketId: socket.id,
      player: player
    });
    this.doHandleDataChannels();
  }

  doHandleDataChannels() {
    console.log('doHandleDataChannels');

    const syncChannel = {};
    const inputChannel = {};
    syncChannel.send = msg => this.socket.emit('webrtcMessage', {label: 'sync', msg});
    inputChannel.send = msg => this.socket.emit('webrtcMessage', {label: 'input', msg});
    this.socket.on('webrtcMessage', data => {
        const label = data['label'];
        const msg = data['msg'];
        if (label === 'sync') {
            const data = JSON.parse(msg);
            if (data['type'] === 'ping') {
                syncChannel.send(msg);
            }
        } else if (label === 'input') {
            this.player.onInputMessage(inputChannel, {'data': msg});
        }
    });
    WebRTC.channels[this.socketId] = syncChannel;
    syncChannel.player = this.player;
  }
}
WebRTC.channels = {}
