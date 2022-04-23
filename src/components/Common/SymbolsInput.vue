<template>
  <div>
    <a-textarea
      id="input-area"
      placeholder="Insert tip for the slide"
      :autoSize="{ minRows: 4, maxRows: 5 }"
      v-model="input_text"
    />
    <a-popover :visible="visible" placement="rightTop" trigger="click">
      <template #content>
        <div class="virtual_keyboard">
          <div class="virtual_keyboard__header">
            <button class="virtual_keyboard__header-prev" @click="prevSymbol"><</button>
            <div class="virtual_keyboard__header-title">{{ MathSymbols[symbolIndex].name }}</div>
            <button class="virtual_keyboard__header-next" @click="nextSymbol">></button>
          </div>
          <div class="virtual_keyboard_body">
            <ul class="virtual_keyboard__list">
              <li
                class="virtual_keyboard__list-item"
                v-for="(item, index) in MathSymbols[symbolIndex].values"
                :key="index"
              >
                <button class="virtual_keyboard__list-item-button" @click="insertSymbol(item)">{{ item }}</button>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <a-button type="primary">π </a-button>
    </a-popover>
  </div>
</template>
<script>
export default {
  name: 'Tip',
  data() {
    return {
      input_text: '',
      visible: false,
      symbolIndex: 0,
      MathSymbols: [
        { name: 'Exponents', values: ['Xⁿ', 'Xᵤ', 'X²', 'X³', 'X⁴', '√'] },
        { name: 'Operators', values: ['+', '-', '×', '÷', '/', '±', '∑', '!', 'log()', 'ln()'] },
        { name: 'Angles', values: ['π', 'º', "'", "''", 'sin()', 'cos()', 'tan()', 'sin⁻¹()', 'cos⁻¹()', 'tan⁻¹()'] },
        { name: 'Functions', values: ['()', '[]', '{}', '||', 'ƒ’(x)', 'ƒ’’(x)', '∫'] }
      ],
      suplist: '⁰¹²³⁴⁵⁶⁷⁸⁹'
    }
  },
  methods: {
    showMathSymbol() {
      console.log('showMathSymbol')
      this.visible = false
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
        this.input_text = 0
      }
    },
    insertSymbol(item) {
      console.log('item', item)
      const lastInput = document.getElementById('input-area')
      console.log('input', lastInput.selectionStart)
      this.input_text =
        this.input_text.substr(0, lastInput.selectionStart) +
        item +
        this.input_text.substring(lastInput.selectionStart, this.input_text.length)
        // this.input_text = this.input_text + item
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/components/index.less';
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
