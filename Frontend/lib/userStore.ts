import store from './store'

store.defineState({
  user: null,
  isAuthenticated: false
})

store.defineGetters({
  isLoggedIn: () => store.getState('isAuthenticated')
})

store.defineActions({
  setUser: (user: any) => {
    store.setState('user', user)
    store.setState('isAuthenticated', true)
  },
  logout: () => {
    store.setState('user', null)
    store.setState('isAuthenticated', false)
  }
})

export default store