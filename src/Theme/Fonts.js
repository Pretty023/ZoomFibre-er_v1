/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ FontSize, Colors }) {
  return StyleSheet.create({
	textTiny: {
      fontSize: FontSize.tiny,
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.text,
	  fontFamily: "Montserrat-Regular",
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
	whiteTextRegular: {
		color: Colors.white,
		fontSize: FontSize.regular,
	},
	white_text: {
		color: '#ffffff'
	},
	black_text: {
		color: Colors.black
	},
	montserrat_regular: {
		fontFamily: "Montserrat-Regular",
	},
	montserrat_bold: {
		fontFamily: "Montserrat-Bold",
	},
	montserrat_italic: {
		fontFamily: "Montserrat-Italic",
	},
  })
}
