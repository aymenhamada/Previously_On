<template>
  <div>
    <div class="container-fluid mt-4">
      <img src="../assets/img/yinyang netflix.png" />
    </div>
    <div class="container">
      <div class="row">
        <div
          class="col-8 offset-2 col-md-5 offset-md-4 col-lg-5 offset-lg-3 col-xl-5 offset-xl-3 contouring"
        >
          <div class="mt-5 ml-5">
            <h3 class="size">S'identifier</h3>
          </div>
          <form class="ml-5 mr-5 mt-4" @submit="checkForm">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="login"
                name="login"
                placeholder="E-mail ou numéro de téléphone"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                v-model="password"
                name="password"
                placeholder="Mot de passe"
              />
            </div>
            <button type="submit" class="btn btn-danger">S'identifier</button>
            <div class="signup d-flex">
              <p>Première visite sur yinYang ?</p>
              <a href="https://www.betaseries.com/inscription/" target="_blank"   rel="noopener noreferrer" class="ml-2">Inscrivez-vous</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
      login: null,
      password: null,
      logged: false,
      user: null
    };
  },
  methods: {
    checkForm: function(e) {
      e.preventDefault();
      this.axios
        .post("http://localhost:4242/login", {
          login: this.login,
          password: this.password
        })
        .then(response => {
          this.logged = true;
          this.user = response.data;
          localStorage.setItem("user", JSON.stringify(this.user));
          location.replace("http://localhost:8080/");
        })
        .catch(err => {
          if (err.response.data.errors) {
            let error = "";
            err.response.data.errors.forEach(element => {
              error = error + `- ${element.text}\n`;
            })
            this.$swal({
              title: "Error",
              text: error,
              icon: "error"
              });
          }
        });
    }
  }
};
</script>

<style lang="sass">
@import '../assets/css/Login.sass'
</style>