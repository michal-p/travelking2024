import { showLoading, hideLoading, showError } from '../utils/helpers.js';

export class RoomManager {
  constructor(elements, BASE_API_URL, checkIn, checkOut) {
    if (!elements.loading || !elements.errorMessage || !elements.roomInfo) {
      throw new Error("Missing required html elements.");
    }
    this.elements = elements;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.fetchRoomData(BASE_API_URL);
  }

  fetchRoomData = async (url) => {
    showLoading(this.elements.loading);
    this.elements.errorMessage.textContent = "";
    this.elements.roomInfo.innerHTML = "";
    const apiURL = `${url}&checkin=${this.checkIn}&checkout=${this.checkOut}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      if (!response.ok) {
        const errorData = data;
        throw new Error(errorData.error.message);
      }
      const rooms = data;
      hideLoading(this.elements.loading);
      this.displayRooms(rooms);
    } catch (error) {
      hideLoading(this.elements.loading);
      showError(this.elements.errorMessage, error.message || "Failed to fetch room data.");
      console.error(error);
    }
  }

  displayRooms = (rooms) => {
    if (rooms.length === 0) {
      showError(this.elements.errorMessage, "No rooms available for the selected dates.");
      return;
    }

    rooms._embedded.hotel_quotes.forEach((room) => {
      const roomDiv = document.createElement("div");
      roomDiv.classList.add("room");

      const roomName = document.createElement("h3");
      roomName.textContent = room.name || "Standard Room";

      const roomDetails = document.createElement("p");
      roomDetails.innerHTML = `
        <strong>Price:</strong> ${room.full_formatted_price}<br>
        <strong>Breakfast Included:</strong> ${room.breakfast ? "Yes" : "No"}<br>
        <strong>Beds:</strong> ${room.beds || "N/A"}<br>
        <strong>Max Occupancy:</strong> ${room.max_occupancy || "N/A"}
      `;

      roomDiv.appendChild(roomName);
      roomDiv.appendChild(roomDetails);
      this.elements.roomInfo.appendChild(roomDiv);
    });
  }
}
