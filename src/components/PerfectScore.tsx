import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import {  useSelector } from 'react-redux';
import styled from 'styled-components';
import '../styles/global.css';
import AudioContainer from './AudioContainer';
import serverURL from '../asset/Url';
import { RootState } from '../redux/store';

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
  clipDurationTime : number ,
  
}


const SectionTitle = styled.h1`
  margin-top : 10px;
  margin-bottom : 10px;
`
const RecordStartBtn = styled.button`
  border : none;
  color : white;
  background-color : ${(props) => (props.disabled ? 'rgba(0,0,0,0.5)' : 'rgba(0,142,245,1)')};
  border-radius : 10px;
  cursor : ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  padding : 20px 10px;
  font-size  :15px;
  margin-right : 10px;
  box-shadow: ${(props) =>
    props.disabled
      ? '2px 4px 6px -1px rgb(0,0,0,.3)'
      : '2px 4px 6px -1px rgba(0,142,245,1)'};

  &:hover {
    background-color: ${(props) => (props.disabled ? 'rgba(0,0,0,0.5)' : 'rgba(0,142,245,0.8)')};
  }
`

const RecordBtnContainer = styled.div`
  margin-bottom : 15px;
  margin-top : 10px;
`
const RecordStopBtn = styled(RecordStartBtn)``;




function PerfectScore() {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState<ISaveVoice[]>([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [pitch, setPitch] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number >(0);
  const [recordingEndTime, setRecordingEndTime] = useState<number>(0);


  const buffersize = 75;
  const voiceArray = useRef<INote[]>(new Array(buffersize));
  
  
  // Canvas 설정
  const canvasWidth = 950;
  const canvasHeight = 500;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasHalf = canvasWidth / 4;
  const redlineWidth = 3
  
  

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

  
  // 실시간 목소리 pitch 탐지
  function updatePitch(analyserNode : AnalyserNode, detector : PitchDetector<Float32Array> , input : Float32Array, sampleRate : number) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    let midi = 0;

    if(voiceArray.current.length >= buffersize ){
        voiceArray.current.shift();
    }

    const startX = canvasHalf-barwidth;
    const endX = canvasHalf;


    //목소리 분석
    if (Math.round(clarity * 100) > 80) {

      //들어온 목소리에 대해서 미디 번호를 알아내고
      midi = freqToNote(Math.round(pitch * 10) / 10);

      if( (midi <= 최고음) && (midi >= 최저음) ){
       const startY= 최고음시작점+Math.abs(최고음 - midi) * 0.5 * lineHeight;
       const endY = startY + lineHeight;
       voiceArray.current.push({startX : startX,endX : endX, startY: startY, endY :endY});
      }

       else{
        voiceArray.current.push({startX : startX,endX : endX, startY: 0, endY : 0});
       }
      setPitch(() => midi);

    }else{
      midi = 0;
      voiceArray.current.push({startX : startX, endX : endX, startY: 0, endY :0});
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

  

  
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraint)
      .then(onSuccess)
      .catch((error) => {
        console.error('마이크 권한을 허용하지 않았습니다', error);
      });
  }, []);


  //음성을 미디 번호로 변환
  const freqToNote = (freq : number) => {
    return Math.round(12 * (Math.log(freq / 440.0) / Math.log(2))) + 69;
  };


  //마이크 음성 시각화 하는 로직

  
  function 프레임마다실행할거(){

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d');

    //오선지  그리기
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
      
      
      if(i=== 7){
        ctx.lineWidth = 5;
      }
      else{
        ctx.lineWidth = 1;
      }

      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    ctx.lineWidth = redlineWidth;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(canvasHalf, 0);
    ctx.lineTo(canvasHalf, canvasHeight);
    ctx.stroke();

    //사용자 음성을 화면에 시각화
    
    ctx.strokeStyle =" blue";

    for (const voice of voiceArray.current) {

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

    },[]);



  ////////////////////


  //녹음 기능
  const handleStartRecording = () => {
    console.log("녹음 시작");

    

    if (mediaRecorderRef.current) {

    setChunks(() => []); // Reset chunks
    mediaRecorderRef.current.start();
    setRecording(true);
    setRecordingStartTime(Date.now());
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
      setRecordingEndTime(Date.now());
    }
  };

  const saveClip = () => {
    const clipName = `${count}번 클립`;
    setCount((prev) => prev + 1);
    const blob = new Blob(chunks, { type: 'audio/wav' });
    setChunks(() => []);
    const audioURL = window.URL.createObjectURL(blob);
    const clipDurationTime = (recordingEndTime - recordingStartTime) / 1000; // 밀리초를 초로 변환


    setClips((prev) => [...prev, { clipName, audioURL, blob , clipDurationTime}]);
  };


  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
  const sendVoice = (음성파일 : Blob) => {
    const voiceURL = `https://${serverURL}/member/upload`;
    const formData = new FormData();
    formData.append('file', 음성파일, 'audio.wav');
  
    // fetch를 사용하여 서버로 전송
    fetch(voiceURL, {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (response.ok) {
          console.log('데이터 전송 성공'); // 200 OK 상태 코드
        } else {
          console.error('데이터 전송 실패'); // 오류 발생시 catch 블록으로 이동
        }
      })
      .catch((error) => {
        console.error('데이터 전송 오류:', error);
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

      <RecordBtnContainer>
        
        <RecordStartBtn onClick={handleStartRecording} disabled={recording}>
          <span>녹음시작</span>
        </RecordStartBtn>
        <RecordStopBtn onClick={handleStopRecording} disabled={!recording}>
          <span>녹음종료</span>
        </RecordStopBtn>
      </RecordBtnContainer>

        
      <section>
        <SectionTitle>녹음 클립들</SectionTitle>
        {clips.map((clip, i) => (
          <div key={i}>
            <h1>{clip.clipName}</h1>
            
            <AudioContainer audioSource={clip.audioURL} clipDurationTime = {clip.clipDurationTime}></AudioContainer>
            <button onClick={() => sendVoice(clip.blob)}>파일 전송</button>
          </div>
        ))}

         
      </section>
    </div>
  );
}

export default PerfectScore;