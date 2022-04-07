<template>
  <div class='youtube-page'>
    <!-- <div class='open-google' @click='openYoutube'>
      open youtube
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="105px"
        height="54px">
        <image x="21px" y="0px" width="84px" height="54px" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAmCAMAAAC4TZh0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABXFBMVEX/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD///955BjmAAAAcnRSTlMACEBkfY6aprC5wsnQ19zg5ens7u/x8OHd0crDurKnnI9+Z0MOgujtiwcRzR7SXF3P0xcfSF9wq6X7/MD2+P3OyPr3+f7b1eby2efauMyou5V8UmUZKlpt2OMB33+RCjNbep2qtLzk6+riv7aeg3JgRhNXz4nXAAAAAWJLR0RzQQk9zgAAAAd0SU1FB+YDGhIbBbIz1x8AAAFhSURBVEjHndVXU8JAFAXgY0FESigJoKhgI3YpKgYLRKLE3hVF7L27//9Bgo46QxLYPY+5+ZLZO5kcQEtDY1OzpcXaamuzO5wuzu3x+nihHL/P63EHgs72jlBnV3c40tPb14/fDERJ3REHh77R8Ej9SItrtMLG6BQhQU2N0ypCJsosRs/iQIJeEZLEJAubwjQLi8DCwlKY0bsspc3ZLGy6bG5+wYxlkNUfyIs5xZgtYdloJOdkQ5gHZ/xMKScZTESYffyKJOvvhofPdGWKpLtUPwRiHiUtVS9VgEpqRalmas236UatcTaDCKD4jfxfSYCF8VhhYSIyLGwVIRa2hnUWtoFNFraFbRZmxQ4Ls2CXhe1hn4UdAJR9o4Urd8AhPTvSKqdAq45PNJagLLhi8qeET4v1I7V09tfe5xeXkavrm9uQPRYvuLi76H2l8/28+JB/DDod2afn1Evp9e3947Ny/xcFKEU9SpHexQAAAABJRU5ErkJggg==" />
        <text kerning="auto" font-family="Adobe Heiti Std" fill="rgb(0, 0, 0)" transform="matrix( 0.76026850993378, 0, 0, 0.76026850993378,39.9637504643871, 37.4908314839571)" font-size="27.35px"><tspan font-size="27.35px" font-family="SimHei" fill="#FFFFFF">T</tspan><tspan font-size="28.069px" font-family="SimHei" fill="#FFFFFF">ub</tspan><tspan font-size="28.069px" font-family="SimHei" fill="#FFFFFF">e</tspan></text>
        <text kerning="auto" font-family="Adobe Heiti Std" fill="rgb(0, 0, 0)" transform="matrix( 0.76026850993378, 0, 0, 0.76026850993378,0.74432862495019, 37.2296792507948)" font-size="27.35px"><tspan font-size="27.35px" font-family="SimHei">Y</tspan><tspan font-size="28.069px" font-family="SimHei">o</tspan><tspan font-size="28.069px" font-family="SimHei">u</tspan></text>
      </svg>

      <svg
        fill='#fff'
        height='14.001'
        style='margin-left: 10px'
        viewBox='0 0 14 14.001'
        width='14'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          id='打开'
          d='M44.133,45.937H33.867A1.867,1.867,0,0,1,32,44.07V33.8a1.867,1.867,0,0,1,1.867-1.867h5.6V33.8H34.8a.933.933,0,0,0-.933.933v8.4a.933.933,0,0,0,.933.933h8.4a.933.933,0,0,0,.933-.933V38.47H46v5.6A1.867,1.867,0,0,1,44.133,45.937Zm.933-9.334a.933.933,0,0,1-.933-.933v-.546l-5.871,5.87a.933.933,0,1,1-1.323-1.316h0L42.813,33.8h-.546a.933.933,0,0,1,0-1.867h2.8a.933.933,0,0,1,.933.933v2.8A.933.933,0,0,1,45.067,36.6Z'
          transform='translate(-32 -31.936)'
        />
      </svg>
    </div> -->

    <div class='youtube-input-class'>
      <img
        src="~@/assets/icons/material/youtube.png"
        class="youtube-input-icon"
        alt=''/>

      <a-input-search
        placeholder='input youtube video url'
        size="large"
        class='youtube-input'
        v-model="url"
        @search="onUrlInputed"
        @pressEnter="onUrlInputed"
        :allowClear="true"
      >
      </a-input-search>
      <!-- <a-input
        v-model='url'
        class='youtube-input'
        size="large"
        placeholder='input youtube video url'
        @input='onUrlInputed()'
      >

        <svg
          slot='suffix'
          :style='`margin-top: 10px; cursor: pointer; opacity: ${url ? 1 : 0.2}`'
          fill='#15c39a'
          height='20'
          viewBox='0 0 26 26.001'
          width='20'
          xmlns='http://www.w3.org/2000/svg'
          @click='refreshVideo'
        >
          <path
            id='刷新'
            d='M24.046,67.74l-4.351-5.392a1.127,1.127,0,0,0-1.8,0L13.558,67.74a.662.662,0,0,0,.45,1.05h1.65c0,3.151,0,7.19-5.7,10.486-.15.15,0,.3.15.3,10.638-1.65,11.538-8.837,11.538-10.785h1.8a.672.672,0,0,0,.6-1.05ZM10.407,69.09h-1.8c0-3.151,0-7.19,5.7-10.486.15-.15,0-.3-.15-.3C3.505,59.954,2.605,67.141,2.605,69.089H.82a.6.6,0,0,0-.45,1.05l4.336,5.392a1.127,1.127,0,0,0,1.8,0l4.351-5.392a.662.662,0,0,0-.45-1.05Zm0,0'
            transform='translate(-0.163 -58.304)'
          />
        </svg>
      </a-input> -->
    </div>

    <div class="youtube-video-con">
      <div class="youtube-video-item" v-for="(item, index) in videos" :key="'video'+index">
        <div class="youtube-video-img">
          <video
            width="230"
            height="120"
            :src="item.link"
            controlslist="nodownload"
            controls=""
            preload="auto"
            class="video-item"></video>
        </div>
        <div class="youtube-video-detail">
          <div class="video-detail-desc">
            {{ item.description }}
          </div>
          <div class="video-detail-time">
            {{ item.date }}
          </div>
        </div>
      </div>
    </div>

    <!-- <iframe
      :id='youtubePlayerId'
      :src='videoUrl'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;allow-presentation'
      allowfullscreen
      frameborder='0'
      height='315'
      title='YouTube video player'
      width='560'
    ></iframe>

    <div class='time--set'>
      <div class='time'>
        Starting time(s):
        <svg
          fill='#15c39a'
          height='20'
          style='margin-top: 5px; margin-left: 5px; cursor: pointer'
          viewBox='0 0 26 26.001'
          width='20'
          xmlns='http://www.w3.org/2000/svg'
          @click='refreshStartTime()'
        >
          <path
            id='刷新'
            d='M24.046,67.74l-4.351-5.392a1.127,1.127,0,0,0-1.8,0L13.558,67.74a.662.662,0,0,0,.45,1.05h1.65c0,3.151,0,7.19-5.7,10.486-.15.15,0,.3.15.3,10.638-1.65,11.538-8.837,11.538-10.785h1.8a.672.672,0,0,0,.6-1.05ZM10.407,69.09h-1.8c0-3.151,0-7.19,5.7-10.486.15-.15,0-.3-.15-.3C3.505,59.954,2.605,67.141,2.605,69.089H.82a.6.6,0,0,0-.45,1.05l4.336,5.392a1.127,1.127,0,0,0,1.8,0l4.351-5.392a.662.662,0,0,0-.45-1.05Zm0,0'
            transform='translate(-0.163 -58.304)'
          />
        </svg>

        <div class='time-number-div'>
          <a-input v-model='startTime' class='a-input--inner' @input='setStartTime'></a-input>

        </div>
        /{{ endTime }}seconds
      </div>
    </div> -->

    <div class='btn' @click='insert'>next</div>
  </div>
