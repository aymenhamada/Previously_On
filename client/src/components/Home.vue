<template>
  <div>
      <Navbar v-on:inputChange="searchBarChange"/>
      <div class="container-fluid marged" v-if="shows">
         <img v-bind:src="showSelected.images.show" alt="" id="banner">
          <div class="vignette">
          </div>
         <div class="info">
           <h2>{{showSelected.original_title}}</h2>
           <div class="meta-data">
             <p class="score">Recommandé à {{showSelected.recommended}} %</p>
             <p>{{showSelected.creation}}</p>
             <p>{{showSelected.seasons_details.length}} saison</p>
             <p>{{showSelected.episodes}} episodes</p>
             <p>{{showSelected.length}} min</p>
             <p>{{showSelected.notes.mean}}<i class="fas fa-star"></i></p>
           </div>
           <p class="description">{{showSelected.description}}</p>
            <div class="d-flex">
              <router-link :to="{name: 'Show', params: { id: showSelected.id}}"><button class="btn btn-danger here" v-if="showsFollowing.includes(showSelected.id)"><span><i class="fas fa-play"></i> Voir la série</span></button></router-link>
              <div>
                <button class="btn" v-if="!showsFollowing.includes(showSelected.id)" v-on:click="followShow(showSelected)" ><span><i class="fas fa-plus"></i> Suivre</span></button>
                <button class="btn" v-if="showsFollowing.includes(showSelected.id)" v-on:click="unFollowShow(showSelected)" ><span><i class="fas fa-check"></i> Vous suivez cette série</span></button>
                <button class="btn" v-if="showsFollowing.includes(showSelected.id)" v-on:click="ArchiveShow(showSelected)"><span><i class="fas fa-archive"></i>Archivez cette série</span></button>
              </div>
            </div>
            <p>Genres: {{showSelected.allGender}}</p>
         </div>
      </div>
    <div class='container-fluid'>
      <div class="row" v-if="shows">
        <h4>Populaire chez YingYang</h4>
        <div class="slider">
          <div class="showContainer" v-for="(show, index) in shows" v-bind:key="show.id" >
            <img v-bind:src="show.images.poster || show.images.banner" alt="poster" v-on:click="showDetails(index)" @mouseover="overAnimation(index)" @mouseleave="removeAnimation()">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import { getToken } from '../helpers';
