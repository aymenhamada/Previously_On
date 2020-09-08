import Vue from 'vue'
import Router from 'vue-router'
import Accueil from '../components/Accueil'
import User from '../components/User'
import Signup from '../components/Signup'
import Login from '../components/Login'
import Home from '../components/Home'
import Show from "../components/Show"
import Films from "../components/Films"
import Friends from "../components/Friends";

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes:
    [{
      path: '/home',
      name: 'Accueil',
      component: Accueil,
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/show/:id',
      name: 'Show',
      component: Show
    },
    {
      path: '/membre',
      name: 'Membre',
      component: User
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/films',
      name: "Films",
      component: Films
    },
    {
      path: '/friends',
      name: "Friends",
      component: Friends
    },
    {
      path: '*',
      redirect: '/'
    }]
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', ,'/home', '/register'];
  const authRequired = publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (to.path == '/' && !loggedIn) {
    return next('/home');
  }

  if (!authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})