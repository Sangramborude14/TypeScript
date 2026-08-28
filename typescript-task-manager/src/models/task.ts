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
type User = {
    id: string;
    name: string;
    email: string;
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

//Generics
class Repository<T extends{ id: string }>{

    private items: T[] = [];

    save(item: T): void{
        this.items.push(item);
    }

    findAlll(): T[]{
        return this.items;
    }
    
    findById(id: string): T|undefined {
        return this.items.find(item => item.id === id);
    }

    findBy<K extends keyof T>(
        key: K,
        value: T[K],
):  T  | undefined {
    return this.items.find(item => item[key] === value);
}

}

const taskRepository = new Repository<Task>();
const userRepostory = new  Repository<User>();


//Generic Type Inference
 function first<T>(items: T[]): T | undefined {
        return items[0];
    }

const task: Omit<Task,"createdAt">[] = [
  {
      id: "12",
    title: "Title",
    description: "GTA 6 loading",
    status: "completed",
    priority: "high"
  },
  {
    id: "13",
    title: "Another task",
    description: "Something else",
    status: "ongoing",
    priority: "low"
  }
]
const firstTask = first<Omit<Task,"createdAt">>(task);

//Conditional Types
type HasId = {
    id: string;
}

type hasAnId<T> = T extends HasId ? true: false;
type A = hasAnId<Task>;

type IsTask<T> = T extends Task ? true : false;
type B = IsTask<Task>;
type C = IsTask<User>

//Conditional types over unions
type OnlyBug<T> = T extends Bug ? T : never;

type ExtractByType<T,U> = T extends U ? T:never;
