export const openMeteoApiSettings = {
    hourlyApiUrl: 'https://api.open-meteo.com/v1/forecast?latitude=43.62&longitude=1.41&hourly=temperature_2m,windspeed_10m,winddirection_10m,precipitation,weathercode&current_weather=true',
    dailyApiUrl: 'https://api.open-meteo.com/v1/forecast?latitude=43.62&longitude=1.41&daily=temperature_2m_min,temperature_2m_max,precipitation_hours,precipitation_sum,windspeed_10m_max,weathercode&timezone=Europe/Paris',
}

export const weatherCodeToSvg = {
    0: 'clear',
    1: 'clear_day',
    2: 'partly_cloudy_day',
    3: 'cloudy',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    56: 'freezing_rain_drizzle',
    57: 'freezing_rain_heavy',
    61: 'rain_light',
    63: 'rain',
    65: 'rain',
    66: 'freezing_rain_light',
    67: 'freezing_rain_heavy',
    71: 'snow_light',
    73: 'snow_heavy',
    77: 'ice_pellets',
    80: 'rain_heavy',
    81: 'rain_heavy',
    82: 'rain_heavy',
    85: 'snow_heavy',
    86: 'snow_heavy',
    95: 'tstorm',
    96: 'tstorm'

}

export function getDayOfWeek(date) {

    var days = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];

    var day = date.getDay();
    return days[day];
}

export function getMonth(index) {

    var months = [
        "Janvier",
        "Février",
        "March",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];
    return months[index];
}