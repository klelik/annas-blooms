<template>
  <div>
    <template v-if="error?.statusCode === 404">
      <Masthead>
        <template #title>
          404! <br />
          <!-- {{ error?.statusMessage }} -->
        </template>
      </Masthead>
    </template>
    <template v-else>
      <Masthead>
        <template #title>
          <!-- {{ error?.statusCode }} <br />
          {{ error?.statusMessage }} -->
          shit happens! <br />
        </template>
      </Masthead>
    </template>
  </div>
</template>

<script setup lang="ts">
const error = useError();
console.log('error', error.value);
</script>
