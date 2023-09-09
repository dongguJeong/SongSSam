import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';


interface INote{
  startX : number,
  endX : number,
  startY : number,
  endY : number,
}

interface ISaveVoice{
  clipName : string,
  audioURL : string,
  
}

function Singing() {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState<ISaveVoice[]>([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [피치, set피치] = useState(0);
  const [옥타브, set옥타브] = useState(0);
  const buffersize = 50;
  const voiceRef = useRef<INote[]>(new Array(buffersize));
  const voiceArray=voiceRef.current;
  
  // Canvas 설정
  const canvasWidth = 1400;
  const canvasHeight = 500;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasHalf = canvasWidth / 2;
  
  let 높은옥타브 = 5;
  let 낮은옥타브 = 3;

  const barwidth = canvasHalf/buffersize;

  const lineNumber = 16;
  const lineHeight = canvasHeight / lineNumber;

  
  //음성정보

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
  }, []);

  //오선지 그리기
  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if(ctx && canvas) {
    
    ctx.fillStyle = 'white';
    canvas.style.border = '1px solid black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.strokeStyle = 'black';

    for (let i = 1; i <= lineHeight; i++) {
      const y = i * lineHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);

      if (i >= 6 && i <= 10) {
        ctx.lineWidth = 5;
      } else {
        ctx.lineWidth = 1;
      }

      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvasHalf, 0);
    ctx.lineTo(canvasHalf, canvasHeight);
    ctx.stroke();
    }
    
  }, []);



  // 실시간 목소리 피치 탐지
  function updatePitch(analyserNode : AnalyserNode, detector : PitchDetector<Float32Array> , input : Float32Array, sampleRate : number) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    let midi = 0;

    if(voiceArray.length >= buffersize ){
        voiceArray.shift();
    }

    const startX = canvasHalf-barwidth;
    const endX = canvasHalf;

    //목소리 분석
    if (Math.round(clarity * 100) > 70) {

      //미디 음계를 알아내고
      midi = freqToNote(Math.round(pitch * 10) / 10);

      //미디 음계로부터 옥타브와 계이름을 알아냄
      //인덱스 0 ~ 11 까지 각각 도, 도#, 레, 레# ... 등에 해당됨.
      const {noteIndex  , octave } = pitchToNoteName(midi);
      set옥타브(()=> octave);

      if (octave < 낮은옥타브 || octave > 높은옥타브) {
        midi  = 0;
        voiceArray.push({startX,endX,startY : 0, endY :0});
      }
      else{

        const startY = (5-0.5*noteIndex) * lineHeight + Math.abs(octave - 높은옥타브) * lineHeight * 5;
        const endY =  (6-0.5*noteIndex) * lineHeight + Math.abs(octave - 높은옥타브)* lineHeight * 5;

        voiceArray.push({startX : startX,endX : endX, startY: startY, endY :endY});
      }

      set피치(() => midi);

    }else{
      midi = 0;
      voiceArray.push({startX : startX, endX : endX, startY: 0, endY :0});
      set피치(midi);
    }

    requestAnimationFrame(() => updatePitch(analyserNode, detector, input, sampleRate));
  }

  
  //getUserMedia 설정
  const constraint = { audio: true };

  const onSuccess = (stream : MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setChunks((prev ) => [...prev, e.data]);
      }
    };

    const sourceNode = audioContextRef?.current?.createMediaStreamSource(stream);
    const audioContext = audioContextRef.current;

    if(sourceNode && audioContext){
      const analyserNode = audioContext.createAnalyser();
      sourceNode.connect(analyserNode);

      analyserNode.minDecibels = -90;
      analyserNode.maxDecibels = -10;
      analyserNode.fftSize = 2048;

      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      const input = new Float32Array(detector.inputLength);
      updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    }
  };

  const onError = (error : any) => {
    console.error('getUserMedia를 지원하지 않는 브라우저 입니다', error);
  };

  
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraint)
      .then(onSuccess)
      .catch(onError);
  }, []);


  //음성을 미디 번호로 변환
  const freqToNote = (freq : number) => {
    return Math.round(12 * (Math.log(freq / 440.0) / Math.log(2))) + 69;
  };

  //미디 번호에서 음계이름으로
  function pitchToNoteName(pitch : number) {
    // 음계 이름 배열
    
    // 피치를 12로 나눈 나머지를 계산하여 음계 인덱스로 변환
    const noteIndex = Math.round(pitch) % 12;
  
    // 피치를 옥타브로 나눈 몫을 계산하여 옥타브 번호 생성
    const octave = Math.floor(pitch / 12);
    return { noteIndex : noteIndex , octave} ;
  }


  //마이크 음성 시각화 하는 로직

  
  function 프레임마다실행할거(){

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d');

    //오선지 새로 그리기
    if(ctx && canvas){
    
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    canvas.style.border = '1px solid black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.strokeStyle = 'black';

    for (let i = 1; i <= lineHeight; i++) {
      const y = i * lineHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);

      if (i >= 6 && i <= 10) {
        ctx.lineWidth = 5;
      } else {
        ctx.lineWidth = 1;
      }

      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvasHalf, 0);
    ctx.lineTo(canvasHalf, canvasHeight);
    ctx.stroke();

    //사용자 음성을 화면에 시각화
    
    ctx.strokeStyle =" blue";

    for (const voice of voiceArray) {

      if (voice?.startX !== undefined && 
          voice?.startY !== undefined && 
          voice?.endX !== undefined && 
          voice?.endY !== undefined){
      
        
        if( voice.startY == 0 ) {   
         ctx.fillStyle = "white";
        }
        else{
          ctx.fillStyle = "blue";
        }
      ctx.fillRect(voice.startX,voice.startY-1, barwidth,lineHeight-1);
  
      voice.startX -= barwidth;
      voice.endX -= barwidth;
    
      }
    }
    requestAnimationFrame(프레임마다실행할거);
    }
  }


    useEffect(() => {
     
      프레임마다실행할거();

    },[voiceArray]);



  ////////////////////


  //녹음 기능
  const handleStartRecording = () => {

    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
    setChunks(() => []); // Reset chunks
    mediaRecorder.start();
    setRecording(true);
    }
  };

  const handleStopRecording = () => {

    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      set피치((prev) => (prev = 0));
    }
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

  return (
    <div>
      <h1>미디 음표 :  음계 {피치} </h1>
      <h1>옥타브 :   {옥타브} </h1>

      <canvas height={canvasHeight} width={canvasWidth} ref={canvasRef}></canvas>

      <div>
        <span>녹음 클립들</span>
        <button onClick={handleStartRecording} disabled={recording}>
          녹음시작
        </button>
        <button onClick={handleStopRecording} disabled={!recording}>
          녹음종료
        </button>
      </div>

      <section>
        {clips.map((clip, i) => (
          <div key={i}>
            <h1>{clip.clipName}</h1>
            <audio controls src={clip.audioURL}></audio>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Singing;
