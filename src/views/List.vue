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

          <v-btn :to="{ name: RouteName.ADD_TASK }" prepend-icon="mdi-plus" size="large" block color="success" :elevation="0">
            Add new task
          </v-btn>

          <v-list v-if="!loading" lines="two">
            <v-list-item density="compact" v-for="task in filteredTasks" :key="task.id"
                :to="{ name: RouteName.TASK, params: { id: task.id } }" :title="task.title" :subtitle="task.description">
              <template v-slot:prepend>
                <div @click.stop>
                  <v-checkbox :model-value="task.completed" @update:model-value="toggleTask(task)" color="success"></v-checkbox>
                </div>
              </template>

              <template v-slot:append>
                <v-btn color="grey-lighten-1" icon="mdi-chevron-right" variant="text"></v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-list v-else>
            <v-list-item density="compact" v-for="i in 6" :key="i + 1">
              <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="hasError">
      Something went wrong! Please try again later.

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="hasError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { removeDiacritics } from '@/utils/string';
import { RouteName } from '@/enum/RouteName';
import { useTasksStore } from '@/store/tasks';
import { Task } from '@/types/task';
import { useTask } from '@/composables/task';

enum Filter {
  ALL,
  COMPLETED,
  TODO,
}

const query = ref('');

const hasError = ref(false);

const filter = ref(Filter.ALL);

const store = useTasksStore();

const filteredTasks = computed(() => {
  const filtered = store.tasks.filter((task) => {
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

const toggleTask = (task: Task) => {
  try {
    task.completed = !task.completed;
    store.updateTask(task);
  } catch (err) {
    hasError.value = true;
  }
}

const { perform: getTasks, isRunning: loading } = useTask(async () => {
  try { 
    await store.getTasks();
  } catch (err) {
    hasError.value = true;
  }
});

onMounted(async () => {
  if (store.tasks.length === 0) {
    getTasks();
  }
});
</script>
