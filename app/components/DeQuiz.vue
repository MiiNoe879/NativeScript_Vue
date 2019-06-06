<template>
    <GridLayout rows="45, *" @loaded="fetchData()" backgroundColor="#F3F4F7"
      padding="15">
      <ActivityIndicator busy="true" v-if="!quiz[0]"/>
      <StackLayout row="0" horizontalAlignment="center">
        <Label class="quiz-title" :text="quiz[0].title" textWrap="true" v-if="quiz[0]"/>
      </StackLayout>
      <StackLayout row="1" horizontalAlignment="center" v-if="quiz[0] && !userScore" >
        <!--<Label :text="JSON.stringify(quiz)" textWrap="true" />-->
            <GridLayout rows="auto, auto, *, auto" columns="*, auto">
              <Label row="0" col="0" fontSize="15" fontWeight="bold"
                :text="`QUESTION ${currentQuestionIndex + 1} / ${quiz[0].questionlist.questions.length}`"></Label>
              <Label row="0" col="1" fontSize="15" fontWeight="bold" text="END"></Label>
              <GridLayout row="1" col="0" colSpan="2" backgroundColor="#4A4A4A" height="20"
                  borderRadius="10" margin="10 0">
                  <StackLayout horizontalAlignment="left" backgroundColor="#F1C40F"
                      height="20" borderRadius="10" :width="`${currentQuestionIndex * 100 / quiz[0].questionlist.questions.length}%`"></StackLayout>
              </GridLayout>
              <GridLayout row="2" col="0" colSpan="2" backgroundColor="#d5d5d5" margin="5"
                  borderRadius="10">
                  <Label verticalAlignment="center" horizontalAlignment="center"
                      textAlignment="center" color="#333" fontSize="20" fontWeight="bold"
                      textWrap="true" :text="removeHTMLTags(quiz[0].questionlist.questions[currentQuestionIndex].question)"></Label>
              </GridLayout>
              <GridLayout row="3" col="0" colSpan="2" rows="*, *, *, *">
                <GridLayout v-for="(option, oidx) in quiz[0].questionlist.questions[currentQuestionIndex].options.list"
                    :row="oidx" height="60" margin="5" padding="5" backgroundColor="#F1C40F"
                    borderRadius="20" @tap="onOptionTap" :optionNumber="oidx">
                    <Label verticalAlignment="center" horizontalAlignment="center"
                        textAlignment="center" color="#fff" fontSize="15" fontWeight="bold"
                        textWrap="true" :text="option.text" ></Label>
                </GridLayout>
              </GridLayout>
            </GridLayout>

            <!--<GridLayout rows="*, auto" backgroundColor="#250046" v-if="userScore">
                <StackLayout row="0" verticalAlignment="center">
                    <Label textAlignment="center" color="#fff" fontSize="20" text="YOUR SCORE"></Label>
                    <Label marginTop="30" textAlignment="center" color="#fff" fontSize="60"
                        fontWeight="bold" :text="`${userScore}%`"></Label>
                </StackLayout>

                <GridLayout row="1" backgroundColor="#F1C40F" margin="20" width="150"
                    height="40" borderRadius="20" @tap="onRetakeTap">
                    <Label verticalAlignment="center" horizontalAlignment="center" color="#333"
                        fontSize="15" fontWeight="bold" text="RETAKE QUIZ"></Label>
                </GridLayout>
            </GridLayout>-->
      </StackLayout>
      <StackLayout row="1" horizontalAlignment="center" v-if="quiz[0] && userScore">
            <Label textAlignment="center" color="#333" fontSize="20" text="YOUR SCORE"></Label>
            <Label marginTop="30" textAlignment="center" color="#333" fontSize="60"
                fontWeight="bold" :text="`${userScore}%`"></Label>
            <Button text="RETAKE QUIZ" @tap="onRetakeTap" class="btn btn-primary"/>
      </StackLayout>
      <!--<StackLayout row="2" horizontalAlignment="center">
        <Label  :text="JSON.stringify(userQuiz)" textWrap="true" />
      </StackLayout>-->
        <!--<Label class="product-title" :text="quiz[0].title" textWrap="true" row="0" v-if="quiz"/>-->
    </GridLayout>
</template>

