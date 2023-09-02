import { Cookies } from "react-cookie";


const cookies = new Cookies();

export const setCookies = (name : string , value : string) => {
    return cookies.set(name,value);
}

export const getCookies = (name : string) => {
    return cookies.get(name);
}

export const removeCookie = (name : string) => {
    cookies.remove(name);
  };