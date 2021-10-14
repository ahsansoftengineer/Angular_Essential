## Base Enums
#### Base Enums is for API Endpoints
> * This File Could be Distributed into Three Parts
> 1. BaseAPIComponent
> 2. BaseAPIDropDown
> 3. BaseAPIAutoComplete
> 4. BaseAPIDependent
##### AUTOCOMPLETE
```javascript
export enum APIs_AC{
  FRUIT='fruiturl',
  VEGITABLE='vegitable'
}
```
##### DROPDOWN
```javascript
export enum APIs_DD{
  FRUIT='fruiturl',
  VEGITABLE='vegitable'
  DRYFRUIT='dryfruit'
}
```
##### DROPDOWN DEPENDENT
```javascript
export enum APIs_D{
  COUNTRY='countryurl',
  STATE='stateurl',
  CITY='cityurl',
  TOWN="town",
}
```
##### COMPONENTS
```javascript
export enum APIs_D{
  ADMIN='admin',
  VENDOR='vendor',
  USER="user",
  PRODUCT='product',
}
```