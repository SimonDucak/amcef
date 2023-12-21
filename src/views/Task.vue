<template>
    <v-main>
        <v-container>
            <v-form @submit.prevent>

                <v-row justify="center">
                    <v-col cols="12" sm="12" md="8" lg="6">
                        <v-row justify="space-between">
                            <v-btn :to="{ name: RouteName.LIST }" color="grey-lighten-1" variant="text">
                                <v-icon>mdi-chevron-left</v-icon>
                                Back to tasks
                            </v-btn>

                            <v-btn color="error" variant="text">
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

                        <v-btn type="submit" prepend-icon="mdi-save" size="large" block color="success" :elevation="0">
                            Save task
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-main>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Task } from '@/types/task';
import moment from 'moment';
import { RouteName } from '@/enum/RouteName';

const task = ref<Task>({
    id: "1",
    title: 'Learn Vue.js 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consectetur dictum eros eget tempus. Fusce maximus varius turpis sit amet luctus.',
    completed: false,
    deadline: null,
});

const deadline = computed<string>(() => {
    const { deadline } = task.value;
    if (!deadline) return '';
    return moment(task.value.deadline).format('MMMM Do YYYY');
});

const setDeadline = (date: unknown) => {
    if (!(date instanceof Date)) return;
    task.value.deadline = date;
};

const titleRules = [
    (value: string) => {
        if (!value) return 'Title is required.';

        if (value.length < 3) return 'Title must be at least 3 characters.';

        return true;
    },
];
</script>