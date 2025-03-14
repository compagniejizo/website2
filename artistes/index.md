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
  let content = import.meta.glob("/artistes/**/*.md");

  for (const path in content) {
    if (path != '/artistes/index.md') {
      try {
        const module = await content[path]();
        console.log(module);
        members.value.push({
          name: module?.__pageData?.frontmatter?.name,
          avatar: withBase(module?.__pageData?.frontmatter?.image),
          title: module?.__pageData?.frontmatter?.role,
          // date: module?.__pageData?.frontmatter?.date,
          // lieu: module?.__pageData?.frontmatter?.lieu,
          org: module?.__pageData?.frontmatter?.role,
          orgLink: path
                .replace("/artistes/",'')
                .replace(".md", "")
                .replace("index","")
        });
      } catch (error) {
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
      Les artistes
    </template>
    <template #lead>
      La dreamteam 💚
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
