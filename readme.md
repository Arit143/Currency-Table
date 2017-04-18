Dev Challenge
===============================

## Authors
Aritra Ghosh

## Description
Simple React Component which renders a Currency table with Name, Best Ask, Best Bid, Last Change Ask, Last Change Bid, 
Open Ask, Open Bid, Spark Line as columns where values of the table changes every second.

Installation

```
rm -rf node_modules
npm install

```

Fire up with `npm start` and navigate to http://localhost:8011 to see the components in action.

### Development commands

- *npm start* - start a development session, watching files for changes running.
- *npm run test* - run tests
- *npm run doc* - generate docs

# Internal Architecture

- React Framework has been used as the JS framework. I am not specifically into observer pattern. ReactJs reduces
boiler plate code hence chose this framework. To accomplish my point, MV* is dead since 2016 (start) and web apps 
has come along a long way from MV*. To make a stronger point React JSX is the V and state is M of MV*. React has
just made MV* much more scalable. We can talk about this if you find the code interesting. :)

- Approach taken for the problem is pretty simple. Data is published over web socket and that data is subscribed 
after web socket is connected by the client. The data is parsed, manipulated and stored in the Component State 
(`tableData`). I will talk about the manipulation of data in my next points.

- There was bug in stomp.js. The server was sending the data over web socket when the socket was still in `CONNECTING`
state. Fixed that issue. You can find my comment in stomp.js file.

- After data is received, I group them by currency names. I maintain a separate map of currency names to maintain the
index of each names. I use this index for building up the data instead of currency names. This approach is taken 
such that sorting can become easy. Sorting doesn't work on dynamic keys.

- For Spark Line, I maintain a separate array of mid values for each index in `tableData` itself. I show the last 
`30` spark line values over the last recently updated one. This approach was taken such that I don't need to think 
about each intervals of spark lines. 

- So each table data is changed, except for spark line value which is pushed into the array. Hence, each table data 
change the table is re- rendered with least DOM Manipulation as I maintain the keys.

- Used Enzyme by airbnb, chai and mocha for testing the React Component. All test cases are covered and properly 
commented. I tried the karma-webpack, but debugging in Karma is horrible. Even for `single-run=false`, there were 
no error logs but test cases were failing. I was stuck for long and finally decided upon the testing framework that 
I usually use.

- Used JSDoc for documenting the React Component.

- Last but not the least, changed the Webpack Configuration a bit for loaders and presets. Added `.babelrc` as mocha 
requires babel for compiling the ES6 code.


