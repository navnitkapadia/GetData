import { MQTT_MESSAGE_RECEIVED } from "../actions/types";

const initialState = {
    sensor1: {
      },
      sensor2: {
      },
      sensor3: {
      },
      sensor4: {
      }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SENSOR_1:
            return {
                ...state,
                sensor1: action.payload
            };
        case SENSOR_2:
            return {
                ...state,
                sensor2: action.payload
            };
        case SENSOR_3:
            return {
                ...state,
                sensor3: action.payload
            };
        case SENSOR_4:
            return {
                ...state,
                sensor4: action.payload
            };
        default:
            return state;
    }
}
