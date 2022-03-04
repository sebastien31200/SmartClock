<template>
  <div>
    <div class="text-h4 pa-2 mt-1" style="word-wrap: break-word; width:800px">
      {{ quote }}
    </div>
    <div class="text-h6 pa-2 mt-1">
      - {{ author }} ({{ birth }} - {{ death }})
    </div>
  </div>
</template>

<script>
import axios from "axios";

var citationUrl =
  "https://citations.ouest-france.fr/apis/export.php?json&key=464fzer5&t=day";

export default {
  data: function() {
    return { quote: "", author: "", birth: "", death: "" };
  },
  mounted: function() {
    axios.get(citationUrl).then(response => {
      this.quote = response.data.quote;
      this.author = response.data.name;
      this.birth = response.data.birth;
      this.death = response.data.death;
    });
  }
};
</script>
