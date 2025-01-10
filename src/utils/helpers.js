export const showLoading = (element) => {
  element.classList.add("visible");
  element.classList.remove("hidden");
};

export const hideLoading = (element) => {
  element.classList.add("hidden");
  element.classList.remove("visible");
};

export const showError = (element, message) => {
  element.textContent = message;
};

export const maxDate = (numberOdDays) => {
  const date = new Date();
  date.setDate(date.getDate() + numberOdDays);
  return date;
}
