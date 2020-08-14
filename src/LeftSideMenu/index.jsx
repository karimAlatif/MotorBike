import React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import {GmContext} from '../Editor/';
import { Tabs } from 'antd';
import { BuildOutlined , FullscreenOutlined, WindowsOutlined  ,BgColorsOutlined,SendOutlined, GatewayOutlined   } from '@ant-design/icons';



const { TabPane } = Tabs;
class LeftSideMenu extends React.Component {
    render() {
        const {styles, initInteriorData} = this.props;
        return (      
            <GmContext.Consumer>
                {GManger => {
                    if (!GManger) {
                        return null;
                    }
                    return (  
                      <React.Fragment>

                      </React.Fragment>    
                    )
                }}
            </GmContext.Consumer>
        )
    }
}
export default LeftSideMenu;


{/* <AppleOutlined
style={{
  position:"absolute",
  zIndex:1,
  marginTop:"9px"
}}
/>
<Avatar
size={38}
style={{
  marginLeft:"-8px"
}}
></Avatar> */}