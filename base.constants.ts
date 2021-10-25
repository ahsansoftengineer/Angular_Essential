export const specialChars: RegExp = /[!~`@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
// export const Alpha: RegExp = /([a-zA-Z _-]+)$/;
export const Alpha: RegExp = /^[a-zA-Z -]*$/;
export const AlphaNum: RegExp = /([a-zA-Z0-9 _-]+)$/;
export const Num: RegExp = /([0-9]+)$/;
export const Email: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const Password: RegExp =
  /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
