import { stat } from "node:fs";

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

//Mapped Types
type MyPartial<T> = {
    [K in keyof T]?: T[K];
}

//Mapped Types Modifiers
type MyRequired<T> = {
    [K in keyof T] -?: T[K];
}
type MyReadOnly<T> = {
   readonly [K in keyof T]: T[K];
}

//Key Remapping
type TaskGetter<T> = {
    [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
}
// for every key K in T rename it as getKEYNAME and assign it the respective type


type TaskEvents = {
    taskCreated: Task;
    taskDeleted: string;
    taskStatusChanged: {
        taskId: string;
        oldStatus: Status;
        newStatus: Status;
    };
};

// Mapped Type: for each event type K --> make it optional and change its type to an array of callback functions
type EventHandlers<Events> = {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>; 
}


class EventEmitter<Events> {
    private handlers: EventHandlers<Events> = {};

     on<K extends keyof Events>(
    event: K, callback: (payload: Events[K]) => void) {

    }

    emit<K extends keyof Events>(
        event: K, payload: Events[K]
    ):void {

    }
}
const taskEvents = new EventEmitter<TaskEvents>();
taskEvents.on("taskCreated",task => {
    console.log(task.title);
})

// interface vs type aliasing 

type Tasks = {
    id: string;
    title: string;
    status: Status;
};

interface Taskes {
    id: string;
    title: string;
    status: Status;
}

interface taskRepository {
    save(task: Task): void;
    findAll(): Task[];
    findById(id: string): Task | undefined;
}


class InMemoryTaskRepository implements taskRepository {
    private tasks: Task[] = [];
    
    save(task: Task): void {
        this.tasks.push(task);
    }

    findAll(): Task[] {
        return this.tasks;
    }

    findById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id)
    }
}


//contructor shorthand
class TaskService {
    constructor(private repository: taskRepository,private readonly serviceName: string){

    }
}

//Dependancy injection
class FakeTaskRepository implements taskRepository {
    private tasks: Task[] = [];
    save(task: Task): void {
        this.tasks.push(task);
    };
    findAll(): Task[] {
        return this.tasks;
    }
    findById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }
}
const service = new TaskService(new FakeTaskRepository(),"Task Service");

// abstract classes
abstract class BaseRepository<T> {
    protected items: T[] = [];

    save(item: T): void {
        this.items.push(item);
    }

    abstract findAll():  T[];
}


    class  TaskRepository extends BaseRepository<Task> {
        findAll(): Task[] {
            return this.items;
        }
    }


//Function Overload
function findTask(input: {status: string}): Task[];
function findTask(input: {id: string}): Task | undefined;
function findTask(input : {id: string} | {status: string}): Task | Task[] | undefined { 
    //implementation
    return undefined;
}


//Custom Type Predicates
function isTask(value: unknown): value is Task{
    if(typeof value !== 'object' || value === null){
        return false;
    }
    const task = value as Record<string,unknown>;

    return (
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.description === 'string' &&
        task.status  === "ongoing" || 
        task.status ==="completed" ||
        task.status ===  "incomplete"
    )
}

function IsStatud(value: unknown): value is Status{
    return( value === 'ongoing' ||
    value === "completed" ||
    value === "incomplete");
}
function isPriority(value: unknown):value is Priority{
    return (
        value === 'low' ||
        value === 'medium' ||
        value === 'high'
    )
}

type GetArrayElement<T> = T extends (infer U)[] ? U : never;

type getFirstParameter<T> = T extends (first: infer P, ...args: any[]) => any ? P : never;  // if function T contains at least one parameter  infer its type as P and return P else return never

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T; //nested infer


//Exhaustive Checking
function handleTask(task: Bug | Feature | Improvement){
    switch (task.type){
        case "bug":
            return task.severity;
        case "feature":
            return task.estimatedHours;
        case 'improvement':
            return task.impact;
        default:
            return assertNever(task);
    }
}


//as const
const statuses = ["ongoing","completed","incomplete"];
type newStatus = typeof statuses[1];


//Branded Types

type TaskId = string & {readonly __brand: "TaskId";}
function createTaskId(value: string): TaskId {
    return value as TaskId;
}

type UserId = string & {readonly __brand: "UserId";}
function createUserId(value: string): UserId {
    return value as UserId;
}


//recursive Types
type TaskNode = Task & {
    subtasks: TaskNode[];
};

const task1: TaskNode = {
  id: "1",
  title: "Build app",
  description: "Main project",
  status: "ongoing",
  priority: "high",
  createdAt: new Date(),

  subtasks: [
    {
      id: "2",
      title: "Build API",
      description: "Create API",
      status: "ongoing",
      priority: "high",
      createdAt: new Date(),
      subtasks: []
    }
  ]
};

type Comment = {
    id : string;
    text : string;
    replies : Comment[];
}
type Folder = {
    name: string;
    files: string[];
    subfolders: Folder[];
}

type JSONValue = string | number | boolean | null | JSONValue[] | {[key: string]: JSONValue};
