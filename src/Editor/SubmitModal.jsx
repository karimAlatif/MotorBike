import React from 'react';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import {Typography, Input, Button, Select} from 'antd';
import Form from 'antd/es/form';


const { Text } = Typography;
const {Item :FormItem} = Form;

const countries =
[ 
    {name: 'Afghanistan', code: 'AF'}, 
    {name: 'Austria', code: 'AT'}, 
    {name: 'Azerbaijan', code: 'AZ'}, 
    {name: 'Barbados', code: 'BB'}, 
    {name: 'Christmas Island', code: 'CX'}, 
    {name: 'Croatia', code: 'HR'}, 
    {name: 'Cuba', code: 'CU'}, 
    {name: 'Dominican Republic', code: 'DO'}, 
    {name: 'Ecuador', code: 'EC'}, 
    {name: 'Egypt', code: 'EG'}, 
]
function SubmitModal(props){
    const [form] = Form.useForm();
    const {isSubmitModalOpen, onDataSubmit, submitModelState} = props ;
    

    const getCountries=()=>{
       return countries.map((country)=>{
            return <Select.Option key={country.code} value={country.code}>{country.name}</Select.Option>
        })
    }

    const handleCancel = e => {
        submitModelState(false)
        form.resetFields();
    };

    const handleModalConfirm = () => {
        form
        .validateFields()
        .then(formData => {
            onDataSubmit(formData);
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    }

    return (
        isSubmitModalOpen &&
            <Modal
                onCancel={() => handleCancel()}
                onOk={() => handleModalConfirm()}
                okText={"SUBMIT"}
                destroyOnClose
                visible={isSubmitModalOpen}
                title= 'Submit for Final Quote'
                width= {800}
                style={{marginTop:"-1%"}}
            >

                {/* ZipCode */}
                <Row style={{marginBottom:"20px"}}>
                    <Col span={24} >
                        <Text 
                            style={{fontSize:"15px", fontWeight:"300"}}
                        >
                            We will contact you within three (3) business days to confirm your design and options and provide you with a final quote,
                            which may include discounts, promotions, taxes, and delivery.
                        </Text>
                    </Col>
                </Row>
                <Form
                    form={form}
                    name="SubmitForm"
                    style={{width:"100%"}}
                    initialValues={{
                        Country:countries[0].code,
                    }}
                >
                    {/* First && Last */}
                    <Row style={{ marginTop:"8px"}}>
                        <Col span={11} >
                            <FormItem
                                name="FirstName"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="First Name*"
                                    />
                                }
                            </FormItem>
                        </Col>
                        <Col offset={1} span={12} >
                            <FormItem
                                name="LastName"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Last Name*"
                                    />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {/* Address && ZipCode */}
                    <Row style={{ marginTop:"5px"}}>
                        <Col span={11} >
                            <FormItem
                                name="DeliveryAddress"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Delivery Address*"
                                    />
                                }
                            </FormItem>
                        </Col>
                        <Col offset={1} span={12} >
                            <FormItem
                                name="DeliveryZIPCode"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Delivery ZIP Code*"
                                    />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {/* City && Country */}
                    <Row style={{ marginTop:"5px"}}> 
                        <Col span={11}  >
                            <FormItem
                                name="DeliveryCity"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Delivery City*"
                                    />
                                }
                            </FormItem>
                        </Col>
                        <Col offset={1} span={12} >
                            <FormItem
                                name="Country"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Select>
                                        {getCountries()}
                                    </Select>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {/* Phone && Email */}
                    <Row style={{ marginTop:"5px"}}>
                        <Col span={11}  >
                            <FormItem
                                name="Phone"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Phone*"
                                    />
                                }
                            </FormItem>
                        </Col>
                        <Col offset={1} span={12} >
                            <FormItem
                                name="Email"
                                rules={[
                                    {
                                    required: true,
                                    message: 'Required !',
                                    },
                                ]}
                                style ={{
                                    width:"100%",
                                }}
                            >
                                {
                                    <Input
                                        type="text"
                                        placeholder="Email*"
                                    />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    
                </Form>

            </Modal>
    )
}
export default SubmitModal;