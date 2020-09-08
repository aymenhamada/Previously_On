<template>
  <div>
    <Navbar v-on:inputChange="searchBarChange" />
    <div class="container-fluid marged" v-if="movies && movieSelected">
      <img v-bind:src="movieSelected.poster" alt id="banner" />
      <div class="vignette"></div>
      <div class="info">
        <h2>{{movieSelected.title}}</h2>
        <div class="meta-data">
          <p class="score">Recommandé à {{movieSelected.total}} %</p>
          <p>{{movieSelected.release_date}}</p>
        </div>
        <p class="description">{{movieSelected.synopsis}}</p>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row" v-if="movies && movieSelected">
        <h4>Populaire chez YingYang</h4>
        <div class="slider">
          <div class="showContainer" v-for="(movie, index) in movies" v-bind:key="index">
            <img
              v-bind:src="movie.poster || ''"
              alt="poster"
              v-on:click="showDetails(index)"
              @mouseover="overAnimation(index)"
              @mouseleave="removeAnimation()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#banner {
  max-height: 300px;
}
</style>

<script>
import Navbar from "./Navbar";
import { getToken } from "../helpers";
export default {
  components: {
    Navbar
  },
  data() {
    return {
      movies: null,
      user: JSON.parse(localStorage.getItem("user")),
      movieSelected: null,
      backUpMovies: null
    };
  },
  mounted() {
    this.axios.get("http://localhost:4242/movies").then(response => {
      this.movies = response.data;
      this.movieSelected = response.data[0];
      this.backUpMovies = response.data;
    });
  },
  methods: {
    showDetails(i) {
      const movie = this.movies[i];
      if (this.movieSelected.poster !== movie.poster) {
        const banner = document.querySelector("#banner");
        banner.style.opacity = 0;
        setTimeout(() => {
          setTimeout(() => {
            banner.style.opacity = 1;
          }, 500);
          this.movieSelected = movie;
        }, 500);
      }
    },
    overAnimation(i, limit) {
      const image = document.querySelectorAll(".showContainer");
      image.forEach((img, index) => {
        if (index == i) {
          img.style.zIndex = 4;
          img.style.transform = "translate3d(0px, 0px, 0px)";
          img.style.transitionDuration = "400ms";
          img.style.transitionDelay = "0ms";
        } else if (index < i && index >= limit && index <= limit + 10) {
          img.style.transform = "translate3d(-100px, 0px, 0px)";
          img.style.transitionDuration = "400ms";
          img.style.transitionDelay = "0ms";
        } else if (index > i && index >= limit && index <= limit + 10) {
          img.style.transform = "translate3d(99px, 0px, 0px)";
          img.style.transitionDuration = "400ms";
          img.style.transitionDelay = "0ms";
        }
      });
    },
    removeAnimation() {
      const image = document.querySelectorAll(".showContainer");
      image.forEach(img => {
        img.style.zIndex = "";
        img.style.transform = "";
      });
    },
    //SearchBarChange secondary helpfull function
    findMatches(value, movies) {
      const found = movies.filter(movie => {
        const regex = new RegExp(value, "gi");
        return movie.title.match(regex);
      });
      return found;
    },
    searchBarChange(event) {
      if (this.movies) {
        const { value } = event.target;
        if (value !== "") {
          const findMovie = this.findMatches(value, this.movies);
          this.movies = findMovie;
        } else {
          this.movies = this.backUpMovies;
        }
      }
      return;
    },
  }
};
</script>


<style lang="sass">
@import '../assets/css/Home.sass'
</style>