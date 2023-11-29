import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import {  useSelector} from 'react-redux';
import styled, { keyframes } from 'styled-components';
import '../styles/global.css';
import AudioContainer from './AudioContainer';
import { RootState } from '../redux/store';
import { ISaveVoice,INote } from '../asset/Interface';
import { motion, useAnimate } from 'framer-motion';


const Wrapper = styled.div`
  margin-bottom  : 100px;
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
      ? 'none'
      : '2px 4px 6px -1px rgba(0,142,245,1)'};

  &:hover {
    background-color: ${(props) => (props.disabled ? 'rgba(0,0,0,0.5)' : 'rgba(0,142,245,0.8)')};
  }
`

const RecordBtnContainer = styled.div`
  margin-bottom : 30px;
  margin-top : 10px;
  display : flex;

`
const RecordStopBtn = styled(RecordStartBtn)``;

const RecordingContainer = styled.div`
  
  display : flex;
  align-items : center;
  justify-content : center;
  width : 50px;
  height : 50px;
  color : red;
  font-weight : 500;
  animation : blink 1s ease-in infinite;
  padding-top  :13px;
  margin-left : 20px;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;


const ClipInnerContainer = styled.div`
  display : flex;
`

const SendBtn = styled.div`

 width : 40px;
 height : 40px;
 border-radius : 50%;
 border : 2px solid black;
 display : flex;
 justify-content: center;
 align-items : center;
 font-size : 10px;
 cursor : pointer;
 transition : all .1s;
 margin-left : 10px;
 margin-top : 20px;

 &:hover{
  background : black;
  color : white;
 }
`


const ClipTitle = styled.div`
  font-size : 14px;
  
  margin-top   : 10px;
  font-weight : 500;
  padding-left : 10px;
  
`

const ClipContainer = styled.div`
  border  : 2px solid black;
  background : white;
  width : 480px;
  border-radius : 10px;
  margin-bottom : 10px;
`

const Flex = styled.div`
 display : flex;
`

const ResetBtn = styled(RecordStartBtn)`
 width : 70px;
 height : 70px;
`


const DeleteBtn = styled(SendBtn)`
`

const InstContainer = styled.div`
 padding-left : 10px;
 padding-top : 5px;
  height : 70px;

`

const InstContainer__Title = styled.div`
 margin-right : 10px;
`

const NoInst = styled.div`
  margin-top : 20px;
`

const YesInst = styled.span`
`


const Warning__Container = styled.div`
 margin-left : 10px;
 cursor : pointer;

 &:hover > div {
  opacity: 1;
}
`

const PerfectTitle = styled.div`
 display : flex;
 position : relative;
`

const Warning__Message = styled.div`
opacity: 0;
transition: opacity 0.1s ease-in-out;
transition-delay: 0.5s;
padding : 3px 5px;
background-color : #E2E2E2;
border-radius : 5px;
position : absolute ;
left : -2px;
bottom : -15px;
font-size : 12px;
color : gray;
`

const Dotdotdot = styled(motion.div)`
`

const DotdotdotVar = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
  },
};


const blinkAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const BlinkDot = styled(motion.span)`
  animation: ${blinkAnimation} 1s infinite;
  margin: 0 4px;
  animation-iteration-count: infinite;

  &:nth-child(1) {
    animation-delay: 0.4s;
  }

  &:nth-child(2) {
    animation-delay: 0.8s;
  }

  &:nth-child(3) {
    animation-delay: 1.2s;
    animation-fill-mode: forwards;
  }
