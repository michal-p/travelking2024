import flatpickr from 'flatpickr';
import { format } from 'date-fns';
import { showLoading, hideLoading, showError, maxDate } from '../utils/helpers.js';

export class CalendarManager {
  constructor(elements, BASE_API_URL, runRoomManager) {
    this.runRoomManager = runRoomManager;
    this.elements = elements;
    this.flatpickrInstance = null;
    this.initializeCalendar(BASE_API_URL);
  }

  initializeCalendar = async (baseUrl) => {
    try {
      const data = await this.fetchAvailability(baseUrl);
      this.setupFlatpickr(data);
    } catch (error) {
      showError(this.elements.errorMessage, "Failed to fetch availability data.");
      console.error(error);
    }
  }

  fetchAvailability = async (url) => {
    showLoading(this.elements.loading);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    const startDate = new Date();

    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');

    const apiURL = `${url}&date_start=${formattedStart}&date_end=${formattedEnd}`;

    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (!data || !data._embedded || !data._embedded.hotel_availabilities) {
        hideLoading(this.elements.loading);
        throw new Error("Invalid data structure received from API.");
      }
      hideLoading(this.elements.loading);
      return data;
    } catch (error) {
      hideLoading(this.elements.loading);
      throw error;
    }
  }

  setupFlatpickr = (data) => {
    this.flatpickrInstance = flatpickr(this.elements.checkAvailabilityBtn, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      maxDate: maxDate(180),
      enable: data._embedded.hotel_availabilities.map(
        (item) => item.date
      ),
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        this.decorateDayElement(dayElem, data);
      },
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          this.elements.checkAvailabilityBtn.textContent = this.elements.checkAvailabilityBtn.value;
          this.runRoomManager(this.confirmSelection());
        } else {
          this.elements.checkAvailabilityBtn.textContent = "Check Availability";
        }
      },
    });
  }

  decorateDayElement = (dayElem, data) => {
    const date = format(dayElem.dateObj, 'yyyy-MM-dd');
    const dayData = data._embedded.hotel_availabilities.find(
      (item) => item.date === format(date, 'yyyy-MM-dd')
    );
    if (dayData) {
      dayElem.setAttribute(
        "title",
        `Price: ${dayData.price}€\nMin Nights: ${dayData.min_nights}`
      );
      this.setDayElementStyle(dayElem, dayData.price_position);
    }
  }

  setDayElementStyle = (dayElem, pricePosition) => {
    dayElem.classList.remove("low-price", "medium-price", "high-price");
    if (pricePosition === "low") {
        dayElem.classList.add("low-price");
    } else if (pricePosition === "medium") {
        dayElem.classList.add("medium-price");
    } else if (pricePosition === "high") {
        dayElem.classList.add("high-price");
    }
}

  confirmSelection = () => {
    try {
      const selectedRange = this.flatpickrInstance.selectedDates;
      if (selectedRange.length !== 2) {
        showError(this.elements.errorMessage, "Please select a check-in and check-out date.");
        return;
      }
      const checkIn = format(selectedRange[0], 'yyyy-MM-dd');
      const checkOut = format(selectedRange[1], 'yyyy-MM-dd');
      return ({ checkIn, checkOut });
    } catch (error) {
      showError(this.elements.errorMessage, error.message || "Failed to confirm selection.");
    }
  }
}
