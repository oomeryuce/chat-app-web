import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'InfiniteLoadingExtra',
  extends: InfiniteLoading,
  methods: {
    getCurrentDistance() {
      let distance = 0
      if (this.direction === 'top') {
        distance = isNaN(this.scrollParent.scrollTop)
          ? this.scrollParent.pageYOffset
          : this.scrollParent.scrollTop
      } else if (this.direction === 'left') {
        distance = isNaN(this.scrollParent.scrollLeft)
          ? this.scrollParent.pageXOffset
          : this.scrollParent.scrollLeft
      } else if (this.direction === 'bottom') {
        const infiniteElmOffsetTopFromBottom =
          this.$el.getBoundingClientRect().top
        const scrollElmOffsetTopFromBottom =
          this.scrollParent === window
            ? window.innerHeight
            : this.scrollParent.getBoundingClientRect().bottom
        distance = infiniteElmOffsetTopFromBottom - scrollElmOffsetTopFromBottom
      } else if (this.direction === 'right') {
        const infiniteElmOffsetLeftFromRight =
          this.$el.getBoundingClientRect().left
        const scrollElmOffsetLeftFromRight =
          this.scrollParent === window
            ? window.innerWidth
            : this.scrollParent.getBoundingClientRect().right
        distance = infiniteElmOffsetLeftFromRight - scrollElmOffsetLeftFromRight
      }
      return distance
    },

    getScrollParent(elm = this.$el) {
      let result
      if (elm.tagName === 'BODY') {
        result = window
      } else if (
        !this.forceUseInfiniteWrapper &&
        (((this.direction === 'top' || this.direction === 'bottom') &&
          ['scroll', 'auto'].indexOf(getComputedStyle(elm).overflowY) > -1) ||
          ((this.direction === 'left' || this.direction === 'right') &&
            ['scroll', 'auto'].indexOf(getComputedStyle(elm).overflowX) > -1))
      ) {
        result = elm
      } else if (
        elm.hasAttribute('infinite-wrapper') ||
        elm.hasAttribute('data-infinite-wrapper')
      ) {
        result = elm
      }
      return result || this.getScrollParent(elm.parentNode)
    },
  },
}
