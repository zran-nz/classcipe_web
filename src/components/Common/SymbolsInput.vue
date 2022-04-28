<template>
  <div class="virtual_keyboard_input">
    <a-textarea
      id="input-area"
      placeholder="Insert tip for the slide"
      ref="inputRef"
      @blur="hideSymbolBtn()"
      @focus="showSymbolBtn()"
      :autoSize="{ minRows: 4, maxRows: 5 }"
      @keyup="inputValue"
      v-model="input_text"
      v-if="isAreaText"
    />
    <a-input
      size="large"
      id="input-area"
      @blur="hideSymbolBtn()"
      @focus="showSymbolBtn()"
      v-model="input_text"
      v-else
    />

    <div class="bundle-virtual-keyboard-wrapper" v-show="symbolBtnShow">
      <div style="position: relative;">
        <button class="keybtn-active" @click="showKeyBoard()">π</button>
        <div class="math-symbols-keyboard" v-show="keyboardShow">
          <div class="virtual_keyboard" @click="noCloseKeyBtn()">
            <div class="virtual_keyboard__header">
              <button class="virtual_keyboard__header-prev" @click="prevSymbol"><</button>
              <div class="virtual_keyboard__header-title">{{ MathSymbols[symbolIndex].name }}</div>
              <button class="virtual_keyboard__header-next" @click="nextSymbol">></button>
            </div>
            <div class="virtual_keyboard_body">
              <ul class="virtual_keyboard__list">
                <li
                  class="virtual_keyboard__list-item"
                  :style="item.length > 3 ? 'width:70px' : ''"
                  v-for="(item, index) in MathSymbols[symbolIndex].values"
                  :key="index"
                >
                  <button class="virtual_keyboard__list-item-button" @click="insertSymbol(item)">
                    {{ item }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// var chars = '+−=()AaÆᴂɐɑɒBbcɕDdðEeƎəɛɜɜfGgɡɣhHɦIiɪɨᵻɩjJʝɟKklLʟᶅɭMmɱNnɴɲɳŋOoɔᴖᴗɵȢPpɸqrRɹɻʁsʂʃTtƫUuᴜᴝʉɥɯɰʊvVʋʌwWxyzʐʑʒꝯᴥβγδθφχнნʕⵡ',

// sup = '⁺⁻⁼⁽⁾⁰¹²³⁴⁵⁶⁷⁸⁹ᴬᵃᴭᵆᵄᵅᶛᴮᵇᶜᶝᴰᵈᶞᴱᵉᴲᵊᵋᶟᵌᶠᴳᵍᶢˠʰᴴʱᴵⁱᶦᶤᶧᶥʲᴶᶨᶡᴷᵏˡᴸᶫᶪᶩᴹᵐᶬᴺⁿᶰᶮᶯᵑᴼᵒᵓᵔᵕᶱᴽᴾᵖᶲqʳᴿʴʵʶˢᶳᶴᵀᵗᶵᵁᵘᶸᵙᶶᶣᵚᶭᶷᵛⱽᶹᶺʷᵂˣʸᶻᶼᶽᶾꝰᵜᵝᵞᵟᶿᵠᵡᵸჼˤⵯ';
// sub='₀₁₂₃₄₅₆₇₈₉ₐᵦₑᵢₒᵣᵤᵥₓᵧ₍₎'
export default {
  name: 'Tip',
  props: {
    isAreaText: {
      type: Boolean,
      default: true
    },
    inputText: {
      type: String,
      default: null
    }
  },
  model: {
    prop: 'inputText',
    event: 'input'
  },
  computed: {
    input_text: {
      get() {
        return this.inputText
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      keyboardShow: false,
      symbolBtnShow: false,
      symbolIndex: 0,
      canCloseKeyBtn: false,
      currentIndex: 0,
      MathSymbols: [
        { name: 'Exponents', values: ['Xⁿ', 'Xᵤ', 'X²', 'X³', 'X⁴', '√'] },
        { name: 'Operators', values: ['+', '-', '×', '÷', '/', '±', '∑', '!', 'log()', 'ln()'] },
        { name: 'Angles', values: ['π', 'º', "'", "''", 'sin()', 'cos()', 'tan()', 'sin⁻¹()', 'cos⁻¹()', 'tan⁻¹()'] },
        { name: 'Functions', values: ['()', '[]', '{}', '||', 'ƒ’(x)', 'ƒ’’(x)', '∫'] },
        { name: 'superscript', values: ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'] },
        {
          name: 'subscript',
          values: ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', 'ₐ', 'ᵦ', 'ₑ', 'ᵢ', 'ₒ', 'ᵣ', 'ᵤ', 'ᵥ', 'ₓ', 'ᵧ']
        }
      ]
    }
  },
  methods: {
    noCloseKeyBtn() {
      console.log('test')
      this.setInputFocus()
      this.canCloseKeyBtn = false
    },
    hideSymbolBtn() {
      // 延迟200毫秒，等待其他事件先执行
      setTimeout(() => {
        console.log('hideSymbolBtn', this.canCloseKeyBtn)
        if (this.canCloseKeyBtn) {
          this.symbolBtnShow = false
          this.keyboardShow = false
        }
        this.canCloseKeyBtn = true
        console.log('hideSymbolBtn', this.canCloseKeyBtn)
      }, 200)
    },
    showSymbolBtn() {
      console.log('showSymbolBtn')
      this.symbolBtnShow = true
      this.setInputFocus()
    },
    setInputFocus() {
      const lastInput = document.getElementById('input-area')
      lastInput.focus()
      // this.$refs.inputRef.focus()
    },
    showKeyBoard() {
      console.log('showKeyBoard')
      this.canCloseKeyBtn = false
      this.keyboardShow = !this.keyboardShow
      this.setInputFocus()
    },
    prevSymbol() {
      if (this.symbolIndex > 0) {
        this.symbolIndex -= 1
      } else {
        this.symbolIndex = this.MathSymbols.length - 1
      }
    },
    nextSymbol() {
      if (this.symbolIndex < this.MathSymbols.length - 1) {
        this.symbolIndex += 1
      } else {
        this.symbolIndex = 0
      }
    },
    insertSymbol(item) {
      console.log('item', item)
      const lastInput = document.getElementById('input-area') // this.$refs.inputRef //
      console.log('input', lastInput.selectionStart)
      if (this.input_text === null || this.input_text === '') {
        this.input_text = item
      } else {
        this.input_text =
          this.input_text.substr(0, lastInput.selectionStart) +
          item +
          this.input_text.substring(lastInput.selectionStart)
      }

      this.setInputFocus()
    },
    inputValue(e) {
      // console.log(e)
      // const textValue = e.target.value
      // const lastInput = document.getElementById('input-area')
      // const inputKey = textValue.substr(lastInput.selectionStart - 1, 1)
      // console.log('inputKey', inputKey)
      // const keyIndex = this.normalList.indexOf(inputKey)
      // const supKey = this.suplist.charAt(keyIndex)
      // console.log('inputKey', inputKey, supKey)
      // if (supKey) {
      //   console.log('input_text11', inputKey, supKey, lastInput.selectionStart, this.input_text.length)
      //   this.input_text =
      //     this.input_text.substr(0, lastInput.selectionStart - 1) +
      //     supKey +
      //     this.input_text.substring(lastInput.selectionStart)
      // } else {
      //   this.input_text =
      //     this.input_text.substr(0, lastInput.selectionStart - 1) +
      //     this.input_text.substring(lastInput.selectionStart)
      //   console.log(lastInput.selectionStart, this.input_text.length)
      // }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/components/index.less';
.virtual_keyboard_input {
  margin-bottom: 20px;
  position: relative;
}
.bundle-virtual-keyboard-wrapper {
  position: absolute;
  bottom: -31px;
  z-index: 12;
}
.keybtn-active {
  background: #00a8ff;
  color: #ffffff;
}
.math-symbols-keyboard {
  position: absolute;
  top: 0;
  left: calc(100% + 5px);
}
.virtual_keyboard {
  width: 252px;
  background: #ffffff;
  border: 1px solid #b8c0c6;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgb(20 44 56 / 40%);
}
.virtual_keyboard__header {
  height: 33px;
  align-items: center;
  background: #f8fafb;
  border-bottom: 1px solid #b8c0c6;
  border-radius: 4px 4px 0 0;
  display: flex;
  text-align: center;
}
.virtual_keyboard__header-prev .virtual_keyboard__header-next {
  width: 30px;
  height: 100%;
  display: inline-block;
  margin: 0;
  padding: 0;
}
.virtual_keyboard__header-title {
  display: inline-block;
  flex: 1;
  text-align: center;
}
input,
button {
  border: 0 none;
  background: none;
  cursor: pointer;
}
.virtual_keyboard__list {
  padding: 5px;
}
.virtual_keyboard_body {
  display: flex;
}
.virtual_keyboard__list-item {
  height: 30px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
  position: relative;
  min-width: 30px;
}
.virtual_keyboard__list-item-button {
  width: 100%;
  background-color: #eaeef1;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgb(0 0 0 / 20%);
  color: #8b9195;
  display: inline-block;
  font-family: 'avenirmedium', Helvetica, Arial, sans-serif;
  font-size: 22px;
  padding: inherit;
  padding-top: 2px;
  text-align: center;
}
</style>
