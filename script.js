//////////////////////////// VARIABLES ////////////////////////////////////////

const graceNoteMovieApi = "xw2s7tehhm97h56k9v6qkeyk";  //Thammarak account1
// const graceNoteMovieApi = "jf2p6cj9xp8pspnqcjg44rc9";  //Thammarak account2
var graceNoteMoviePrefix = "https://data.tmsapi.com/v1.1/movies/showings?";
// sample of request var graceNoteMoviePrefix = "https://data.tmsapi.com/v1.1/movies/showings?genres=action&startDate=2020-11-23&zip=78613&radius=5&api_key=adsprbrpwkseeq22z6hc2386";
const graceNoteMoviePosterLink = "https://demo.tmsimg.com/";

// var yelpApi = "9VUtXRmjC3Psh50MTKDn-lpXsZIazhjlyx88TpX6WWLCHvk-_-DuGww3FkdhLhSDpIPlFvOzMjVSsJaS1hrIbG3FYNxznVAWr_UMGM4E8DbkOzrAz5pYOQY1qUW5X3Yx"
// var yelpApiPrefix = "https://api.yelp.com/v3/businesses/search?";
// sample of request var yelpAPIPrefix = "https://api.yelp.com/v3/businesses/search?term=pizza&latitude=30.266666&longitude=-97.733330&apikey=kttxiZtG1Dr6SQS5GR-wLFn_d-Y4xjs0lqPoakVILmEO8UWcTXfrPZ9PV95L7-traBoAT0kEsK0vsOtq_r-CBmPLqxYYqHe-pKTh2xFNe5saVlDbTAtT0vUmiz25X3Yx";

var dateSelected = "";
var zipCode = "";
var radius = "5";
var genresSearch = "";
var poster = "";


//////////////////////////// FUNCTION ////////////////////////////////////////
  
  //// 1 /////
function getMovies(zipCode, genresSearch, dateTimeSearch) {
    // use ajax to get movies information

    // MOVIE URL REQUEST
    var movieUrlRequest = graceNoteMoviePrefix + "genres="+ genresSearch + "&startDate=" + dateTimeSearch + "&zip=" + zipCode + "&radius=" + radius + "&api_key=" + graceNoteMovieApi;

    //console.log("line 58 " + movieUrlRequest);

    $.ajax({
        url: movieUrlRequest,
        method: "GET",
        error: function (err) {
            alert("The input was not found. Please change zipcode or date")
            return;
        }
    })
        .then(function (response) {
            return addNewArray(response, zipCode, genresSearch);
        })

}

