/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import EditorSettings from './Settings';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import {GmContext} from './index';
import { EditOutlined } from '@ant-design/icons';
import { Popover, Button, Typography, Radio, message } from 'antd';


const { Text } = Typography;

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginLeft:"10px"
};

class EditorButton extends React.Component {
    state = {
        isSettingsModalOpen: false,
        visible: false,
    };

    // constructor( props ){
    //     super( props );
    //     this.onRadioButChange = this.onRadioButChange.bind(this);
    // }

    handleCameraZoom = (GManager, ZoomIn) => {
        GManager.studioSceneManager.CameraZoomAnimation(ZoomIn);
    }


    async onRadioButChange  (value, compData)  { //onChange
        console.log("this !!!! ", this)
        const {id, configType, GManager, catType} = compData;
        const {selectedStyle, handleStyleComponents} = this.props;

        let resultMsg = await GManager.studioSceneManager.replaceComponentModel({
            id,
            configType,
            catType,
        },
        value
        );

        if(!resultMsg) throw Error("error can't find msg");

        let targetCompOpt = selectedStyle.componentsData.options.find( (x) => x.value === catType )
        let targetModelOpt = null;
        let compObj = null;
        if(resultMsg.key === "main"){
            targetModelOpt = resultMsg.configs[0].opts.find((x) => x.id === value) //search for selected mesh id
    
            compObj = { //add Main modelObject
                key:resultMsg.key,
                compId:id, //last obj Id
                id: resultMsg.id, //newObj Id
                value : targetModelOpt.value, //36" Single Door
                price: targetCompOpt.priceObj[targetModelOpt.id], //price
            }

        }else if (resultMsg.key === "sub"){
            console.log("config ", resultMsg.configs)
            console.log("configType ", configType)
            console.log("catType ", catType)

            let targetConfig = resultMsg.configs.find((x) => x.id === configType);
            targetModelOpt = targetConfig.opts.find((x) => x.id === value); //search for selected mesh id

            compObj = { //add extension modelObject
                key:resultMsg.key,
                compId: id, //compId
                id: targetConfig.id,  //config id
                value: targetModelOpt.value, //opt Value
                price: targetCompOpt.priceObj[targetModelOpt.id] //opt Price
            }
        }

        handleStyleComponents("edit",compObj) //add new clonning Comp using Handler


    };
    
    //#region Content Footer

    //Clone
    async handleCloneComponent (compData, index) { 
        const {GManager, id, catType} = compData;
        const {selectedStyle, handleStyleComponents} = this.props;

        let resultMsg = await GManager.studioSceneManager.cloneSelectedComponent({
            id,
            catType,
        });
        switch (resultMsg.success) {
            case true:
                message.success(resultMsg.message);
                console.log("resultMsg",resultMsg)

                let targetCompOpt = selectedStyle.componentsData.options.find( (x) => x.value === catType )
                let targetModelOpt = resultMsg.configs[0].opts.find((x) => x.isSelected === true)

                let tmpCompObj = { //add Main modelObject
                    id: resultMsg.id,
                    type: catType, //singleDoor
                    value : targetModelOpt.value, //36" Single Door
                    price : targetCompOpt.priceObj[targetModelOpt.id], // 36" Single Door price
                    extensions : []
                }
                //add Extension Opt to mainObject
                console.log("tmpCompObj",tmpCompObj)
                console.log("configs",resultMsg.configs)
                for (let i = 1; i < resultMsg.configs.length; i++) {
                    console.log("opts",resultMsg.configs[i].opts)

                    let selectedOpt = resultMsg.configs[i].opts.find((x) => x.isSelected === true)
                    console.log("tmpCompObj",tmpCompObj)

                    if(!selectedOpt){ //if there's no opt selected
                        selectedOpt = resultMsg.configs[i].opts[0]; //firstItem
                    }
                    
                    let extensionObj = {
                        id: resultMsg.configs[i].id, //config id
                        value: selectedOpt.value,
                        price: targetCompOpt.priceObj[selectedOpt.id]
                    }
                    tmpCompObj.extensions.push(extensionObj);
                }
                console.log("tmpCompObj ؤؤ",tmpCompObj)
                handleStyleComponents("add",tmpCompObj) //add new clonning Comp using Handler
                break;
            default: //false
                message.error(resultMsg.message);
                break;
        }
        this.handleVisibleChange(false, index)
    };
    //Delete
    handleDeleteComponent = (compId, index, GManger) => {
        const {handleStyleComponents} = this.props;
        GManger.studioSceneManager.deleteComponent(compId); //delete if from 3d

        //Compnents
        let tmpCompObj = { //add Main modelObject
            id: compId,
        };
        handleStyleComponents("delete",tmpCompObj)

        this.handleVisibleChange(false, index) //hideUi
    }
    //Close
    handleVisibleChange = (visible,index) => {
        this.props.visibleChange(visible,index);
    };
    
