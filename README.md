# Movie Ticket App (Flatdango)

Flatdango is a mini web application that allows users to view movie details, purchase tickets, and manage film data. The app uses JavaScript for dynamic updates and interacts with a JSON server to fetch and modify movie information.

## Features
- Display a list of available movies.
- Show movie details, including poster, runtime, showtime, and available tickets.
- Allow users to purchase tickets (reducing available ticket count dynamically).
- Indicate when a movie is sold out.
- Support deleting movies from the list and server.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** JSON Server (Mock Backend)

## How to Use the Server

### 1. Install Dependencies
Ensure you have Node.js installed, then install `json-server` globally:
```sh
npm install -g json-server
```

### 2. Start the JSON Server
The server serves data from a `db.json` file. Run:
```sh
json-server --watch db.json --port 3000
```

## API Endpoints
- `GET /films` - Retrieves all movies.
- `GET /films/:id` - Retrieves a specific movie by ID.
- `PATCH /films/:id` - Updates `tickets_sold` for a movie.
- `POST /tickets` - Adds a new ticket purchase.
- `DELETE /films/:id` - Removes a movie from the server.

## Usage
1. Click a movie title from the list to view its details.
2. Click the **Buy Ticket** button to purchase a ticket (until sold out).
3. Use the delete option to remove a movie from the list and database.
