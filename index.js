document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const titleElement = document.getElementById("title");
    const runtimeElement = document.getElementById("runtime");
    const showtimeElement = document.getElementById("showtime");
    const posterElement = document.getElementById("poster");
    const ticketsElement = document.getElementById("tickets");
    const buyTicketButton = document.getElementById("buy-ticket");

    const API_URL = "http://localhost:3001/films";

    function fetchMovies() {
        fetch(API_URL)
            .then(response => response.json())
            .then(movies => {
                if (movies.length > 0) {
                    displayMovieList(movies);
                    displayMovieDetails(movies[0]); // Show first movie
                }
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

    function displayMovieList(movies) {
        filmsList.innerHTML = ""; // Clear previous list
        movies.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            li.dataset.id = movie.id; // Store movie ID for selection
            li.classList.add("film-item");
            filmsList.appendChild(li);
        });

        // Attach event listeners after list is created
        document.querySelectorAll(".film-item").forEach(item => {
            item.addEventListener("click", (event) => {
                const selectedId = event.target.dataset.id;
                const selectedMovie = movies.find(movie => movie.id === selectedId);
                if (selectedMovie) displayMovieDetails(selectedMovie);
            });
        });
    }

    function displayMovieDetails(movie) {
        titleElement.textContent = movie.title;
        runtimeElement.textContent = `Runtime: ${movie.runtime} min`;
        showtimeElement.textContent = `Showtime: ${movie.showtime}`;
        posterElement.src = movie.poster;
        updateTickets(movie);
        buyTicketButton.onclick = () => purchaseTicket(movie);
    }

    function updateTickets(movie) {
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketsElement.textContent = `Available Tickets: ${availableTickets}`;
        buyTicketButton.disabled = availableTickets <= 0;
        buyTicketButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
    }

    function purchaseTicket(movie) {
        if (movie.tickets_sold < movie.capacity) {
            movie.tickets_sold++;
            fetch(`${API_URL}/${movie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold })
            })
            .then(response => response.json())
            .then(updatedMovie => updateTickets(updatedMovie))
            .catch(error => console.error("Error updating tickets:", error));
        }
    }

    fetchMovies();
});
