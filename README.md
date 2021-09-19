# COVID-19 Tracker & Interactive Charts



## Environment

`plotly-latest.min.js`    *https://plotly.com/javascript/*

`d3.min.js == 3.5.17`      *https://d3js.org*

#### Data Source

**[The COVID Tracking Project](https://covidtracking.com/data/)**
https://covidtracking.com/data/download/all-states-history.csv



## Design

This page shows an visualization way of tracking the COVID causality of **all states** in U.S.

The layout of the page can be seperated to three independent sections:

- **Hearder**
- **Map Animation**
- **Plot Animation**

The header is composed with a cover image and transparent colors. The theme colors chosen are darkslategrey and darkred. This will make the charts and fonts looks sharp and clear, and the chosen colors fit the theme well. 
The data obtained from the data source can be considered as a table composed with multiple time sequences. Thus, the map animation was designed to illustrate the number of deaths caused by COVID-19 growth within the time range, and through choropleth mapping, intuitively shows the severities of the pandemic across all states  in each specific date.
As a complement, a plot animation was designed to illustrate the number of deaths caused by COVID-19 growth in each state varying with the time.



## Challenges

1. Time sequences manipulation: since the original data is incomplete, many deaths number records were left with blanks, which will cause the discontinuity. Therefore, I used the recorded data and the increase of deaths to recalculate a version having all casualty data in all dates.
2. Optimizing the data structures passed to the frames for the animation. In this case, the purpose is to make an animation instead of generating a static chart. So I must pre-calculate all data frames and then render them in the right order.
3. Adjusting the layout for better viewing experience, the colors and fonts must refer to the theme colors chosen before.
4. Adding a choosing dropdown list to listen which state is chosen and pass the value to functions.
