<template>
	<Page class="page">
		<ActionBar title="Audio" class="action-bar" />
		<ScrollView>
			<StackLayout class="home-panel">
				<Progress :value="progress" />
				<Button class="btn btn-primary" :text="isPlaying ? 'Pause' : 'Play'" @tap="playPause" />
        <ActivityIndicator busy="true"  /> <!--@busyChange="onBusyChanged" -->
			</StackLayout>
		</ScrollView>
	</Page>
</template>

<script>
const { isIOS } = require('tns-core-modules/platform');
const { TNSPlayer } = require('../nativescript-audio');
export default {
  data() {
    return {
      progress: 0,
      isPlaying: false,
    }
  },
  mounted() {
    this._player = new TNSPlayer();
    const playerOptions = {
      audioFile: "https://www.w3schools.com/html/horse.mp3",
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

        this.progress = Math.ceil(current / duration * 100);

        this.isPlaying = this._player.isAudioPlaying()
      });
    }, 200)
  },
  destroyed() {
    clearInterval(this._checkInterval)
  },
  methods: {
    playPause() {
      if (this._player.isAudioPlaying()) {
        this._player.pause();
      } else {
        this._player.play();
      }
    },
  }
};
</script>
