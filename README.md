# Travelking 2024 Front-End Developer Challenge

This repository contains the implementation of the Travelking 2024 Front-End Developer Challenge. It showcases the availability and pricing of stays over a 6-month period using vanilla JavaScript and the Flatpickr library.

## Features

- **Availability Check:** Users can check availability for the next 6 months for 2 adults.
- **Interactive Calendar:** Integrates Flatpickr for date selection with visual cues based on pricing.
- **Room Selection:** After selecting dates, available rooms are displayed with relevant details.
- **Responsive Design:** Ensures usability across various device sizes.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- [Flatpickr](https://flatpickr.js.org/) for the calendar component

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) (which includes npm).
- You have a modern web browser installed.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/travelking2024.git
    ```

2. Navigate to the project directory:
    ```bash
    cd travelking2024
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

## Running the Project

To run the project locally, follow these steps:

1. Start the development server:
    ```bash
    npm start
    ```

2. Open your web browser and navigate to:
    ```
    http://localhost:9000
    ```

## Building the Project

To build the project for production, run:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/`: Contains the source code.
  - `index.js`: Entry point of the application.
  - `travelkingApp.js`: Main application logic.
  - `components/`: Contains the components used in the application.
  - `styles/`: Contains the SCSS styles.
  - `templates/`: Contains the Pug templates.
- `dist/`: Contains the built files.
- `index.html`: The main HTML file.
- `webpack.config.js`: Webpack configuration file.
- `package.json`: Project configuration and dependencies.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Michal Puchy