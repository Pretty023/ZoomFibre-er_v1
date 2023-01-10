import React from 'react'
import PropTypes from 'prop-types'
import { View, Image } from 'react-native'
import { useTheme } from '@/Hooks'
import { useRoute } from '@react-navigation/native'

const DarkBrand = ({ height, width, mode }) => {
  const { Layout, Images } = useTheme()
  const route = useRoute();

  return (
    <View style={{ height, width }} onLayout={event => {
		const layout = event.nativeEvent.layout;
		if(route.name=="Startup"){
			global.logo_default_y = layout.y;
		}//if
	  }}>
      <Image style={Layout.fullSize} source={Images.zf_logo} resizeMode={mode} />
    </View>
  )
}

DarkBrand.propTypes = {
  height: PropTypes.number,
  mode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'repeat', 'center']),
  width: PropTypes.number,
}

DarkBrand.defaultProps = {
  height: 200,
  mode: 'contain',
  width: 200,
}

export default DarkBrand
