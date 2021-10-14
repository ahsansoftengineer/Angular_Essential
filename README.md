## Base Constant
> * This Validator Constant are being Utilized inside BaseValidator Class
#### Special Character Regular Expression
```javascript
export const specialChars: RegExp = /[!~`@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
```
#### Only Alphabets Allow Regular Expression
```javascript
export const Alpha: RegExp = /^[a-zA-Z -]*$/;
```
#### Only Numeric Allow Regular Expression
```javascript
export const Num: RegExp = /([0-9]+)$/;
```
#### Only Alphabets & Numerics Allow Regular Expression
```javascript
export const AlphaNum: RegExp = /([a-zA-Z0-9 _-]+)$/;
```
#### Email Address Regular Expression
```javascript
export const Email: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
```
#### Password Regular Expression
```javascript
export const Password: RegExp =
  /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
```