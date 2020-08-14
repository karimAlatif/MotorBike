import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { Typography, Avatar, Radio, Button, Input, Modal } from 'antd';

const { Text } = Typography;

const radioStyleV = {
    display: 'block',
    marginBottom:"5px",
    height: '6vh',
    lineHeight: '5vh',
    textAlign:"center",
};
const radioStyleH = {
    height: '5vh',
    lineHeight: '5vh',
    textAlign:"center",
};

const selected = (imagePath) => {
    return{
        width:"93%",
        height:"11vh",
        backgroundImage:`url(${imagePath})`,
        backgroundSize:"80%",
        backgroundRepeat:"no-repeat",
        backgroundPosition: "center",
        borderColor:"#374abd !important"
    }
}

class StylingTab extends React.Component {
    state = {
    };

    OnInitStyleShape(newStyleIndex){ //try to get new Style Init (if it wasn't the same)
        const {handleInitStyleShape} =this.props;        
        handleInitStyleShape(newStyleIndex);
    }

    onOptionChange = (optionId,optionValue) => {
        console.log("oo",optionValue)
        const {handleEditStyleShape,selectedStyle} =this.props;

        let optObjIndex = selectedStyle.styleData.findIndex(opt => opt.id === optionId);
        if(optObjIndex < 0 ) throw Error ("optObjIndex Not Exists !!")
        let optObj = selectedStyle.styleData[optObjIndex];
        if(!optObj || !optObj.data ) throw Error ("optObj Not Exists !!")
        let optData = optObj.data.find(x => x.id === optionValue );
        if(!optData) throw Error ("optData Not Exists !!")

        let tmpOptionObj={
            id:optionId,
            name:optData.name,
            value: optData.value,
            price: optData.price,

        }
        console.log(" heya heya ", tmpOptionObj)
        handleEditStyleShape(tmpOptionObj);

        // setTimeout(() => {
        //     handleEditStyleShape(tmpOptionObj);
        // }, 250);
    }

    renderAllShapes =()=>{
        const {styles,selectedStyle} =this.props;
        return styles.map((styleData)=>{
          return <Col span={6} key={styleData.id}>
                        <Row>
                            <Col offset={1} span={23}>
                                <Button 
                                    // style={{width:":"85%"85%",height:"127%"}}
                                    className={styleData.id === selectedStyle.id ? "selectedStyleButton" : "unSelectedStyleButton"}
                                    style={{                 
                                        width:"93%",
                                        height:"11vh",
                                        backgroundImage:`url(${styleData.imagePath})`,
                                        backgroundSize:"80%",
                                        backgroundRepeat:"no-repeat",
                                        backgroundPosition: "center",                                                     
                                    }}
                                    onClick={()=>{this.OnInitStyleShape(styleData.id)}} >
                                    {/* <img 
                                        style={{
                                            width:"100%",
                                            // height:"85%",
                                            marginLeft:"-7px"
                                        }}
                                        src={styleData.imagePath} 
                                        alt="Italian Trulli"
                                    /> */}
                                </Button>
                            </Col>
                            </Row>
                            <Row>
                            <Col span={23}>
                                <Text>
                                    {styleData.name}
                                </Text>
                            </Col>
                        </Row>
                    </Col>
        })
    }

    getDefualtShapeDataOpt = (styleOption) => {
        const {selectedStyle} =this.props;

        let selectedOpt = selectedStyle.initData.styleData.find(opt => opt.id === styleOption.id);
        if(!selectedOpt)
            selectedOpt = styleOption.data[0];

        return selectedOpt.value;
    }
    
    renderShapeData = () => {
        // const {selectedStyle, selectedStyleData} = this.props;
        // let shapeStyleData = selectedStyle.styleData;

        // if(shapeStyleData) //ErorrAvoider
        // return shapeStyleData.map( (styleOption) => { //Siding,Porch,PorchD,WallH,Roof
        //     if( !styleOption.relatedOptId || (styleOption.relatedOptId && selectedStyleData.find(opt => opt.id === styleOption.relatedOptId).value !== shedConfigration.porchEnum.none) ) //static
        //     return <React.Fragment key={styleOption.id}>       
        //                 <Row style={{marginTop:"5%",marginLeft:"1%"}} justify="start">
        //                     <Col span={24} style={{fontSize:"16px",fontWeight:"500"}}>
        //                         <Text>{styleOption.name}</Text>
        //                     </Col>
        //                 </Row>
        //                 <Row style={{marginTop:"2%",marginLeft:"1%"}} justify="start">
        //                     <Col span={12}>
        //                         <Radio.Group style={{marginLeft:"15px", width:"100%"}} onChange={(e)=>{this.onOptionChange(styleOption.id,e.target.value)}} defaultValue={this.getDefualtShapeDataOpt(styleOption)}>
        //                            {styleOption.data.map((optionData)=>{
        //                                return <Radio.Button style={(styleOption.view === "vertical" ? radioStyleV: radioStyleH)} key={optionData.id} value={optionData.id}>{optionData.name}</Radio.Button>
        //                             })}
        //                         </Radio.Group>
        //                     </Col>
        //                 </Row>
        //             </React.Fragment>
        // });
    }
    // let arr =  [{id:0,value:11,price:22}, {id:0,value:11,price:22}].map((configObj)=>{

    render() {
        return (
            <div
                style={{height:"80vh",overflowY:"auto",overflowX:"hidden",paddingBottom:"25px"}}
            >
                <Row style={{overflow:"auto"}}>
                    <Col style={{marginTop:"15px"}}>
                        <Text style={{color:"#23211f",fontSize:"small",fontWeight:"500"}}>
                            Select your preferred shed style below
                            Let us know if you have a custom style in mind,
                            and we’ll be happy to work with you on it.
                        </Text>
                    </Col>
                </Row>
    
                {/* Shapes */}
                <Row style={{marginTop:"5%",marginLeft:"1%"}}  justify="start">
                    <Col span={24} style={{fontSize:"16px",fontWeight:"500"}}>
                        <Text>Shapes</Text>
                    </Col>
                </Row>
                <Row style={{marginTop:"5%",marginLeft:"1%"}} gutter={[10, 12]} justify="start">
                    {this.renderAllShapes()}
                </Row>
                    {this.renderShapeData()}
            </div>
        )
    }
}

export default StylingTab;