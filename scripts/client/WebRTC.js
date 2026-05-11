class WebRTC {
	constructor(socket, doComplete, dataChannelSettings) {
        console.log('webrtc constructor');
		Object.assign(this, {
			remoteReceived: false,
			socket: socket,
			doComplete: doComplete,
			channels: {},
			dataChannelSettings: dataChannelSettings
		});
		this.doCreateDataChannels();
	}

	doHandleError(error) {
        console.log('doHandleError');
		throw error;
	}

	doWaitforDataChannels() {
        console.log('doWaitforDataChannels');
	}

	doCreateDataChannels() {
        console.log('doCreateDataChannels');
		const labels = Object.keys(this.dataChannelSettings);
		labels.forEach(label => {
            const channel = {onmessage: data => {}};
            channel.send = msg => this.socket.emit('webrtcMessage', {
                'label': label,
                'msg': msg
            });
            this.channels[label] = channel;
		});
        this.socket.on('webrtcMessage', data => {
            const {label, msg} = data;
            this.channels[label].onmessage({'data': msg});
        });
        waitFor( () => window.webRTC)
            .then(w => this.doComplete() );
	}
}


function waitFor(f, time=200) {
    return new Promise( (res, rej) => {
        const r = f();
        if (r) {
            res(r);
        } else {
            setTimeout( () => res( waitFor(f, time) ), time);
        }
    });
}
