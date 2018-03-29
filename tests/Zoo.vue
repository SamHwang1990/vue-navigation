<template>
    <div @click="navigation.navigate('photo', { name: ~~(Math.random() * 100) })">Zoo Component: {{ JSON.stringify(navigation.state.params) }}</div>
</template>
<script>
    module.exports = {
      name: 'Zoo'
    }
</script>