import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons/faLocationCrosshairs'
import { faMapLocation } from '@fortawesome/free-solid-svg-icons/faMapLocation'
import { faHouseSignal } from '@fortawesome/free-solid-svg-icons/faHouseSignal'
import { faSlash } from '@fortawesome/free-solid-svg-icons/faSlash'
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons/faPersonDigging'
import { faHouseCircleExclamation } from '@fortawesome/free-solid-svg-icons/faHouseCircleExclamation'
import { faInfinity } from '@fortawesome/free-solid-svg-icons/faInfinity'
import { faCircleDown } from '@fortawesome/free-solid-svg-icons/faCircleDown'
import { faCircleUp } from '@fortawesome/free-solid-svg-icons/faCircleUp'
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons/faCloudArrowDown'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons/faCloudArrowUp'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo'
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons/faCircleChevronRight'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faFileImport } from '@fortawesome/free-solid-svg-icons/faFileImport'
import { faSignature } from '@fortawesome/free-solid-svg-icons/faSignature'
import { faPenNib } from '@fortawesome/free-solid-svg-icons/faPenNib'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage'
import { fa1 } from '@fortawesome/free-solid-svg-icons/fa1'
import { fa2 } from '@fortawesome/free-solid-svg-icons/fa2'
import { fa3 } from '@fortawesome/free-solid-svg-icons/fa3'
import { fa4 } from '@fortawesome/free-solid-svg-icons/fa4'
import { fa5 } from '@fortawesome/free-solid-svg-icons/fa5'
import { fa6 } from '@fortawesome/free-solid-svg-icons/fa6'
import { fa7 } from '@fortawesome/free-solid-svg-icons/fa7'
import { fa8 } from '@fortawesome/free-solid-svg-icons/fa8'
import { fa9 } from '@fortawesome/free-solid-svg-icons/fa9'
import { fa0 } from '@fortawesome/free-solid-svg-icons/fa0'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { faIdBadge } from '@fortawesome/free-solid-svg-icons/faIdBadge'
import { faReceipt } from '@fortawesome/free-solid-svg-icons/faReceipt'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice'





library.add(fab, faAngleLeft, faArrowLeft, faCircleUser, faLocationDot, faCircleCheck, faCircleXmark, faAsterisk, faTimes, faCircleExclamation, faLocationCrosshairs, faMapLocation, faHouseSignal, faSlash, faPersonDigging, faHouseCircleExclamation, faInfinity, faCircleDown, faCircleUp, faCloudArrowDown, faCircleInfo, faCircleChevronRight, faCloudArrowUp, faArrowUp, faArrowDown, faFileImport, faSignature, faPenNib, faCamera,faEdit, faFileImage, fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9, faIdCard, faIdBadge, faReceipt, faFileInvoice)


const App = () => (
	
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApplicationNavigator />
    </PersistGate>
  </Provider>
)

export default App
