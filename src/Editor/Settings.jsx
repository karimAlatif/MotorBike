import React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import {GmContext} from './index';

class EditorSettings extends React.Component {
    state = {
        widthInputText: "150",
        lengthInputText: "150",
    };

    handleModalStatus = status => {
        this.props.setSettingsModalStatus(status);
    }

    handleModalConfirm = (GManager) => {
        const {widthInputText, lengthInputText} = this.state;
        GManager.studioSceneManager.UpdateGridProperties(widthInputText, lengthInputText);
        this.props.setSettingsModalStatus(false);
    }

    handleInputsChange(inputType, value){
            switch (inputType) {
                case "width":
                    this.setState({
                        widthInputText: value
                    })
                break;
                case "length":
                    this.setState({
                        lengthInputText: value
                    })
                break;
                default:
                    break;
            }
    }

    render() {
        const {isSettingsModalOpen} = this.props;
        const {widthInputText, lengthInputText} = this.state;
        return (
            <GmContext.Consumer>
            {GManager => {
                return(
                    <Modal onCancel={() => this.handleModalStatus(false)}
                        onOk={() => this.handleModalConfirm(GManager)}
                        visible={isSettingsModalOpen}
                        title="Grid Properties"
                    >
                        <Row gutter={8}>
                            <Col span={5}>
                                <p>Width </p>
                                <Input type="number" value={widthInputText}  onChange ={({target}) => this.handleInputsChange("width", target.value)} />
                            </Col>
                            <Col span={8}>
                                <p>Length </p>
                                <Input type="number" defaultValue={lengthInputText} onChange ={({target}) => this.handleInputsChange("length", target.value)} />
                            </Col>
                        </Row>   
                    </Modal>
                )
            }}
        </GmContext.Consumer>
        )
    }
}

export default EditorSettings;