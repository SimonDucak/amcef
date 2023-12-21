import { Task } from "@/types/task";
import { isObject } from "./typeof";

export const getEmptyTask = (): Task => ({
    id: "",
    title: "",
    description: "",
    completed: false,
    deadline: null,
});

export const parseTask = (data: unknown): Task => {
    const task = getEmptyTask();
    if (!isObject(data)) return task;
    Object.assign(task, data);
    return task;
}