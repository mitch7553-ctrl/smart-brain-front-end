# Smart Brain Front-End

This is the front-end application for Smart Brain, an interactive web app that detects faces in images using the Clarifai API.

## Features
- **User Authentication**: Secure sign-in and registration pages
- **Image Submission**: Users can submit image URLs for processing
- **Facial Recognition**: The app draws a bounding box around detected faces
- **Rank/Entries Tracker**: Keeps track of how many images each user has submitted
- **Responsive UI**: Built with Tachyons CSS for a clean, responsive layout
- **Interactive Background**: Animated particle background using `particles-bg`

## Tech Stack
- **React**: Frontend library for building the UI components
- **Tachyons CSS**: Functional CSS toolkit for styling
- **React-Tilt**: For adding a 3D tilt effect to the application logo
- **Particles-bg**: For the animated background
- **Clarifai API**: (Integrated via backend) For face detection

## Components
- `FaceRecognition`: Renders the image and the bounding box over detected faces
- `ImageLinkForm`: Input field and submit button for image URLs
- `Logo`: Application logo with tilt effect
- `Navigation`: Top navigation bar with Sign In / Sign Out links
- `Rank`: Displays the user's name and their current entry count
- `Register`: New user registration form
- `Signin`: Existing user sign-in form

## Setup and Installation

1. Clone the repository
2. Navigate to the `facialrecognition` directory
3. Run `npm install` to install dependencies
4. Run `npm start` to launch the development server

## Backend Integration
This front-end connects to the Smart Brain Backend API for user authentication, database updates, and secure Clarifai API calls.
