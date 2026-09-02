export class SaiedCall {
  private pc: RTCPeerConnection;
  private localStream?: MediaStream;

  constructor(private onRemoteStream: (stream: MediaStream) => void) {
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    this.pc.ontrack = event => {
      const stream = event.streams[0];
      if (stream) this.onRemoteStream(stream);
    };
  }

  async startLocalMedia(video: boolean) {
    this.localStream = await navigator.mediaDevices.getUserMedia({audio:true, video});
    this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream!));
    return this.localStream;
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async acceptOffer(offer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(offer);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async setAnswer(answer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(candidate);
  }

  end() {
    this.localStream?.getTracks().forEach(t => t.stop());
    this.pc.close();
  }
}
