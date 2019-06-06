import ImgixClient from 'imgix-core-js'


export const getImageUrl = (url, options) => {
  if (!url || url.length === 0) return 'https://deapp.imgix.net/contentmeta/Core_Audio.png?w=288&h=181&s=6aeae2d1ad6ee73eda3b9681c6546d9d'
  let client = new ImgixClient({
    domains: 'deapp.imgix.net',
    secureURLToken: '5576NB5NbYnwzCFU'
  })
  options.auto = 'compress'
  return client.buildURL(url, options)
}