</template>
<script>

export default {
  props: {
    nextYoutube: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      youtubePlayerId: `youtubePlayerId${Math.random()}`,
      videoId: '',
      ytPlayer: null,
      startTime: 0,
      endTime: 0,
      url: '',
      videoUrl: '',
      delaySetTime: null,
      playerStatus: -1,
      playerStatusInterval: null,
      videos: [
          {
              'link': 'https://www.youtube.com/embed/_UR-l3QI2nE?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/_UR-l3QI2nE/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC SONG | ABC Songs for Children - 13 Alphabet Songs &amp; 26 Videos',
              'description': 'ABC Song and Alphabet Song Ultimate kids songs and baby songs Collection with 13 entertaining "English abcd songs" and 26 a ...',
              'date': '2014-05-01',
              'videoId': '_UR-l3QI2nE'
          },
          {
              'link': 'https://www.youtube.com/embed/71h8MZshGSs?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/71h8MZshGSs/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song + More Nursery Rhymes &amp; Kids Songs - CoComelon',
              'description': 'Subscribe for new videos every week! https://www.youtube.com/c/Cocomelon?sub_confirmation=1 A new compilation video, ...',
              'date': '2019-04-12',
              'videoId': '71h8MZshGSs'
          },
          {
              'link': 'https://www.youtube.com/embed/mRfQa-UT5-A?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/mRfQa-UT5-A/mqdefault.jpg',
              'size': 102400,
              'title': 'Encanto ABC - Learn to write ABC´s with MAGNATAB',
              'description': 'By SUBSCRIBING to our channel you help us grow! Thanks! Learn the alphabet with ENCANTO!. It is a great way to practice how ...',
              'date': '2022-03-05',
              'videoId': 'mRfQa-UT5-A'
          },
          {
              'link': 'https://www.youtube.com/embed/ezmsrB59mj8?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/ezmsrB59mj8/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song | Learn ABC Alphabet for Children | Education ABC Nursery Rhymes',
              'description': 'ABC Song | Learn ABC Alphabet for Children | Education ABC Nursery Rhymes ABC Alphabet Song Lyrics: ...',
              'date': '2017-12-19',
              'videoId': 'ezmsrB59mj8'
          },
          {
              'link': 'https://www.youtube.com/embed/75p-N9YKqNo?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/75p-N9YKqNo/mqdefault.jpg',
              'size': 102400,
              'title': 'The ABC Song',
              'description': "It's the classic ABC song with big and small letters. Arranged and performed by A.J. Jenkins. Copyright 2010 ...",
              'date': '2010-01-07',
              'videoId': '75p-N9YKqNo'
          },
          {
              'link': 'https://www.youtube.com/embed/wjpcusBGVWI?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/wjpcusBGVWI/mqdefault.jpg',
              'size': 102400,
              'title': 'Lingokids ABC Chant + More Songs for Kids 🎶 Lingokids Songs',
              'description': 'ABC Chant + More Songs for Kids | Check out our Songs for Kids Playlist ➽ https://bit.ly/songs-to-learn-english | Subscribe and ...',
              'date': '2021-04-16',
              'videoId': 'wjpcusBGVWI'
          },
          {
              'link': 'https://www.youtube.com/embed/67JzSRnyXr4?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/67JzSRnyXr4/mqdefault.jpg',
              'size': 102400,
              'title': 'Learn The Alphabet With Blippi | ABC Letter Boxes',
              'description': 'Blippi is here to help you learn the alphabet with letter boxes. Learn all 26 letters of the alphabet with Blippi while he opens the ...',
              'date': '2016-05-22',
              'videoId': '67JzSRnyXr4'
          },
          {
              'link': 'https://www.youtube.com/embed/TdzO7QG9vIQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/TdzO7QG9vIQ/mqdefault.jpg',
              'size': 102400,
              'title': 'Music Song + More Nursery Rhymes &amp; Kids Songs - CoComelon',
              'description': 'Subscribe for new videos every week! https://www.youtube.com/c/Cocomelon?sub_confirmation=1 A new compilation video, ...',
              'date': '2019-07-19',
              'videoId': 'TdzO7QG9vIQ'
          },
          {
              'link': 'https://www.youtube.com/embed/T9ViFtzplf8?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/T9ViFtzplf8/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song, Counting Numbers &amp; Learn Colors For Kids + More Educational Videos For Toddlers',
              'description': 'Teach ABCs, Numbers, Colors, Tracing Alphabets to Phonics. Get ready to listen to our compiled ABCD songs, counting ...',
              'date': '2022-01-16',
              'videoId': 'T9ViFtzplf8'
          },
          {
              'link': 'https://www.youtube.com/embed/tKsIi1MH4lw?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/tKsIi1MH4lw/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Phonics Song with Sounds for Children - Alphabet Song with Two Words for Each Letter',
              'description': 'This animated phonics song helps children learn the sounds of the letters in the English alphabet. Colorful characters teach kids ...',
              'date': '2019-06-20',
              'videoId': 'tKsIi1MH4lw'
          },
          {
              'link': 'https://www.youtube.com/embed/abxA_XtnRSc?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/abxA_XtnRSc/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Learn English Alphabet with Diana and Roma',
              'description': 'Diana and Roma open boxes with letters and learn the English Alphabet Subscribe to Kids Diana Show - http://bit.ly/2k7NrSx ...',
              'date': '2020-08-20',
              'videoId': 'abxA_XtnRSc'
          },
          {
              'link': 'https://www.youtube.com/embed/WP1blVh1ZQM?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/WP1blVh1ZQM/mqdefault.jpg',
              'size': 102400,
              'title': 'See It, Say It, Sign It | Letter Sounds | ASL Alphabet | Jack Hartmann',
              'description': 'See It, Say It, Sign It by Jack Hartmann teaches sign language for each letter and the letter sounds for each letter of the alphabet ...',
              'date': '2017-09-28',
              'videoId': 'WP1blVh1ZQM'
          },
          {
              'link': 'https://www.youtube.com/embed/ON5UiXqOgL4?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/ON5UiXqOgL4/mqdefault.jpg',
              'size': 102400,
              'title': 'Human Alphabet - Learning ABC for Kids - ABC Flashcards for Toddlers',
              'description': 'Hi Kiddos, in this video, we will watch how to form the alphabet while learning the words that are starting with each letter. Enjoy!',
              'date': '2021-02-02',
              'videoId': 'ON5UiXqOgL4'
          },
          {
              'link': 'https://www.youtube.com/embed/BNTCpF_n6J4?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/BNTCpF_n6J4/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song | Wendy Pretend Play Learning Alphabet w/ Toys &amp; Nursery Rhyme Songs',
              'description': 'Wendy and Lyndon pretend play learning their ABCs with toys and nursery rhyme song. Wendy is playing with her alphabet toys ...',
              'date': '2018-11-04',
              'videoId': 'BNTCpF_n6J4'
          },
          {
              'link': 'https://www.youtube.com/embed/x1fD8-WLv9k?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/x1fD8-WLv9k/mqdefault.jpg',
              'size': 102400,
              'title': 'The ABC Song with Cookies | Learn ABC Alphabet Song + More Nursery Rhymes &amp; Kids Songs - Super JoJo',
              'description': 'With yummy cookies to learn your ABCs! Super JoJo - Nursery Rhymes ...',
              'date': '2020-10-23',
              'videoId': 'x1fD8-WLv9k'
          },
          {
              'link': 'https://www.youtube.com/embed/YNZz2Blqdco?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/YNZz2Blqdco/mqdefault.jpg',
              'size': 102400,
              'title': 'Amy Schumer&#39;s Oscars 2022 Opening Monologue',
              'description': '94th Oscars host Amy Schumer gets the show started with her opening monologue. Watch more highlights from Oscars 2022 on ...',
              'date': '2022-03-28',
              'videoId': 'YNZz2Blqdco'
          },
          {
              'link': 'https://www.youtube.com/embed/g0xMTNKoIsM?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/g0xMTNKoIsM/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Phonics Song + More | Learn the Alphabet, Nursery Rhymes &amp; Kids Songs Busy Beavers',
              'description': 'Busy Beavers Teach Toddlers & Preschoolers the English Alphabet in this 70 Minute Compilation Packed with Catchy Songs ...',
              'date': '2021-02-06',
              'videoId': 'g0xMTNKoIsM'
          },
          {
              'link': 'https://www.youtube.com/embed/BHbeKrkKgI8?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/BHbeKrkKgI8/mqdefault.jpg',
              'size': 102400,
              'title': 'Tik Tokset &amp; PM - Në club, 3 Prill 2022 | ABC News Albania',
              'description': "KOSHERJA 'shtëpia e re e humorit' vjen cdo të dielë në 'shtëpinë' tuaj, nën regjinë dhe autorsinë e Altin Bashës. Ky program ...",
              'date': '2022-04-03',
              'videoId': 'BHbeKrkKgI8'
          },
          {
              'link': 'https://www.youtube.com/embed/YVvgCMZSkyw?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/YVvgCMZSkyw/mqdefault.jpg',
              'size': 102400,
              'title': 'Will Smith Accepts the Oscar for Lead Actor',
              'description': "Watch Will Smith's Oscar 2022 acceptance speech for Actor in a Leading Role for his portrayal of Richard Williams in KING ...",
              'date': '2022-03-28',
              'videoId': 'YVvgCMZSkyw'
          },
          {
              'link': 'https://www.youtube.com/embed/7MFlKEkQ0_A?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/7MFlKEkQ0_A/mqdefault.jpg',
              'size': 102400,
              'title': 'Learn ABC and Animals Song! + 2 HOURS of Nursery Rhymes and Kids Songs | Little Baby Bum',
              'description': 'Sing and Learn animals and letters with Little Baby Bum! SUBSCRIBE for new Little Baby Bum videos every week!',
              'date': '2022-03-19',
              'videoId': '7MFlKEkQ0_A'
          },
          {
              'link': 'https://www.youtube.com/embed/JhVAHfKm9Fw?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/JhVAHfKm9Fw/mqdefault.jpg',
              'size': 102400,
              'title': 'The Alphabet Hip-Hop + More | Learn ABC | Mother Goose Club Phonics Songs',
              'description': 'The Alphabet Hip-Hop and More Nursery Rhymes from Mother Goose Club! Sing along with your favorite Mother Goose Club ...',
              'date': '2018-06-11',
              'videoId': 'JhVAHfKm9Fw'
          },
          {
              'link': 'https://www.youtube.com/embed/TiNuLYBiQPU?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/TiNuLYBiQPU/mqdefault.jpg',
              'size': 102400,
              'title': 'DIY - How To Make ABC Train From Magnetic Balls (Satisfying and Relax) | Magnet World 4K',
              'description': 'DIY - How To Make ABC Train From Magnetic Balls (Satisfying and Relax) | Magnet World 4K Hi, Today i make abc train from ...',
              'date': '2019-07-14',
              'videoId': 'TiNuLYBiQPU'
          },
          {
              'link': 'https://www.youtube.com/embed/tKDb13AU1DQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/tKDb13AU1DQ/mqdefault.jpg',
              'size': 102400,
              'title': 'Will Smith and Jada Pinkett Smith Oscars 2022 Red Carpet Interview',
              'description': 'Watch Will Smith with Jada Pinkett Smith on the Oscars 2022 red carpet talking about KING RICHARD and what he hopes ...',
              'date': '2022-03-28',
              'videoId': 'tKDb13AU1DQ'
          },
          {
              'link': 'https://www.youtube.com/embed/zN4-GPVaQMM?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/zN4-GPVaQMM/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song with Balloons | CoComelon Nursery Rhymes &amp; Kids Songs',
              'description': 'Have fun learning the alphabet with this renewed classic balloon abc song! Subscribe for new videos every week: ...',
              'date': '2017-04-05',
              'videoId': 'zN4-GPVaQMM'
          },
          {
              'link': 'https://www.youtube.com/embed/88zaWBzu85I?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/88zaWBzu85I/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Alphabet Phonics song with Milusik Lanusik. Милусик учит английский алфавит',
              'description': 'Милусик учит английский алфавит ABC.',
              'date': '2019-03-01',
              'videoId': '88zaWBzu85I'
          },
          {
              'link': 'https://www.youtube.com/embed/PPNOv8j5Zps?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/PPNOv8j5Zps/mqdefault.jpg',
              'size': 102400,
              'title': 'Oscars producer reveals what LAPD said about Will Smith',
              'description': 'Will Packer speaks to ABC News in an exclusive interview about the moment Will Smith slapped Chris Rock onstage.',
              'date': '2022-04-01',
              'videoId': 'PPNOv8j5Zps'
          },
          {
              'link': 'https://www.youtube.com/embed/KTl7jh2SrRE?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/KTl7jh2SrRE/mqdefault.jpg',
              'size': 102400,
              'title': 'Binkie TV - Bowling Ball ABC Alphabet Song - Colors Fruits Fun',
              'description': 'Buy Coloring Book here: https://www.amazon.com/author/binkie #Bowling Ball showing #alphabet, colors, fruits and #nursery ...',
              'date': '2021-01-02',
              'videoId': 'KTl7jh2SrRE'
          },
          {
              'link': 'https://www.youtube.com/embed/RLERZgAO2xQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/RLERZgAO2xQ/mqdefault.jpg',
              'size': 102400,
              'title': 'Regina Hall, Amy Schumer and Wanda Sykes Welcome Everyone to the 94th Oscars',
              'description': 'Regina Hall, Amy Schumer and Wanda Sykes welcome everyone to the 94th Oscars. Watch more highlights from Oscars 2022 on ...',
              'date': '2022-03-28',
              'videoId': 'RLERZgAO2xQ'
          },
          {
              'link': 'https://www.youtube.com/embed/hq3yfQnllfQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/hq3yfQnllfQ/mqdefault.jpg',
              'size': 102400,
              'title': 'Phonics Song with TWO Words - A For Apple - ABC Alphabet Songs with Sounds for Children',
              'description': 'To download and watch this video anywhere and at any time, get the ChuChu TV Pro app now by clicking the below link!',
              'date': '2014-03-06',
              'videoId': 'hq3yfQnllfQ'
          },
          {
              'link': 'https://www.youtube.com/embed/BELlZKpi1Zs?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/BELlZKpi1Zs/mqdefault.jpg',
              'size': 102400,
              'title': 'Phonics Song 2',
              'description': "It's a phonics song with a picture for each letter. This is designed to help children learn the sounds of the letters in the English ...",
              'date': '2009-09-22',
              'videoId': 'BELlZKpi1Zs'
          },
          {
              'link': 'https://www.youtube.com/embed/_8m7yhtPsqc?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/_8m7yhtPsqc/mqdefault.jpg',
              'size': 102400,
              'title': '&quot;A-B-C, Easy as 1-2-3!&quot; by ABCmouse.com (originally by The Jackson 5)',
              'description': "Learning can truly be as easy as ABC, 1-2-3, and Do-Re-Mi! This full-length music video of ABCmouse's cover version of \"ABC\" by ...",
              'date': '2015-09-09',
              'videoId': '_8m7yhtPsqc'
          },
          {
              'link': 'https://www.youtube.com/embed/9LBlYU8Eei4?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/9LBlYU8Eei4/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song | Numbers Song | Colors Song | Shapes Song',
              'description': 'ABC Song | Numbers Song | Colors Song | Shapes Song 00:00 - Learn Alphabet with Gumball Machine 05:20 - Learn Colors with ...',
              'date': '2017-04-29',
              'videoId': '9LBlYU8Eei4'
          },
          {
              'link': 'https://www.youtube.com/embed/lNbl9iNb1UE?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/lNbl9iNb1UE/mqdefault.jpg',
              'size': 102400,
              'title': 'Ruby and Bonnie ABC Song with granny #shorts',
              'description': 'Ruby and Bonnie ABC Song with granny #shorts Subscribe to Ruby and Bonnie here→ https://bit.ly/3jVKS43 Ruby and Bonnie ...',
              'date': '2022-03-19',
              'videoId': 'lNbl9iNb1UE'
          },
          {
              'link': 'https://www.youtube.com/embed/jfvc12jHlTU?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/jfvc12jHlTU/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song تعلم الأبجدية الإنجليزية - أغاني الأطفال أغاني الأسرة للأطفال',
              'description': 'ABC Song تعلم الأبجدية الإنجليزية - أغاني الأطفال أغاني الأسرة للأطفال تعلم الأبجدية الإنجليزية وتعلم الألوان للأطفال الصغار.',
              'date': '2022-04-02',
              'videoId': 'jfvc12jHlTU'
          },
          {
              'link': 'https://www.youtube.com/embed/iXri4xxHmKE?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/iXri4xxHmKE/mqdefault.jpg',
              'size': 102400,
              'title': 'The ABC Song - Sing Along | @Cocomelon - Nursery Rhymes | Moonbug Literacy',
              'description': "It's time to learn the alphabet! Sing the ABCs along with us! Grow and learn with Moonbug. Recognising letters and word patterns ...",
              'date': '2021-10-05',
              'videoId': 'iXri4xxHmKE'
          },
          {
              'link': 'https://www.youtube.com/embed/eD1kBfXc5i8?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/eD1kBfXc5i8/mqdefault.jpg',
              'size': 102400,
              'title': 'Academy &#39;outraged&#39; at Will Smith',
              'description': "The Academy of Motion Picture Arts and Sciences promised to take “appropriate” action over Will Smith's slap at the Oscars. ABC ...",
              'date': '2022-03-30',
              'videoId': 'eD1kBfXc5i8'
          },
          {
              'link': 'https://www.youtube.com/embed/_2Sx_UGU2tI?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/_2Sx_UGU2tI/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Cookie Song | Sing Along | Learn Letters | @Super JoJo - Nursery Rhymes | Playtime with Friends',
              'description': 'Super JoJo - Playtime with Friends ▻ https://www.youtube.com/channel/UCJzcBX9R38KVkH7sWUn5apA?sub_confirmation=1 ...',
              'date': '2022-03-31',
              'videoId': '_2Sx_UGU2tI'
          },
          {
              'link': 'https://www.youtube.com/embed/jrsLMbQB6yI?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/jrsLMbQB6yI/mqdefault.jpg',
              'size': 102400,
              'title': 'Bath Song + More Nursery Rhymes &amp; Kids Songs - CoComelon',
              'description': 'Bath time for kids with Cody and CoComelon! Sing along to all your favorite CoComelon kids songs and nursery rhymes.',
              'date': '2022-03-19',
              'videoId': 'jrsLMbQB6yI'
          },
          {
              'link': 'https://www.youtube.com/embed/lXn3VhwwCsA?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/lXn3VhwwCsA/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Soup Song | CoComelon Nursery Rhymes &amp; Kids Songs',
              'description': "Let's learn our ABC's with alphabet soup! Sing along with CoComelon! Subscribe for new videos every week!",
              'date': '2021-08-26',
              'videoId': 'lXn3VhwwCsA'
          },
          {
              'link': 'https://www.youtube.com/embed/wlrvO4QvyIQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/wlrvO4QvyIQ/mqdefault.jpg',
              'size': 102400,
              'title': 'Teddy Bear Song + More Nursery Rhymes &amp; Kids Songs - CoComelon',
              'description': 'Play and sing along with JJ, YoYo and their Teddy Bears! Sing along to all your favorite CoComelon nursery rhymes. In this songs ...',
              'date': '2022-03-26',
              'videoId': 'wlrvO4QvyIQ'
          },
          {
              'link': 'https://www.youtube.com/embed/xY3Z8acE8ew?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/xY3Z8acE8ew/mqdefault.jpg',
              'size': 102400,
              'title': 'The ABC Song | CoComelon Nursery Rhymes &amp; Kids Songs',
              'description': "It's time to learn the alphabet! Sing the ABCs along with us! Subscribe for new videos every week: ...",
              'date': '2019-03-26',
              'videoId': 'xY3Z8acE8ew'
          },
          {
              'link': 'https://www.youtube.com/embed/lAQBTU9MUaM?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/lAQBTU9MUaM/mqdefault.jpg',
              'size': 102400,
              'title': 'Sacramento officials speak after tragic shooting',
              'description': 'This senseless epidemic of gun violence must be addressed,” said Mayor Darrell Steinberg during a news conference Sunday ...',
              'date': '2022-04-03',
              'videoId': 'lAQBTU9MUaM'
          },
          {
              'link': 'https://www.youtube.com/embed/Iy6Lvck2tMA?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/Iy6Lvck2tMA/mqdefault.jpg',
              'size': 102400,
              'title': 'Gas situation in Europe amid rising cost of fuel l GMA',
              'description': 'Russian gas is still flowing through European pipelines even though Vladimir Putin declared that he would cut off supplies if ...',
              'date': '2022-04-02',
              'videoId': 'Iy6Lvck2tMA'
          },
          {
              'link': 'https://www.youtube.com/embed/OpyqfWX86PM?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/OpyqfWX86PM/mqdefault.jpg',
              'size': 102400,
              'title': 'Fallout after the Oscars slap between Will Smith and Chris Rock | ABCNL',
              'description': 'Kelley Carter, senior entertainment reporter, and Stacey Schecter, supervising attorney, discuss the Oscars fallout as Will Smith ...',
              'date': '2022-03-29',
              'videoId': 'OpyqfWX86PM'
          },
          {
              'link': 'https://www.youtube.com/embed/cYdC7uBBFXQ?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/cYdC7uBBFXQ/mqdefault.jpg',
              'size': 102400,
              'title': 'LIVE: Oscars Pre-Ceremony Countdown | ABC News',
              'description': 'oscars Tune in to the Oscars on ABC Network at 8pm ET SUBSCRIBE to ABC News on YouTube: https://bit.ly/2vZb6yP Latest ...',
              'date': '2022-03-27',
              'videoId': 'cYdC7uBBFXQ'
          },
          {
              'link': 'https://www.youtube.com/embed/SWvBAQf7v8g?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/SWvBAQf7v8g/mqdefault.jpg',
              'size': 102400,
              'title': 'Sesame Street: Usher&#39;s ABC Song',
              'description': "Get ready to dance along to User's ABC Song because this alphabet song will have you on your feet and moving your body!",
              'date': '2013-10-01',
              'videoId': 'SWvBAQf7v8g'
          },
          {
              'link': 'https://www.youtube.com/embed/yqsux6Y1D1M?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/yqsux6Y1D1M/mqdefault.jpg',
              'size': 102400,
              'title': 'ABC Song - Bài hát ABC Tiếng Việt [ Full ] | Giúp Bé Học Chữ Cái Qua Bài hát | VOI TV',
              'description': 'Bảng chữ cái Tiếng Việt - Giúp bé yêu học bảng chữ cái, tập nói sớm và phát triển trí tuệ. Các bạn nhỏ nhớ đăng ký kênh và bấm ...',
              'date': '2018-07-16',
              'videoId': 'yqsux6Y1D1M'
          },
          {
              'link': 'https://www.youtube.com/embed/7K_xBKnVdCc?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/7K_xBKnVdCc/mqdefault.jpg',
              'size': 102400,
              'title': 'The cost of living&#39;s hitting hard but it&#39;s hitting people on the aged pension even harder | ABC News',
              'description': "The one issue that's showing up more than any other at the moment is the rise in the cost of living, and those on the aged pension ...",
              'date': '2022-04-03',
              'videoId': '7K_xBKnVdCc'
          },
          {
              'link': 'https://www.youtube.com/embed/M1ivLF1Aq9k?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/M1ivLF1Aq9k/mqdefault.jpg',
              'size': 102400,
              'title': 'Kadi - Përballja me veten, Kosherja, 3 Prill 2022 | ABC News Albania',
              'description': "KOSHERJA 'shtëpia e re e humorit' vjen cdo të dielë në 'shtëpinë' tuaj, nën regjinë dhe autorsinë e Altin Bashës. Ky program ...",
              'date': '2022-04-03',
              'videoId': 'M1ivLF1Aq9k'
          },
          {
              'link': 'https://www.youtube.com/embed/fdqNKul2hAA?showinfo=0&modestbranding=1&rel=0',
              'thumbnail': 'https://i.ytimg.com/vi/fdqNKul2hAA/mqdefault.jpg',
              'size': 102400,
              'title': 'Learn ABC&#39;s with Alphabet Ice Cream Popsicles Song | ABC Songs for Children',
              'description': "Learn ABC's with Alphabet Ice Cream Popsicles Song | ABC Songs for Children.",
              'date': '2017-10-11',
              'videoId': 'fdqNKul2hAA'
          }
      ]
    }
  },

  created() {
  },
  watch: {
    videoId() {
      this.loadScriptCallBack()
    }
  },
  mounted() {
    this.$logger.info(this.videoId, 'watch videoId')
  },
  methods: {
    loadScriptCallBack() {
      this.$nextTick(() => {
        this.ytPlayer = new window.YT.Player(this.youtubePlayerId, {
          events: {
            onReady: this.onYTReady,
            onStateChange: this.onYTStateChange
          }
        })
      })
    },
    closeYoutubeVideo() {
      this.stopVideo()
      setTimeout(() => {
        this.videoId = ''
        this.startTime = 0
        this.endTime = 0
        this.url = ''
        this.videoUrl = ''
        this.delaySetTime = null
        console.log('closeYoutubeVideo')
      }, 500)

      this.playerStatusInterval && clearInterval(this.playerStatusInterval)
    },
    onYTReady(event) {
      console.log(event, 'onYTReady')
      if (this.ytPlayer.getDuration) {
        this.endTime = this.ytPlayer.getDuration()
      }
    },
    onYTStateChange(event) {
      const state = event.data
      console.log(event, 'onYTStateChange')
      if (state === 5 && this.setTimePaly) {
        this.ytPlayer.mute()
        this.ytPlayer.playVideo()
      }
      if (state === 1 && this.setTimePaly) {
        this.ytPlayer.pauseVideo()
        this.setTimePaly = false
        this.ytPlayer.unMute()
      }
    },
    stopVideo() {
      if (this.ytPlayer && this.ytPlayer.pauseVideo && this.ytPlayer.clearVideo) {
        this.ytPlayer.pauseVideo()
        this.ytPlayer.clearVideo()
      }
    },
    setStartTime() {
      if (this.delaySetTime) clearTimeout(this.delaySetTime)
      this.delaySetTime = setTimeout(() => {
        this.delaySetTime = null
        if (this.ytPlayer.cueVideoByUrl) {
          this.ytPlayer.cueVideoByUrl(this.videoUrl, this.startTime)
          this.ytPlayer.mute()
        }
        this.setTimePaly = true
      }, 100)
    },
    openYoutube() {
      window.open('https://www.youtube.com/')
    },
    onUrlInputed() {
    },
    refreshVideo() {
      if (!this.url) return
      this.showVideo = true
      // https://youtu.be/hCVHjyjh3WI   https://www.youtube.com/watch?v=hCVHjyjh3WI&t=2187s˝
      this.getTime(this.url.split('?v=')[1].split('&')[0])
      let url = ''
      if (this.url.indexOf('https://youtu.be/') > -1) {
        this.videoId = this.url.split('?v=')[1].split('&')[0]
        url =
          'https://www.youtube.com/embed/' +
          this.url.split('?v=')[1].split('&')[0] +
          '?enablejsapi=1&rel=0'
        this.videoUrl = url + '&start=' + this.startTime
      } else if (this.url.indexOf('https://www.youtube.com') > -1) {
        this.videoId = this.url.split('?v=')[1].split('&')[0]
        url =
          'https://www.youtube.com/embed/' +
          this.url.split('?v=')[1].split('&')[0] +
          '?enablejsapi=1&rel=0'
      }
      this.videoUrl = url + '&origin=' + location.origin
      console.log(this.videoUrl)
    },
    refreshStartTime() {
      this.startTime = 0
    },
    getTime() {
    },
    insert() {
      console.log(this.url)
      if (!this.url || this.url.indexOf('youtube') < 0) {
        return
      }
      if (!this.videoUrl) {
        this.refreshVideo()
      }

      this.nextYoutube(this.videoUrl)
      this.url = ''
      this.startTime = 0
      this.endTime = 0
      this.videoUrl = ''
    }
  }
}
</script>

