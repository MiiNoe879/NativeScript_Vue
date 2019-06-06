import DEAPI from '~/api/index.js';
import * as ApplicationSettings from "application-settings"

export default {
  feed(context, hunger) {
    context.commit('feed', hunger);
  },
  setusername({commit}, name) {
    commit('setusername', name);
  },
  loginUser( { state, commit }, data ){
    DEAPI.auth.loginuser( data )
      .then( function( response ){
        console.log('login response action: ', response.data.user)
        commit('setUser', response.data.user)
        ApplicationSettings.remove("token")
        ApplicationSettings.setString("authuser", JSON.stringify(response.data.user))
        ApplicationSettings.setString("token", response.data.token)
        console.log('state user', state.auth.user)
        return response.data.user
      })
      .catch( function(){
        //commit( 'setCafe', {} );
      });
  },
  setStoredUser({ commit }, data) {
    commit('setUser', data)
  },
  resetUser ({commit}) {
    commit('RESET_USER')
    ApplicationSettings.remove("authuser")
    ApplicationSettings.remove("token")
  },
  async getAuthUserPlans ({commit}) {
    //console.log('getting auth user plans')
    return DEAPI.product.getuserplans()
    .then(response => {
      //console.log('user plans response: ', response.data)
      commit('SET_AUTHUSER_PLANS', response.data.plans)
      return response
    })
    .catch(error => {
      console.log('product error: ', error)
      commit('RESET_USER')
      ApplicationSettings.remove("authuser")
      ApplicationSettings.remove("token")
      return error
    })
  },
  getLessonSets ({state, commit, dispatch}, collectionId) {
    console.log('lesson sets action: ', collectionId)
    return DEAPI.content.getlessonsets(collectionId)
    .then(response => {
      //console.log('fetched lesson sets: ', response.data.lessonsets)
      commit('SET_LESSONSETS', response.data.lessonsets)
      if (state.auth.user) {
        let ls = []
        response.data.lessonsets.forEach (lessonset => {
          ls.push(lessonset.id)
        })
        /*dispatch('getBulkTracking', ls)
          .then(result => {
            console.log('Got Bulk Tracking')
          })
          .catch(error => {
            console.log('bulk fetch tracking error', error)
          })*/
      }
      return response
    })
    .catch(error => {
      console.log('lesson fetch error: ', error)
      return error
    })
    // console.log('collection id: ', collectionId)
  },
  getLessonsinSet ({commit}, lessonsetId) {
    //console.log ('fetching lessons: ', lessonsetId)
    return DEAPI.content.getlessonsinset(lessonsetId)
    .then(response => {
      var payload = {lessonsetId: lessonsetId, lessons: response.data.lessons}
      //console.log('fetched lessons: ', response.data.lessons)
      commit('SET_LESSONSINSET', payload)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getLessonSet ({commit}, lessonsetId) {
    return DEAPI.content.getlessonset(lessonsetId)
    .then(response => {
      // var payload = {lessonsetId: lessonsetId, lessons: response.data.lessons}
      // console.log('fetched lessons: ', response.data.lessonset)
      commit('SET_LESSONSET', response.data.lessonset[0])
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getBulkTracking ({commit}, payload) {
    //console.log('getting Bulk Tracking', payload)
    return DEAPI.tracking.getbulktracking(payload)
    .then(response => {
      //console.log('bulk tracking response: ', response.data)
      commit('SET_LESSONSET_TRACKING_BULK', response.data)
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getMedia ({commit}, payload) {
    //console.log('media id: ', payload)
    return DEAPI.media.getmedia(payload)
    .then(response => {
      //console.log('fetched media: ', response.data.media)
      commit('SET_MEDIA', response.data.media)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getVimeoUrl ({commit}, payload) {
    //console.log('media id: ', payload)
    return DEAPI.media.getvimeourl(payload)
    .then(response => {
      console.log('fetched video data: ', response.data)
      commit('SET_VIMEO_URL', response.data)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getTranscript ({commit}, payload) {
    console.log('fetch transcript id: ', payload)
    return DEAPI.transcript.gettranscript(payload)
    .then(response => {
      console.log('fetched transcript: ', response.data.transcript)
      commit('SET_TRANSCRIPT', response.data.transcript)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getVocabWords ({commit}, payload) {
    return DEAPI.content.getvocabwords(payload.wordIds)
    .then(response => {
      var newpayload = {lessonsetId: payload.lessonsetId, words: response.data.words}
      // console.log('fetched words: ', response.data.words)
      commit('SET_LESSONSET_WORDS', newpayload)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getRelatedContent ({commit}, id) {
    console.log('getting related content: ', id)
    return DEAPI.media.getrelatedcontent(id)
    .then(response => {
      //console.log('fetched content: ', response.data.content)
      commit('SET_RELATEDCONTENT', response.data.content)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getLessonQuiz ({commit}, quizId) {
    return DEAPI.content.getquiz(quizId)
    .then(response => {
      // var payload = {lessonsetId: lessonsetId, lessons: response.data.lessons}
      //console.log('fetched quiz: ', response.data.quiz[0])
      let payload = {quizId:quizId, data: response.data.quiz[0]}
      commit('SET_LESSONQUIZ', payload)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  submitUserQuiz ({commit}, payload) {
    return DEAPI.content.submituserquiz(payload)
    .then(response => {
      //console.log('quiz submit success: ', response.data)
      // commit('SET_PAGE', response.data)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getUserQuiz ({commit}, quizId) {
    return DEAPI.content.getuserquiz(quizId)
    .then(response => {
      // var payload = {lessonsetId: lessonsetId, lessons: response.data.lessons}
      //console.log('fetched user quiz: ', response.data.quiz)
      // let payload = {quizId:quizId, data: response.data.quiz[0]}
      if (response.data.quiz[0]) {
        commit('SET_USERQUIZ', response.data.quiz)
      }
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getTranslation ({commit}, payload) {
    commit('RESET_TRANSLATION')
    return DEAPI.content.gettranslation(payload)
    .then(response => {
      console.log('translated text: ', response.data)
      commit('SET_TRANSLATION', response.data)
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  sendTracking ({commit}, payload) {
    return DEAPI.tracking.sendtracking(payload)
    .then(response => {
      let commitdata
      // console.log('LS tracking success: ', response.data)
      // commit('SET_PAGE', response.data)
      if (payload.section === 'LessonSet' && payload.data.status === 1) {
        commitdata = {id: payload.sectionId, data: {status:1}}
        commit('SET_LESSONSET_TRACKING', commitdata)
      }
      if (payload.section === 'LessonSet' && payload.data.status === 2) {
        commitdata = {id: payload.sectionId, data: {status:2}}
        commit('SET_LESSONSET_TRACKING', commitdata)
      }
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getBulkTracking ({commit}, payload) {
    console.log('getting Bulk Tracking', payload)
    return DEAPI.tracking.getbulktracking(payload)
    .then(response => {
      console.log('bulk tracking response: ', response.data)
      commit('SET_LESSONSET_TRACKING_BULK', response.data)
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getTracking ({commit}, payload) {
    if (payload.section === 'ProductWelcome') {
            commit('RESET_PRODUCTWELCOME')
    }
    // let payload1 = {'section': 'ProductWelcome', 'sectionId': 1, 'productId': 1}
    return DEAPI.tracking.gettracking(payload)
    .then(response => {
      let commitdata
      //console.log('tracking data data: ', response.data.data[0].data)
      if (payload.section === 'ProductWelcome' && response.data.data.length > 0) {
        commit('SET_PRODUCTWELCOME')
      }
      if (payload.section === 'LessonSet' && response.data.data.length > 0) {
        commitdata = {id: payload.sectionId, data: response.data.data[0].data}
        commit('SET_LESSONSET_TRACKING', commitdata)
      }
      //if (payload.section === 'LessonSet' && response.data.data.length === 0) {
        //commitdata = {id: payload.sectionId, data: {status:0}}
        //commit('SET_LESSONSET_TRACKING', commitdata)
      //}
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  removeTracking ({commit}, payload) {
    return DEAPI.tracking.removetracking(payload)
    .then(response => {
      let commitdata
      console.log('LS tracking remove success: ', response.data)
      // commit('SET_PAGE', response.data)
      if (payload.section === 'LessonSet') {
        commitdata = {id: payload.sectionId, data: {status:0}}
        commit('UNSET_LESSONSET_TRACKING', commitdata)
      }
      return response
    })
    .catch(error => {
      console.log(error)
      return error
    })
  },
  getBookmarks ({commit}) {
    return DEAPI.tracking.getbookmarks()
    .then(response => {
      console.log('Bookmarks re: ', response.data)
      commit('SET_BOOKMARKS', response.data)
      //if (payload.section === 'LessonSet' && response.data.data.length === 0) {
        //commitdata = {id: payload.sectionId, data: {status:0}}
        //commit('SET_LESSONSET_TRACKING', commitdata)
      //}
      return response.data
    })
    .catch(error => {
      console.log('bookmark error: ', error)
      commit('RESET_USER')
      ApplicationSettings.remove("authuser")
      ApplicationSettings.remove("token")
      return error
    })
  },
  addBookmark ({commit}, payload) {
    return DEAPI.tracking.addbookmark(payload)
    .then(response => {
      commit('ADD_BOOKMARK', payload)
      return response
    })
    .catch(error => {
      console.log('bookarking error', error)
      return error
    })
  },
  removeBookmark ({commit, dispatch}, payload) {
    console.log('Bookmarking action')
    return DEAPI.tracking.removebookmark(payload)
    .then(response => {
      dispatch('getBookmarks')
      //commit('ADD_BOOKMARK', payload)
      return response
    })
    .catch(error => {
      console.log('bookarking error', error)
      return error
    })
  }
}
