import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Icon from 'antd/es/icon';
import {GmContext} from '../Editor/index';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'
import Button from 'antd/es/button';
import { faClone, faExpandAlt } from '@fortawesome/free-solid-svg-icons'
import { UnorderedListOutlined, FileTextOutlined, MailOutlined} from '@ant-design/icons';

import EstimateModal from './EstimateModal';

 
const ButtonGroup = Button.Group;

class TopMenu extends React.Component {

    state = {
        isEstimateModalOpen : false,
      };

    handleCloneSelectedItem(GManger){
        // GManger.studioSceneManager.CloneSelectedItem();
    }
    
    handleScaleSelectedObj(GManger){
        // GManger.studioSceneManager.ScaleSelectedObj();
    }

    handleModelState = (state) =>{
        this.setState({
            isEstimateModalOpen:state
        });
    }

    handleSubmitModelState = (state) =>{
        this.props.submitModelState(state)
    }


    handleEmailModalState = (state) =>{
        this.props.handleEmailModalState(state)
    }

    

    render() {
        const { selectedStyleData, selectedStyleComps, selectedStyleInteriors } = this.props;
        const { isEstimateModalOpen } = this.state;
        return (
            <GmContext.Consumer>
                {GManger => {
                    if (!GManger) {
                        return null;
                    }
                    return (
                        <div>
                            <Row>
                                <Col offset={21} span={3}>
                                    <Button 
                                        style= {{marginRight:"10px"}} size={"large"} 
                                        type="primary" 
                                        shape="circle"
                                        icon={<UnorderedListOutlined />}
                                        onClick={() => this.handleModelState(true)}
                                    />
                                    <Button 
                                        style= {{marginRight:"10px"}}
                                        size={"large"}
                                        type="primary"
                                        shape="circle"
                                        icon={<FileTextOutlined />} 
                                        onClick={() => this.handleSubmitModelState(true)}
                                    />
                                    <Button 
                                        style= {{marginRight:"10px"}}
                                        size={"large"}
                                        type="primary"
                                        shape="circle" icon={<MailOutlined />} 
                                        onClick={() => this.handleEmailModalState(true)}
                                    />
                                    {/* <Button >
                                        <FontAwesomeIcon icon={faClone} />
                                    </Button> */}
                                </Col>
                            </Row>
                            <EstimateModal
                                isEstimateModalOpen={isEstimateModalOpen}
                                handleModelState={this.handleModelState}
                                selectedStyleData={selectedStyleData}
                                selectedStyleComps= {selectedStyleComps}
                                selectedStyleInteriors={selectedStyleInteriors}
                            />
                        </div>
                    )
                }}
            </GmContext.Consumer>
        )
    }
}
export default TopMenu;
