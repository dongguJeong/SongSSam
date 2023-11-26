import { IData } from "./Interface";

export const MakeString = (song : IData) => {

    const {artist , title, id, imgUrl} = song;
    let originUrl = 'null';
    let instUrl   = 'null';

    if(song.originUrl !== null){
      originUrl = song.originUrl.split('/')[1];
    }

    if(song.instUrl !== null){
      instUrl = song.instUrl.split('/')[1];
    }

    return (`/detail/${artist}/${title}/${id}/${encodeURIComponent(imgUrl)}/${originUrl}/${instUrl}`);
  }