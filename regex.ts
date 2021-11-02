export abstract class RegExps {
  static SPECIALCHARS: RegExp = /[!~`@$%^&*()+\=\[\]{};':"\\|<>\/?]/;
  // alpha: RegExp = /([a-zA-Z _-]+)$/;
  static ALPHA: RegExp = /^[a-zA-Z -]*$/;
  static ALPHANUM: RegExp = /([a-zA-Z0-9 _-]+)$/;
  static NUM: RegExp = /([0-9]+)$/;
  static POSITIVENUM : RegExp = /^(?:[+\d].*\d|\d)$/;
  static EMAIL: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static PASSWORD: RegExp =
  /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
}