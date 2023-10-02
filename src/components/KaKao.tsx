
export const REST_API_KEY = "f3474b073f9c02883e0b9ac53d7cbead";

// const REDIRECT_URI = "http://songssam.site:3000/login"
export const REDIRECT_URI = "http://localhost:3000/login"
export const REDIRECT_LOGOUT_URI = 'http://localhost:3000'

export const KAKAO_AUTH_URL =  `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login`;

