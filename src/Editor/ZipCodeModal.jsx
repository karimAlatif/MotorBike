import React from 'react';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import {Typography, Input, Button} from 'antd';
import Form from 'antd/es/form';


const { Text } = Typography;
const {Item :FormItem} = Form;

function ZipCodeModal(props){
    const [form] = Form.useForm();
    const {isZipModelOpen, onConfirmState} = props ;

    const renderFooterData=()=>{
        return <React.Fragment>
                <Button
                  size="default"
                  type="primary"
                  onClick={() => {handleModalConfirm()}}
                >
                  START BUILDING
                </Button>
            </React.Fragment>
    }
    
    
    const  handleModalConfirm = () => {
        form
        .validateFields()
        .then(formData => {
            let onCallBackError =()=>{
                form.setFields([
                    {
                        name: 'ZipCode',
                        errors: ['Our buildings are not currently available in your area. Please contact us for a referral'],
                    },
                ]);
            };
          onConfirmState(formData, onCallBackError);
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    } 
    return (
        isZipModelOpen &&
            <Modal
                // onOk={() => renderFooterData()}
                footer={renderFooterData()}
                closable={false}
                destroyOnClose
                visible={isZipModelOpen}
                title= 'Enter Delivery Zip Code'
                width= {600}
                style={{marginTop:"7%"}}
            >

                {/* ZipCode */}
                <Row >
                    <Col span={24} style={{ marginTop:"5px"}}>
                        <Text 
                            strong
                            style={{fontSize:"15px"}}
                        >
                            Provide the delivery ZIP code to view the buildings available in your area :
                        </Text>
                    </Col>
                </Row>
                <Row>
                    <Form
                        form={form}
                        name="ZipCodeForm"
                        style={{height:"50px",width:"100%"}}
                    >
                        <Col span={24} style={{ marginTop:"8px"}} >
                            <FormItem
                                name="ZipCode"
                                rules={[
                                    {
                                    required: true,
                                    message: 'ZIPCode is Messing !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Delivery ZIP Code"
                                    />
                                }
                            </FormItem>
                        </Col>
                    </Form>

                </Row>
            </Modal>
    )
}
export default ZipCodeModal;