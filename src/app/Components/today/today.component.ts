import { WeatherService } from './../../Services/weather.service';
import { Hourly } from './../../Class/hourly';
import { Forecast } from './../../Class/forecast';
import { Component, OnInit } from '@angular/core';
import { TodayWeather } from 'src/app/Class/today-weather';
import { ResolveLocationService } from 'src/app/Services/resolve-location.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {

  currentWeather: TodayWeather;  
  location;
  cityName: string = '';
  cityForecast: Forecast[] = [];
  hourlyData: Hourly[] = [];

  hourlyTemp: [] = [];
  hourlyTime: [] = [];

  //chart starts
  lineChartData: ChartDataSets[] = [
    { data: this.hourlyTemp, label: `Temperature` },
  ];

  lineChartLabels: Label[] = this.hourlyTime;

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'lightblue',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(240, 176, 18, 0.7)',
      pointBorderWidth: 1,
      pointHitRadius: 5
    },
  ];


  lineChartType = 'line';

  //chart end s

  constructor(private ngxService: NgxUiLoaderService,private weatherService: WeatherService, private rsolve: ResolveLocationService) { }

  ngOnInit() {
    //loader
    this.ngxService.start(); 
    setTimeout(() => {
      this.ngxService.stop(); }, 2000);

    this.weatherService.localWeather().then((data: TodayWeather) => {
      this.currentWeather = data;
    });

    //forecast 5 days
    this.weatherService.forecastCurrentCity().then((data: Forecast[]) => {
      this.cityForecast = data;
      // console.log("Forecast city:", data);
    })

    //hourly data show
    this.weatherService.hourlyForecast().then((data: Hourly[]) => {
      this.hourlyData = data;
      console.log("Hourly data:", this.hourlyData);
      for(let i=0; i<=this.hourlyData.length; i++){
        const temporaryTemp = Math.abs(this.hourlyData[i].temperature - 273.15);
        const temporaryTime = new Date(this.hourlyData[i].time * 1000);

        this.hourlyTemp.push(temporaryTemp);
        this.hourlyTime.push(temporaryTime.getHours() + `:` + temporaryTime.getMinutes());

        // console.log("Houlry Temp Show: Array", this.hourlyTime);
      }
    })

    // console.log("Houlry Temp Show: Array", this.hourlyTemp);
  }

  onSubmit(f) {
    this.ngxService.start(); 
    setTimeout(() => {
      this.ngxService.stop();
    }, 2000);

    //current city weather card
    this.cityName = f.form.value.search;
    this.weatherService.searchCityWeather(this.cityName).subscribe((data: TodayWeather) =>{
      
      this.currentWeather = new TodayWeather(data.main.temp, 
                                              data.weather[0].icon, 
                                              '12', 
                                              data.main.pressure, 
                                              data.main.humidity, 
                                              data.name, 
                                              data.sys.sunrise, 
                                              data.sys.sunset );
    });

    //forecast list
    this.weatherService.sixDayForecast(this.cityName).subscribe((data: Forecast[]) =>{
      console.log("Forecats City search: ",data);
      for(let i=0; i<data.list.length; i+=8){
        const temporary = new Forecast(data.list[i].dt_txt,
                                          data.list[i].main.temp_min,
                                          data.list[i].main.temp_max,
                                          data.list[i].weather[0].icon,
                                          data.list[i].weather[0].main);
        this.cityForecast.push(temporary);                                
      }
    })


    // this.weatherService.searchCityHourly(this.cityName).subscribe((data: Hourly[]) =>{
    //   console.log("Search city Hourly::",  data)
    // })

  }

}

