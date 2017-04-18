'use strict';

/**
 * As discussed in the component logic, this function prepares the update table data.
 * @param {Object} tableData - Contains all table data details
 * @param {Array} tableDataMap - Array of currency names to map to index
 * @param {Object} rawData - Received from stomp server
 * @param {Float} sparkLineValue - Half of sum of bestAsk and bestBid
 * @returns {{tableData: *, tableDataMap: *}}
 */


const getUpdatedTableData = (tableData, tableDataMap, rawData, sparkLineValue) => {
    if (tableDataMap.indexOf(rawData.name) == -1) {
        tableDataMap.push(rawData.name);
    }

    const indexMap = tableDataMap.indexOf(rawData.name);

    if (!tableData[indexMap]) {
        tableData[indexMap] = [];
    }

    if (!tableData[indexMap]['sparkLine']) {
        tableData[indexMap]['sparkLine'] = [];
    }

    tableData[indexMap]['name'] = rawData.name;
    tableData[indexMap]['bestAsk'] = rawData.bestAsk;
    tableData[indexMap]['bestBid'] = rawData.bestBid;
    tableData[indexMap]['lastChangeAsk'] = rawData.lastChangeAsk;
    tableData[indexMap]['lastChangeBid'] = rawData.lastChangeBid;
    tableData[indexMap]['openAsk'] = rawData.openAsk;
    tableData[indexMap]['openBid'] = rawData.openBid;
    tableData[indexMap]['sparkLine'].push(sparkLineValue);

    return { tableData, tableDataMap };
};

module.exports = {
    getUpdatedTableData
};