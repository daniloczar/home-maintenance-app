# HOME MAINTENANCE

## Overview

This project is built using React Native and Firebase to facilitate services availability for House Holders. Users will be of 2 types; Service Providers and House Holders, who can create and edit profiles. 

Householders can post jobs, accept & delete bids, leave reviews for a service, book/message a Service Provider through an integrated chat system, view the jobs posted and the service providers available.

Service Providers can view all the available jobs, bid on them once, edit or delete their bid, view the jobs they have bid on, view and update their services.

The application includes map integration, allowing users to view available providers and jobs on a map. Users can book services directly through the map interface, enhancing the user experience by providing a visual representation of service locations.

## Features

- User Authentication
- Profile Management
- Service Listing and Booking
- Rating and Reviews
- Real-time Chat
- Map Integration for Viewing and Booking Services

## Prerequisites

Ensure you have the following versions installed:

- React Native (Expo): `13.6.8`
- Node.js: `v21.6.1`
- Firebase: `firebase@10.12.2`

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Home-Maintenance/home-maintenance-app.git
    ```
2. Navigate to the project directory:
    ```sh
    cd your-repository
    ```
3. Install dependencies:
    ```sh
    npx expo install
    ```
4. Set up Firebase:
    - Create a Firebase project.
    - Add your Firebase configuration to a file named `FirebaseConfig.js`.

## Usage

1. Start the development server:
    ```sh
    npx expo start
    ```
2. Run the app on your device or emulator:
    - For Android:
        ```sh
        npx expo run:android
        ```
    - For iOS:
        ```sh
        npx expo run:ios
        ```


## Features We Would Like to Add in a Future Sprint

- A search bar to allow users to make more detailed job and service searches.
- Job completion status functionality to confirm when a job has been successfully completed.
- Enhancing user profiles with more detailed information.
- Implementing push notifications for real-time updates.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-name
    ```
3. Make your changes.
4. Commit your changes:
    ```sh
    git commit -m 'Add feature'
    ```
5. Push to the branch:
    ```sh
    git push origin feature-name
    ```
6. Create a pull request.

## Acknowledgements

This project belongs to NorthCoders. We would like to thank NorthCoders for their support and resources provided throughout the development of this project. For more information, visit [NorthCoders](https://northcoders.com).
