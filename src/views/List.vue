<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="8" lg="6">
          <v-text-field placeholder="Search for a task" outlined dense v-model="query" variant="outlined"></v-text-field>

          <v-radio-group v-model="filter" inline>
            <v-radio label="All tasks" :value="Filter.ALL"></v-radio>
            <v-radio label="Completed tasks" :value="Filter.COMPLETED"></v-radio>
            <v-radio label="Tasks to do" :value="Filter.TODO"></v-radio>
          </v-radio-group>

          <v-btn prepend-icon="mdi-plus" size="large" block color="success" :elevation="0">
            Add new task
          </v-btn>

          <v-list lines="two">
            <v-list-item density="compact" v-for="task in filteredTasks" :key="task.id"
              :to="{ name: RouteName.TASK, params: { id: task.id } }" :title="task.title" :subtitle="task.description">
              <template v-slot:append>
                <v-btn color="grey-lighten-1" icon="mdi-chevron-right" variant="text"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import { Task } from '@/types/task';
import { removeDiacritics } from '@/utils/string';
import { RouteName } from '@/enum/RouteName';
import { parseTask } from '@/utils/task';

enum Filter {
  ALL,
  COMPLETED,
  TODO,
}

const query = ref('');

const filter = ref(Filter.ALL);

const tasks = ref<Task[]>([]);

const filteredTasks = computed(() => {
  const filtered = tasks.value.filter((task) => {
    const title = removeDiacritics(task.title.toLowerCase());

    const description = removeDiacritics(task.description.toLowerCase());

    const queryValue = removeDiacritics(query.value.toLowerCase());

    return title.includes(queryValue) || description.includes(queryValue);
  });

  switch (filter.value) {
    case Filter.COMPLETED:
      return filtered.filter((task) => task.completed);
    case Filter.TODO:
      return filtered.filter((task) => !task.completed);
    default:
      return filtered;
  }
});

onBeforeMount(async () => {
  const response = await fetch("https://6582c33c02f747c8367a2493.mockapi.io/task");
  const json = await response.json();
  if (!Array.isArray(json)) return;
  tasks.value = json.map((task) => parseTask(task));
});
</script>
