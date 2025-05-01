<template>
  <div class="masthead">
    <div class="container">
      <div class="masthead__content">
        <div class="flow flow-gap-3" data-aos="fade-up" data-aos-once="true">
          <slot name="tag" />
          <h1
            class="text-pretty"
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-delay="100"
          >
            <slot name="title" />
          </h1>
        </div>
      </div>
    </div>
    <!-- <div class="gradient" /> -->
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
.masthead-bottom-right {
  position: absolute;
  bottom: -2px;
  right: -1px;
  z-index: 9;
  border-radius: 1rem 0 0 0;
}
</style>
