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

  hourlyTemp: number[] = [];
  hourlyTime: string[] = [];

  temporaryTemp: any;
  temporaryTime: any;

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

  //chart ends here

  //wethrIcon according to their iconRange
  weatherIcon = {
    "cloud": "cloud",
    "thunderstorm": "thunderstorm",
    "rain": "rain",
    "snow": "snow",
    "clear": "sun",
    "atmosphere": "smog",
    "drizzle": "drizzle"
  };

  icon: String = '';

  constructor(private ngxService: NgxUiLoaderService,
              private weatherService: WeatherService, 
              private rsolve: ResolveLocationService) { }

  ngOnInit() {
    //loader
    this.ngxService.start(); 
    setTimeout(() => {
      this.ngxService.stop(); }, 2000);

    this.weatherService.localWeather().then((data: TodayWeather) => {
      this.currentWeather = data;
      this.icon = this.get_weatherIcon(this.currentWeather.icon,this.currentWeather.iconRange);
    });
    
    //forecast 5 days
    this.weatherService.forecastCurrentCity().then((data: Forecast[]) => {
      this.cityForecast = data;
    })

    //hourly data show
    this.weatherService.hourlyForecast().then((data: Hourly[]) => {
      this.hourlyData = data;
      for(let i=0; i<=this.hourlyData.length; i++){
        const temp = this.hourlyData[i].temperature;
        const time = this.hourlyData[i].time;
        this.temporaryTemp = (parseInt(temp) - 273.15).toFixed(0);
        this.temporaryTime = new Date(parseInt(time)* 1000);

        this.hourlyTemp.push(this.temporaryTemp);
        this.hourlyTime.push(this.temporaryTime.getHours() + `:` + this.temporaryTime.getMinutes());
      }
    })
  }

  //setting up icns according to theird iconRange
  get_weatherIcon(icons, weatherRange){
    switch(true){
      case weatherRange >= 200 && weatherRange<=232:
      icons=this.weatherIcon.thunderstorm
      break;
      case weatherRange >= 300 && weatherRange<=321:
      icons=this.weatherIcon.drizzle
      break;
      case weatherRange >= 500 && weatherRange<=531:
      icons=this.weatherIcon.rain
      break;
      case weatherRange >= 600 && weatherRange<=622:
      icons=this.weatherIcon.snow
      break;
      case weatherRange >= 700 && weatherRange<=781:
      icons=this.weatherIcon.atmosphere
      break;
      case weatherRange == 800:
      icons=this.weatherIcon.clear
      break;
      default:
      icons=this.weatherIcon.cloud
    }
    return icons;
  }

  onSubmit(f) {
    this.ngxService.start(); 
    setTimeout(() => {
      this.ngxService.stop();
    }, 2000);

    //Search city weather card
      this.cityName = f.form.value.search;
      document.querySelector('.msg').textContent = "";
      this.weatherService.searchCityWeather(this.cityName)
      .then((data: TodayWeather) => {
        this.currentWeather = data;
        this.icon = this.get_weatherIcon(this.currentWeather.icon,this.currentWeather.iconRange);
      });

      //SEARCH CITY SIX DAYS forecast
      this.weatherService.sixDayForecast(this.cityName).then((data: Forecast[]) => {
        this.cityForecast = data;
      })
  }
}

