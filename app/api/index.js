import axios from 'axios'
const baseURL = 'https://api.deepdev.xyz'
axios.defaults.baseURL = baseURL
import * as ApplicationSettings from "application-settings"
let token = ApplicationSettings.getString('token')
let options = {
   headers: {
      Authorization: token
   }
}

export default {
  auth: {
    //loginuser: (user) => axios.post('https://reqres.in/api/login', user),
    loginuser: (data) => axios.post('https://api.deepdev.xyz/api/users/login', data),
    //fetchuser: () => axios.get('api/users/')
  },
  product: {
    getproducts: () => axios.get('api/products/'),
    getproductcollections: (data) => axios.get('api/productcollections/', {
      params: {ids: data}
    }),
    getcheckoutproduct: (productId) => axios.get('api/singleproduct/' + productId),
    getproductsbyuserid: (data) => axios.get('api/getproductsbyuserid/', {
      params: {userId: data.userId, productId: data.productId}
    }),
    getproductplan: (data) => axios.get('api/productplan/', {
      params: {productId: data.productId, planName: data.planName}
    }),
    getuserproducts: () => axios.get('api/getuserproducts/'),
    getuserplans: () => axios.get('https://api.deepdev.xyz/api/getuserplans/', {
       headers: {Authorization: ApplicationSettings.getString('token')}
    })
  },
  content: {
    getlessonsets: (collectionId) => axios.get('https://api.deepdev.xyz/api/lessonsets/' + collectionId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getlessonsetslimited: (collectionId) => axios.get('https://api.deepdev.xyz/api/lessonsetslimited/' + collectionId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getlessonsinset: (lessonsetId) => axios.get('https://api.deepdev.xyz/api/lessonsinset/' + lessonsetId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getlessonset: (lessonsetId) => axios.get('https://api.deepdev.xyz/api/lessonset/' + lessonsetId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getquiz: (quizId) => axios.get('https://api.deepdev.xyz/api/quiz/' + quizId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getuserquiz: (quizId) => axios.get('https://api.deepdev.xyz/api/userquiz/' + quizId, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    submituserquiz: (payload) => axios.post('https://api.deepdev.xyz/api/userquiz/', payload, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getvocabwords: (data) => axios.get('api/vocabwords/', {
      params: {ids: data},
      headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    gettranslation: (data) => axios.get('https://api.deepdev.xyz/api/translate', {
        params: data,
        headers: {Authorization: ApplicationSettings.getString('token')}
    })
  },
  media: {
    getmedia: (id) => axios.get('https://api.deepdev.xyz/api/mediasigned/' + id, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getvimeourl: (id) => axios.get('https://api.deepdev.xyz/api/vimeo/' + id, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getrelatedcontent: (id) => axios.get('https://api.deepdev.xyz/api/relatedcontent/' + id, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    })
  },
  transcript: {
    gettranscript: (id) => axios.get('https://api.deepdev.xyz/api/transcript/' + id, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    })
  },
  page: {
    getpage: (id) => axios.get('api/page/' + id)
  },
  tracking: {
    sendtracking: (payload) => axios.post('https://api.deepdev.xyz/api/track', payload, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    gettracking: (data) => axios.get('https://api.deepdev.xyz/api/track', {
        params: data,
        headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getbulktracking: (data) => axios.get('https://api.deepdev.xyz/api/track/bulk', {
        params: {ids: data},
        headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    getbookmarks: (data) => axios.get('https://api.deepdev.xyz/api/bookmarks', {
        headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    removetracking: (payload) => axios.post('https://api.deepdev.xyz/api/track/remove', payload, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    addbookmark: (payload) => axios.post('https://api.deepdev.xyz/api/addbookmark', payload, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    }),
    removebookmark: (payload) => axios.post('https://api.deepdev.xyz/api/removebookmark', payload, {
       headers: {Authorization: ApplicationSettings.getString('token')}
    })
  }
}
