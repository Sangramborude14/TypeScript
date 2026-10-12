//1. Type testing harness
export type Equal<X,Y> = 
(<T>() => T extends X ? 1 : 2) extends
(<T>() => T extends Y ? 1 : 2) ? true : false;

export type Expect<T extends true> = T;
export type ExpectFalse<T extends false> = T;

//2. Nominal Branding
declare const __brand: unique symbol;
export type Brand<K,T> = K & { readonly [__brand] : T};

export type TenantId = Brand<string, "TenantId">
export type WorkflowId = Brand<string , "WorkflowId">
export type StepId = Brand<string,"StepId">
export type CorrelationId = Brand<string, "CorrelationId">;

//Constructor helper function
export function makeTenanatId(id: string): TenantId {
    return id as TenantId;!
}
