import React, { useState,useRef, useEffect } from "react";
import styled from "styled-components";
import '../styles/global.css';

const AudioPlayer = styled.div`
    display : flex;
    width : 600px;
    background : white;
    --primary : #50bcdf;
    border-radius : 50px;
    border : 1px solid blue;
    align-items : center;

`

const ForwardBackWard = styled.div`
    display : flex;
    background : transparent;
    border : none;
    flex-direction : column;
    justify-content : center;
    padding : 10px 10px;
    cursor : pointer;

    &:hover{
        color : var(--primary);
    }
    &:hover svg{
        fill : var(--primary);
    }
`

const PlayPause = styled.div`
    display : flex;
    cursor : pointer;
    background : transparent;
    border : none;
    flex-direction : column;
    justify-content : center;
    padding : 10px 10px;

    svg{
        width : 20px;
        height : 20px;
    }

    &:hover{
        color : var(--primary);
    }
    &:hover svg{
        fill : var(--primary);
    }
`

const ProgressBar = styled.input`
    --bar-bg : #A3A096;
    --seek-before-width : 0;
    --seek-before-color : #3F7AB5;
    --knobby : #3452a5;
    --selectedKnobby : #26c9c3;
    appearance : none;

    background : var(--bar-bg);
    border-radius : 10px;
    position : relative;
    width : 100%;
    height : 5px;
    outline : none;


    &::-moz-range-track{
        background : var(--bar-bg);
        border-radius : 10px;
        position : relative;
        width : 100%;
        height : 5px;
        outline : none;
    }

    &::before{
        content : '';
        height : 5px;
        width : var(--seek-before-width);
        background-color : var(--seek-before-color);
        border-top-left-radius : 10px;
        border-bottom-left-radius : 10px;
        position : absolute;
        top : 0;
        left : 0;
        cursor : pointer;
        z-index : 2;
    }

    &::-webkit-slider-thumb{
        -webkit-appearance : none;
        height : 15px;
        width : 15px;
        border-radius : 50%;
        cursor : pointer;
        background-color : var(--knobby);
        box-sizing : border-box;
        position : relative;
        z-index : 3;
        border : none;
    }

    &:active::-webkit-slider-thumb{
        transform : scale (1.2);
        background : var(--selectedKnobby);
    }


    &::-moz-focus-outer{
        border : 0;
    }

    &::-moz-range-progress{
        background-color : var(--seek-before-color);
        border-top-left-radius : 10px;
        border-bottom-left-radius : 10px; 
        height : 5px;  
    }

    &::-moz-range-thumb{
        -webkit-appearance : none;
        height : 15px;
        width : 15px;
        border-radius : 50%;
        cursor : pointer;
        background-color : var(--knobby);
        box-sizing : border-box;
        position : relative;
        z-index : 3;
        border : transparent;
        
    }

    &:active::-moz-range-thumb{
        transform : scale(1.2);
        background : var(--selectedKnobby);
    }
`

const VolumeBar = styled.input`
    --bar-bg : #A3A096;
    --seek-before-width : 100%;
    --seek-before-color : #3F7AB5;
    --knobby : #3452a5;
    --selectedKnobby : #26c9c3;
    appearance : none;

    background : var(--bar-bg);
    border-radius : 10px;
    position : relative;
    width : 10%;
    height : 5px;
    outline : none;


    &::-moz-range-track{
        background : var(--bar-bg);
        border-radius : 10px;
        position : relative;
        width : 100%;
        height : 5px;
        outline : none;
    }

    &::before{
        content : '';
        height : 5px;
        width : var(--seek-before-width);
        background-color : var(--seek-before-color);
        border-top-left-radius : 10px;
        border-bottom-left-radius : 10px;
        position : absolute;
        top : 0;
        left : 0;
        cursor : pointer;
        z-index : 2;
    }

    &::-webkit-slider-thumb{
        -webkit-appearance : none;
        height : 15px;
        width : 15px;
        border-radius : 50%;
        cursor : pointer;
        background-color : var(--knobby);
        box-sizing : border-box;
        position : relative;
        z-index : 3;
        border : none;
    }

    &:active::-webkit-slider-thumb{
        transform : scale (1.2);
        background : var(--selectedKnobby);
    }


    &::-moz-focus-outer{
        border : 0;
    }

    &::-moz-range-progress{
        background-color : var(--seek-before-color);
        border-top-left-radius : 10px;
        border-bottom-left-radius : 10px; 
        height : 5px;  
    }

    &::-moz-range-thumb{
        -webkit-appearance : none;
        height : 15px;
        width : 15px;
        border-radius : 50%;
        cursor : pointer;
        background-color : var(--knobby);
        box-sizing : border-box;
        position : relative;
        z-index : 3;
        border : transparent;
        
    }

    &:active::-moz-range-thumb{
        transform : scale(1.2);
        background : var(--selectedKnobby);
    }
`


const CurrentTime = styled.div`
    width : 70px;
    height : 20px;
    text-align : center;
    padding-top : 6px;
    
`
const DurationTime = styled.div`
    text-align : center;
    width : 70px;
    height : 20px;
    padding-top : 6px;

    
`

