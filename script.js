(() => {
  const pickRandomGIF = () => {
    const initialGIFs = [
      'https://i.imgur.com/emSvYMy.gif',
      'https://i.imgur.com/9mv2XGt.gif',
    ]
    const randomIndex = Math.floor(Math.random() * Math.floor(initialGIFs.length))
    return initialGIFs[randomIndex]
  }
  
  const onFormSubmit = (e) => {
    e.preventDefault()
    
    const gifURL = form['gif_url'].value
    const ytURL = form['youtube_url'].value
    
    const ytRegEx = /\/watch\?v=([a-zA-Z0-9]+)$/
    const gifRegEx = /^https?:\/\/[a-zA-Z0-9\.\/]+\.gifv?$/
    
    let errors = []
    
    if (gifURL.match(gifRegEx) === null) errors.push(['error_gif_url', 'GIF link error'])
    if (ytURL.match(ytRegEx) === null) errors.push(['error_youtube_url', 'YT link error'])
    
    const error_len = errors.length;
    
    if (error_len > 0) {
      document.getElementsByClassName('error_gif_url')[0].innerHTML = ''
      document.getElementsByClassName('error_youtube_url')[0].innerHTML = ''
      for (let i = 0; i < error_len; ++i)
        document.getElementsByClassName(errors[i][0])[0].innerHTML = errors[i][1]
      
      return
    }
  
    showGifView(gifURL, ytURL.match(ytRegEx)[1])
  }
  
  const showGifView = (gifURL, ytURL) => {
    document.getElementById('welcome_view').style.display = 'none'
    document.getElementById('gif_view').style.display = 'initial'
    
    document.getElementById('main_gif').src = gifURL
    
    ytPlayer.play(ytURL)
    document.getElementById('yt_embed_container').style.display = 'none'
  }
  
  // set the background GIF on load
  document.getElementById('bg_gif').src = pickRandomGIF()
  
  // attach submit event handler to form
  const form = document.forms[0]
  form.addEventListener('submit', onFormSubmit)
})()

const ytPlayer = (() => {
  // a reference to the youtube player
  let player = undefined
  
  
  const onPlayerReady = (event) => {
    player = event.target
  }
  
  const config = {
    width: '640',
    height: '360',
    // see: https://developers.google.com/youtube/player_parameters#Parameters
    playerVars: {
      // hide the youtube logo
      'modestbranding': 1,
      // disable controls
      'controls': 1,
      // disable keyboard control
      'disablekb': 1,
      // disable related videos
      'rel': 0,
      // disable info
      'showinfo':  0
    },
    events: {
      'onReady': onPlayerReady
    }
  }

  const init = (elm) => {
    new window.YT.Player(elm, config)
  }
  
  const play = (ytURL) => {
    console.log('playing: ', ytURL)
    console.log(player)
    player.loadVideoById({
      videoId: ytURL,
      startSeconds: 0
    })
  }
  
  return {
    init,
    play
  }
})()


const fullScreenBrowser = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  document.getElementsByClassName('fullscreen_btn')[0].style.display = 'none'
}

// Called after YouTube API is loaded
window.onYouTubeIframeAPIReady = () => {
  ytPlayer.init('yt_embed_container')
}