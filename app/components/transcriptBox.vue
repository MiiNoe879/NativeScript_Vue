<template>
  <StackLayout horizontalAlignment="center" @loaded="fetchData()">
    <!--<TextView :text="plainText"></TextView>-->
    <GridLayout rows="auto, *">
      <TextView editable="false" backgroundColor="transparent" @longPress="onLongPress" @loaded="onLoadTextView" class="target transcriptBox" ref="transcript" row="1">
        <FormattedString>
          <Span :text="item.text" v-for="item in formattedTextMap" :fontWeight="item.fontWeight ? 'Bold' : false"/>
        </FormattedString>
      </TextView>
      <Fab
              @tap="showSelection()"
              row="1"
              icon="~/images/translate-icon.png"
              rippleColor="#f1f1f1"
              class="fab-button"
              v-if="showButton"
            ></Fab>
    </GridLayout>
    <!--<Button class="btn btn-outline" text="Show Selection" @tap="showSelection()" row="2" v-if="showButton"/>-->
    <!--<WebView :src="transcript.content.content" v-if="transcript"/>-->
  </StackLayout>
</template>

<script>
import {parse} from 'himalaya';
var utilsModule = require("tns-core-modules/utils/utils");
import translationModal from "~/components/translationModal";
export default {
  data() {
    return {
      selectedText: 'Nothing Selected',
      showButton:false
    }
  },
  props: ['data'],
  created () {
    //this.fetchData()
  },
  computed: {
    transcriptTreeMap () {
      if (this.transcript) {
        console.log(this.transcript);
        console.log('Transcript Map: ', parse(this.transcript.content.content));
        return parse(this.transcript.content.content)
      } else {
        return [{"type":"element","tagName":"p","attributes":[],"children":[{"type":"text","content":"Loading..."}]}]
      }
    },
    formattedTextMap () {
      let textMap = []
      let spanItem = null
      this.transcriptTreeMap.forEach (item => {
        if(item.tagName === 'p') {
          item.children.forEach(child => {
            //child.content = child.content
            if (child.type === 'text') {
              child.content = this.formatSpan(child.content)
              spanItem = {'text':child.content}
              textMap.push(spanItem)
            }
            if (child.type === 'element') {
              if (child.children[0].type === 'text') {
                child.children[0].content = this.formatSpan(child.children[0].content)
                spanItem = {'text':child.children[0].content}
                if (child.tagName === 'strong') {
                  spanItem.fontWeight = 'Bold'
                }
                textMap.push(spanItem)
              }
            }
          })
          textMap.push({'text':'\n\n'})
        }
      })
      return textMap
    },
    plainText () {
      let rawText = ''
      this.transcriptTreeMap.forEach (item => {
        if(item.tagName === 'p' || item.tagName === 'div') {
          item.children.forEach(child => {
            if (child.type === 'text') {
              child.content = this.formatSpan(child.content)
              rawText = rawText.concat(child.content)
            }
            if (child.type === 'element') {
              if (child.children[0].type === 'text') {
                child.children[0].content = this.formatSpan(child.children[0].content)
                rawText = rawText.concat(child.children[0].content)
              }
            }
          })
          rawText = rawText.concat('  ')
        }
      })
      return rawText
    },
    transcript () {
      let transcripts = this.$store.state.transcripts
      var result = transcripts.filter(obj => {
        return obj.id === this.data.transcript_id
      })
      return result[0]
    },
    userlang () {
      return (this.$store.state.auth || {}).user.lang || {"code": "en","language": "English"}
    },
  },
  methods: {
    onLongPress(args) {
        /*this.log.unshift({
            text: "You performed a long press"
        });*/
        console.log("pressed data textview: ", args.object["text"]); //args.eventName, args.viuew
        //var nativeView = new android.widget.TextView(args.context);
        let mytext = args.object;
        //mytext.nativeView.setText("Native");
        console.log('Selection Start', mytext.nativeView.getSelectionStart);
        this.showButton = true

    },
    showSelection() {
      console.log('selection....') // ._nativeView , this.$refs.transcript
      //for (let key in this.$refs.transcript._nativeView.nativeView) console.log(key);
      console.log('selection start....', this.$refs.transcript._nativeView.nativeView.getSelectionStart());
      console.log('selection end....', this.$refs.transcript._nativeView.nativeView.getSelectionEnd());
      console.log(this.plainText.substring(this.$refs.transcript._nativeView.nativeView.getSelectionStart(), this.$refs.transcript._nativeView.nativeView.getSelectionEnd()));
      this.selectedText = this.plainText.substring(this.$refs.transcript._nativeView.nativeView.getSelectionStart(), this.$refs.transcript._nativeView.nativeView.getSelectionEnd());
      //console.log('text....', this.$refs.transcript._nativeView.nativeView.getText()) ;
      this.translate(this.selectedText)
      this.showButton = false
    },
    async translate (sentence) {
      let payload = {'sentence': sentence, 'lang': this.userlang}
      this.showButton = false
      this.$showModal(translationModal,{ props: payload});

    },
    async fetchData () {
      if (this.data.transcript_id) {
        console.log('transcript: ', this.data.transcript_id)
        let transcript_id = this.data.transcript_id
        let transcripts = this.$store.state.transcripts
        var result = transcripts.filter(obj => {
          return obj.id === this.data.transcript_id
        })
        if (result.length === 0) {
          await this.$store.dispatch('getTranscript', transcript_id)
        }
      }
    },
    downloadMedia () {
      console.log('downloading')
      utilsModule.openUrl(this.media.url)
    },
    formatSpan (content) {
      let newcontent = content.replace('&nbsp;', ' ')
      newcontent = newcontent.replace('&ldquo;', '"')
      newcontent = newcontent.replace('&rdquo;', '"')
      newcontent = newcontent.replace('&rsquo;', "'")
      newcontent = newcontent.replace('&#8217;', "'")
      newcontent = newcontent.replace('&#8221;', "'")
      return newcontent
    },
    onLoadTextView(args) {
      console.log('text view loaded');
      args.object.nativeView.setTextIsSelectable(true);
    },
  }
}
</script>
<style scoped>
.transcriptBox {
  padding: 0 10;
}
</style>
