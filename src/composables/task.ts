import { ref } from "vue";

export type PerformFn = () => Promise<void>;

export const useTask = (fn: PerformFn) => {
    const isRunning = ref(false);

    const perform = async () => {
        isRunning.value = true;
        try {
            await fn();
        } finally {
            isRunning.value = false;
        }
    };

    return {
        isRunning, 
        perform,
    }
}