document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const movieDetails = document.getElementById("movie-details");
    const buyTicketBtn = document.getElementById("buy-ticket");
    let currentMovie = null;

    // Fetch and display all movies in sidebar
    function fetchMovies() {
        fetch("http://localhost:3000/films")
            .then(res => res.json())
            .then(movies => {
                filmsList.innerHTML = "";
                movies.forEach(movie => addMovieToList(movie));
                displayMovieDetails(movies[0]);
            });
    }

    // Add a movie to the sidebar list
    function addMovieToList(movie) {
        const li = document.createElement("li");
        li.classList.add("film", "item");
        li.textContent = movie.title;
        li.addEventListener("click", () => displayMovieDetails(movie));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteMovie(movie.id, li);
        });

        li.appendChild(deleteBtn);
        filmsList.appendChild(li);
    }

    // Display movie details
    function displayMovieDetails(movie) {
        currentMovie = movie;
        document.getElementById("poster").src = movie.poster;
        document.getElementById("title").textContent = movie.title;
        document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
        document.getElementById("showtime").textContent = movie.showtime;
        document.getElementById("available-tickets").textContent = movie.capacity - movie.tickets_sold;
        buyTicketBtn.textContent = (movie.capacity - movie.tickets_sold) > 0 ? "Buy Ticket" : "Sold Out";
        buyTicketBtn.disabled = movie.tickets_sold >= movie.capacity;
    }

    // Handle buying tickets
    buyTicketBtn.addEventListener("click", () => {
        if (!currentMovie) return;
        let availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
        if (availableTickets > 0) {
            currentMovie.tickets_sold++;
            updateTicketsSold(currentMovie);
        }
    });

    // Update tickets sold on the server
    function updateTicketsSold(movie) {
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold })
        })
        .then(() => {
            document.getElementById("available-tickets").textContent = movie.capacity - movie.tickets_sold;
            buyTicketBtn.textContent = (movie.capacity - movie.tickets_sold) > 0 ? "Buy Ticket" : "Sold Out";
            buyTicketBtn.disabled = movie.tickets_sold >= movie.capacity;
            postNewTicket(movie.id);
        });
    }

    // Post a new ticket purchase to the server
    function postNewTicket(filmId) {
        fetch("http://localhost:3000/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ film_id: filmId, number_of_tickets: 1 })
        });
    }

    // Delete a movie from the server
    function deleteMovie(movieId, listItem) {
        fetch(`http://localhost:3000/films/${movieId}`, { method: "DELETE" })
            .then(() => listItem.remove());
    }

    fetchMovies();
});
