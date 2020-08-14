/* eslint-disable no-loop-func */
import React from 'react';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import {Typography, Input, Button} from 'antd';
import Form from 'antd/es/form';

import {IsPricing} from "../appConfig/ShedConfigration";


const { Text } = Typography;
const {Item :FormItem} = Form;

function EstimateModal(props){
    const [form] = Form.useForm();
    const {isEstimateModalOpen, handleModelState, selectedStyleComps, selectedStyleData, selectedStyleInteriors} = props ;

    const handleCancel = e => {
        handleModelState(false)
    };
    const renderFooterData=()=>{
        return <React.Fragment>
                <Button
                  size="default"
                  type="primary"
                  onClick={() => {handleModelState(false)}}
                >
                  Close
                </Button>
            </React.Fragment>
    }

    console.log("selectedStyleData", selectedStyleData)
    console.log("selectedStyleComps ", selectedStyleComps)
    console.log("selectedStyleInteriors ", selectedStyleInteriors)

    
    const renderStructureDetails = () => {
        return selectedStyleData.map((configObj)=>{
            return  <Row style={{
                            marginBottom:"5px"
                        }}
                        key ={configObj.id}
                    >
                        <Col offset={1} span={6}>
                            <Text 
                                strong
                            >
                                {configObj.id.toUpperCase()}
                            </Text>
                        </Col>
                        <Col offset={3} span={9}>
                            <Text 
                                style={{fontSize:"15px", fontWeight:400}}
                            >
                                {configObj.id !==  "size" ? configObj.name : `${configObj.value.width} x ${configObj.value.length}`}
                            </Text>
                        </Col>
                        {IsPricing &&<Col offset={3} span={2}>
                                <Text 
                                    strong
                                >
                                    {`${configObj.price}$`}
                                </Text>
                        </Col> }
                    </Row>
        });           
    }
    const renderComponentsDetails = () => {
        if (Array.isArray(selectedStyleComps) && selectedStyleComps.length > 0) {
            return  selectedStyleComps.map((configObj)=>{
                        return  <Row style={{
                                        marginBottom:"5px"
                                    }}
                                    key ={configObj.id}
                                >
                                    <Col offset={1} span={23} style={{marginBottom:"5px"}}>
                                        <Text 
                                            strong
                                        >
                                            {configObj.type.toUpperCase()}
                                        </Text>
                                    </Col>
                                    {/* Model Type */}
                                    <Col offset={2} span={6}>
                                        <Text 
                                            strong
                                        >
                                            {"Model Type"}
                                        </Text>
                                    </Col>
                                    <Col offset={2} span={7}>
                                        <Text 
                                            style={{fontSize:"15px", fontWeight:400}}
                                        >
                                            {configObj.value}
                                        </Text>
                                    </Col>
                                    {IsPricing  && <Col offset={4} span={3}>
                                        <Text 
                                            strong
                                        >
                                            {`${configObj.price}$`}
                                        </Text>
                                    </Col> }
                                
                                    {/* Color Type */}
                                    <Col offset={2} span={6}>
                                        <Text 
                                            strong
                                        >
                                            {"Color"}
                                        </Text>
                                    </Col>
                                    <Col offset={3} span={7}>
                                        <Text 
                                            style={{fontSize:"15px", fontWeight:400}}
                                        >
                                            {"White"}
                                        </Text>
                                    </Col>
                                    { IsPricing && <Col offset={3} span={3}>
                                        <Text 
                                            strong
                                        >
                                            {`0$`}
                                        </Text>
                                    </Col> }
                                    {/* Extensions */}
                                    {configObj.extensions.map((extensionObj)=>{
                                        return <Row style={{width:"100%", marginBottom:"3"}} key={extensionObj.id}>
                                                    <Col offset={2} span={5} >
                                                        <Text 
                                                            strong
                                                        >
                                                            {extensionObj.id.toUpperCase()}
                                                        </Text>
                                                    </Col>
                                                    <Col offset={4} span={5}>
                                                        <Text 
                                                            style={{fontSize:"15px", fontWeight:400}}
                                                        >
                                                            {extensionObj.value}
                                                        </Text>
                                                    </Col>
                                                    {IsPricing  && <Col offset={5} span={3}>
                                                        <Text 
                                                            strong
                                                        >
                                                            {`${extensionObj.price}$`}
                                                        </Text>
                                                    </Col> }
                                                </Row>
                                    })}
                                </Row>
                    });     
        }
        else
            return <p>{"No Components Atttached "}</p>     
    }
    const renderInteriorDetails = () => {
        // for (let [mainOptKey, optArrValue] of Object.entries(selectedStyleInteriors)) {
            console.log("mmai id dddd n ", selectedStyleInteriors)
 
        return  selectedStyleInteriors.map((mainOpt)=>{//loop on all InitObj
                console.log("mmaii n ", mainOpt)
                return  <Row
                        style= {{marginBottom:"5px"}}
                        key= {mainOpt.id}
                    >
                        <Col offset={1} span={23} style={{marginBottom:"5px"}}>
                            <Text strong >
                                {mainOpt.id.toUpperCase()}
                            </Text>
                        </Col>
                        {mainOpt.data.map((optObj,index)=>{
                            // && optObj.data.qty > 0
                            
                            console.log("optObj.data.qty !," , optObj.data.qty)
                            return  (   (!optObj.data.hasOwnProperty("qty") && !Array.isArray(optObj.data) ) ||
                                        (!optObj.data.hasOwnProperty("qty") && Array.isArray(optObj.data) && optObj.data.length > 0 )||
                                         optObj.data.qty > 0
                                    ) 
                                        && <Row style={{width:"100%", marginBottom:"3"}} key={index}>
                                        {
                                            console.log("optObj.data.qty !," , (!optObj.data.hasOwnProperty("qty") && optObj.data.length > 0 ), "==== ",optObj.data.qty !== 0 )
                                        }
                                        <Col offset={2} span={5} >
                                                <Text 
                                                    strong
                                                >
                                                    {  optObj.type.toUpperCase() }
                                                    {/* { (optObj.singleType ) ? optObj.type.toUpperCase() : optObj.data[0].type.toUpperCase()} */}

                                                </Text>
                                        </Col>
                                            {
                                                optObj.singleOpt ? 
                                                <Col span={17}>
                                                    <Row style={{width:"100%"}}>
                                                        <Col offset={4} span={13}>
                                                            <Text 
                                                                style={{fontSize:"15px", fontWeight:400}}
                                                            >

                                                                { (optObj.data.qty && optObj.data.qty > 0) ?  `${optObj.data.name} (Qty.${optObj.data.qty})`: optObj.data.name}
                                                            </Text>
                                                        </Col>
                                                        {IsPricing && <Col offset={4} span={3}>
                                                            <Text 
                                                                strong
                                                            >
                                                                {`${optObj.data.price}$`}
                                                            </Text>
                                                        </Col> }
                                                    </Row>
                                                </Col>
                                                : //multi
                                                    <Col span={17}>
                                                    {
                                                        optObj.data.map((dataObj) =>{
                                                                return <Row key= {dataObj.name} style={{width:"100%"}}>
                                                                            <Col offset={4} span={13}>
                                                                                <Text 
                                                                                    style={{fontSize:"15px", fontWeight:400}}
                                                                                >
                                                                                    {dataObj.name}
                                                                                </Text>
                                                                            </Col>
                                                                            {IsPricing  && <Col offset={4} span={3}>
                                                                                <Text 
                                                                                    strong
                                                                                >
                                                                                    {`${dataObj.price}$`}
                                                                                </Text>
                                                                            </Col> }
                                                                        </Row>
                                                        })
                                                    }
                                                </Col>
                                            }
                                        
                                    </Row>
                        })}
                    </Row>
        })

    }

    return (
        isEstimateModalOpen &&
            <Modal
                onCancel={() => handleCancel()}
                footer={renderFooterData()}
                destroyOnClose
                visible={isEstimateModalOpen}
                title= 'Your Estimate'
                width= {800}
                style={{marginTop:"-2%"}}
            >
            
            <div
                style={{
                    overflow:"auto"
                }}
            >
                {/* ZipCode */}
                <Row >
                    <Col span={24} style={{ marginTop:"5px"}}>
                        <Text 
                            style={{fontSize:"15px", fontWeight:"300"}}
                        >
                            The infor1mation below is an estimate only. Final pricing - including pricing adjustments, discounts, delivery, and taxes - will be provided with final quote prior to purchase.
                        </Text>
                    </Col>
                </Row>
                {/* StructureDetails */}
                <div style={{marginTop:"10px"}}>
                    <div style={{marginBottom:"10px"}}>
                        <Text style={{fontSize:"15px",fontWeight:"700"}} >Structure Details</Text>
                    </div>
                    {renderStructureDetails()}
                </div>
                {/* StructureDetails */}
                <div style={{marginTop:"10px"}}>
                    <div style={{marginBottom:"10px"}}>
                        <Text style={{fontSize:"15px",fontWeight:"700"}} >Components</Text>
                    </div>
                    {renderComponentsDetails()}
                </div>
                {/* StructureDetails */}
                <div style={{marginTop:"10px"}}>
                    <div style={{marginBottom:"10px"}}>
                        <Text style={{fontSize:"15px",fontWeight:"700"}} >{`Flooring & Interior`}</Text>
                    </div>
                    {renderInteriorDetails()}
                </div>
            </div>

            </Modal>
    )
}
export default EstimateModal;