<style scoped lang="less">

.time-number-div .a-input__inner {
  border: 0 solid #15c39a;
  background-color: transparent !important;
}

.time-number-div {
  margin-left: 10px;
  display: flex;
  background-color: #efefef;
  border-radius: 2px;
  min-width: 60px;
  align-items: center;
  height: 35px;
}

.time-btn-div {
  display: flex;
  flex-direction: column;
}

.time--set {
  display: flex;
  height: 40px;
}

.time {
  color: #7e7e7e;
  font-size: 14px;
  font-family: Inter-Bold;
  display: flex;
  align-items: center;
}

.youtube-page {
  width: 900px;
  margin: 20px auto;
  overflow: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .youtube-input-class {
    display: flex;
    align-items: center;
    width: 100%;
    .youtube-input-icon {
      width: 100px;
      height: 50px;
    }
    .youtube-input {
      margin-left: 10px;
      flex: 1;
    }
  }
  .youtube-video-con {
    padding-left: 110px;
    width: 100%;
    height: 400px;
    overflow-y: auto;
    .youtube-video-item {
      display: flex;
      &.youtube-video-item {
        margin-top: 20px;
      }
      .youtube-video-img {
        width: 230px;
        height: 120px;
      }
      .youtube-video-detail {
        flex: 1;
        margin-left: 15px;
        text-align: left;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .video-detail-desc {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #282828;
        }
        .video-detail-time {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #939393;
        }
      }
    }
  }
}

iframe {
  border: 1px solid #15c39a;
}

.open_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  color: #15c39a;
  font-size: 18px;
  cursor: pointer;
}

.open-google {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
}

iframe {
  margin-top: 20px;
  margin-bottom: 20px;
}

.btn {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
}
</style>
