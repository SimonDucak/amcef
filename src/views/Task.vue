<template>
    <v-main>
        <v-container>
            <v-form v-if="!taskLoading" @submit.prevent>
                <v-row justify="center">
                    <v-col cols="12" sm="12" md="8" lg="6">
                        <v-row justify="space-between">
                            <v-btn :to="{ name: RouteName.LIST }" color="grey-lighten-1" variant="text">
                                <v-icon>mdi-chevron-left</v-icon>
                                Back to tasks
                            </v-btn>

                            <v-btn @click="removeTask" :loading="removing" color="error" variant="text">
                                <v-icon>mdi-trash-can</v-icon>
                                Remove task
                            </v-btn>
                        </v-row>

                        <v-text-field placeholder="Enter title of task" :rules="titleRules" v-model="task.title"
                            variant="plain"></v-text-field>

                        <v-spacer />

                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <v-text-field label="Deadline" readonly v-bind="props"
                                    :model-value="deadline"></v-text-field>
                            </template>
                            <v-list>
                                <v-date-picker show-adjacent-months @update:model-value="setDeadline"></v-date-picker>
                            </v-list>
                        </v-menu>

                        <v-textarea placeholder="Enter description of task" v-model="task.description"
                            variant="plain"></v-textarea>

                        <v-btn @click="saveTask" :loading="saving" type="submit" prepend-icon="mdi-save" size="large" block color="success" :elevation="0">
                            Save task
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>

            <v-row v-else justify="center">
                <v-col cols="12" sm="12" md="8" lg="6">
                    <v-list>
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
import { ref, computed, onBeforeMount } from 'vue';
import moment from 'moment';
import { RouteName } from '@/enum/RouteName';
import { useTasksStore } from '@/store/tasks';
import { useRouter } from 'vue-router';
import { useTask } from '@/composables/task';

const store = useTasksStore();

const router = useRouter();

const task = ref(store.getEmptyTask());

const hasError = ref(false);

const deadline = computed<string>(() => {
    const { deadline } = task.value;
    if (!deadline) return '';
    return moment(task.value.deadline).format('MMMM Do YYYY');
});

const setDeadline = (date: unknown) => {
    if (!(date instanceof Date)) return;
    task.value.deadline = date;
};

const { perform: getTask, isRunning: taskLoading } = useTask(async () => {
    try {
        const { id } = router.currentRoute.value.params;
        if (typeof id !== "string") throw new Error("Invalid task id"); 
        task.value = await store.getTask(id);
    } catch (err) {
        hasError.value = true;
    }
});

const { perform: saveTask, isRunning: saving } = useTask(async () => {
    try {
        await store.updateTask(task.value);
    } catch (err) {
        hasError.value = true;
    }
});

const { perform: removeTask, isRunning: removing } = useTask(async () => {
    try {
        await store.removeTask(task.value.id);
        router.push({ name: RouteName.LIST });
    } catch (err) {
        hasError.value = true;
    }
});

const titleRules = [
    (value: string) => {
        if (!value) return 'Title is required.';

        if (value.length < 3) return 'Title must be at least 3 characters.';

        return true;
    },
];

onBeforeMount(() => getTask());
</script>