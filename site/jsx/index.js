import React, { Component, PropTypes } from 'react';
const Stomp = require('./../stomp');
const SparkLine = require('./../sparkline');
const getUpdatedTableData = require('./util').getUpdatedTableData;

const url = "ws://localhost:8011/stomp";
const client = Stomp.client(url);
client.debug = false;

export default class CurrencyTable extends Component {

    /**
     * Declares the initial state and binds the component functions
     * @constructor
     * @param {Object} props - React super class props to bind `this`.
     */

    constructor(props) {
        super(props);
        this.state = { tableData: [], tableDataMap: [] };
        this.processData = this.processData.bind(this);
    }

    /**
     * React Hook <br>
     * Stomp subscribe. <br>
     * processData is success callback
     */

    // TODO: Error not handled. We can show the error if any.
    componentDidMount() {
        client.connect({}, () => {
            client.subscribe("/fx/prices", this.processData);
        });
    }

    /**
     * React Hook <br>
     * Gets the sorted data as the spark line has to changed according to the sorted data as the dom element for
     * attaching spark line needs to be dynamic. <br>
     * The state contains spark line data for each currency. Array slice for `array length - 30` always gives the last 30
     * values over the last recent update. If number of data are less than 30, it shows that many number of values.
     */

    componentDidUpdate() {
        const sortedTableData = this._getSortedData();
        for (let key in sortedTableData) {
            const sparkLineValues = sortedTableData[key]['sparkLine'];
            const currencyElement = document.getElementById(`sparkLine_${key}`);
            currencyElement ? SparkLine.draw(currencyElement, sparkLineValues.slice(Math.max(sparkLineValues.length - 30))) : null;
        }
    }

    /**
     * Returns the sorted array of lastChangeBid
     * @returns {Array.<T>}
     * @private
     */

    _getSortedData() {
        return this.state.tableData.slice().sort((currentValue, previousValue) => {
            return previousValue.lastChangeBid - currentValue.lastChangeBid;
        });
    }


    /**
     * Accepts the message published to the socket by the server
     * Parses the message body and sets the data to the tableData state
     *
     * @description
     * 1. As sorting does not work on dynamic keys in array of objects, we maintain a tableDataMap which keeps pushing
     * the currency name if it is not present in the tableDataMap. <br>
     * 2. If the currency name is present in tableDataMap, the index of currency name is obtained and values are pushed
     * to that particular index. <br>
     * 3. Calculates the spark line value which is half of the sum of bestAsk & bestBid and keeps pushing to the tableData.
     *
     * @example
     * What happens in step 1 and step 2 ?
     *
     * 'usdjpy' is received. If 'usdjpy' not present in tableDataMap, it is pushed and the index of
     * 'usdjpy' in tableDataMap is used for creating array. In this way we can maintain the index
     * for different currency names and keeping the data separate for different currencies as well.
     *
     * @param {Object} message - Contains body, ack, subscriber id etc.
     */
    processData(message) {
        const rawData = JSON.parse(message.body);
        const sparkLineValue = (rawData.bestAsk + rawData.bestBid) / 2;

        /** @function getUpdatedTableData */
        const { tableData, tableDataMap } = getUpdatedTableData(this.state.tableData, this.state.tableDataMap, rawData, sparkLineValue);

        this.setState({ tableData, tableDataMap });
    }

    /**
     * JSX View for table rows
     * Dynamic keys have been used to reduce as less DOM Manipulation as possible.
     * @returns {Array}
     * @private
     */

    _showTableData() {
        const tableData = [];
        const sortedTableData = this._getSortedData();

        for (let key in sortedTableData) {
            tableData.push(
                <tr key={key}>
                    <td key={`name_${key}`}>{sortedTableData[key].name}</td>
                    <td key={`bestAsk_${key}`}>{sortedTableData[key].bestAsk}</td>
                    <td key={`bestBid_${key}`}>{sortedTableData[key].bestBid}</td>
                    <td key={`lastChangeAsk_${key}`}>{sortedTableData[key].lastChangeAsk}</td>
                    <td key={`lastChangeBid_${key}`}>{sortedTableData[key].lastChangeBid}</td>
                    <td key={`openAsk_${key}`}>{sortedTableData[key].openAsk}</td>
                    <td key={`openBid_${key}`}>{sortedTableData[key].openBid}</td>
                    <td key={`sparkLine_${key}`} id={`sparkLine_${key}`}></td>
                </tr>
            );
        }

        return tableData;
    }

    /**
     * JSX for rendering the table
     */
    render() {
        return (
            <table className="currency-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Best Ask</th>
                        <th>Best Bid</th>
                        <th>Last Change Ask</th>
                        <th>Last Change Bid</th>
                        <th>Open Ask</th>
                        <th>Open Bid</th>
                        <th>Spark Line</th>
                    </tr>
                </thead>
                <tbody>
                    {this._showTableData()}
                </tbody>
            </table>
        );
    }
}


