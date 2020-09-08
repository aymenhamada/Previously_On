<template>
    <div>
        <Navbar/>
        <div class="container">
            <div v-if="noMoreToSee">
                <h4>You watched all episodes.</h4>
            </div>
            <div class="seenSelector" v-bind:class="{active: seenSelector}" v-on:click="showOnlyNotSeen()">
                <p>Episode non vue </p>
            </div>
            <div class="seenSelector" v-bind:class="{active: !seenSelector}" v-on:click="showAll()" style="margin-bottom: 20px;">
                <p>Tout les episodes </p>
            </div>
            <div class="d-flex column"  v-if="episodes.length || Allepisodes.length">
                <div class="containSeason">
                    <div class="seasonSelector" v-on:click="showSubMenu()">
                    <p>Saison {{episodes[0] && episodes[0].season}}</p> <span class="arrow"></span>
                    </div>
                    <div class="sub-menu">
                        <ul class="list">
                            <li class="item" v-for="i in nbrSeason" v-bind:key="i">
                                <p v-on:click="changeSeason(i)">Saison {{i}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-12" v-for="(episode, index) in episodes" v-bind:key="episode.id">
                    <div class='photo'>
                        <img v-bind:src="`https://api.betaseries.com/pictures/episodes?key=1d5f28cdef42&id=${episode.id}`">
                    </div>
                    <div class='d-flex flex-column'>
                        <div class='d-flex'>
                            <p class="episode-title">{{episode.episode}} : {{episode.title}}</p>
                            <p class="score">Recommandé à {{episode.recommended}} %</p>
                            <p class="episode-title">{{episode.date}}</p>
                            <p class="episode-title">{{episode.note.mean}}<i class="fas fa-star"></i></p>
                        </div>
                        <div class='text'>
                            <p class="description">{{episode.description}}</p>
                           <button class="btn" v-on:click="watchRequest($event, episode.id, false, episode, index)"><span><i class="far fa-eye" v-bind:class="{seen: check(episodes, index)}"></i></span></button>
                           <button class="btn" v-if="seenSelector" v-on:click="watchRequest($event, episode.id, true, episode, index)"><span>Marquer cette épisode et les épisode précédante comme vue</span></button>
                           <button class="btn" v-if="!seenSelector && AllepisodesNotSeen.filter((ep) => ep.id == episode.id).length == 0" v-on:click="commentEpisode(episode, episode.id)"><span>Commenter cette épisode</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "./Navbar";
import { dateChanger, getToken } from "../helpers";
export default {
    components:{
        Navbar
    },
    data(){
        return{
            AllepisodesNotSeen: [],
            Allepisodes: [],
            episodes: [],
            nbrSeason: 0,
            showMenu: false,
            user: JSON.parse(localStorage.getItem('user')),
            seenSelector: true,
            noMoreToSee: false
        }
    },
    methods:{
        showSubMenu(){
            this.showMenu = !this.showMenu
            const subMenu = document.querySelector('.sub-menu');
            if(this.showMenu){
                subMenu.style.opacity = 1;
            }
            else{
                subMenu.style.opacity = 0;
            }
        },
        changeSeason(i){
            const subMenu = document.querySelector('.sub-menu');
            if(subMenu.style.opacity == 1){
                if(this.seenSelector){
                    this.episodes = this.AllepisodesNotSeen.filter((ele) => ele.season == i)
                } else {
                    this.episodes = this.Allepisodes.filter((ele) => ele.season == i)
                }
                this.showSubMenu();
                this.$nextTick().then(() => this.onMountDivAnimation())
            }
        },
        onMountDivAnimation(){
            const col = document.querySelectorAll('.col-12');
            col.forEach((e, i) => {
                e.style.opacity = 0;
                setTimeout(() => {
                    e.style.opacity = 1;
                }, i * 750);
            })
        },
       async watchRequest(event, id, bulk, episode, index){
            event.stopPropagation();
            event.preventDefault();
            const seen = document.querySelectorAll('.far')[index];
            const classes = seen.classList;
            if(classes.length < 3){
                if(this.seenSelector){
                    if(!bulk){
                        this.episodes = this.episodes.filter((episode) => episode.id !== id)
                        this.AllepisodesNotSeen = this.AllepisodesNotSeen.filter((episode) => episode.id !== id)
                    } else {
                        this.episodes = this.episodes.filter((episode) => episode.id > id)
                        this.AllepisodesNotSeen = this.AllepisodesNotSeen.filter((episode) => episode.id > id)
                    }
                } else {
                    this.AllepisodesNotSeen = this.AllepisodesNotSeen.filter((episode) => episode.id !== id)
                    classes.add("seen");
                }
                const token = await getToken(this.user.id);
                this.axios
                    .post("https://api.betaseries.com/episodes/watched?key=1d5f28cdef42", {
                        id: id,
                        bulk: bulk,
                        token
                    })
                    .then((response) => {
                    })
                    .catch(err => console.log(err.response.data));
            }
            else {
                if(classes.contains('seen')){
                    classes.remove("seen");
                    this.AllepisodesNotSeen.push(episode);
                    const token = await getToken(this.user.id);
                    this.axios
                    .delete(`https://api.betaseries.com/episodes/watched?key=1d5f28cdef42&id=${id}&token=${token}`)
                    .then((response) => {
 
                    })
                    .catch(err => console.log(err.response.data))
                }
            }
        },
        showOnlyNotSeen(){
            this.seenSelector = true;
            for(let i = 1; i <= this.nbrSeason; i++){
                this.episodes = this.AllepisodesNotSeen.filter((ele) => ele.season == i);
                if(this.episodes.length > 0){
                    this.episodes = this.episodes.sort((a, b) => a.episode > b.episode ? 1 : -1) // sort by epiodes ascending 1-infini;
                    this.noMoreToSee = false; // There has some episode to watch
                    return;
                }
            }
            this.noMoreToSee = true; // No more episode to see, a message will be appear on the screen,
        },
        showAll(){
            this.seenSelector = false;
            this.episodes = this.Allepisodes.filter((ele) => ele.season == 1);
        },
        check(episodes, index){
            if(this.seenSelector) return false;
            const episodesNotSeen = this.AllepisodesNotSeen.filter((ele) => ele.season == episodes[index].season);
            const allEpisodes = this.Allepisodes.filter((ele) => ele.season == episodes[index].season);
             for(let i = 0; i < episodesNotSeen.length; i++){
                    if(allEpisodes[index].episode == episodesNotSeen[i].episode) return false;
            }
            return true;
        },
        commentEpisode(episode, id){
            this.$swal({
              title: `Commenter l'épisode ${episode.title}`,
              content: 'input',
              button: {
                  text: "Comment !",
                  closeModal: false,
              }
            })
            .then(async comment => {
                if(!comment) return this.$swal({
                     title: "Error",
                     text: "Vous ne pouvez pas laisser un commentaire vide",
                     icon: "error"
                })
                const token = await getToken(this.user.id);
                this.axios.post(`https://api.betaseries.com/comments/comment?key=1d5f28cdef42`, {
                    type: 'episode',
                    id,
                    text: comment,
                    token
                })
                .then((response) => {
                    return this.$swal({
                        title: "Commentaire envoyée !",
                        text: `Votre commentaire : \n\n ${comment} \n\n a étais envoyer avec succés !`,
                        icon: "success"
                    })
                })
                .catch(err => console.log(err.response.data));
            })
        },
    },
    async mounted(){
        const token = await getToken(this.user.id);
        this.axios
        .get(`https://api.betaseries.com/episodes/list?key=1d5f28cdef42&showId=${this.$route.params.id}&userId=${this.user.id}&token=${token}&limit=10000`)
        .then((response) => {
            console.log(response);
            if(response.data.shows.length > 0) {
                response.data.shows[0].unseen.forEach((episode) => {
                    episode.date = dateChanger(episode.date)
                    episode.note.mean = Number((episode.note.mean).toFixed(2))
                    episode.recommended = Math.floor((episode.note.mean / 5) * 100);
                    if(episode.season > this.nbrSeason){
                        this.nbrSeason = episode.season
                    }
                })
                console.log(response.data.shows)
                this.AllepisodesNotSeen = response.data.shows[0].unseen;
            }
            this.showOnlyNotSeen();
        })
        .catch(err => console.log(err.response.data))

        this.axios
        .get(`http://api.betaseries.com/shows/episodes?key=1d5f28cdef42&id=${this.$route.params.id}`)
        .then((response) => {
            response.data.episodes.forEach((episode) => {
                episode.date = dateChanger(episode.date)
                episode.note.mean = Number((episode.note.mean).toFixed(2))
                episode.recommended = Math.floor((episode.note.mean / 5) * 100);
                if(episode.season > this.nbrSeason){
                    this.nbrSeason = episode.season
                }
                this.Allepisodes = response.data.episodes;
            })
        })
    },
};
</script>

<style lang="sass">
@import '../assets/css/Show.sass'
</style>