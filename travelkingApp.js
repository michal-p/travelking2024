import flatpickr from 'flatpickr';

export class TravelkingApp {
  constructor() {
    this.elements = {
      checkAvailabilityBtn: document.getElementById("checkAvailabilityBtn"),
      roomInfo: document.getElementById("roomInfo"),
      loading: document.getElementById("loading"),
      errorMessage: document.getElementById("errorMessage"),
    };
    this.availabilityData = [];
    this.flatpickrInstance = null;
    this.initializeCalendar();
  }

  async initializeCalendar() {
    try {
      const data = await this.fetchAvailability();
      this.availabilityData = data;
      this.setupFlatpickr();
    } catch (error) {
      this.showError("Failed to fetch availability data.");
      console.error(error);
    }
  }

  showLoading() {
    this.elements.loading.style.visibility = "visible";
  }

  hideLoading() {
    this.elements.loading.style.visibility = "hidden";
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
  }

  async fetchAvailability() {
    this.showLoading();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    const startDate = new Date();

    const formattedStart = startDate.toISOString().split("T")[0];
    const formattedEnd = endDate.toISOString().split("T")[0];

    const apiURL = `https://api.travelcircus.net/hotels/17080/checkins?party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de&date_start=${formattedStart}&date_end=${formattedEnd}`;

    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      this.hideLoading();
      return data;
    } catch (error) {
      this.hideLoading();
      throw error;
    }
  }

  setupFlatpickr() {
    const availableDates = this.availabilityData._embedded.hotel_availabilities.map(
      (item) => item.date
    );
    this.flatpickrInstance = flatpickr(this.elements.checkAvailabilityBtn, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      maxDate: new Date().fp_incr(180),
      enable: availableDates,
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        const date = dayElem.dateObj.toISOString().split("T")[0];
        const dayData = this.availabilityData._embedded.hotel_availabilities.find(
          (item) => item.date === date
        );
        if (dayData) {
          dayElem.setAttribute(
            "title",
            `Price: ${dayData.price}€\nMin Nights: ${dayData.min_nights}`
          );
          if (dayData.price_position === "low") {
            dayElem.style.backgroundColor = "#d4edda";
          } else if (dayData.price_position === "medium") {
            dayElem.style.backgroundColor = "#fff3cd";
          } else if (dayData.price_position === "high") {
            dayElem.style.backgroundColor = "#f8d7da";
          }
        }
      },
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          this.elements.checkAvailabilityBtn.textContent = this.elements.checkAvailabilityBtn.value;
          this.confirmSelection();
        } else {
          this.elements.checkAvailabilityBtn.textContent = "Check Availability";
        }
      },
    });
  }

  confirmSelection() {
    const selectedRange = this.flatpickrInstance.selectedDates;
    if (selectedRange.length !== 2) {
      this.showError("Please select a check-in and check-out date.");
      return;
    }
    const checkIn = selectedRange[0].toISOString().split("T")[0];
    const checkOut = selectedRange[1].toISOString().split("T")[0];
    this.fetchRoomData(checkIn, checkOut);
  }

  async fetchRoomData(checkIn, checkOut) {
    this.showLoading();
    this.elements.errorMessage.textContent = "";
    this.elements.roomInfo.innerHTML = "";
    const apiURL = `https://api.travelcircus.net/hotels/17080/quotes?locale=de&checkin=${checkIn}&checkout=${checkOut}&party=%7B%22adults%22:2,%22children%22:%5B%5D%7D&domain=de`;

    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const rooms = await response.json();
      this.hideLoading();
      this.displayRooms(rooms);
    } catch (error) {
      this.hideLoading();
      this.showError("Failed to fetch room data.");
      console.error(error);
    }
  }

  displayRooms(rooms) {
    if (rooms.length === 0) {
      this.showError("No rooms available for the selected dates.");
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
