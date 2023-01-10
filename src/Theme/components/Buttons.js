import { StyleSheet } from 'react-native'

export default function ({ Colors, Gutters, Layout }) {
  const base = {
    ...Layout.center,
    ...Gutters.largeHPadding,
    height: 40,
    backgroundColor: Colors.primary,
  }
  const rounded = {
    ...base,
    borderRadius: 65,
  }

  return StyleSheet.create({
    base,
    rounded,
    outline: {
      ...base,
      backgroundColor: Colors.transparent,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    outlineRounded: {
      ...rounded,
      backgroundColor: Colors.transparent,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
	solidBackgroundPrimary: {
		...base,
		backgroundColor: Colors.primary,
		marginLeft: 5,
		marginRight: 5,
	},
	solidBackgroundSecondary: {
		...base,
		backgroundColor: Colors.secondary,
		marginLeft: 5,
		marginRight: 5,
	},
  solidBackgroundWhite: {
		...base,
		backgroundColor: Colors.white,
		marginLeft: 5,
		marginRight: 5,
	},
  })
}
