export interface INote{
    startX : number,
    endX : number,
    startY : number,
    endY : number,
  }
  
export interface ISaveVoice{
    clipName : string,
    audioURL : string,
    blob : Blob,
    clipDurationTime : number ,  
}

export interface IData{
    id : number,
    title : string,
    imgUrl : string ,
    artist : string,
    genre : string,
    vocalUrl : null | string,
    originUrl : null | string,
    instUrl : null | string,
  }
  
export interface IChart {
    smallTitle : string;
    btnTitle : string;
    data : IData[];
}

export interface IProfile {
    id: number;
    email: string;
    nickname: string;
    profileUrl: string;
    role: string;
  }
  
export interface IVocal {
    id: null;
    originUrl: string;
    spectr: [];
    createdAt: string;
    user: null;
    songId : number;
  }
  
export interface IMp3{
    mp3 : Blob,
    duration : number,
    songId : number,
  }

export interface IAI{
  id : number;
  name : string;
}


export interface IAI_Cover{
  id : number,
  generatedUrl : string,
  song : IData,
  ptrData : IAI,
}