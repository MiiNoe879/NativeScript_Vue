export default {
  feed(state, hunger) {
    let satisfaction = parseInt(hunger);
    state.hungriness += satisfaction;
  },
  setusername(state, name) {
    state.username = name;
  },
  setUser (state, data) {
    state.auth.user = data
  },
  RESET_USER (state) {
    state.auth.user = null
  },
  SET_AUTHUSER_PLANS(state,payload) {
    state.authuser_plans = payload
    let userproducts = []
    payload.forEach (function(obj) {
      userproducts.push(obj.Product)
    })
    state.authuser_products = userproducts
  },
  SET_MEDIA (state, data) {
    state.media.push(data)
  },
  SET_VIMEO_URL (state, data) {
    state.videos.push(data)
  },
  SET_RELATEDCONTENT (state, data) {
    state.relatedcontent = state.relatedcontent.concat(data)
  },
  SET_TRANSCRIPT (state, data) {
    state.transcripts = state.transcripts.concat(data)
  },
  RESET_LESSONSETS (state) {
    state.lessonsets = []
  },
  SET_LESSONSETS (state, data) {
    state.lessonsets = data
  },
  SET_LESSONSET (state, data) {
    state.lessonsets[data.id] = data
  },
  SET_LESSONQUIZ (state, payload) {
    state.quizzes = state.quizzes.concat(payload.data)
  },
  SET_USERQUIZ (state, payload) {
    state.userQuizzes = state.userQuizzes.concat(payload)
  },
  SET_LESSONSETSLIMITED (state, payload) {
    state.lessonsetslimited[payload.collectionId] = payload.data
  },
  SET_LESSONSINSET (state, payload) {
    state.lessons[payload.lessonsetId] = payload.lessons
    // state.lessonsinset = data
    console.log('lesson mutation', state.lessons)
  },
  SET_LESSONSET_WORDS (state, data) {
    state.lessonwords[data.lessonsetId] = data.words
  },
  UPDATE_TRANSCRIPT_VISIBILITY (state, payload) {
    let lessonsetId = payload.lessonsetId
    var lessonarray = state.lessons[lessonsetId]
    // console.log('lessonarray: ', lessonarray)
    var pos = 0
    if (lessonarray) {
      lessonarray.forEach(function(e) {
        if( e.id === parseInt(payload.lessonId)) {
          pos++
        }
      })
      /*var result = lessonarray.filter(obj => {
        return obj.id === parseInt(payload.lessonId)
      })
      // console.log('result: ', result)
      if (result.length > 0) {
        return result[0]
      } else {
      }*/
      console.log(state.lessons[lessonsetId][pos-1].content.rows[payload.i-1].columns[payload.j].component)
      state.lessons[lessonsetId][pos-1].content.rows[payload.i-1].columns[payload.j].component.visible = payload.visible
    }
  },
  SET_TRANSLATION (state, payload) {
    state.translation = payload.translation
  },
  RESET_TRANSLATION (state) {
    state.translation = 'Loading...'
  },
  SET_PAGE (state, data) {
    state.currentPage = data.data[0]
  },
  SET_PRODUCTWELCOME (state, payload) {
    // false represents that it's already tracked so don't show.
    state.productWelcome = false
  },
  RESET_PRODUCTWELCOME (state) {
    state.productWelcome = true
  },
  SET_LESSONSET_TRACKING (state, payload) {
    state.lessonsetsTracking = []
    state.lessonsetsTracking.push(payload)
  },
  SET_LESSONSET_TRACKING_BULK (state, payload) {
    let ls = {}
    state.lessonsetsTracking = null
    let tracking = []
    payload.data.forEach (lessonset => {
      ls = {}
      ls.id = lessonset.sectionId.toString()
      ls.data = lessonset.data
      tracking.push(ls)
    })
    //console.log('tracking object:', tracking)
    state.lessonsetsTracking = tracking
    //console.log('tracking state:', state.lessonsetsTracking)
  },
  UNSET_LESSONSET_TRACKING (state, payload) {
    state.lessonsetsTracking = []
    // state.lessonsetsTracking.push(payload)
  },
  SET_BOOKMARKS (state, payload) {
    state.bookmarks = payload
    console.log('Bookmarks state: ', state.bookmarks)
  },
  ADD_BOOKMARK (state, payload) {
    let newpayload = {}
    newpayload.data = payload
    state.bookmarks.push(newpayload)
  }
}
