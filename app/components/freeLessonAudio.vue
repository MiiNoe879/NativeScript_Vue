<template>
  <StackLayout horizontalAlignment="center">
    <GridLayout columns="100,*, 40, 40" rows="*">
      <Button class="btn btn-primary debluebg" :text="isPlaying ? 'Pause' : 'Play'" @tap="playPause" col="0" row="0" marginRight="0"/>
      <!--<Progress :value="progress" col="1" row="0" class="m-r-20"/>-->
      <Slider :value="progress" @valueChange="onValueChanged" col="1" row="0" class="m-r-20" :maxValue="maxduration" marginRight="0"/>
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
    audioTrack = 'https://deepenglish.com/audio/' + this.audio;
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
  },
  methods: {
    playPause() {
      if (this._player.isAudioPlaying()) {
        this._player.pause();
      } else {
        this._player.play();
      }
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
  font-size:20;
  padding:20;
}
Slider {
  color:#F1C40F;
}
</style>