<script>
//import QuizScoreModal from "~/components/QuizScoreModal";
export default {
  props: ['quizId'],
  components: {
    //QuizScoreModal
  },
  data () {
    return {
      currentQuestionIndex: 0,
      userResponses: [],
      evaluatedQuiz:{
        title:null,
        evaluated:false,
        questions:[],
        userCorrect: null,
        total:null
      },
      retake: false,
      quizResults:null,
      showResultsModal: false,
      userScore: null
    }
  },
  computed: {
    quiz () {
      let quizarray = this.$store.state.quizzes
      //return this.$store.state.quizzes[this.quizId]
      var result = quizarray.filter(obj => {
        return obj.id === this.quizId
      })
      return result
    },
    userQuiz () {
      let userquizzes= this.$store.state.userQuizzes
      var result = userquizzes.filter(obj => {
        return obj.quizId === this.quizId
      })
      return result
    }
  },
  methods: {
    async fetchData () {
      console.log('fetching data')
      await this.$store.dispatch('getUserQuiz', this.quizId)

      // We should attempt to not load the quiz if the user quiz results are positive for this page's quiz.
      await this.$store.dispatch('getLessonQuiz', this.quizId)
    },
    onOptionTap (args) {
      console.log('option tapped: ', args.object.optionNumber)

      //console.log('selected option is right or wrong: ', this.quiz[0].questionlist.questions[this.currentQuestionIndex].options.list[parseInt(args.object.optionNumber)].isCorrect)
      this.userResponses[this.currentQuestionIndex] = args.object.optionNumber
      if (this.quiz[0].questionlist.questions[this.currentQuestionIndex].options.list[parseInt(args.object.optionNumber)].isCorrect) {
        args.object.backgroundColor = '#52B568'
      } else {
        args.object.backgroundColor = '#ff4b60'
      }
      setTimeout(
        () => {
          args.object.backgroundColor = '#F1C40F';
          if (this.currentQuestionIndex == this.quiz[0].questionlist.questions.length - 1) {
            this.evaluateQuiz();
          }
          else {
            this.currentQuestionIndex += 1;
          }
        }, 1000)
      //this.userResponses[this.currentQuestionIndex] = e
      //console.log('User Responses: ', this.userResponses)
      //e.object.backgroundColor = '#B6EB81'
    },
    async evaluateQuiz () {
      console.log('quiz ended')
      this.evaluatedQuiz.questions = []
      let questions = this.quiz[0].questionlist.questions
      let total = questions.length
      let userCorrect = 0
      let userResponses = this.userResponses
      console.log('User Responses', userResponses)
      questions.forEach(function(question, qindex){
        let index
        index = question.options.list.findIndex(option => option.isCorrect===true)
        console.log('correct choice and response: ', index, userResponses[qindex])
        if (userResponses[qindex]) {
          questions[qindex].options.list[parseInt(userResponses[qindex])].userResponse = true
        }

        if (index === parseInt(userResponses[qindex])) {
          userCorrect++
        }

        // copy.push(item*item);
      });
      this.evaluatedQuiz.questions = questions
      this.evaluatedQuiz.userCorrect = userCorrect
      console.log('User Correct: ', this.evaluatedQuiz.userCorrect)
      this.evaluatedQuiz.total = total
      this.evaluatedQuiz.evaluated = true
      this.evaluatedQuiz.title = this.quiz[0].title
      let payload = {quizid: this.quizId, quizdata: this.evaluatedQuiz}
      await this.$store.dispatch('submitUserQuiz', payload)
      this.userScore = userCorrect/total*100
      //this.$showModal(QuizScoreModal,{ fullscreen: true, props: { userScore: this.userScore }});
    },
    onRetakeTap () {
      this.currentQuestionIndex = 0
      this.userResponses = []
      this.evaluatedQuiz = {
        title:null,
        evaluated:false,
        questions:[],
        userCorrect: null,
        total:null
      }
      this.userScore = null
    },
    removeHTMLTags (content) {
      var result = content.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
      return result
    }
    /*onRowTap (i, args) {
      let option = args.object
      console.log('row tapping', i, e)
      option.backgroundColor = '#B6EB81'
    }*/
  }
}
</script>
<style scoped>
.quiz-title {
  font-size:18;
  font-family: "Asap-Bold";
  font-weight:bold;
}
</style>
