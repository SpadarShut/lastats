import React from 'react';
import './App.css';
import * as FirestoreService from './services/firebase'

function App() {
  const [statuses, setStatuses] = React.useState();
  const [emissions, setEmission] = React.useState();
  const [issuers, setIssuers] = React.useState();

  React.useEffect(async () => {
    const statuses = await FirestoreService.getData();

  })

  return (
    <div className="App">
      {}
    </div>
  );
}

export default App;
