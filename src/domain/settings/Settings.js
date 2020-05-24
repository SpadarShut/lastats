import React from 'react'
import {useAppState} from '../app/appStateContext'
import EmissionData from "../../components/EmissionData"
import FiltersView from '../filters/FiltersView'
import CheckNow from './CheckNow'
// import { Form, Field } from 'react-final-form'

const Settings = () => {
  const [appState] = useAppState();
  const {selectedEmissionId } = appState;

  return (
    <div className="">
      <FiltersView />
      {
        selectedEmissionId &&
          <EmissionData emissionId={selectedEmissionId}/>
      }
      <CheckNow/>
    </div>
  )
}

export {Settings}