const MuteBtn = styled.div`

    cursor : pointer;
    margin-right : 10px;

    
    transition : all .1s;
    svg:hover{
        transform : scale(1.2);
    }

    svg{
        width : 20px;
        height : 20px;
    }
`




const AudioContainer = ({audioSource} : {audioSource : string}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration,setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [soundZero, setSoundZero] = useState(false);

    const volumeBarRef = useRef<HTMLInputElement | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement  | null>(null);
    const progressBarRef = useRef<HTMLInputElement | null>(null);
    let animationRef : any = null; 
    


    // 해당 오디오의 총 녹음된 음성의 재생 시간 표시
    useEffect(() => {
        const progressBar = progressBarRef.current;
        const audioPlayer =audioPlayerRef.current;
        if(audioPlayer && progressBar) {
            const seconds = Math.floor(audioPlayer.duration);
            setDuration(seconds);
            progressBar.max = seconds.toString();
        }
    },[audioPlayerRef?.current?.onloadedmetadata , audioPlayerRef?.current?.readyState])

    //시간을 00:00초로 표시
    const calculateTime = (secs : number) => {
        const minutes = Math.floor(secs/ 60) ;
        const returnedMinute = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs% 60) ;
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;  
        return `${returnedMinute}:${returnedSeconds}`;
    }


    const togglePlayPause = () => {
        const prevValue = isPlaying;
        const audioPlayer = audioPlayerRef.current;
        setIsPlaying(!prevValue);
        
        
        if (audioPlayer ) {
            if (!prevValue) {
                audioPlayer.play();
                requestAnimationFrame(whilePlaying);
                    
                    
            }
             else {
                audioPlayer.pause();
                cancelAnimationFrame(animationRef);
            }
        }
    }
    




    const changeRange = () => {
        const progressBar = progressBarRef.current;
        const audioPlayer = audioPlayerRef.current;

        if(progressBar && audioPlayer) {
            audioPlayer.currentTime = parseFloat(progressBar.value);
            progressBar.style.setProperty('--seek-before-width',`${parseFloat(progressBar.value)/duration * 100}%`);
            setCurrentTime(parseFloat(progressBar.value)); 
        }
    }
  

    const onLoadedMetadata = () => {
        // 메타데이터 로드 시 호출될 함수
        const audioPlayer = audioPlayerRef.current;
        if (audioPlayer) {
            const seconds = Math.floor(audioPlayer.duration);
            setDuration(seconds);
            if (progressBarRef.current) {
                progressBarRef.current.max = seconds.toString();
            }
        }
    };

    const whilePlaying = () => {

        const audioPlayer = audioPlayerRef.current;
        const progressBar = progressBarRef.current;

        if(audioPlayer && progressBar){
           progressBar.value = audioPlayer.currentTime.toString();
           animationRef = requestAnimationFrame(whilePlaying); 
           progressBar.style.setProperty('--seek-before-width',`${parseFloat(progressBar.value)/duration * 100}%`);
           setCurrentTime(parseFloat(progressBar.value)); 
           
        }
      }

      const changeVolume = () => {
        const volumeBar = volumeBarRef.current;
        const audioPlayer = audioPlayerRef.current;


        if(volumeBar && audioPlayer) {
            const volumeValue = parseFloat(volumeBar.value);
            volumeBar.style.setProperty('--seek-before-width',`${volumeValue}%`);
            audioPlayer.volume = volumeValue/100;
            
        }
      }

      const toggleMuteBtn= () => {

        const audio = audioPlayerRef.current;
        setSoundZero((cur) => !cur);

        if(audio)
        {
            if(soundZero ) {
            audio.muted = true;
            }
            else{
            audio.muted = false
            }
        }

      }

    return (
        <AudioPlayer>
            <audio ref={audioPlayerRef} 
                   preload="metadata"
                   onLoadedMetadata={onLoadedMetadata}
            >
            <source 
            src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"  
            type="audio/mpeg" />
            </audio>
            
            <ForwardBackWard>
            <svg height="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>
            30초 전
            </ForwardBackWard>
            <PlayPause onClick={togglePlayPause}>
                {
                    isPlaying ? <svg height="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg> 
                    : <svg height="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                }
               
            </PlayPause>
            <ForwardBackWard>

            <svg  height="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg>
            30초 후
            </ForwardBackWard>


            <CurrentTime>{calculateTime(currentTime)}</CurrentTime>
            <div>
                <ProgressBar 
                    ref = {progressBarRef}
                    type="range" 
                    defaultValue='0'
                    onChange={changeRange}
                    >
                </ProgressBar>
            </div>
            <DurationTime >{(duration && !isNaN(duration)) &&calculateTime(duration)}</DurationTime>
            <MuteBtn onClick={toggleMuteBtn}>
            {
                soundZero ?  
                
                <svg xmlns="http://www.w3.org/2000/svg" 
                    height="1rem"   
                    viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
                : 
                
                <svg xmlns="http://www.w3.org/2000/svg" 
                    height="1rem"
                    viewBox="0 0 448 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"/></svg>
            
            }
            </MuteBtn>
            
            <VolumeBar ref={volumeBarRef} type="range" max='100' defaultValue="100"  onChange={changeVolume}></VolumeBar>
       
       </AudioPlayer>
    );
}

export default AudioContainer;
