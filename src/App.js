
import styled from '@emotion/styled';
//import {ThemeProvider} from 'emotion-theming'; //此方法已經不管用 要用下面這個方式
import { useTheme, ThemeProvider, withTheme } from '@emotion/react'
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import {ReactComponent as LoadingIcon} from './images/loading.svg';

const AUTHORIZATION_KEY = 'CWB-7C930803-B46B-44AF-9B38-E15F3AE0F7EF';
const LOCATION_NAME = '臺北';
const LOCATION_NAME_FORECAST = '臺北市';

const fetchCurrentWeather = () => {
    
 return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
  ).then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item) => {
        if (['WDSD', 'TEMP'].includes(item.elementName)){
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      },{}
    );
    return {
      observationTime: locationData.time.obsTime,
      locationName: locationData.locationName,
      temperature: weatherElements.TEMP,
      windSpeed: weatherElements.WDSD,
      isLoading: false,
    };
});
} //fetchCurrentWeather

const fetchWeatherForecast = () => {
return fetch(
  `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
).then((response) => response.json())
.then((data) => {
  const locationData = data.records.location[0];

  const weatherElements = locationData.weatherElement.reduce(
    (neededElements, item) => {
      if (['Wx', 'PoP', 'CI'].includes(item.elementName)){
        neededElements[item.elementName] = item.time[0].parameter;
      }
      return neededElements;
    },
    {}
  )
  return {
    description: weatherElements.Wx.parameterName,
    weatherCode: weatherElements.Wx.parameterValue,
    rainPossibility: weatherElements.PoP.parameterName,
    comfortability: weatherElements.CI.parameterName,
  };
}); //fetch.then
};//fetchWeatherForecast

const App = () => {

  const [currentTheme, setCurrentTheme] = useState('light');

  const [weatherElement, setWeatherElement] = useState({
    locationName: '', 
    description: '', 
    windSpeed: 0, 
    temperature: 0, 
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
  });

  //解構賦值 要使用的資料就不用寫currentWeather.xxx
  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability,
  } = weatherElement;
  
  //畫面render完就執行
  useEffect(() => {
    const fetchData = async () => {
      
      //拉取資料前先將isLoading變成true  
      setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));

        // 拉取資料的awai function
        const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather(), fetchWeatherForecast()
        ]);

        //把取得的物件用解構賦值放入
        setWeatherElement({
          ...currentWeather,
          ...weatherForecast,
          isLoading: false,
        })
    };
    fetchData();
  }, []) //空陣列是觀察的變數，沒變動就不會重新執行，防止無限迴圈

  
  
  //用來傳入到下面ThemeProvider的元件（標籤）以此所有包含在內的元件都會套用樣式
  const theme = {
    light: {
      backgroundColor: '#ededed',
      foregroundColor: '#f9f9f9',
      boxShadow: '0 1px 3px 0 #999999',
      titleColor: '#212121',
      temperatureColor: '#757575',
      textColor: '#828282',
    },
    dark: {
      backgroundColor: '#1F2022',
      foregroundColor: '#121416',
      boxShadow:
        '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
      titleColor: '#f9f9fa',
      temperatureColor: '#dddddd',
      textColor: '#cccccc',
    },
  };


  /*-- 將原本載入的元件用emotion的方式修改樣式 --*/
  const DayCloudy = styled(DayCloudyIcon)`
    flex-basis: 30%;
  `;

   /*-- emotion的CSS in JS方式帶入樣式 --*/
   /*-- props傳入做動態判定 --*/
  const Location = styled.div`
    ${props => console.log(props)}
    font-size: 28px;
    color: ${({theme}) => theme.titleColor};
    margin-bottom: 20px;
  `;

  const Container = styled.div`
    background-color: ${({theme}) => theme.backgroundColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center
     `;

  const WeatherCard = styled.div`
    position: relative;
    min-width: 360px;
    box-shadow: ${({theme}) => theme.boxShadow};
    background-color: ${({theme}) => theme.foregroundColor};
    box-sizing: border-box;
    padding: 30px 15px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({theme}) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  svg {
    width: 25px;
    height: auto;
    margin-right: 10px;
  }
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
  margin-bottom: 20px;
`;

const Rain = styled.div`
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({theme}) => theme.textColor};
`;

const Refresh = styled.div`
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({isLoading}) => (isLoading ? '1.5s' : '0s')}
  }
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({theme}) => theme.textColor};
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
  return (
    <ThemeProvider theme={theme[currentTheme]}>
    <Container>
      {console.log('render, isLoading:', isLoading)}
      <WeatherCard>
        <Location>{locationName}</Location>
        <Description>{description}{' '}{comfortability}</Description>
        <CurrentWeather>
          <Temperature>
          {Math.round(temperature)}<Celsius>ºC</Celsius>
          </Temperature>
          <DayCloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon/>{windSpeed} m/h
        </AirFlow>
        <Rain>
        <RainIcon /> {rainPossibility} </Rain>
        <Refresh 
        onClick={() => {
          fetchCurrentWeather();
          fetchWeatherForecast();
          console.log('123');
        }}
        isLoading={isLoading}
        > 
          最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))}
            {''}
           {isLoading ? <LoadingIcon/> : <RefreshIcon />}
        </Refresh>
      </WeatherCard>
    </Container>
    </ThemeProvider>
  );
};

export default App;
