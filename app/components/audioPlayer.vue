<template>
  <StackLayout horizontalAlignment="center" @loaded="fetchData()" class="audio-player">
    <Label class="media-title" :text="media.title" textWrap="true" v-if="media"/>
    <GridLayout columns="100,*, 40, 40" rows="*">
      <Button class="btn btn-primary debluebg" :text="isPlaying ? 'Pause' : 'Play'" @tap="playPause" col="0" row="0" marginRight="0"/>
      <!--<Progress :value="progress" col="1" row="0" class="m-r-20"/>-->
      <Slider :value="progress" @valueChange="onValueChanged" col="1" row="0" class="m-r-20" :maxValue="maxduration" marginRight="0" backgroundColor="#4F8AB6"/>
      <Label class="fa backward" text.decode="&#xf04a; " @tap="backThirty" col="2" row="0" verticalAlignment="center" fontSize="20" marginLeft="0"/>
      <Label class="fa forward" text.decode="&#xf04e; " @tap="forwardThirty" col="3" row="0"verticalAlignment="center" fontSize="20"/>
    </GridLayout>

  </StackLayout>
</template>

<script>
const { isIOS } = require('tns-core-modules/platform');
const { TNSPlayer } = require('../nativescript-audio');
export default {
  data() {
    return {
      progress: 0,
      isPlaying: false,
      maxduration: 100
    }
  },
  props: ['audio'],
  created () {
    //this.fetchData()
  },
  mounted() {
    this._player = new TNSPlayer();
    let audioTrack;
    if (this.media) {
      audioTrack = this.media.url;
    } else {
      audioTrack = "https://sample-videos.com/audio/mp3/crowd-cheering.mp3";
    }
    const playerOptions = {
      audioFile: audioTrack,
      loop: false,
      autoplay: false,
    };

    this._player
      .initFromUrl(playerOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("something went wrong...", err);
      });

    this._checkInterval = setInterval(() => {
      this._player.getAudioTrackDuration().then(duration => {
        // iOS: duration is in seconds
        // Android: duration is in milliseconds
        let current = this._player.currentTime
        if (isIOS) {
          duration *= 1000
          current *= 1000
        }
        this.maxduration = duration;
        this.progress = current; // Math.ceil(current / duration * 100);

        this.isPlaying = this._player.isAudioPlaying()
      });
    }, 200)
  },
  destroyed() {
    clearInterval(this._checkInterval)
  },
  computed: {
    testmedia () {
      return 'https://www.w3schools.com/html/horse.mp3'
    },
    media () {
      let media = this.$store.state.media
      var result = media.filter(obj => {
        return obj.id === this.audio.asset_id
      })
      return result[0]
    },
  },
  watch: {
    media: function(val) {
      console.log('media changed: ', val)
      this.changeTrack()
    }
  },
  methods: {
    async fetchData () {
      let media_id = this.audio.asset_id
      let media = this.$store.state.media
      var result = media.filter(obj => {
        return obj.id === this.audio.asset_id
      })
      if (result.length === 0) {
        await this.$store.dispatch('getMedia', media_id)
      }
    },
    playPause() {
      if (this._player.isAudioPlaying()) {
        this._player.pause();
      } else {
        this._player.play();
      }
    },
    changeTrack() {
      console.log('Changing track to: ', this.media.url)
      const playerOptions = {
          audioFile: this.media.url, //https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
          loop: false,
          autoPlay: false
      };
      this._player
        .playFromUrl(playerOptions)
        .then(function(res) {
          console.log('changed track response: ', res);
        })
        .catch(function(err) {
          console.log('something went wrong..', err);
        });
      /*if (this._player.isAudioPlaying()) {
              this._player.pause();
      }*/
    },
    onValueChanged () {
      console.log('value changed', this.progress, this.maxduration)
      //this._player.seekTo(this.progress)
    },
    forwardThirty () {
      let newTime = this._player.currentTime + 30000
      this._player.seekTo(newTime)
      this.progress = newTime
    },
    backThirty () {
      let newTime = this._player.currentTime - 30000
      this._player.seekTo(newTime)
      this.progress = newTime
    }
  }
}
</script>
<style scoped>
.media-title {
  text-align:center;
  font-size:17;
  padding:10 15 8 15;
}
.audio-player {
  height:110;
}
Slider {
  color:#F1C40F;
}
</style>