//// 2 /////
function addNewArray(response, zipCode, genresSearch) {
    // FILTER ONLY GENRES THAT MATCH SELECTED AND PUSH INTO NEW ARRAY newMovieArray

    // console.log("line 67 " + zipCode);
    // console.log("line 67 " + genresSearch);

    // console.log("line 80 typeof genresSearch " + typeof(genresSearch));
    // console.log("line 80 " + response.length);

    var movieGenresMatch = [];

    for (i = 0; i < response.length; i++) {
        // for (i = 0; i < 3; i++) {
        var movieMatch = response[i].title;
        // var movieMatchNoSpace = response[i].title.replace(/ /g, "_");

        var genresMatch = response[i].genres;
        // convert response genres to lower case to compare with user genres selected

        // console.log("line 92 typeof genresMatch " + typeof(genresMatch));
        // console.log("line 92 genresMatch.length " + genresMatch.length);


        if (genresMatch) {


            for (x = 0; x < genresMatch.length; x++) {
                genresMatch[x] = genresMatch[x].toLowerCase();
            }
    
            // console.log("line 85 loop " + i + "genresMatch " + genresMatch);
            // console.log("line 85 loop " + i  + "genresSearch " + genresSearch);
    
            var showtimesMatch = response[i].showtimes;
            var imageMatch = response[i].preferredImage.uri;
            
    
            if (genresMatch.includes(genresSearch)) {
                //console.log("line 109 loop " + i + "genresMatch " + genresMatch + "has " + genresSearch);
    
                movieGenresMatch.push({ Title: movieMatch, Genres: genresSearch, Showtimes: showtimesMatch, Image: imageMatch });
    
                // 78613 ACTIVE SHOW FOUR ARRAY TRY 78749 SHOW FOUR TOO
                // console.log("line 109 " + movieGenresMatch);
                // console.log("line 109 " + movieGenresMatch.length);
    
            }


        }

    

        // console.log("line 118 " + movieGenresMatch);
        // console.log("line 118 " + movieGenresMatch.length);
    }

    // THIS IS WHERE THE PROBLEM FOUND BELOW TWO VAR WAS MISSING FOR 78749 BUT 78613 WORKS
    // console.log("line 123 " + movieGenresMatch);
    // console.log("line 123 " + movieGenresMatch.length);
    // ADDING MATCH ONES TO NEW MOVIE ARRAY
    var newMovieArray = []

    // 78749 DID NOT REACH HERE BUT 78613 SHOW FOUR WHY???
   // console.log("line 116 " + movieGenresMatch.length);

    for (i = 0; i < movieGenresMatch.length; i++) {
        for (y = 0; y < movieGenresMatch[i].Showtimes.length; y++) {

            //  TRYING CONVERT 24H TO 12H
             var dateTimeBeforeConvert = movieGenresMatch[i].Showtimes[y].dateTime;
             //console.log("line 155 dateTimeBeforeConvert " + dateTimeBeforeConvert);
             dateTimeAfterConvert = convertTime12H(dateTimeBeforeConvert);


            // newMovieArray.push({ Title: movieGenresMatch[i].Title, Theatre: movieGenresMatch[i].Showtimes[y].theatre.name, Showtimes: movieGenresMatch[i].Showtimes[y].dateTime, Image: movieGenresMatch[i].Image });

            // THIS LINE WORKING WITHOUT TICKET LINK
            // newMovieArray.push({ Title: movieGenresMatch[i].Title, Theatre: movieGenresMatch[i].Showtimes[y].theatre.name, Showtimes: dateTimeAfterConvert, Image: movieGenresMatch[i].Image });

            // TRY ADD TICKET LINK
            newMovieArray.push({ Title: movieGenresMatch[i].Title, Theatre: movieGenresMatch[i].Showtimes[y].theatre.name, Showtimes: dateTimeAfterConvert, Image: movieGenresMatch[i].Image, Ticket: movieGenresMatch[i].Showtimes[y].ticketURI });

            // console.log("line 102 " + movieGenresMatch[i].Title);
            // console.log("line 102 " + movieGenresMatch[i].Showtimes[y].theatre.name);
            // console.log("line 102 " + movieGenresMatch[i].Showtimes[y].dateTime);
            // console.log("line 102 " + movieGenresMatch[i].Image);
            // console.log("line 102 " + movieGenresMatch[i].Showtimes[y].ticketURI);


        }
    }

    //console.log("line 128 " + newMovieArray);

    renderMoviesResult(newMovieArray);
}



//// 3 /////
function renderMoviesResult(newMovieArray) {
    // to display movie search result

    //console.log("line 175 " + newMovieArray);
    var startCard = 0
    var currentMovieName = "";
    var currentTheatre = "";

    for (var i = 0; i < newMovieArray.length; i++) {
        // for (var i = 0; i < 1; i++) {
        // FOR DEBUG

        var movieName = newMovieArray[i].Title;
        var theatre = newMovieArray[i].Theatre;
        var imageUrl = newMovieArray[i].Image;
        var ticketURL = newMovieArray[i].Ticket;

        if (movieName !== currentMovieName) {
            ++startCard
        }

        var cardNumber = "mov-result-" + startCard;
        // same movie scenarios to display only one
        if (movieName === currentMovieName) {
            cardNumber = currentCardNumber;

            // TRY MOVE UNDER THEATRE LOOP
            $(`#${cardNumber}`).find('.schedule').append("<p>" + newMovieArray[i].Showtimes + "</p>");
            // ADD BUTTON
            $(`#${cardNumber}`).find('.schedule').append('<button>Select</button>').addClass('time-select');
          
             // ADD LINK TO EACH SHOWTIME
             //console.log("line 161 ticketURL " + ticketURL);
             $(`#${cardNumber}`).find('a').attr("href", ticketURL);
             $(`#${cardNumber}`).find('#ticket-link').text("Click for ticket");

            if (theatre === currentTheatre) {
               // console.log("line 215 " + "theatre= " + theatre + "currentTheatre= " + currentTheatre );
            } else {
                $(`#${cardNumber}`).find('.schedule').append("<p>" + newMovieArray[i].Theatre + "</p>");
            }
          
        } else {
            $(`#${cardNumber}`).find('.mov-title').text(newMovieArray[i].Title);
            $(`#${cardNumber}`).find('.theatre').text(newMovieArray[i].Theatre);
            // $(`#${cardNumber}`).find('.schedule').text(newMovieArray[i].Showtimes);
            $(`#${cardNumber}`).find('.schedule').append("<p>" + newMovieArray[i].Showtimes + "</p>");
            // ADD BUTTON
            $(`#${cardNumber}`).find('.schedule').append('<button>Select</button>').addClass('time-select');



            // ADD LINK TO EACH SHOWTIME
            //console.log("line 176 ticketURL " + ticketURL);
            $(`#${cardNumber}`).find('a').attr("href", ticketURL);
            $(`#${cardNumber}`).find('#ticket-link').text("Click for ticket");


            // FINALLY FOUND THE LINK TO POSTER
            $(`#${cardNumber}`).find('.movieThumb').attr('src', graceNoteMoviePosterLink + newMovieArray[i].Image);
        }

        var currentMovieName = newMovieArray[i].Title;
        var currentCardNumber = cardNumber;
        var currentTheatre = theatre;

    }
    // END OF FOR LOOP


}


