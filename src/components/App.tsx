/// <reference path="../../typings/_custom.d.ts" />

import * as React from 'react';
import { CompactPicker } from 'react-color';
import Radiogroup from './radiogroup';
import Radio from './radio';
import syncer from '../lib/sync-storage'
import * as objectAssign from 'object-assign';

class App extends React.Component<any, any> {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
          displayColorPicker: false,
          currentType: null,
          data: {}
        };
        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        syncer.getData('gitTern', (data) => this.setState({data: data.gitTern}));
    }

    handleColorClick(type) {
        this.state.currentType = type;
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.setState({ displayColorPicker: false });
    }

    handleChange(prop, value){
        var newValue = objectAssign({}, this.state.data, { [prop]: value });
        syncer.setData({gitTern: newValue}, () => this.setState({data: newValue}));
    }

    render() {
        const {refColor, defColor, scroll, control} = this.state.data;
        return (
            <div className="container">
                <div className="row">
                    <Radiogroup
                        name="typeClick"
                        value={control}
                        options={['alt', 'cmd']}
                        onChange={(value)=> this.handleChange('control', value)}
                    />
                    <span className="title">+ click</span>
                </div>
                <label className="row">
                    <input
                        type="checkbox"
                        checked={scroll}
                        onClick={()=>this.handleChange('scroll', !scroll)} />
                    <span className="title">Scroll to definition</span>
                </label>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'defColor') }>
                    <span className="pallet" style={{backgroundColor: `#${defColor}`}} >
                        Definition color
                    </span>
                </div>
                <div className="row" onClick={ this.handleColorClick.bind(null, 'refColor') }>
                    <span className="pallet" style={{backgroundColor: `#${refColor}`}} >
                        Reference color
                    </span>
                </div>
                {this.state.displayColorPicker &&
                <CompactPicker
                  color={ this.state.color }
                  position="below"
                  onChange={(color)=> {this.handleClose(); this.handleChange(this.state.currentType, color.hex)}}
                  onClose={ this.handleClose }
                />
                }
            </div>
        );
    }
}

export default App;