<template>
  <div>
    <div :style="{ transform: 'rotateZ(' + direction + 'deg)'}">
      <v-icon
        id="wind-icon"
        v-for="i in speedLevel"
        v-bind:key="i"
        :size="30"
        :style="{ transform: ' translateY('+ 8*i +'px)'}"
      >mdi-arrow-down</v-icon>
    </div>
    <div id="div-spd-value">{{this.speed}}</div>
  </div>
</template>

<script>
export default {
  props: { speed: Number, direction: String, iconIndex: Number },
  computed: {
    /* 0-10km/h: 1, 10-20km/h: 2, 20-30km/h: 3 */
    speedLevel: function() {
      var speedLevel = (this.speed - (this.speed % 10)) / 10 + 1;
      //var speedLevel = 3;
      // console.log("speed: " + this.speed + "index: " + speedLevel);
      // console.log("icon index " + this.iconIndex);
      return speedLevel;
    }
  }
};
</script>

<style>
#div-spd-value {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  transform: translateX(40px);
  color: var(--wind-color);
}

#wind-icon {
  position: absolute;
  bottom: 0%;
  left: 40%;
  color: var(--wind-color);
}
</style>