document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const movieDetails = document.getElementById("movie-details");
    const buyTicketBtn = document.getElementById("buy-ticket");
    let currentMovie = null;

    r
    function fetchMovies() {
        fetch("http://localhost:3001/films")
            .then(res => res.json())
            .then(movies => {
                filmsList.innerHTML = "";
                movies.forEach(movie => addMovieToList(movie));
                displayMovieDetails(movies[0]);
            });
    }

    
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

    
    buyTicketBtn.addEventListener("click", () => {
        if (!currentMovie) return;
        let availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
        if (availableTickets > 0) {
            currentMovie.tickets_sold++;
            updateTicketsSold(currentMovie);
        }
    });

    
    function updateTicketsSold(movie) {
        fetch(`http://localhost:3001/films/${movie.id}`, {
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

    
    function postNewTicket(filmId) {
        fetch("http://localhost:3001/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ film_id: filmId, number_of_tickets: 1 })
        });
    }

    
    function deleteMovie(movieId, listItem) {
        fetch(`http://localhost:3001/films/${movieId}`, { method: "DELETE" })
            .then(() => listItem.remove());
    }

    fetchMovies();
});
