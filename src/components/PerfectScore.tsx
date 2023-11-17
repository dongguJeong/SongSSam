import React, { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import {  useSelector } from 'react-redux';
import styled from 'styled-components';
import '../styles/global.css';
import AudioContainer from './AudioContainer';
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
 margin-left : 20px;
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

const Warning = styled.div`
 margin-bottom : 10px;
 font-size : 25px;
 text-align : center;
 color : red;
 
`

function PerfectScore({songId , instUrl} : {songId : string | undefined , instUrl : string | undefined}) {
  const [recording, setRecording] = useState(false);
  const [clips, setClips] = useState<ISaveVoice[]>([]);
  const [count, setCount] = useState(1);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [voiceOctave , setVoiceOctave] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState<number >(0);
  const [recordingEndTime, setRecordingEndTime] = useState<number>(0);
  const [audioElement , setAudioElement] = useState(new Audio());

  const constraint = { audio: true };

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
  const canvasWidthRatio = 0.65;

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
        프레임마다실행할거();
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
    function 프레임마다실행할거(){

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
    if(instUrl !== null && audioElement.paused){
        audioElement.play();
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
      if(instUrl !== null && audioElement.played.length > 0){
        audioElement.pause();
      }
      
    }
  };

  const saveClip = () => {
    const clipName = `${count}번 클립`;
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

  useEffect (() => {
    const downloadInstFile = async () => {
        try {
          if(instUrl !== 'null'){
            const response = await fetch(`https://songssam.site:8443/song/download_inst?url=inst/${instUrl}`); 
            const blob = await response.blob();
            const audioURL = URL.createObjectURL(blob);
            setAudioElement(new Audio(audioURL));
          }
          
        } catch (error) {
          console.error('파일 다운로드 중 오류 발생:', error);
        }
      };

       downloadInstFile();

  },[instUrl]);
  
  const handleReset = () => {
    if(audioElement){
      audioElement.currentTime = 0
    }
  };

  const handleDelete = (clipName : string) => {
    const temp = clips.filter(clip => clip.clipName !== clipName);
    setClips((cur) => cur = temp );
  }

  return (
    <div>
      <Warning >❗️반드시 이어폰을 착용 후 사용해주십쇼 ❗️</Warning>
      <Warning>음표 출력이 비정상적으로 빨라지나면 새로고침을 누르세요</Warning>

      <h1 style={{marginBottom : '10px'}}>음계 :  {voiceOctave} </h1>

      <canvas height={canvasHeight} width={canvasWidth} ref={canvasRef}></canvas>

      <RecordBtnContainer>
        
        <RecordStartBtn onClick={handleStartRecording} disabled={recording}>
          <span>녹음시작</span>
        </RecordStartBtn>
        <RecordStopBtn onClick={handleStopRecording} disabled={!recording}>
          <span>녹음종료</span>
        </RecordStopBtn>
        <ResetBtn>
          <svg width="30px" height="30px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" onClick={handleReset}>
            <g fill="none" 
                fill-rule="evenodd" 
                stroke='#FFFFFF' 
                stroke-linecap="round"
                strokeWidth='1.5'
                stroke-linejoin="round" 
                transform="matrix(0 1 1 0 2.5 2.5)">
            <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
            <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
            </g>
          </svg>
        </ResetBtn>
        <RecordingContainer>
          {recording ? <span>녹음 중</span> : <div></div>}
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
            <SendBtn onClick={() => sendVoice(clip.blob)}>파일<br/>전송</SendBtn>
            <DeleteBtn onClick={() => {handleDelete(clip.clipName)}}> 삭제 </DeleteBtn>
          </Flex>
        ))}
      </section>
    </div>
  );
}

export default PerfectScore;