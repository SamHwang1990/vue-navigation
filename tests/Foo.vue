<template>
    <div>
        Foo Navigator Default Screen
        <div class="button" id="profile_nav" @click="navigation.navigate('profile', {})">Go to a profiles screen</div>
        <div class="button" @click="navigation.goBack()">Go Back</div>
    </div>
</template>
<script>
  module.exports = {
    name: 'Foo',
    data: function() {
      return {
        styleScope: {
          button: {
            display: 'block',
            height: 50,
            margin: '10px',
            padding: '10px',
            align: 'center middle',
            backgroundColor: '#1eadff'
          }
        }
      }
    }
  }
</script>