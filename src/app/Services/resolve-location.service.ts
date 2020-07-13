import { WeatherService } from './weather.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResolveLocationService implements Resolve<any> {

  constructor(private weatherService: WeatherService) { }

  resolve(){
    // this.weatherService.localWeather();
  }
}
