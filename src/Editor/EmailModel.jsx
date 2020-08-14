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
function EmailModel(props){
    const [form] = Form.useForm();
    const {isEmailModalOpen, onEmailDataSubmit, handleEmailModalState} = props ;
    

    const getCountries=()=>{
       return countries.map((country)=>{
            return <Select.Option key={country.code} value={country.code}>{country.name}</Select.Option>
        })
    }

    const handleCancel = e => {
        handleEmailModalState(false)
        form.resetFields();
    };

    const handleModalConfirm = () => {
        form
        .validateFields()
        .then(formData => {
            onEmailDataSubmit(formData);
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    }

    return (
        isEmailModalOpen &&
            <Modal
                onCancel={() => handleCancel()}
                onOk={() => handleModalConfirm()}
                okText={"EMAIL LINK"}
                destroyOnClose
                visible={isEmailModalOpen}
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
                    {/* DeliveryZIPCode && DeliveryCity */}
                    <Row style={{ marginTop:"5px"}}>
                        <Col span={11} >
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
                        <Col offset={1} span={12} >
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
                    </Row>
                    {/* Country && Phone */}
                    <Row style={{ marginTop:"5px"}}> 
                        <Col span={11}  >
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
                        <Col offset={1} span={12} >
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
                    </Row>
                    {/* Email */}
                    <Row style={{ marginTop:"5px"}}>
                        <Col span={11}  >
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
export default EmailModel;