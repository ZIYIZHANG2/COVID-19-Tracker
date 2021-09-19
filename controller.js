
d3.csv("https://raw.githubusercontent.com/ZIYIZHANG2/AA/dev/all-states-history-1.csv", function(err, rows){

    function dateChange(num = 1, date = false) {
        if (!date) {
            date = new Date();
            date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }
        date = date.replace(/-/g, '/');
        date += " 00:00:00";
        date = Date.parse(new Date(date))/1000;
        date += (86400) * num;
        const newDate = new Date(parseInt(date) * 1000);
        return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
    }

    function filter_and_unpack(rows, key, date) {
        return rows.filter(row => row['date'] === date).map(row => row[key])
    }

    let date_list = rows.filter(row => row['state'] === 'AL').map(row => row['date']).reverse();
    const offset = 48; // Start date differs from 2020-01-13
    date_list = date_list.slice(offset, date_list.length)
    const slider_steps = [];
    const n = date_list.length - 1;
    let frames = [];

    for (let i = 0; i <= n; i++) {
        const z = filter_and_unpack(rows, 'death', date_list[i]);
        const locations = filter_and_unpack(rows, 'state', date_list[i]);
        frames[i] = {data: [{z: z, locations: locations, text: locations}], name: date_list[i]};
        slider_steps.push ({
            label: date_list[i],
            method: "animate",
            args: [[date_list[i]], {
                mode: "immediate",
                transition: {duration: 300},
                frame: {duration: 300}
            }
            ]
        });
    }

    const data = [{
        // Use the plotly us-states map
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        // text: frames[0].data[0].locations,
        text: null,
        zauto: false,
        zmin: 0,
        zmax: 5000
        /*
        // Use the mapbox us-states map
        type: "choroplethmapbox",
        geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json",
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        */
    }];

    const layout = {
        title: 'US Covid Deaths Toll<br>2020.03 - 2021.03',
        height: 800,
        paper_bgcolor: '#2F4F4F',
        font: {color: '#ddd'},
        geo: {
            scope: 'usa',
            countrycolor: 'rgb(255, 255, 255)',
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
            lonaxis: {},
            lataxis: {}
        },
        /*
        mapbox: {style: 'dark', center: {lon: -100, lat: 40}, zoom: 2.5},
         */
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                }],
                label: "Play",
            }, {
                method: "animate",
                args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                            duration: 0
                        },
                        frame: {
                            duration: 0
                        }
                    }
                ],
                label: "Pause"
            }]
        }],
        sliders: [{
            active: 0,
            steps: slider_steps,
            tickcolor: "#aaa",
            x: 0.12,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: "Date:",
                xanchor: "right",
                font: {
                    size: 20,
                    color: "#ddd"
                }
            },
            transition: {
                duration: 300,
                easing: "cubic-in-out"
            }
        }]
    };

    const config = {mapboxAccessToken: "pk.eyJ1Ijoieml5aXpoYW5nMiIsImEiOiJja3RqeXloamIwcXgxMnRtc2gzb3B4YjN5In0.MHafM3y2FWYphkZ7v2V42g"};

    Plotly.newPlot('Animation', data, layout, {displaylogo:false}, config).then(function() {
        Plotly.addFrames('Animation', frames);
    });
});

const short2full = {"PR":"Puerto Rico", "MP":"Northern Mariana Islands", "GU":"Guam", "AS":"American Samoa", "VI":"Virgin Islands", "DC":"District OF Columbia", "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"};
const full2short = {};
for (let k in short2full) {
    let value = short2full[k];
    full2short[value] = k;
}

d3.csv('https://raw.githubusercontent.com/ZIYIZHANG2/AA/dev/all-states-history-1.csv', function(err, rows){

    function filter_and_unpack(rows, key, state) {
        return rows.filter(row => row['state'] === state).map(row => row[key]);
    }

    let date_list = rows.filter(row => row['state'] === 'AL').map(row => row['date']).reverse();
    const states = rows.filter(row => row['date'] === '2021-03-07').map(row => row['state']);
    const states_full = states.map(state => short2full[state]);
    const state_data = {};
    const offset = 48;
    date_list = date_list.slice(offset, date_list.length);
    const n = date_list.length;
    let currentDeath = [],
        currentDate = [],
        frames = [];


    for (let i = 0; i < states.length; i++ ){
        let data = filter_and_unpack(rows, 'death', states[i]).reverse();
        data = data.slice(offset, data.length);
        state_data[states[i]] = data;
    }

    function getStateData(chosenState) {
        currentDeath = state_data[full2short[chosenState]];
        currentDate = date_list;
    }

// Default State Data
    setBubblePlot('Alaska');

    function setBubblePlot(chosenState) {
        getStateData(chosenState);

        /*
        const trace1 = {
            x: currentDate,
            y: currentDeath,
            mode: 'lines',
            marker: {
                size: 12,
                opacity: 0.5
            }
        };
        // For static charts
         */
        for (let i = 0; i < n; i++) {
            frames[i] = {data: [{x: [], y: []}]}
            frames[i].data[0].x = currentDate.slice(0, i+1);
            frames[i].data[0].y = currentDeath.slice(0, i+1);
        }
        // const data = [trace1]; // Static Chart

        const data = [{
            x: frames[1].data[0].x,
            y: frames[1].data[0].y,
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'lines',
            line: {color: '#8B0000'}
        }];

        const layout = {
            title: {text: 'US State Covid Deaths Trend<br>2020.03 - 2021.03', xref: 'paper', x: 0.5},
            height: 800,
            width: 1600,
            margin: {l: 150},
            paper_bgcolor: '#2F4F4F',
            plot_bgcolor: '#2F4F4F',
            font: {color: '#ddd'},
            xaxis: {
                range: [frames[n-1].data[0].x[0], frames[n-1].data[0].x[n-1]],
                // gridcolor: '#888',
                // linecolor: '#888',
                showgrid: false,
                showline: false,
                showticklabels: false,
                zeroline: false,
                type: 'date'
            },
            yaxis: {
                range: [0, frames[n-1].data[0].y[n-1]],
                // autorange: true,
                // gridcolor: '#888',
                // linecolor: '#888',
                showgrid: false,
                showline: false,
                showticklabels: false,
                zeroline: false
            },
            annotations: [{
                showarrow: false,
                text: chosenState,
                font: {
                    family: 'Gravitas One',
                    size: 48,
                    color: '#aaa'
                },
                xref: 'paper',
                yref: 'paper',
                x: 0.5,
                y: 0.5
            }],
        };


        Plotly.newPlot('plotdiv', data, layout, {displaylogo: false}).then(function () {
            Plotly.animate('plotdiv', frames, {
                transition: {
                    duration: 0
                },
                frame: {
                    duration: 20,
                    redraw: false
                }
            });
        });
    }

    const innerContainer = document.querySelector('[data-num="0"]'),
        plotEl = innerContainer.querySelector('.plot'),
        stateSelector = innerContainer.querySelector('.statedata');

    function assignOptions(textArray, selector) {
        for (let i = 0; i < textArray.length; i++) {
            const currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }

    assignOptions(states_full, stateSelector);

    function updateState(){
        setBubblePlot(stateSelector.value);
    }

    stateSelector.addEventListener('change', updateState, false);
});