export default {
  components: {
    Navbar
  },
  data(){
    return{
      shows: null,
      itemsPerRows: null,
      showSelected: null,
      user: JSON.parse(localStorage.getItem('user')),
      showsFollowing: [],
      allShows: null,
      backUpShows: null,
    }
  },
  async mounted(){
    if(!localStorage.getItem('userShows')){
      this.axios
      .get(`https://api.betaseries.com/shows/member?key=1d5f28cdef42&id=${this.user.id}`)
      .then((response) => {
        const showsFollowing = response.data.shows;
        this.showsFollowing = showsFollowing.map((ele) => ele.id);
        localStorage.setItem('userShows', JSON.stringify(this.showsFollowing));
      })
      .catch(err => console.log(err.response.data))
    }
    else{
      this.showsFollowing = JSON.parse(localStorage.getItem('userShows'));
    }

    const introduceShows = await new Promise((resolve) => this.showsRequest(`https://api.betaseries.com/shows/list?key=1d5f28cdef42&order=popularity&limit=25`, resolve))
    this.shows = introduceShows;
    this.showSelected = introduceShows[0];
    this.backUpShows = introduceShows;
    const allShows = await new Promise((resolve) => this.showsRequest(`https://api.betaseries.com/shows/list?key=1d5f28cdef42&order=popularity&limit=250`, resolve));
    this.allShows = allShows;

      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;
      recognition.addEventListener('result', (event) =>{
        const transcript = Array.from(event.results)
                           .map(results => results[0])
                           .map(result => result.transcript)
                           .join("");
        if(event.results[0].isFinal){
          if(transcript.includes("cherche-moi")){
            const showsToFind = transcript.replace("cherche-moi", "").trim();
            const findShows = this.findMatches(showsToFind, this.allShows);
            this.shows = findShows;
            this.showDetails(0);
          }
          if(transcript.includes("retour au menu principal")){
              this.shows = this.backUpShows;
              this.showDetails(0);
          }
        }
      })
      recognition.addEventListener('end', recognition.start);
      recognition.start();
  },
  methods:{
    showDetails(i){
      const show = this.shows[i];
      if(this.showSelected.images.show !==  show.images.show){
        const banner = document.querySelector('#banner');
        banner.style.opacity = 0;
        setTimeout(() => {
          setTimeout(() => {
            banner.style.opacity = 1;
          }, 500)
          this.showSelected = show;
        }, 500)
      }
    },
    showsRequest(url, resolve){
        this.axios
        .get(url)
        .then((response) => {
          console.log(response);
            response.data.shows.forEach((show) => {
            let string = "";
            if(show.genres.length > 0){
              show.genres.forEach((genre, i) => {
                  string = string + ` ${genre}` + (i == show.genres.length - 1 ? '' : ',')
              })
            }
            show.allGender = string;
            show.notes.mean = Number((show.notes.mean).toFixed(2))
            show.recommended = Math.floor((show.notes.mean / 5) * 100);
          })
            resolve(response.data.shows);
        })
        .catch(err => {
            console.log(err);
        })
    },
    overAnimation(i, limit){
      const image = document.querySelectorAll('.showContainer');
      image.forEach((img, index) => {
        if(index == i){
          img.style.zIndex = 4
          img.style.transform = "translate3d(0px, 0px, 0px)";
          img.style.transitionDuration = "400ms"
          img.style.transitionDelay = "0ms"
        } else if(index < i && index >= limit && index <= limit + 10){
          img.style.transform = "translate3d(-100px, 0px, 0px)";
          img.style.transitionDuration = "400ms"
          img.style.transitionDelay = "0ms"
        } else if(index > i && index >= limit && index <= limit + 10){
          img.style.transform = "translate3d(99px, 0px, 0px)";
          img.style.transitionDuration = "400ms"
          img.style.transitionDelay = "0ms"
        }
      })
    },
    removeAnimation(){
        const image = document.querySelectorAll('.showContainer');
        image.forEach((img) =>{
          img.style.zIndex  = "";
          img.style.transform = "";
        })
    },
    async followShow(showSelected){
      this.showsFollowing.push(showSelected.id);
      localStorage.setItem('userShows', JSON.stringify(this.showsFollowing));
      const token = await getToken(this.user.id);
      this.axios
      .post("https://api.betaseries.com/shows/show?key=1d5f28cdef42", {
          id: showSelected.id,
          token,
      })
      .then((response) =>{
            console.log(this.user.showsFollowing);
      })
      .catch(err => console.log(err.response.data));
    },
   async ArchiveShow(showSelected){
      const token = await getToken(this.user.id);
      this.axios
      .post("https://api.betaseries.com/shows/archive?key=1d5f28cdef42", {
        id: showSelected.id,
        token,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch(err => console.log(err.response.data))
    },
    async unFollowShow(showSelected){
        this.showsFollowing = this.showsFollowing.filter((ele) => ele !== showSelected.id);
        localStorage.setItem('userShows', JSON.stringify(this.showsFollowing));
        const token = await getToken(this.user.id);
        this.axios
        .delete(`https://api.betaseries.com/shows/show?key=1d5f28cdef42&id=${showSelected.id}&token=${token}`)
        .then((response) => {
          console.log(response);
        })
        .catch(err => console.log(err.response.data))
    },
    //SearchBarChange secondary helpfull function
    findMatches(value, shows){
        const found = shows.filter((show) => {
            const regex = new RegExp(value, 'gi');
            return show.original_title.match(regex) || show.title.match(regex);
        })
        return found;
    },
    searchBarChange(event){
        if(this.allShows){
            const { value } = event.target;
            if(value !== ""){
                const findShows = this.findMatches(value, this.allShows);
                this.shows = findShows;
            } else {
                this.shows = this.backUpShows;
            }
        }
        return;
    },
  },
};

</script>

<style lang="sass">
@import '../assets/css/Home.sass'
</style>