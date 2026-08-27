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
    type: "bug";
}
type Feature = Task & {
    estimatedHours: number;
    type: "feature";
}
type Improvement = Task & {
    type: "improvement";
    impact: "low" | "medium" | "high";
}
type Research = {
    type: "research";
    source: string;
}
type TaskItems =  Bug | Feature | Improvement;

function printTaskDetails(task: TaskItems){
    switch(task.type){
        case "bug":
            console.log(task.severity);
            break;
        case "feature":
            console.log(task.estimatedHours);
            break;
        case "improvement":
            console.log(task.impact);
            break;
        default:
            assertNever(task);
    }
};


function assertNever(value: never): never{
    throw new Error(`Unexpected Value: ${value}`);
}

