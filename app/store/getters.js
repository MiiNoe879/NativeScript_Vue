export default {
  cathappiness(state) {
      // the more hungry, the less happy
      return 100 - state.hungriness;
  },
  username(state) {
      // the more hungry, the less happy
      return state.username;
  }
}
