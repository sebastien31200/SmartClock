<template>
  <div v-if="success">
    <v-card elevation="10" class="ma-3 pa-2" width="550" max-height="220">
      <v-list-item-icon>
        <v-icon size="40" color="light-blue lighten-1">mdi-silverware</v-icon>
        <v-list-item-title class="display-1 light-blue--text text--lighten-1 ml-2">Menu</v-list-item-title>
      </v-list-item-icon>
      <div class="ma-1 headline">
        <ul>
          <li
            v-for="item in recipes.slice(0, 4)"
            v-bind:key="item.content"
            v-bind:style="item.style"
          >{{ item.content }}</li>
        </ul>
      </div>
    </v-card>
  </div>
  <div v-else>
    <v-skeleton-loader class="ma-3 pa-2" type="paragraph@2" elevation="10" height="150" width="550"></v-skeleton-loader>
  </div>
</template>

<script>
import axios from "axios";

if (process.env.NODE_ENV == "development") {
  var axiosInstance = axios.create({ baseURL: "http://100.115.92.206:3000" });
} else {
  axiosInstance = axios;
}

export default {
  data: function() {
    return {
      recipes: [],
      success: false
    };
  },

  methods: {
    updateRecipe() {
      axiosInstance.get("/recettes").then(response => {
        console.log(response);
        response.data.content.forEach(element => {
          if (element.textContent.length > 1) {
            var content = element.textContent;
            if (Object.prototype.hasOwnProperty.call(element, "textStyle")) {
              var textStyle = element.textStyle;
              var colorStyle = "";
              var fontSize = "";
              var boldStyle = "";
              var italicStyle = "";

              if (
                Object.prototype.hasOwnProperty.call(
                  textStyle,
                  "foregroundColor"
                )
              ) {
                var red = textStyle.foregroundColor.color.rgbColor.red;
                var green = textStyle.foregroundColor.color.rgbColor.green;
                var blue = textStyle.foregroundColor.color.rgbColor.blue;

                var r = red == undefined ? 0 : Math.round(red * 255);
                var g = green == undefined ? 0 : Math.round(green * 255);
                var b = blue == undefined ? 0 : Math.round(blue * 255);

                colorStyle = "color: rgb(" + r + "," + g + "," + b + ")";
              }
              if (Object.prototype.hasOwnProperty.call(textStyle, "fontSize")) {
                fontSize = ";font-size:" + textStyle.fontSize.magnitude;
              }
              boldStyle = Object.prototype.hasOwnProperty.call(
                textStyle,
                "bold"
              )
                ? ";font-weight: bold"
                : "";
              italicStyle = Object.prototype.hasOwnProperty.call(
                textStyle,
                "italic"
              )
                ? ";font-style:italic"
                : "";
            }
            var style = colorStyle + fontSize + boldStyle + italicStyle;
            this.recipes.push({ content: content, style: style });
          }
        });
        this.success = true;
      });
    }
  },

  mounted: function() {
    this.updateRecipe();
  }
};
</script>