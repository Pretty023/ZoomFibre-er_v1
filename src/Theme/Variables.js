/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  // Example colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  text: '#212529',
  primary: '#178FC4',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ff661a',
  secondary: '#F05636',
  semi_trans_white: 'rgba(255,255,255,0.6)',
  semi_trans_black: 'rgba(0,0,0,0.6)',
  thirty_trans_black: 'rgba(0,0,0,0.3)',
  solitude: '#E9ECF4',
  black: '#242424',
  primary_gradient_start: '#178FC4',
  primary_gradient_mid: '#023C53',
  primary_gradient_end: '#314755',
  trans_black: 'rgba(0,0,0,0)',
  light_gray: 'rgba(0,0,0,0.2)',
  //dark_white: 'rgba(0,0,0,0.005)',
  dark_white: '#f4f4f5',
}

export const NavigationColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
}

/**
 * FontSize
 */
export const FontSize = {
  tiny: 10,
  small: 12,
  regular: 14,
  large: 30,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 2 // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
}

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
}
