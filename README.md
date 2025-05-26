# Holidaze

This is a React-based web application for browsing, creating, and booking venues. It features user authentication, profile management, and a clean, navigable interface using React Router.

## 🚀 Features

- Home page with navigation layout
- User login and profile pages
- Browse and search venues
- View single venue details
- Create, edit, and preview venues
- Book venues and manage bookings

## 🛠️ Tech Stack

- **React** (Vite)
- **React Router**
- **JavaScript**
- **Tailwind**

## 📦 Installation

npm install

## 🧪 Running the App

npm run dev

## 📁 File Structure

holidaze/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  # Main app with route definitions
│   ├── globals.css              # Global styles
│   ├── components/
│   │   └── BookingCalendar.jsx             # Calendar to display booked dates
│   │   └── BookingForm.jsx                 # Form to create a new booking
│   │   └── BookingsByProfile.jsx           # List of all bookings by current profile
│   │   └── BookingsOnVenue.jsx             # List of all bookings on current venue
│   │   └── Categories.jsx                  # Venue Categories for Home page
│   │   └── CategoryCard.jsx                # Dynamic card to display Categories
│   │   └── Description.jsx                 # Venue description
│   │   └── EditBooking.jsx                 # Form to edit an existing booking
│   │   └── Filter.jsx                      # Filter and sort venues
│   │   └── Header.jsx                      # Header component at top of page
│   │   └── HeroSlideshow.jsx               # Slideshow of different venues on Home page
│   │   └── HomePageCard.jsx                # Cards showing popular destinations
│   │   └── Layout.jsx                      # Shared layout across routes
│   │   └── LoadingSpinner.jsx              # Loading Spinner used when page or component is loading
│   │   └── MediaViewer.jsx                 # Media gallery in SingleVenue page
│   │   └── Modal.jsx                       # Reusable modal used for deleting, confirmation etc.
│   │   └── Navbar.jsx                      # Navbar shown on smaller, mobile devices
│   │   └── Pagination.jsx                  # Pagination used for showing next/previous page
│   │   └── ProfileEditor.jsx               # Editor for updating profile avatar, bio etc.
│   │   └── Rating.jsx                      # Venue rating showing one to five stars
│   │   └── Register.jsx                    # Register new user when logging in
│   │   └── Return.jsx                      # Button used for returning to previous page
│   │   └── SingleVenueHero.jsx             # Hero slideshow displaying images for single venue
│   │   └── StatusMessage.jsx               # Error, confirmation, feedback messages to the user
│   │   └── Tooltip.jsx                     # Tooltip for the user when hovering over certain elements
│   │   └── UpcomingBookingsCalendar.jsx    # Calendar to display only bookings by current user
│   │   └── VenueCard.jsx                   # Card showing each venue in Browse page
│   │   └── VenuesByProfile.jsx             # List of all venues created by current user
│   ├── pages/
│   │   ├── Home.jsx         # Home page
│   │   ├── Login.jsx        # User authentication
│   │   ├── Browse.jsx       # Venue listings
│   │   ├── Bookings.jsx     # Booking management
│   │   ├── Profile.jsx      # User profile page
│   │   ├── Create.jsx       # Venue creation form
│   │   ├── Edit.jsx         # Edit venue details
│   │   ├── Preview.jsx      # Preview created venue
│   │   ├── SingleVenue.jsx  # View details for a single venue
│   │   └── Booking.jsx      # View details for a single booking
└── package.json

