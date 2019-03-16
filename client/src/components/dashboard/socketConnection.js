import socketIOClient from 'socket.io-client'
import config from '../../config/config';
const socket = socketIOClient(config.soketIoUrl);
function connectSocket(cb) {
  // listen for any messages coming through
  // of type 'chat' and then trigger the 
  // callback function with said message
  socket.on('chart', (message) => {
    // console.log the message for posterity
    // trigger the callback passed in when
    // our App component calls connect
    cb(message);
  })
}

export { connectSocket }
