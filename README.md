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

```
holidaze/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  # Main app with route definitions
│   ├── globals.css              # Global styles
│
│   ├── components/
│   │   ├── BookingCalendar.jsx             # Calendar to display booked dates
│   │   ├── BookingForm.jsx                 # Form to create a new booking
│   │   ├── BookingsByProfile.jsx           # List of all bookings by current profile
│   │   ├── BookingsOnVenue.jsx             # List of all bookings on current venue
│   │   ├── Categories.jsx                  # Venue Categories for Home page
│   │   ├── CategoryCard.jsx                # Dynamic card to display Categories
│   │   ├── Description.jsx                 # Venue description
│   │   ├── EditBooking.jsx                 # Form to edit an existing booking
│   │   ├── Filter.jsx                      # Filter and sort venues
│   │   ├── Header.jsx                      # Header component at top of page
│   │   ├── HeroSlideshow.jsx               # Slideshow of different venues on Home page
│   │   ├── HomePageCard.jsx                # Cards showing popular destinations
│   │   ├── Layout.jsx                      # Shared layout across routes
│   │   ├── LoadingSpinner.jsx              # Loading spinner shown during loading states
│   │   ├── MediaViewer.jsx                 # Media gallery on SingleVenue page
│   │   ├── Modal.jsx                       # Reusable modal for confirmation, deletion, etc.
│   │   ├── Navbar.jsx                      # Mobile navigation bar
│   │   ├── Pagination.jsx                  # Pagination controls
│   │   ├── ProfileEditor.jsx               # Editor for updating profile details
│   │   ├── Rating.jsx                      # Star rating display
│   │   ├── Register.jsx                    # Registration form for new users
│   │   ├── Return.jsx                      # Back button for navigation
│   │   ├── SingleVenueHero.jsx             # Hero slideshow for single venue page
│   │   ├── StatusMessage.jsx               # Display status messages (error, success, etc.)
│   │   ├── Tooltip.jsx                     # Tooltip hints
│   │   ├── UpcomingBookingsCalendar.jsx    # Calendar showing bookings for current user
│   │   ├── VenueCard.jsx                   # Venue listing card
│   │   └── VenuesByProfile.jsx             # List of venues created by current user
│
│   ├── pages/
│   │   ├── Home.jsx         # Home page
│   │   ├── Login.jsx        # User authentication page
│   │   ├── Browse.jsx       # Venue listings and browsing
│   │   ├── Bookings.jsx     # Booking management page
│   │   ├── Profile.jsx      # User profile dashboard
│   │   ├── Create.jsx       # Venue creation form
│   │   ├── Edit.jsx         # Edit venue details
│   │   ├── Preview.jsx      # Preview created venue before publishing
│   │   ├── SingleVenue.jsx  # View detailed info of a venue
│   │   └── Booking.jsx      # View single booking details
│
└── package.json             # Project dependencies and scripts
```




