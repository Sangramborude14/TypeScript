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


//Utility
type CreateTaskInput = Omit<Task,"id" | "createdAt">; // Omit -> remove the give types
type TaskPreview = Pick<Task,"id" | "title" | "status" | "priority"> //Pick -> only considers the choosen types
type UpdateTaskInput = Partial<CreateTaskInput>; // partial converts all properties into OPTIONAL --> id?: string;

function createTask(input: CreateTaskInput):Task {
    const id = crypto.randomUUID();
    const createdAt =  new Date();

    return {
        id,
        ...input,
        createdAt
    };
};

function getTaskPreview(task: Task):TaskPreview{
const {id,title,status,priority} = task;

return task;
}
function updateTask(task: Task,updates: UpdateTaskInput): Task{
   const updatedTask = {...task,...updates};
   return updatedTask;
}


