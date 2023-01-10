 export const Config = {
  DEFAULT_URL: '',
  API_URL: 'https://jsonplaceholder.typicode.com/',
  RESELLER_API_URL: 'https://lara.zoomfibre.co.za/zf_reseller_generator/',
  GOOGLE_PLACES_API_URL: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  GOOGLE_PLACES_DETAILS_API_URL: 'https://maps.googleapis.com/maps/api/place/details/json',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBbkpfFBYsjBdbY7ukJzeSUetQ13jfLG3Q',
  AEX_API_URL: 'https://lara.zoomfibre.co.za/aex_api/',
  //AEX_API_URL: 'https://www.zoomfibre.co.za/aex_api/',
  GOOGLE_OAUTH_CLIENT_ID: '704116453469-v96u9qj4f5b3q9hjbie34844m4hou12s.apps.googleusercontent.com',
  GOOGLE_SIGN_IN_CONFIG: {//androidClientId: '704116453469-9240mqntjp8cueaj57odiqrbpkcm819u.apps.googleusercontent.com',
    //iosClientId: 'ADD_YOUR_iOS_CLIENT_ID_HERE',
    webClientId: this.GOOGLE_OAUTH_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
    offlineAccess: false,
    hostedDomain: 'zoomfibre.co.za',
    forceCodeForRefreshToken: true,},
}
