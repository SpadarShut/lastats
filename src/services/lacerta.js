export const checkStatus = () => {
  return fetch('https://europe-west3-lastats.cloudfunctions.net/saveStatusHttps')
}