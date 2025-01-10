import { CalendarManager } from './components/calendarManager.js';
import { RoomManager } from './components/roomManager.js';

const AVAILABILITIES_API_URL = "https://api.travelcircus.net/hotels/17080/quotes?locale=de&party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de";
const CHECKINS_API_URL = "https://api.travelcircus.net/hotels/17080/checkins?party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de";

export class TravelkingApp {
  constructor() {
    this.elements = {
      checkAvailabilityBtn: document.getElementById("checkAvailabilityBtn"),
      roomInfo: document.getElementById("roomInfo"),
      loading: document.getElementById("loading"),
      errorMessage: document.getElementById("errorMessage"),
    };
    this.init();
  }

  init = () => {
    this.calendarManager = new CalendarManager(this.elements, CHECKINS_API_URL, this.runRoomManager);
  }

  runRoomManager = ({ checkIn, checkOut}) => {
    this.roomManager = new RoomManager(this.elements, AVAILABILITIES_API_URL, checkIn, checkOut);
  }
}
