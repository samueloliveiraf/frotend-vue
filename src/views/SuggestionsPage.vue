<template>
  <div class="iframe-container">
    <iframe src="https://appcuca.com.br/page/activies/" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'SuggestionsPage',
  props: {
    msg: String
  }
}
</script>

<style scoped>
h1 {
  color: white;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.iframe-container {
  height: 100vh;
  overflow: hidden;
}

iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
