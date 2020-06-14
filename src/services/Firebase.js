import * as firebase from "firebase/app";
import "firebase/firestore";
import React from "react"
import { useCollectionData } from 'react-firebase-hooks/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAuJpDa2F6jUWFs7lVQBakFEcydtyddYQM",
  authDomain: "lastats.firebaseapp.com",
  databaseURL: "https://lastats.firebaseio.com",
  projectId: "lastats",
  storageBucket: "lastats.appspot.com",
  messagingSenderId: "450437294925",
  appId: "1:450437294925:web:6e94f612ab36e4f83da504"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const RATE = 2.5;

function useEmissions() {
  const [emissions, loading, err] = useCollectionData(db.collection('emissions'))
  if ((emissions && !emissions.length)) {
    debugger;
  }
  const emissionsObj = React.useMemo(
    () => !emissions || !emissions.length
      ? null
      : emissions.reduce(
        (acc, em) => ({ ...acc, [em.id]: em }), {}
      ),
    [emissions]
  );
  return [emissionsObj, loading, err]
}

function useEmission(id) {
  const [e] = useEmissions()
  if (!e) {
    return null;
  }
  return e[id] || null
}

function useStatuses (){
  const [statuses, sLoading, sErr] = useCollectionData(db.collection('statuses'), {idField: 'id'})
  const [emissionsObj, eLoading, eErr] = useEmissions()
  const errors = [sErr, eErr].filter(e => !!e)
  const loading = sLoading || eLoading;

  return React.useMemo(() => {
    if (!statuses || !emissionsObj) {
      return [null, loading, errors]
    }

    return [
      groupStatusesByEmission(statuses),
      loading,
      errors
    ];
  }, [statuses, emissionsObj, errors, loading]);
}

function getPriceInUSD(bondsCount, emission, st) {
  if (!emission) {
    console.log('Unknown emission', st.id)
    return 0;
  }
  if (emission.currency_type === 'USD') {
    return bondsCount * RATE
  }
  return bondsCount * emission.computed_price / RATE
}

function groupStatusesByEmission(statuses) {
  return Object
    .entries(
      statuses.reduce(
        (acc, dayStatus) => {
          dayStatus = {...dayStatus}
          const time = dayStatus.id;
          delete dayStatus.id;

          Object
            .values(dayStatus)
            .forEach((emisStatus) => {
              acc[emisStatus.id] = acc[emisStatus.id] || [];
              acc[emisStatus.id].push({...emisStatus, time})
            })
          return acc
      }, {})
    )
    .map(
      ([id, data]) => ({id, data})
    )
}

export {
  useEmissions,
  useEmission,
  useStatuses,
  getPriceInUSD,
}
