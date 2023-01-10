/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function () {
	
  return {
    logo: require('@/Assets/Images/TOM.png'),
	  bg: require('@/Assets/Images/bg.png'),
	  zf_logo: require('@/Assets/Images/zoomdark.png'),
	  zf_logo_light: require('@/Assets/Images/zoomlight.png'),
    prepaid_indicator: require('@/Assets/Images/prepaid.png'),
    business_indicator: require('@/Assets/Images/Business.png'),
    residential_indicator: require('@/Assets/Images/Residential.png'),
    prepaid_icon: require('@/Assets/Images/prepaid_icon.png'),
    residential_icon: require('@/Assets/Images/residential_icon.png'),
    business_icon: require('@/Assets/Images/business_icon.png'),
    google_logo: require('@/Assets/Images/google_logo.png'),
  }
}
