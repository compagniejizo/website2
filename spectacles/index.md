---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
} from 'vitepress/theme'

import VPTeamMembers from '../components/VPTeamMembers.vue'

import { ref, onMounted } from "vue";
import {withBase } from "vitepress";

const members = ref([]);

onMounted(async () => {
  let content = import.meta.glob("/spectacles/**/*.md");

  for (const path in content) {
    if (path != '/spectacles/index.md') {
      try {
        const module = await content[path]();
        console.log(module);
        members.value.push({
        //   name: module?.__pageData?.frontmatter?.name,
          avatar: withBase(module?.__pageData?.frontmatter?.image),
          name: module?.__pageData?.frontmatter?.title,
          // date: module?.__pageData?.frontmatter?.date,
          // lieu: module?.__pageData?.frontmatter?.lieu,
          //org: module?.__pageData?.frontmatter?.role,
          orgLink: path
                .replace("/spectacles/",'')
                .replace(".md", "")
                .replace("index","")
        });
      } catch (error) {
        console.log(error);
        console.error("Error loading ${path}");
      }
    }
  }

//   members.value.sort((a, b) => {
//     if (!a.date || !b.date) return 0;
//     return new Date(b.date) - new Date(a.date);
//   });

});

</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Spectacles
    </template>
    <template #lead>
      Le catalogue de la compagnie 📚
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
