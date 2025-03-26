document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "https://flatadango-71ws.onrender.com";
    const filmList = document.getElementById("films");
    const poster = document.getElementById("poster");
    const title = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const ticketCount = document.getElementById("available-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");
    const deleteButton = document.createElement("button");

    deleteButton.id = "delete-movie";
    deleteButton.textContent = "Delete Movie";
    document.querySelector("#movie-details").appendChild(deleteButton);
    
    let currentMovieId;

    function loadMovies() {
        fetch(`${baseURL}/films`)
            .then(res => res.json())
            .then(movies => {
                filmList.innerHTML = "";
                if (movies.length === 0) return;

                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    li.classList.add("film", "item");
                    li.dataset.id = movie.id;
                    if (movie.capacity - movie.tickets_sold === 0) {
                        li.classList.add("sold-out");
                    }
                    li.addEventListener("click", () => loadMovieDetails(movie.id));
                    filmList.appendChild(li);
                });

                loadMovieDetails(movies[0].id);
            })
            .catch(error => console.error("Error loading movies:", error));
    }

    function loadMovieDetails(movieId) {
        fetch(`${baseURL}/films/${movieId}`)
            .then(res => res.json())
            .then(movie => {
                currentMovieId = movie.id;
                poster.src = movie.poster;
                title.textContent = movie.title;
                runtime.textContent = movie.runtime;
                showtime.textContent = movie.showtime;
                const availableTickets = movie.capacity - movie.tickets_sold;
                ticketCount.textContent = availableTickets;
                buyTicketButton.disabled = availableTickets === 0;
                buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";
            })
            .catch(error => console.error("Error loading movie details:", error));
    }

    buyTicketButton.addEventListener("click", () => {
        if (!currentMovieId) return;

        fetch(`${baseURL}/films/${currentMovieId}`)
            .then(res => res.json())
            .then(movie => {
                if (movie.tickets_sold < movie.capacity) {
                    const updatedTicketsSold = movie.tickets_sold + 1;

                    fetch(`${baseURL}/films/${currentMovieId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tickets_sold: updatedTicketsSold })
                    })
                    .then(() => loadMovieDetails(currentMovieId))
                    .catch(error => console.error("Error updating ticket count:", error));
                }
            });
    });

    deleteButton.addEventListener("click", () => {
        if (!currentMovieId) return;

        fetch(`${baseURL}/films/${currentMovieId}`, {
            method: "DELETE"
        })
        .then(() => {
            document.querySelector(`li[data-id='${currentMovieId}']`).remove();
            loadMovies();
        })
        .catch(error => console.error("Error deleting movie:", error));
    });

    loadMovies();
});

fetch("https://flatadango-71ws.onrender.com/films")
    .then(res => res.json())
    .then(movies => console.log("Fetched movies:", movies))
    .catch(error => console.error("Fetch error:", error));
