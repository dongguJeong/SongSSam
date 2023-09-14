import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import {  useSelector } from 'react-redux';
import { getAccessToken } from '../redux/tokenSlice';
import styled from 'styled-components';
import '../styles/global.css';

interface INote{
  startX : number,
  endX : number,
  startY : number,
  endY : number,
}

interface ISaveVoice{
  clipName : string,
  audioURL : string,
  blob : Blob,
  
}


const SectionTitle = styled.h1`
  margin-top : 10px;
`
const RecordStartBtn = styled.button`
  border : none;
  color : white;
  background-color : ${(props) => (props.disabled ? 'rgba(0,0,0,0.5)' : 'var(--iconColor)')};
  border-radius : 10px;
  cursor : ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  padding : 20px 10px;
  font-size  :15px;
  margin-right : 10px;
  box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);
`
const RecordStopBtn = styled(RecordStartBtn)``

const ClipContainer = styled.h1``
const ClipTitle = styled.h2``
const ClipAudio = styled.audio``



function PerfectScore() {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState<ISaveVoice[]>([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [pitch, setPitch] = useState(0);
  const buffersize = 75;
  const voiceRef = useRef<INote[]>(new Array(buffersize));
  const voiceArray=voiceRef.current;
  
  // Canvas 설정
  const canvasWidth = 950;
  const canvasHeight = 500;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasHalf = canvasWidth / 4;
  
  
  

  const barwidth = canvasHalf/buffersize;

  const lineNumber = 16;
  const lineHeight = canvasHeight / lineNumber; 

  let 기준음 = 48;
  let 최고음 = 기준음+12;
  let 최저음 = 기준음 - 12;
  const 최고음시작점 = lineHeight/2; 

  
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
      if(i === 8){
        ctx.lineWidth = 5;
      }
      else{
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
    
  }, [canvasHeight]);



  // 실시간 목소리 pitch 탐지
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
    if (Math.round(clarity * 100) > 50) {

      //들어온 목소리에 대해서 미디 번호를 알아내고
      midi = freqToNote(Math.round(pitch * 10) / 10);

      if( (midi <= 최고음) && (midi >= 최저음) ){
       const startY= 최고음시작점+Math.abs(최고음 - midi) * 0.5 * lineHeight;
       const endY = startY + lineHeight;
       voiceArray.push({startX : startX,endX : endX, startY: startY, endY :endY});
      }

       else{
        voiceArray.push({startX : startX,endX : endX, startY: 0, endY : 0});
       }
      setPitch(() => midi);

    }else{
      midi = 0;
      voiceArray.push({startX : startX, endX : endX, startY: 0, endY :0});
      setPitch(midi);
    }

    requestAnimationFrame(() => updatePitch(analyserNode, detector, input, sampleRate));
  }

  
  //getUserMedia 설정
  const constraint = { audio: true };

  const onSuccess = (stream : MediaStream) => {
     mediaRecorderRef.current = new MediaRecorder(stream);
    
     mediaRecorderRef.current.ondataavailable = (e) => {
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
      
      
      if(i=== 8){
        ctx.lineWidth = 5;
      }
      else{
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
      
        
        if( voice.startY === 0 ) {   
         ctx.fillStyle = "white";
        }
        else{
          ctx.fillStyle = "blue";
        }
      ctx.fillRect(voice.startX,voice.startY, barwidth,lineHeight);
  
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
    console.log("녹음 시작");

    

    if (mediaRecorderRef.current) {

    setChunks(() => []); // Reset chunks
    mediaRecorderRef.current.start();
    setRecording(true);
    }
    else{
      console.log("미디어 레코더 없음");
    }
  };

  const handleStopRecording = () => {

    console.log("녹음 끝");
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPitch((prev) => (prev = 0));
    }
  };

  const saveClip = () => {
    const clipName = `${count}번 클립`;
    setCount((prev) => prev + 1);
    const blob = new Blob(chunks, { type: 'audio/mp3' });
    setChunks(() => []);
    const audioURL = window.URL.createObjectURL(blob);
    setClips((prev) => [...prev, { clipName, audioURL, blob }]);
  };


  const AToken =  useSelector(getAccessToken);
  const 음성전송 = (음성파일 : Blob) => {

    const voiceURL = "http://songssam.site:8080/member/vocal_upload";
    const formData = new FormData();
    const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    formData.append('file', audioBlob, 'audio.mp3'  ); // 'audioBlob'는 서버에서 받을 때 사용할 필드 이름

  // fetch를 사용하여 서버로 전송
  fetch(voiceURL, {
    method: 'POST',
    body: formData,
    headers : {
      "Authorization": "Bearer " + AToken
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('파일 업로드에 실패했습니다.');
      }
      return response.json(); // 서버 응답 처리
    })
    .then((data) => {
      console.log('파일 업로드 성공:', data);
      // 서버 응답 처리 로직을 추가하세요.
    })
    .catch((error) => {
      console.error('파일 업로드 오류:', error);
      // 오류 처리 로직을 추가하세요.
    });

  }

  useEffect(() => {
    if (chunks.length > 0 && !recording) {
      saveClip();
    }
  }, [chunks, recording]);

  return (
    <div>
      <h1>미디 번호 :  {pitch} </h1>

      <canvas height={canvasHeight} width={canvasWidth} ref={canvasRef}></canvas>

      <div>
        
        <RecordStartBtn onClick={handleStartRecording} disabled={recording}>
          <span>녹음시작</span>
        </RecordStartBtn>
        <RecordStopBtn onClick={handleStopRecording} disabled={!recording}>
          <span>녹음종료</span>
        </RecordStopBtn>
      </div>

        <SectionTitle>녹음 클립들</SectionTitle>
      <section>
        
        {clips.map((clip, i) => (
          <div key={i}>
            <h1>{clip.clipName}</h1>
            <audio controls src={clip.audioURL}></audio>
            <button onClick={() => 음성전송(clip.blob)}>파일 전송</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PerfectScore;