import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/Hooks'
import { useReseller } from '@/Hooks'
import { setReseller } from '@/Store/Reseller'
import { clearReseller } from '@/Store/Reseller'
import CheckBox from 'react-native-just-checkbox'
import ProgressBar from 'react-native-animated-progress'
import Toast, {BaseToast, ErrorToast } from 'react-native-toast-message';


export default function (initialstate = {}, validations = [], ) {

	// const {isValid: initialIsValid, errors: initialErrors} = validate(validations, initialState);
	 // const [inputs, setInputs] = useState(initialState);
	 // const [errors, setErrors] = useState(initialErrors);
     // const [isValid, setValid] = useState(initialIsValid);
	// const changeHandler = event => {
    // const newInputs = {...inputs, [event.target.name]: event.target.value};
    // const {isValid, errors} = validate(validations, newInputs);
    // setInputs(newInputs);
    // setValid(isValid);
    // setErrors(errors);
  // };
 // return {
	    // inputs, changeHandler, isValid, errors 
	// };
  }; 
  
  
function validate(validations, inputs) {
  const errors = validations
    .map(validation => validation(inputs))
    .filter(validation => typeof validation === 'object');
	
  return {isValid: errors.length === 0, errors: errors.reduce((errors, error) => ({...errors, ...error}), {})};
}
	

  


