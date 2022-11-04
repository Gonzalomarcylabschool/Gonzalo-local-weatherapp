debugger;
let units = 'imperial';//initailize the unit of measurement for open weather map API
let uOfm = 'F'; //set the unit of measurment for the page 
let temp;
let newTemp;
const status = document.querySelector('.status');
const iconElement = document.querySelector('.weather-icon');
const degree = document.querySelector('.degree');
const fanCel = document.querySelector('.fanCel');
const cond = document.querySelector('.condition');

function getWeatherAndLocation(unit, fandc){
  const success = (position)=>{//retruns the users location and fetch the data from the location and weather API
    units = unit;
    console.log(position)
    const latitude = position.coords.latitude;// constant for the latitude  coordinates 
    const longitude = position.coords.longitude;//constant for the longitude coordinates 
    console.log('long:'+longitude+' lat:'+ latitude); // check the console to make sure it worked
    const weatherAPIurl=['https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&units='+units+'&appid=b989a956b784b1493fe08339165f3739','https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&units='+units+'&appid=b989a956b784b1493fe08339165f3739' ]
    //get the users locations and sets it on the page
    fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}X&localityLanguage=en')
    .then(res=> res.json())
    .then(data=> {
      console.log(data)
        status.textContent = data.locality+", "+data.principalSubdivision  
    })
    //get the weather using user's location and sets it on the page
    getWeatherData(weatherAPIurl[0], fandc)
    getWeatherData(weatherAPIurl[1], fandc)
  }
  const error = () =>{// returns only if the user does not allow location service. 
    status.textContent = "unable to fulfill request";
  }
  navigator.geolocation.getCurrentPosition(success, error);//gets the user long and lat if successful or let the user know that it can if error
}
function findZip(){
  var x = document.getElementById("frm1");
  var zip = "";
  var i;
  for (i = 0; i < x.length ;i++) {
    zip += x.elements[i].value;
    console.log(x);
  }
  getWeatherData('https://api.openweathermap.org/data/2.5/weather?zip='+zip+',us&units=imperial&appid=b989a956b784b1493fe08339165f3739', 'F')
  status.textContent ="Weather in " +zip
}
function getWeatherData(weatherURL, fandc){
 fetch(weatherURL)
    .then(res=> res.json())
    .then(data=> {
      console.log(data)
        temp = Math.trunc(data.main.temp)
        degree.textContent = temp +'°'
        fanCel.textContent=fandc
        iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>`
        cond.textContent=data.weather[0].main
        console.log(temp)
    })
}
function changeUnits(degrees, unitChange ){
  units = unitChange
  if (units == 'metric'){
    newTemp = ((degrees-32)*5)/9;
    console.log(newTemp);
    degree.textContent = Math.trunc(newTemp) +'°';
    fanCel.textContent='C';
  } 
  else{
    degree.textContent = Math.trunc(degrees) +'°';
    fanCel.textContent='F';
  }
}
//event listener that runs the function when the page loads.
document.querySelector('.weather-icon').addEventListener('click', getWeatherAndLocation(units, uOfm));
//set the unit of mesurment to metric
document.querySelector('.toCel').onclick = function(){ changeUnits(temp, 'metric');
}//set the unit of measurment to imperial (the dark side)
document.querySelector('.toFar').onclick = function(){ changeUnits(temp,'imperial');
}
document.querySelector('.zipBut').onclick = function(){ findZip();
}