    //#endregion

    getSelectedOpt = (configObj) => {
        let targetOpt = null;
        targetOpt = configObj.opts.find( (x)=> x.isSelected === true )
        if(targetOpt)
            return targetOpt.id; //id
        return targetOpt; //null
    }
    renderCompContent =(componentData,index, GManager)=>{
        const {selectedStyle:{materialType}} = this.props;
        console.log("pppopoerpowepw ",materialType )
        console.log("componentData", componentData)
        let isBarnStyle = true;
    
        return <React.Fragment>
            {
                componentData.configs.map( (configObj) => {
                    return <div key={configObj.id}>
                        <Row style={{marginTop: (index === 0) ? "2px":"10px"}} >
                            <Col>
                                <Text style={{fontWeight:"500"}}>{configObj.value}</Text>
                            </Col>
                        </Row>
                            {
                                configObj.opts.length > 0 && 
                                 <Radio.Group 
                                    onChange={ (e) => this.onRadioButChange(e.target.value, {configType: configObj.id, GManager, id: componentData.id, catType: componentData.catType} )} 
                                    defaultValue={ this.getSelectedOpt(configObj) || configObj.opts[0].id } //for first time only
                                >
                                    {configObj.opts.map( (optObj,index) => {
                                        if( (!isBarnStyle && !optObj.isBarn) || isBarnStyle ) 
                                        return <Radio style={radioStyle} key={optObj.id} value={optObj.id}>
                                                {optObj.value}
                                            </Radio> 

                                    })}
                                </Radio.Group>
                            }
                    </div>
                })
            }
            <Row style={{marginTop:"15px", borderTop:"1px solid #f0f0f0", width:"190px"}} >
                <Col offset={6} span={7} style={{marginTop:"5px"}}>
                <a onClick={() => this.handleCloneComponent({GManager, id: componentData.id, catType: componentData.catType}, index ) }>Clone</a>
                </Col>
                <Col span={7} style={{marginTop:"5px"}}>
                <a onClick={() => this.handleDeleteComponent(componentData.id, index, GManager) }>Delete</a>
                </Col>
                <Col span={4} style={{marginTop:"5px"}}>
                <a onClick={() => this.handleVisibleChange(false, index) }>Close</a>
                </Col>
            </Row>

        </React.Fragment>

    }
    createComponentsButtons(GManager){
        const {selectedFaceComps } = this.props;

        console.log("ccc", this.props.visibleArr)
        let tmpSelectedFaceComps = selectedFaceComps.map( (componentData,index) => {
            return  <Popover
                        content={this.renderCompContent(componentData,index, GManager)}
                        trigger="click"
                        visible={this.props.visibleArr[index]}
                        onVisibleChange={ (visible)=> this.handleVisibleChange(visible, index)}
                        key={index}
                    >
                        <Button
                            style={{
                                left : componentData.left,
                                top : componentData.top,
                                position : "fixed",
                                color:'rgb(60, 59, 59) !important'
                            }} 
                            shape="circle" icon={<EditOutlined />} />
                    </Popover>
        });

        return tmpSelectedFaceComps;
    }

    render() {
        const {isSettingsModalOpen } = this.state;
        return (
            <GmContext.Consumer>
                {GManager => {
                    return (
                        null
                    )
            }}
            </GmContext.Consumer>
        )
    }
}

export default EditorButton;