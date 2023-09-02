import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from "https://esm.sh/pitchy@4";
import Layout from '../components/Layout';


function Singing() {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState([]);
  const [피치 , set피치 ] = useState(0);
  const [선명도 , set선명도 ] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioContext = new window.AudioContext();
  const analyserNode = audioContext.createAnalyser();

  const canvasRef = useRef(null);
  

  

  useEffect(() => {

      const canvas = canvasRef.current;
      const ctx= canvas.getContext("2d");
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "green";
      ctx.fillRect(10, 10, 800, 600);

      const numLines = 5;
      const lineHeight = canvas.height / (numLines+1); 
      const lineWidth = canvas.width;

      

      for (let i = 0; i < numLines; i++) {
        const yPos = i * lineHeight+lineHeight;
        ctx.beginPath();
        ctx.moveTo(10, yPos);
        ctx.lineTo(lineWidth, yPos);
        ctx.strokeStyle = 'black';
        ctx.stroke();
      }

    if (navigator.mediaDevices.getUserMedia) {
      const constraint = { audio: true };

      const onSuccess = (stream : any) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setChunks((prev) => [...prev, e.data]);
          }
        };
        const audioContext = new window.AudioContext();
        const analyserNode = audioContext.createAnalyser();
        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);

        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);
        updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    
      };

      const onError = (err : any) => {
        console.log("오류 발생: " + err);
      };

      navigator.mediaDevices.getUserMedia(constraint)
      .then(onSuccess, onError);
      
      

    } else {
      console.log("getUserMedia를 지원하지 않는 브라우저입니다");
    }
  }, []);

  const handleStartRecording = () => {
    setChunks(() => []); // Reset chunks
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    set선명도((prev) => prev= 0);
    set피치((prev) => prev =0);
  };

  const saveClip = () => {
    const clipName = `${count}번 클립`;
    setCount((prev) => prev + 1);
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    setChunks(() => []);
    const audioURL = window.URL.createObjectURL(blob);
    setClips((prev) => [...prev, { clipName, audioURL }]);
  };

  useEffect(() => {
    if (chunks.length > 0 && !recording) {
      saveClip();
    }
  }, [chunks, recording]);

  

  function updatePitch(analyserNode, detector, input, sampleRate) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    
    set피치(() => Math.round(pitch * 10) / 10);
    set선명도(() => Math.round(clarity * 100));

    window.setTimeout(
      () => updatePitch(analyserNode, detector, input, sampleRate),
      100
    );
  }



  const freqToNote = (freq: number) => {
    return Math.round(12 * (Math.log(freq / 440.0) / Math.log(2))) + 69;
  };




  return (
    
      <Layout>
      <div>
        <h1>Pitch : {피치} Hz</h1>
        
      </div>

      <canvas ref={canvasRef}></canvas>


      <span>녹음 클립들</span>
      <button onClick={handleStartRecording} disabled={recording}>
        녹음시작
      </button>
      <button onClick={handleStopRecording} disabled={!recording}>
        녹음종료
      </button>

      <section>
        {clips.map((clip, i) => (
          <div key={i}>
            <h1>{clip.clipName}</h1>
            <audio controls src={clip.audioURL}></audio>
          </div>
        ))}
      </section>
      </Layout>
  );
}

export default Singing;
