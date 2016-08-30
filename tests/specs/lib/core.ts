import OctoRef from '../../../src/lib/core';
const config = require('../../../src/config.json');

import * as objectAssign from 'object-assign';
import chai = require('chai');
const expect = chai.expect;

describe('core', function(){
    const pathname = 'http://url.com';
    const root = {
        location: { pathname }
    };
    const defMock = {
        isCodePage: () => true,
        subscribe: ()=> null,
        getFileContent: () => 'fileContent',
    }
    const makeMockAdapter = (customProps = {}) => () =>
            objectAssign({}, defMock, customProps)


    it('constructor should create instance', function() {
        const spySubscribe = sinon.spy();
        const spySend = sinon.spy();

        const mockAdapter = makeMockAdapter({
            subscribe: spySubscribe
        })

        OctoRef.prototype.send = spySend;
        new OctoRef(root, mockAdapter, config);

        expect(spySubscribe.calledWith('click')).to.be.ok;
        expect(spySend.calledWith('register', { content: 'fileContent', url: pathname })).to.be.ok;
    });

    it('#findDefinition ', function() {
        const line = 3;
        const character = 5;

        const spySend = sinon.spy();

        const mockAdapter = makeMockAdapter({
            getSelectedElemPosition: () => ({ line, character })
        })

        OctoRef.prototype.send = spySend;
        var instance = new OctoRef(root, mockAdapter, config);
        instance.findDefinition();

        expect(spySend.calledWith('definition', { end: { line, character }, url: pathname })).to.be.ok;
    });

    it('#doHighlight', function() {
        const shouldDo = {};
        const currentPosition = {};
        const spyHighlight = sinon.spy();

        const mockAdapter = makeMockAdapter({
            highlight: spyHighlight
        })

        var instance = new OctoRef(root, mockAdapter, config);

        const data = {start: 'start', end: 'end'};
        instance.doHighlight(shouldDo, [data], currentPosition); // FIXME

        expect(spyHighlight.calledOnce).to.be.ok;
        expect(spyHighlight.calledWith(data)).to.be.ok;
    });

    it('click + altKey should lead to findDefinition call', function() {
        const mockAdapter = makeMockAdapter();

        const instance = new OctoRef(root, mockAdapter, config);
        const findDefStub = sinon.stub(instance, 'findDefinition');

        instance.handleClick({});
        expect(findDefStub.notCalled).to.be.ok;

        instance.handleClick({});
        expect(findDefStub.notCalled).to.be.ok;

        instance.handleClick({altKey: true});
        expect(findDefStub.calledOnce).to.be.ok;
    });
})
