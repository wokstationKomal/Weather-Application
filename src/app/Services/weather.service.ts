import { Hourly } from './../Class/hourly';
import { TodayWeather } from './../Class/today-weather';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Forecast } from '../Class/forecast';

@Injectable()
export class WeatherService {

    todayWeather: TodayWeather;
    location;
    forecastDays: Forecast[] = [];
    hourlyData: Hourly[] = [];

    constructor(private http: HttpClient){}

    localWeather(){
        return new Promise((res, req) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.location = pos.coords;
                const lat = this.location.latitude;
                const lon = this.location.longitude;
                return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=85f1fe5bbc266e3d1380052a45c7ed51`)
                .subscribe((data) =>{
                        this.todayWeather = new TodayWeather(data.main.temp, data.weather[0].icon, '12', data.main.pressure, data.main.humidity, data.name, data.sys.sunrise, data.sys.sunset );
                res(this.todayWeather);
                })
            })
        })
    }
                    
    //sixdays forecatstof current city
    forecastCurrentCity(){
        return new Promise((res, req) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.location = pos.coords;
                console.log(this.location)
                const lat = this.location.latitude;
                const lon = this.location.longitude;
                return this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=85f1fe5bbc266e3d1380052a45c7ed51`)
                .subscribe((data) =>{
                    console.log("SIX: ", data);
                        for(let i=1; i<data.list.length; i+=8){
                            const temporary = new Forecast(data.list[i].dt_txt,
                                                              data.list[i].main.temp_min,
                                                              data.list[i].main.temp_max,
                                                              data.list[i].weather[0].icon,
                                                              data.list[i].weather[0].main);
                            this.forecastDays.push(temporary);                                
                          }
                        
                res(this.forecastDays);
                })
            })
        })
    }

   //SEARCH CITY CURRENT TEMP CARD
   searchCityWeather(city: string){
    return new Promise((res, req) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            this.location = pos.coords;
            const lat = this.location.latitude;
            const lon = this.location.longitude;
            return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=85f1fe5bbc266e3d1380052a45c7ed51`)
            .subscribe((data) =>{
                    this.todayWeather = new TodayWeather(data.main.temp, data.weather[0].icon, '12', data.main.pressure, data.main.humidity, data.name, data.sys.sunrise, data.sys.sunset );
            res(this.todayWeather);
            },  (err) => document.querySelector('.msg').textContent = "Please search for a valid city 😩")
        })
    })
}

    //SEARCH CITY SIX DAYS DATA
    sixDayForecast(city: string){
        this.forecastDays = [];
        return new Promise((res, req) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                return this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=85f1fe5bbc266e3d1380052a45c7ed51`)
                .subscribe((data) =>{
                        for(let i=1; i<data.list.length; i+=8){
                            const temporary = new Forecast(data.list[i].dt_txt,
                                                              data.list[i].main.temp_min,
                                                              data.list[i].main.temp_max,
                                                              data.list[i].weather[0].icon,
                                                              data.list[i].weather[0].main);
                            this.forecastDays.push(temporary);                                
                          }
                res(this.forecastDays);
                })
            })
        })
    }

    hourlyForecast(){
        return new Promise((res, req) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.location = pos.coords;
                const lat = this.location.latitude;
                const lon = this.location.longitude;
                return this.http.get<any>(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
                exclude={part}&appid=85f1fe5bbc266e3d1380052a45c7ed51`)
                .subscribe((data) =>{
                    console.log("Service hourly:", data);
                        for(let i=0; i<24; i++){
                            const temporary = new Hourly(data.hourly[i].weather[0].icon,
                                                              data.hourly[i].temp,
                                                              data.hourly[i].dt);
                            this.hourlyData.push(temporary);                                
                          }
                    res(this.hourlyData);
                })
            })
        })
    }


    searchCityHourly(city: string){
        return this.http.get(`https://api.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=85f1fe5bbc266e3d1380052a45c7ed51`);

    }
}

