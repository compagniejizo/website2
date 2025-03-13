<script setup>
import { useData } from "vitepress";
import { ref, onMounted } from "vue";

const liste = ref([]);

onMounted(async () => {
  let content = import.meta.glob("/artistes/**/*.md");

  for (const path in content) {
    if (path != '/artistes/index.md') {
      try {
        const module = await content[path]();
        console.log(module);
        liste.value.push({
          name: module?.__pageData?.frontmatter?.name,
          // date: module?.__pageData?.frontmatter?.date,
          // lieu: module?.__pageData?.frontmatter?.lieu,
          link: path
                .replace("/artistes/",'')
                .replace(".md", "")
                .replace("index","")
        });
      } catch (error) {
        console.error("Error loading ${path}");
      }
    }
  }

  liste.value.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

});
</script>
<template>
  <div>
    <h1>Nos artistes</h1>
    <div class="grid-container">
      <div v-for="elem in liste" :key="elem" class="grid">
        <div class="card">
          <h3><a :href="'/artistes/'+elem.link">{{ elem.name }}</a></h3>
          <!-- <p>{{ elem.date }}</p>
          <p>{{ elem.lieu }}</p>
          <p>{{ elem.lien }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
                .grid-container {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                  gap: 15px;
                  width: 90%;
                  max-width: 1000px;
                }
        
                .card {
                  background: white;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
        
                .card h3 {
                  margin-bottom: 10px;
                  font-size: 1.2em;
                }
        
                .card p {
                  font-size: 0.9em;
                  color: #555;
                }
</style>

