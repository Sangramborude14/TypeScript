type Status = "ongoing" | "completed" | "incomplete"; // used Literal Union Types
type Priority = "low" | "medium" | "high"; // '\' is called Union

type Task = {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: Date;
}

type Bug = Task & {
    severity: "low" | "medium" | "critical"; // '&' is called intersection
}
type Feature = Task & {
    estimatedHours: number;
}