`;

function PerfectScore({songId} : {songId : string | undefined}) {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState<ISaveVoice[]>([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [voiceOctave , setVoiceOctave] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState<number >(0);
  const [recordingEndTime, setRecordingEndTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const constraint = { audio: true };
  const INST = useSelector((state : RootState) => state.instToken.inst);
  const audioSource = useSelector((state : RootState) => state.songToken.songURL);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraint)
      .then(onSuccess)
      .catch((error) => {
        console.error('마이크 권한을 허용하지 않았습니다', error);
      });
  }, []);

  const buffersize = 150;
  const voiceArray = useRef<INote[]>(new Array(buffersize));
  
  
  // Canvas 설정
  const canvasWidthRatio = 0.75;

  const calculateCanvasWidth = () => {
    const screenWidth = window.innerWidth;
    return Math.floor(screenWidth * canvasWidthRatio);
  };

  const [canvasWidth, setCanvasWidth] = useState(calculateCanvasWidth());
  const canvasHeight = 500;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {
    const handleResize = () => {
      const newCanvasWidth = calculateCanvasWidth();
      setCanvasWidth(newCanvasWidth);
      requestAnimationFrame(() => {
        draw();
      });
    };

    // 화면 크기 변경 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const canvasHalf = canvasWidth / 2;
  const redlineWidth = 3
  const barwidth = canvasHalf/buffersize;

  const lineNumber = 16+12;
  const lineHeight = canvasHeight / lineNumber; 

  let 기준음 = 48;
  let 최고음 = 기준음+12+12+12;
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

    const startX = canvasHalf-barwidth ;
    const endX = canvasHalf;


    //목소리 분석
    if (Math.round(clarity * 100) > 80) {
      
      //들어온 목소리에 대해서 미디 번호를 알아내고
      midi = freqToNote(Math.round(pitch * 10) / 10);
      setVoiceOctave((prev) => prev = midiToNote(midi));

      if( (midi <= 최고음) && (midi >= 최저음) ){
       const startY= 최고음시작점+Math.abs(최고음 - midi) * 0.5 * lineHeight;
       const endY = startY + lineHeight;
       voiceArray.current.push({startX : startX,endX : endX, startY: startY, endY :endY});
      }
    }

    requestAnimationFrame(() => updatePitch(analyserNode, detector, input, sampleRate));
  }

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

  //음성을 미디 번호로 변환
  const freqToNote = (freq : number) => {
    return Math.round(12 * (Math.log(freq / 440.0) / Math.log(2))) + 69;
  };

  function midiToNote(midiNumber : number) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor((midiNumber - 12) / 12); // 12 미디 번호마다 1 옥타브 증가
    const noteName = noteNames[midiNumber % 12];
    
    return `${noteName}${octave}`;
  }

  //마이크 음성 시각화 하는 로직
    function draw(){

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d');

    //오선지  그리기
    if(ctx && canvas){

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    canvas.style.border = '1px solid black';
    canvas.style.borderRadius = '10px';
    canvas.style.boxShadow = '0px 4px 6px -1px rgb(0,0,0,.3)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = 'black';

    for (let i = 1; i <= lineHeight+12; i++) {
      const y = i * lineHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      if(i=== 7 || i=== 13 || i==19 ){
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
        
        ctx.fillStyle = "blue";
        
      ctx.fillRect(voice.startX,voice.startY, barwidth,lineHeight);
  
      voice.startX -= barwidth;
      voice.endX -= barwidth;
    
      }
    }
    requestAnimationFrame(draw);
    }
  }

  useEffect(() => {  
    draw();
  },[canvasWidth]);


  //녹음 기능
  const handleStartRecording = () => {
    if(!accessToken){
      alert("로그인이 필요한 서비스입니다");
      return
    };

    if (mediaRecorderRef.current) {
    setChunks(() => []);
    mediaRecorderRef.current.start();
    setRecording(true);
    setRecordingStartTime(Date.now());
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    else{
      console.log("미디어 레코더 없음");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingEndTime(Date.now());
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const saveClip = () => {
    const clipName = `${count}번 녹음`;
    setCount((prev) => prev + 1);
    const blob = new Blob(chunks, { type: 'audio/mp3' });
    setChunks(() => []);
    const audioURL = window.URL.createObjectURL(blob);
    const clipDurationTime = (recordingEndTime - recordingStartTime) / 1000; // 밀리초를 초로 변환
    setClips((prev) => [...prev, { clipName, audioURL, blob , clipDurationTime}]);
  };

  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);

  const sendVoice = (음성파일 : Blob) => {

    const mp3File = new Blob([음성파일] , {'type' : 'audio/mpeg'});
    const voiceURL = `https://songssam.site:8443/member/upload?songId=${songId}`;
    const formData = new FormData();
    formData.append('file', mp3File, `${songId}.mp3`);

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
          alert("파일 전송을 성공했습니다");
        } else {
          alert("파일 전송을 실패했습니다");
        }
      })
      .catch((error) => {
        console.error('데이터 전송 오류:', error);
        // 오류 처리 로직을 추가하세요.
      });
  };

  useEffect(() => {
    if (chunks.length > 0 && !recording) {
      saveClip();
    }
  }, [chunks, recording]);

  
  
  const handleReset = () => {
    if(audioRef.current){
      audioRef.current.currentTime = 0
    }
  };

  const handleDelete = (clipName : string) => {
    const temp = clips.filter(clip => clip.clipName !== clipName);
    setClips((cur) => cur = temp );
  };

  return (
    <Wrapper>

      
        <PerfectTitle>
          <h1 style={{marginBottom : '10px' , width : '80px'}}>음계 :  {voiceOctave} </h1>
          <Warning__Container>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="1em"
              fill="orange" 
              viewBox="0 0 512 512">
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
            </svg>
            <Warning__Message>
              <span>음표가 갑자기 빨라진다면 새로고침을 해보십쇼</span>
            </Warning__Message>
          </Warning__Container>
        </PerfectTitle>
    
      <canvas height={canvasHeight} width={canvasWidth} ref={canvasRef}></canvas>

      <RecordBtnContainer>
        {
        INST ?
        <div style={{display : 'flex'}}>
          <RecordStartBtn onClick={handleStartRecording} disabled={recording}>
            <span>녹음시작</span>
          </RecordStartBtn>
          <RecordStopBtn onClick={handleStopRecording} disabled={!recording}>
            <span>녹음종료</span>
          </RecordStopBtn>
          <ResetBtn onClick={handleReset}>
                    <svg width="30px" height="30px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" >
                      <g fill="none" 
                          fillRule="evenodd" 
                          stroke='#FFFFFF' 
                          strokeLinecap="round"
                          strokeWidth='1.5'
                          strokeLinejoin="round" 
                          transform="matrix(0 1 1 0 2.5 2.5)">
                      <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
                      <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
                      </g>
                    </svg>
          </ResetBtn>

                    <InstContainer>
                      <InstContainer__Title>
                      { audioSource === null ?  <NoInst>노래에 대한 inst가 없습니다</NoInst> : <YesInst> Inst 듣기</YesInst>}
                      </InstContainer__Title>
                      {audioSource !== null && (
                      <div style={{height : '40px', marginTop : '10px'}}>
                        <audio ref={audioRef} src={audioSource} style={{height : '100%'}} controls></audio>
                      </div>)}
                    </InstContainer>
        </div>
        :
        <div>
          <div style={{display : 'flex'}}>
            <div>
            <span>노래를 다운 받는 중 입니다 잠시만 기다려주세요</span> </div>
              <Dotdotdot 
                variants={DotdotdotVar} 
                initial="start"
                animate = "end"
              >
              <BlinkDot>.</BlinkDot>
              <BlinkDot>.</BlinkDot>
              <BlinkDot>.</BlinkDot>
              </Dotdotdot>
              </div>
          
        </div>
        }
        

        <RecordingContainer>
          {recording ? <span>녹음 중</span> : null }
        </RecordingContainer>
      </RecordBtnContainer>
      <section>
        
        {clips.map((clip, i) => (
          <Flex key={i}>
            <ClipContainer >
              <ClipTitle >{clip.clipName}</ClipTitle>
              <ClipInnerContainer>
                <AudioContainer audioSource={clip.audioURL} clipDurationTime = {clip.clipDurationTime}></AudioContainer>
              </ClipInnerContainer> 
            </ClipContainer>
            {
              
            }
            <SendBtn onClick={() => sendVoice(clip.blob)}>파일<br/>전송</SendBtn>
            <DeleteBtn onClick={() => {handleDelete(clip.clipName)}}> 삭제 </DeleteBtn>
          </Flex>
        ))}
      </section>
    </Wrapper>
  );
}

export default PerfectScore;