function convertTime12H(dateTimeBeforeConvert) {

    //console.log("line 345 dateTimeBeforeConvert " + dateTimeBeforeConvert);

    showtimesMatch24H = dateTimeBeforeConvert.slice(11);
    //console.log("line 345 showtimesMatch24H " + showtimesMatch24H);

    
    dateTimeAfterConvert = moment(showtimesMatch24H, 'HH:mm').format('hh:mm a');

    // console.log("line 351 " + dateTimeAfterConvert);

    return(dateTimeAfterConvert);

}


function getFoodCuisine(){
    
    var foodCuisine = $('#foodCuisines option:selected').text();
    foodCuisine.toLowerCase();

    getRestaurant(foodCuisine);
    
return foodCuisine;
}

function getRestaurant(foodCuisine){
    var cityID = "";
    var zomatoURL = `https://developers.zomato.com/api/v2.1/search?entity_id=$278&entity_type=city&q=${foodCuisine}&count=4&apikey=8d7d2f5f69ede05c41b4571b85670193`
        $.ajax({
            url: zomatoURL,
            method: "GET",  
        }).then(function(response) {
                for(var i = 0; i < response.restaurants.length;i++){
                    //console.log(response.restaurants[i].restaurant.location.address);
                    $('#restaurant-result-' + i).find('.restaurant-title').text(response.restaurants[i].restaurant.name);
                    $('#restaurant-result-' + i).find('.restaurantThumb').attr("src", response.restaurants[i].restaurant.thumb);
                    $('#restaurant-result-' + i).find('.schedule').text(response.restaurants[i].restaurant.location.address);
                    $('#restaurant-result-' + i).find('.asdf').text(response.restaurants[i].restaurant.phone_numbers);
                    $('#restaurant-result-' + i).find('.qwert').text(response.restaurants[i].restaurant.timings);

               }
        })
    }

//////////////////////////// EXECUTION ////////////////////////////////////////

$("#location-button").click(function (event) {

    // alert("You selected zipCode " + $('.input').val());
    // alert("You selected genres " + $("#movie-selections option:selected").text());
    // alert("You selected dateSearch " + $('#date-select').val());
    // alert("You selected timeSearch " + $('#time-select').val());

    event.preventDefault;

    window.zipCode = $('.input').val();

    window.genresSearch = $("#movie-selections option:selected").text();
    genresSearch = genresSearch.toLowerCase();

    window.dateSearch = $('#date-select').val();
    window.timeSearch = $('#time-select').val();
    window.dateTimeSearch = dateSearch + "T" + timeSearch;

    getMovies(zipCode, genresSearch, dateTimeSearch);
    getFoodCuisine();

})





/////////////// BACKUP CODE OMDB /////////////////////


//// 4 /////

// var omdbApiKey = "5673ffbb";
// var omdbPrefix = "https://www.omdbapi.com/?apikey="
// function getPoster(newMovieArray) {


//     console.log("line 155 " + newMovieArray);
//     console.log("line 155 " + newMovieArray[0].Title);


//     for (var i = 0; i < newMovieArray.length; i++) {
//         // for (var i = 0; i < 1; i++) {
//         // FOR DEBUG

//         // var movieMatchNoSpace = newMovieArray[i].title.replace(/ /g, "_");
//         var movieMatchNoSpace = newMovieArray[i].Title.replace(/ /g, "_");;
//         console.log("line 165 " + movieMatchNoSpace);

//         var omdbUrlRequest = omdbPrefix + omdbApiKey + "&t=" + movieMatchNoSpace
//         console.log("line 168 " + omdbUrlRequest);
//         $.ajax({
//             url: omdbUrlRequest,
//             method: "GET",
//         })
//             .then(function (response) {

//                 addPosterToArray(response, newMovieArray);
                
//             });
//     }

// }