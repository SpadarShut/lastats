import React from 'react';
import '../../tailwind.generated.css';
import './App.css';
import * as FirestoreService from '../../services/Firebase'
import { Settings } from '../settings/Settings'
// import {useAppState} from "./appStateContext"
import Chart from "../charts/Chart"

function App() {
  const [data, loading, errors] = FirestoreService.useStatuses()

  return (
    loading ?
      <div className="h-full flex items-center justify-center p-4">Loading...</div>
      :
      <div className="flex-row h-full items-stretch">
        <div className="Settings p-4 flex-shrink-0 overflow-y-auto">
          <Settings/>
          {
            !!errors.length &&
            <div>
              {errors.map(e => (<p>{e.toString()}</p>))}
            </div>
          }
        </div>
        <div className="relative flex-grow flex-shrink">
          <Chart/>
        </div>
      </div>
  );
}

export default App;
