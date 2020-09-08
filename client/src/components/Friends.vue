<template>
    <div>
        <Navbar/>
        <div class="container-fluid marged">
            <div class="d-flex parent">
                <div class="d-flex column" v-if="friends">
                    <h3>Your friends</h3>
                    <div v-for="(user, index) in friends" v-bind:key="index" class="friendContainer">
                        <p>{{user.login}} xp: {{user.xp}}</p>
                        <button class="btn btn-danger" @click="deleteFriend(user.id)">Delete</button>
                        <button class="btn btn-danger" @click="block(user.id)">Block</button>
                    </div>
                </div>
                <div class="d-flex">
                    <label  for="search" class="d-inline">
                    <input
                        type="search"
                        placeholder="Search for a friends..."
                        v-on:input="searchFriends($event)"
                    />
                    <img
                        src="../assets/img/search.png"
                        class="loupe"
                    />
                    <ul v-if="usersFind">
                         <li v-for="(user, index) in usersFind" v-bind:key="index">
                             <p>{{user.login}} xp: {{user.xp}}</p>
                            <button class="btn btn-success" @click="addUser(user.id, user.login, user.xp)">+ ADD</button>
                        </li>
                    </ul>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "./Navbar";
import { getToken } from '../helpers';
export default {
    components:{
        Navbar
    },
    data(){
        return{
            user: JSON.parse(localStorage.getItem('user')),
            friends: [],
            usersFind: null,
        }
    },
    methods:{
        searchFriends(e){
            const { value } = e.target;
            if(value.length > 1) {
                this.axios.get(`https://api.betaseries.com/members/search?key=1d5f28cdef42&login=${value}`)
                .then((response) => {
                    const { data } = response;
                    if(data.users.length > 0){
                        console.log(data.users);
                       this.usersFind =  data.users;
                    } else {
                        console.log("hi")
                        this.usersFind = null;
                    }
                })
                .catch(err => console.log(err.response.data));
            } else {
                this.usersFind = null;
            }
        },
        async addUser(id, login, xp){
            const token = await getToken(this.user.id);
            const isAlreadyAddded = this.friends.filter(friend => friend.id == id);
            if(isAlreadyAddded.length == 0 && this.user.id !== id){
                this.friends.push({id, login, xp});
                this.axios.post('https://api.betaseries.com/friends/friend?key=1d5f28cdef42', {
                    id,
                    token
                })
                .then((response) => {
                })
                .catch(err => console.log(err))
            }
        },
        async deleteFriend(id){
            this.friends = this.friends.filter((user) => user.id !== id);
            const token = await getToken(this.user.id);
            this.axios.delete(`https://api.betaseries.com/friends/friend?key=1d5f28cdef42&id=${id}&token=${token}`)
            .then((response) => {
            })
            .catch(err => console.log(err));
        },
        async block(id){
            const token = await getToken(this.user.id);
            this.axios.post(`https://api.betaseries.com/friends/block?key=1d5f28cdef42&id=${id}&token=${token}`)
            .then((response) => {
                console.log(response)
            })
            .catch(err => console.log(err));
        }
    },
   async mounted(){
        const token = await getToken(this.user.id);
        this.axios
            .get(` https://api.betaseries.com/friends/list?key=1d5f28cdef42&id=${this.user.id}&blocked=true&token=${token}`)
            .then((response) => {
                console.log(response)
                this.friends = response.data.users;

            })
            .catch(err => console.log(err.response.data))

        this.axios.get(`https://api.betaseries.com/friends/requests?key=1d5f28cdef42&received=true&token=${token}`)
        .then((response) => {
            console.log(response.data);
        })
        .catch(err => console.log(err.response.data));
    },
};
</script>

<style lang="sass">
@import "../assets/css/Friends.sass"
</style>