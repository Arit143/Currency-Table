import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';

import CurrencyTable from '../site/jsx/index.js';

const dummyMessage1 = [];
const dummyMessage2 = [];
const dataAfterProcessing = [];

/**
 * Not checking stomp end points. Expecting to always get the data.
 * TODO: May be nock can be used to mock the stomp topic.
 */

dummyMessage1['body'] = JSON.stringify({
    "name": 'usdjpy',
    "bestBid": 106.7297012204255,
    "bestAsk": 107.25199883791178,
    "openBid": 107.22827132623534,
    "openAsk": 109.78172867376465,
    "lastChangeAsk": -4.862314256927661,
    "lastChangeBid": -2.8769211401569663
});

dummyMessage2['body'] = JSON.stringify({
    "name": 'usdeur',
    "bestBid": 104.7297012204255,
    "bestAsk": 105.25199883791178,
    "openBid": 106.22827132623534,
    "openAsk": 108.78172867376465,
    "lastChangeAsk": -2.862314256927661,
    "lastChangeBid": 1.8769211401569663
});

dataAfterProcessing['sparkLine'] = [106.99085002916864];
dataAfterProcessing['name'] = 'usdjpy';
dataAfterProcessing['bestAsk'] = 107.25199883791178;
dataAfterProcessing['bestBid'] = 106.7297012204255;
dataAfterProcessing['lastChangeAsk'] = -4.862314256927661;
dataAfterProcessing['lastChangeBid'] = -2.8769211401569663;
dataAfterProcessing['openAsk'] = 109.78172867376465;
dataAfterProcessing['openBid'] = 107.22827132623534;

describe('CurrencyTable', function () {
    it('initial render without problems', function () {
        /**
         * Loading just initial table
         */
        expect(mount(<CurrencyTable />).find('.currency-table').length).to.equal(1);
    });

    it('initial table state should be empty', function () {
        const wrapper = mount(<CurrencyTable />);
        /**
         * Check if the initial table data is empty.
         */
        expect(wrapper.state().tableData).to.be.empty;
        expect(wrapper.state().tableDataMap).to.be.empty;
    });

    it('calls processData, updates DOM with table data with spark line', () => {
        const wrapper = mount(<CurrencyTable />);
        wrapper.instance().processData(dummyMessage1);

        /**
         * Checks for spark lines loaded. As componentDidUpdate will append spark line to innerHtml.
         * Throws an error if `sparkLine_0` is not present.
         * Checks for table data after data processing. Does a deep check as the format of the data needs to be correct.
         */

        expect(wrapper.find('#sparkLine_0').length).to.equal(1);
        expect(wrapper.state('tableData')[0]).to.eql(dataAfterProcessing);
    });

    it('calls processData twice, check sorting and check table data', () => {
        const wrapper = mount(<CurrencyTable />);
        wrapper.instance().processData(dummyMessage1);
        wrapper.instance().processData(dummyMessage2);

        wrapper.instance()._showTableData();

        /**
         * Passed two lastChangeBid - (-2.8769211401569663 and 1.8769211401569663).
         * 1.8769211401569663 should be at the first table row in table body hence checking to have that string.
         */
        expect(wrapper.find('tbody').at(0).text()).to.have.string('1.8769211401569663');
    })
});