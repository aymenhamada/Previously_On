<template>
  <div>
    <nav
      class="navbar fixed-top navbar-expand-sm navbar-expand-md navbar-expand-lg navbar-expand-xl navbar-light"
    >
      <router-link to="/" class="navbar-brand ml-4" href="#">
        <img src="../assets/img/yinyang_navbar.png" class='logo' />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/">
              Accueil
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Séries</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/films">Films</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/friends">Amis</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Ma liste</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <label :data-searchbar="searchbar" for="search" class="d-inline">
            <input
              class
              type="search"
              placeholder="Search"
              @mouseleave="searchbar = 'close'"
              aria-label="Search"
              v-on:input="(event) => this.$emit('inputChange', event)"
            />
            <img
              src="../assets/img/search.png"
              class="loupe"
              aria-hidden="true"
              @click="searchbar = 'open'"
              @blur="searchbar = 'close'"
            />
          </label>

<ul class="navbar-nav mr-auto color">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src="../assets/img/img_user.png" width="48" />
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </form>
        <button class="btn btn-danger" @click="logOff()">Deconnexion</button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchbar: "close"
    };
  },
  methods: {
    logOff(){
      if(localStorage.getItem('user')){
        localStorage.removeItem('user');
        localStorage.removeItem('userShows');
        location.replace('http://localhost:8080/home');
      }
    }
  },
   created(){
    window.onscroll = function(e){
      const navbar = document.querySelector('.navbar');
      let opacity = window.scrollY / 100;
      if(window.scrollY > 100){
        navbar.style.backgroundColor = "rgb(0, 0, 0, 1)"
      }
      else{
        navbar.style.backgroundColor = `rgb(0, 0, 0, ${opacity})`;
      }
    }
  }
};
</script>

<style lang="sass">
@import '../assets/css/Navbar.sass'
</style>