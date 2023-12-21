export type Task = {
    id: string;
    title: string;
    description: string;
    deadline: Date | null;
    completed: boolean;
}