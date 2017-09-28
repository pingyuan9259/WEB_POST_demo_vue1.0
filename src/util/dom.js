export default {
  scrollTop (p = 0) {
    if (document.body) {
      document.body.scrollTop = p
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = p
    }
  }
}
