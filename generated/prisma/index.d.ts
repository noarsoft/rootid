
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model business
 * 
 */
export type business = $Result.DefaultSelection<Prisma.$businessPayload>
/**
 * Model data_schema
 * 
 */
export type data_schema = $Result.DefaultSelection<Prisma.$data_schemaPayload>
/**
 * Model view
 * 
 */
export type view = $Result.DefaultSelection<Prisma.$viewPayload>
/**
 * Model form
 * 
 */
export type form = $Result.DefaultSelection<Prisma.$formPayload>
/**
 * Model data
 * 
 */
export type data = $Result.DefaultSelection<Prisma.$dataPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Businesses
 * const businesses = await prisma.business.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Businesses
   * const businesses = await prisma.business.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.business`: Exposes CRUD operations for the **business** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Businesses
    * const businesses = await prisma.business.findMany()
    * ```
    */
  get business(): Prisma.businessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.data_schema`: Exposes CRUD operations for the **data_schema** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Data_schemas
    * const data_schemas = await prisma.data_schema.findMany()
    * ```
    */
  get data_schema(): Prisma.data_schemaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.view`: Exposes CRUD operations for the **view** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Views
    * const views = await prisma.view.findMany()
    * ```
    */
  get view(): Prisma.viewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.form`: Exposes CRUD operations for the **form** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Forms
    * const forms = await prisma.form.findMany()
    * ```
    */
  get form(): Prisma.formDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.data`: Exposes CRUD operations for the **data** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Data
    * const data = await prisma.data.findMany()
    * ```
    */
  get data(): Prisma.dataDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    business: 'business',
    data_schema: 'data_schema',
    view: 'view',
    form: 'form',
    data: 'data'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "business" | "data_schema" | "view" | "form" | "data"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      business: {
        payload: Prisma.$businessPayload<ExtArgs>
        fields: Prisma.businessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.businessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.businessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          findFirst: {
            args: Prisma.businessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.businessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          findMany: {
            args: Prisma.businessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>[]
          }
          create: {
            args: Prisma.businessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          createMany: {
            args: Prisma.businessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.businessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>[]
          }
          delete: {
            args: Prisma.businessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          update: {
            args: Prisma.businessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          deleteMany: {
            args: Prisma.businessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.businessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.businessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>[]
          }
          upsert: {
            args: Prisma.businessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$businessPayload>
          }
          aggregate: {
            args: Prisma.BusinessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusiness>
          }
          groupBy: {
            args: Prisma.businessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessGroupByOutputType>[]
          }
          count: {
            args: Prisma.businessCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessCountAggregateOutputType> | number
          }
        }
      }
      data_schema: {
        payload: Prisma.$data_schemaPayload<ExtArgs>
        fields: Prisma.data_schemaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.data_schemaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.data_schemaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          findFirst: {
            args: Prisma.data_schemaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.data_schemaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          findMany: {
            args: Prisma.data_schemaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>[]
          }
          create: {
            args: Prisma.data_schemaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          createMany: {
            args: Prisma.data_schemaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.data_schemaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>[]
          }
          delete: {
            args: Prisma.data_schemaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          update: {
            args: Prisma.data_schemaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          deleteMany: {
            args: Prisma.data_schemaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.data_schemaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.data_schemaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>[]
          }
          upsert: {
            args: Prisma.data_schemaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$data_schemaPayload>
          }
          aggregate: {
            args: Prisma.Data_schemaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateData_schema>
          }
          groupBy: {
            args: Prisma.data_schemaGroupByArgs<ExtArgs>
            result: $Utils.Optional<Data_schemaGroupByOutputType>[]
          }
          count: {
            args: Prisma.data_schemaCountArgs<ExtArgs>
            result: $Utils.Optional<Data_schemaCountAggregateOutputType> | number
          }
        }
      }
      view: {
        payload: Prisma.$viewPayload<ExtArgs>
        fields: Prisma.viewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.viewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.viewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          findFirst: {
            args: Prisma.viewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.viewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          findMany: {
            args: Prisma.viewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>[]
          }
          create: {
            args: Prisma.viewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          createMany: {
            args: Prisma.viewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.viewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>[]
          }
          delete: {
            args: Prisma.viewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          update: {
            args: Prisma.viewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          deleteMany: {
            args: Prisma.viewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.viewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.viewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>[]
          }
          upsert: {
            args: Prisma.viewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$viewPayload>
          }
          aggregate: {
            args: Prisma.ViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateView>
          }
          groupBy: {
            args: Prisma.viewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.viewCountArgs<ExtArgs>
            result: $Utils.Optional<ViewCountAggregateOutputType> | number
          }
        }
      }
      form: {
        payload: Prisma.$formPayload<ExtArgs>
        fields: Prisma.formFieldRefs
        operations: {
          findUnique: {
            args: Prisma.formFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.formFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          findFirst: {
            args: Prisma.formFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.formFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          findMany: {
            args: Prisma.formFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>[]
          }
          create: {
            args: Prisma.formCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          createMany: {
            args: Prisma.formCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.formCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>[]
          }
          delete: {
            args: Prisma.formDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          update: {
            args: Prisma.formUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          deleteMany: {
            args: Prisma.formDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.formUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.formUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>[]
          }
          upsert: {
            args: Prisma.formUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$formPayload>
          }
          aggregate: {
            args: Prisma.FormAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateForm>
          }
          groupBy: {
            args: Prisma.formGroupByArgs<ExtArgs>
            result: $Utils.Optional<FormGroupByOutputType>[]
          }
          count: {
            args: Prisma.formCountArgs<ExtArgs>
            result: $Utils.Optional<FormCountAggregateOutputType> | number
          }
        }
      }
      data: {
        payload: Prisma.$dataPayload<ExtArgs>
        fields: Prisma.dataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          findFirst: {
            args: Prisma.dataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          findMany: {
            args: Prisma.dataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>[]
          }
          create: {
            args: Prisma.dataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          createMany: {
            args: Prisma.dataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.dataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>[]
          }
          delete: {
            args: Prisma.dataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          update: {
            args: Prisma.dataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          deleteMany: {
            args: Prisma.dataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.dataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>[]
          }
          upsert: {
            args: Prisma.dataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dataPayload>
          }
          aggregate: {
            args: Prisma.DataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateData>
          }
          groupBy: {
            args: Prisma.dataGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataGroupByOutputType>[]
          }
          count: {
            args: Prisma.dataCountArgs<ExtArgs>
            result: $Utils.Optional<DataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    business?: businessOmit
    data_schema?: data_schemaOmit
    view?: viewOmit
    form?: formOmit
    data?: dataOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BusinessCountOutputType
   */

  export type BusinessCountOutputType = {
    versions: number
    schemas: number
  }

  export type BusinessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | BusinessCountOutputTypeCountVersionsArgs
    schemas?: boolean | BusinessCountOutputTypeCountSchemasArgs
  }

  // Custom InputTypes
  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessCountOutputType
     */
    select?: BusinessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: businessWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountSchemasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: data_schemaWhereInput
  }


  /**
   * Count Type Data_schemaCountOutputType
   */

  export type Data_schemaCountOutputType = {
    versions: number
    views: number
    forms: number
    records: number
  }

  export type Data_schemaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | Data_schemaCountOutputTypeCountVersionsArgs
    views?: boolean | Data_schemaCountOutputTypeCountViewsArgs
    forms?: boolean | Data_schemaCountOutputTypeCountFormsArgs
    records?: boolean | Data_schemaCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * Data_schemaCountOutputType without action
   */
  export type Data_schemaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Data_schemaCountOutputType
     */
    select?: Data_schemaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Data_schemaCountOutputType without action
   */
  export type Data_schemaCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: data_schemaWhereInput
  }

  /**
   * Data_schemaCountOutputType without action
   */
  export type Data_schemaCountOutputTypeCountViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: viewWhereInput
  }

  /**
   * Data_schemaCountOutputType without action
   */
  export type Data_schemaCountOutputTypeCountFormsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: formWhereInput
  }

  /**
   * Data_schemaCountOutputType without action
   */
  export type Data_schemaCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dataWhereInput
  }


  /**
   * Count Type ViewCountOutputType
   */

  export type ViewCountOutputType = {
    versions: number
  }

  export type ViewCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | ViewCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * ViewCountOutputType without action
   */
  export type ViewCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ViewCountOutputType
     */
    select?: ViewCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ViewCountOutputType without action
   */
  export type ViewCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: viewWhereInput
  }


  /**
   * Count Type FormCountOutputType
   */

  export type FormCountOutputType = {
    versions: number
  }

  export type FormCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | FormCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * FormCountOutputType without action
   */
  export type FormCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormCountOutputType
     */
    select?: FormCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FormCountOutputType without action
   */
  export type FormCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: formWhereInput
  }


  /**
   * Count Type DataCountOutputType
   */

  export type DataCountOutputType = {
    versions: number
  }

  export type DataCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | DataCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * DataCountOutputType without action
   */
  export type DataCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataCountOutputType
     */
    select?: DataCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DataCountOutputType without action
   */
  export type DataCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dataWhereInput
  }


  /**
   * Models
   */

  /**
   * Model business
   */

  export type AggregateBusiness = {
    _count: BusinessCountAggregateOutputType | null
    _avg: BusinessAvgAggregateOutputType | null
    _sum: BusinessSumAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  export type BusinessAvgAggregateOutputType = {
    id: number | null
    prev_id: number | null
    modify_datetime: number | null
  }

  export type BusinessSumAggregateOutputType = {
    id: number | null
    prev_id: number | null
    modify_datetime: bigint | null
  }

  export type BusinessMinAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    name: string | null
    icon: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type BusinessMaxAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    name: string | null
    icon: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type BusinessCountAggregateOutputType = {
    rootid: number
    id: number
    prev_id: number
    name: number
    icon: number
    flag: number
    activate: number
    modify_datetime: number
    _all: number
  }


  export type BusinessAvgAggregateInputType = {
    id?: true
    prev_id?: true
    modify_datetime?: true
  }

  export type BusinessSumAggregateInputType = {
    id?: true
    prev_id?: true
    modify_datetime?: true
  }

  export type BusinessMinAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    name?: true
    icon?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type BusinessMaxAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    name?: true
    icon?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type BusinessCountAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    name?: true
    icon?: true
    flag?: true
    activate?: true
    modify_datetime?: true
    _all?: true
  }

  export type BusinessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which business to aggregate.
     */
    where?: businessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of businesses to fetch.
     */
    orderBy?: businessOrderByWithRelationInput | businessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: businessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned businesses
    **/
    _count?: true | BusinessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BusinessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BusinessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessMaxAggregateInputType
  }

  export type GetBusinessAggregateType<T extends BusinessAggregateArgs> = {
        [P in keyof T & keyof AggregateBusiness]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusiness[P]>
      : GetScalarType<T[P], AggregateBusiness[P]>
  }




  export type businessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: businessWhereInput
    orderBy?: businessOrderByWithAggregationInput | businessOrderByWithAggregationInput[]
    by: BusinessScalarFieldEnum[] | BusinessScalarFieldEnum
    having?: businessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessCountAggregateInputType | true
    _avg?: BusinessAvgAggregateInputType
    _sum?: BusinessSumAggregateInputType
    _min?: BusinessMinAggregateInputType
    _max?: BusinessMaxAggregateInputType
  }

  export type BusinessGroupByOutputType = {
    rootid: string
    id: number
    prev_id: number | null
    name: string
    icon: string | null
    flag: string | null
    activate: boolean
    modify_datetime: bigint | null
    _count: BusinessCountAggregateOutputType | null
    _avg: BusinessAvgAggregateOutputType | null
    _sum: BusinessSumAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  type GetBusinessGroupByPayload<T extends businessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessGroupByOutputType[P]>
        }
      >
    >


  export type businessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    name?: boolean
    icon?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | business$previousArgs<ExtArgs>
    versions?: boolean | business$versionsArgs<ExtArgs>
    schemas?: boolean | business$schemasArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type businessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    name?: boolean
    icon?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | business$previousArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type businessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    name?: boolean
    icon?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | business$previousArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type businessSelectScalar = {
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    name?: boolean
    icon?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
  }

  export type businessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"rootid" | "id" | "prev_id" | "name" | "icon" | "flag" | "activate" | "modify_datetime", ExtArgs["result"]["business"]>
  export type businessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | business$previousArgs<ExtArgs>
    versions?: boolean | business$versionsArgs<ExtArgs>
    schemas?: boolean | business$schemasArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type businessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | business$previousArgs<ExtArgs>
  }
  export type businessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | business$previousArgs<ExtArgs>
  }

  export type $businessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "business"
    objects: {
      previous: Prisma.$businessPayload<ExtArgs> | null
      versions: Prisma.$businessPayload<ExtArgs>[]
      schemas: Prisma.$data_schemaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      rootid: string
      id: number
      prev_id: number | null
      name: string
      icon: string | null
      flag: string | null
      activate: boolean
      modify_datetime: bigint | null
    }, ExtArgs["result"]["business"]>
    composites: {}
  }

  type businessGetPayload<S extends boolean | null | undefined | businessDefaultArgs> = $Result.GetResult<Prisma.$businessPayload, S>

  type businessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<businessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BusinessCountAggregateInputType | true
    }

  export interface businessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['business'], meta: { name: 'business' } }
    /**
     * Find zero or one Business that matches the filter.
     * @param {businessFindUniqueArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends businessFindUniqueArgs>(args: SelectSubset<T, businessFindUniqueArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Business that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {businessFindUniqueOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends businessFindUniqueOrThrowArgs>(args: SelectSubset<T, businessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Business that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessFindFirstArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends businessFindFirstArgs>(args?: SelectSubset<T, businessFindFirstArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Business that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessFindFirstOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends businessFindFirstOrThrowArgs>(args?: SelectSubset<T, businessFindFirstOrThrowArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Businesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Businesses
     * const businesses = await prisma.business.findMany()
     * 
     * // Get first 10 Businesses
     * const businesses = await prisma.business.findMany({ take: 10 })
     * 
     * // Only select the `rootid`
     * const businessWithRootidOnly = await prisma.business.findMany({ select: { rootid: true } })
     * 
     */
    findMany<T extends businessFindManyArgs>(args?: SelectSubset<T, businessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Business.
     * @param {businessCreateArgs} args - Arguments to create a Business.
     * @example
     * // Create one Business
     * const Business = await prisma.business.create({
     *   data: {
     *     // ... data to create a Business
     *   }
     * })
     * 
     */
    create<T extends businessCreateArgs>(args: SelectSubset<T, businessCreateArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Businesses.
     * @param {businessCreateManyArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends businessCreateManyArgs>(args?: SelectSubset<T, businessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Businesses and returns the data saved in the database.
     * @param {businessCreateManyAndReturnArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Businesses and only return the `rootid`
     * const businessWithRootidOnly = await prisma.business.createManyAndReturn({
     *   select: { rootid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends businessCreateManyAndReturnArgs>(args?: SelectSubset<T, businessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Business.
     * @param {businessDeleteArgs} args - Arguments to delete one Business.
     * @example
     * // Delete one Business
     * const Business = await prisma.business.delete({
     *   where: {
     *     // ... filter to delete one Business
     *   }
     * })
     * 
     */
    delete<T extends businessDeleteArgs>(args: SelectSubset<T, businessDeleteArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Business.
     * @param {businessUpdateArgs} args - Arguments to update one Business.
     * @example
     * // Update one Business
     * const business = await prisma.business.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends businessUpdateArgs>(args: SelectSubset<T, businessUpdateArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Businesses.
     * @param {businessDeleteManyArgs} args - Arguments to filter Businesses to delete.
     * @example
     * // Delete a few Businesses
     * const { count } = await prisma.business.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends businessDeleteManyArgs>(args?: SelectSubset<T, businessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends businessUpdateManyArgs>(args: SelectSubset<T, businessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses and returns the data updated in the database.
     * @param {businessUpdateManyAndReturnArgs} args - Arguments to update many Businesses.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Businesses and only return the `rootid`
     * const businessWithRootidOnly = await prisma.business.updateManyAndReturn({
     *   select: { rootid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends businessUpdateManyAndReturnArgs>(args: SelectSubset<T, businessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Business.
     * @param {businessUpsertArgs} args - Arguments to update or create a Business.
     * @example
     * // Update or create a Business
     * const business = await prisma.business.upsert({
     *   create: {
     *     // ... data to create a Business
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Business we want to update
     *   }
     * })
     */
    upsert<T extends businessUpsertArgs>(args: SelectSubset<T, businessUpsertArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessCountArgs} args - Arguments to filter Businesses to count.
     * @example
     * // Count the number of Businesses
     * const count = await prisma.business.count({
     *   where: {
     *     // ... the filter for the Businesses we want to count
     *   }
     * })
    **/
    count<T extends businessCountArgs>(
      args?: Subset<T, businessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BusinessAggregateArgs>(args: Subset<T, BusinessAggregateArgs>): Prisma.PrismaPromise<GetBusinessAggregateType<T>>

    /**
     * Group by Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {businessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends businessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: businessGroupByArgs['orderBy'] }
        : { orderBy?: businessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, businessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the business model
   */
  readonly fields: businessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for business.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__businessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    previous<T extends business$previousArgs<ExtArgs> = {}>(args?: Subset<T, business$previousArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versions<T extends business$versionsArgs<ExtArgs> = {}>(args?: Subset<T, business$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    schemas<T extends business$schemasArgs<ExtArgs> = {}>(args?: Subset<T, business$schemasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the business model
   */
  interface businessFieldRefs {
    readonly rootid: FieldRef<"business", 'String'>
    readonly id: FieldRef<"business", 'Int'>
    readonly prev_id: FieldRef<"business", 'Int'>
    readonly name: FieldRef<"business", 'String'>
    readonly icon: FieldRef<"business", 'String'>
    readonly flag: FieldRef<"business", 'String'>
    readonly activate: FieldRef<"business", 'Boolean'>
    readonly modify_datetime: FieldRef<"business", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * business findUnique
   */
  export type businessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter, which business to fetch.
     */
    where: businessWhereUniqueInput
  }

  /**
   * business findUniqueOrThrow
   */
  export type businessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter, which business to fetch.
     */
    where: businessWhereUniqueInput
  }

  /**
   * business findFirst
   */
  export type businessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter, which business to fetch.
     */
    where?: businessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of businesses to fetch.
     */
    orderBy?: businessOrderByWithRelationInput | businessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for businesses.
     */
    cursor?: businessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * business findFirstOrThrow
   */
  export type businessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter, which business to fetch.
     */
    where?: businessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of businesses to fetch.
     */
    orderBy?: businessOrderByWithRelationInput | businessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for businesses.
     */
    cursor?: businessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * business findMany
   */
  export type businessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter, which businesses to fetch.
     */
    where?: businessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of businesses to fetch.
     */
    orderBy?: businessOrderByWithRelationInput | businessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing businesses.
     */
    cursor?: businessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * business create
   */
  export type businessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * The data needed to create a business.
     */
    data: XOR<businessCreateInput, businessUncheckedCreateInput>
  }

  /**
   * business createMany
   */
  export type businessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many businesses.
     */
    data: businessCreateManyInput | businessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * business createManyAndReturn
   */
  export type businessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * The data used to create many businesses.
     */
    data: businessCreateManyInput | businessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * business update
   */
  export type businessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * The data needed to update a business.
     */
    data: XOR<businessUpdateInput, businessUncheckedUpdateInput>
    /**
     * Choose, which business to update.
     */
    where: businessWhereUniqueInput
  }

  /**
   * business updateMany
   */
  export type businessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update businesses.
     */
    data: XOR<businessUpdateManyMutationInput, businessUncheckedUpdateManyInput>
    /**
     * Filter which businesses to update
     */
    where?: businessWhereInput
    /**
     * Limit how many businesses to update.
     */
    limit?: number
  }

  /**
   * business updateManyAndReturn
   */
  export type businessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * The data used to update businesses.
     */
    data: XOR<businessUpdateManyMutationInput, businessUncheckedUpdateManyInput>
    /**
     * Filter which businesses to update
     */
    where?: businessWhereInput
    /**
     * Limit how many businesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * business upsert
   */
  export type businessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * The filter to search for the business to update in case it exists.
     */
    where: businessWhereUniqueInput
    /**
     * In case the business found by the `where` argument doesn't exist, create a new business with this data.
     */
    create: XOR<businessCreateInput, businessUncheckedCreateInput>
    /**
     * In case the business was found with the provided `where` argument, update it with this data.
     */
    update: XOR<businessUpdateInput, businessUncheckedUpdateInput>
  }

  /**
   * business delete
   */
  export type businessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    /**
     * Filter which business to delete.
     */
    where: businessWhereUniqueInput
  }

  /**
   * business deleteMany
   */
  export type businessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which businesses to delete
     */
    where?: businessWhereInput
    /**
     * Limit how many businesses to delete.
     */
    limit?: number
  }

  /**
   * business.previous
   */
  export type business$previousArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    where?: businessWhereInput
  }

  /**
   * business.versions
   */
  export type business$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    where?: businessWhereInput
    orderBy?: businessOrderByWithRelationInput | businessOrderByWithRelationInput[]
    cursor?: businessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * business.schemas
   */
  export type business$schemasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    where?: data_schemaWhereInput
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    cursor?: data_schemaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Data_schemaScalarFieldEnum | Data_schemaScalarFieldEnum[]
  }

  /**
   * business without action
   */
  export type businessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
  }


  /**
   * Model data_schema
   */

  export type AggregateData_schema = {
    _count: Data_schemaCountAggregateOutputType | null
    _avg: Data_schemaAvgAggregateOutputType | null
    _sum: Data_schemaSumAggregateOutputType | null
    _min: Data_schemaMinAggregateOutputType | null
    _max: Data_schemaMaxAggregateOutputType | null
  }

  export type Data_schemaAvgAggregateOutputType = {
    id: number | null
    business_id: number | null
    prev_id: number | null
    modify_datetime: number | null
  }

  export type Data_schemaSumAggregateOutputType = {
    id: number | null
    business_id: number | null
    prev_id: number | null
    modify_datetime: bigint | null
  }

  export type Data_schemaMinAggregateOutputType = {
    rootid: string | null
    id: number | null
    business_id: number | null
    prev_id: number | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type Data_schemaMaxAggregateOutputType = {
    rootid: string | null
    id: number | null
    business_id: number | null
    prev_id: number | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type Data_schemaCountAggregateOutputType = {
    rootid: number
    id: number
    business_id: number
    prev_id: number
    name: number
    json: number
    flag: number
    activate: number
    modify_datetime: number
    _all: number
  }


  export type Data_schemaAvgAggregateInputType = {
    id?: true
    business_id?: true
    prev_id?: true
    modify_datetime?: true
  }

  export type Data_schemaSumAggregateInputType = {
    id?: true
    business_id?: true
    prev_id?: true
    modify_datetime?: true
  }

  export type Data_schemaMinAggregateInputType = {
    rootid?: true
    id?: true
    business_id?: true
    prev_id?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type Data_schemaMaxAggregateInputType = {
    rootid?: true
    id?: true
    business_id?: true
    prev_id?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type Data_schemaCountAggregateInputType = {
    rootid?: true
    id?: true
    business_id?: true
    prev_id?: true
    name?: true
    json?: true
    flag?: true
    activate?: true
    modify_datetime?: true
    _all?: true
  }

  export type Data_schemaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which data_schema to aggregate.
     */
    where?: data_schemaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data_schemas to fetch.
     */
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: data_schemaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data_schemas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data_schemas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned data_schemas
    **/
    _count?: true | Data_schemaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Data_schemaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Data_schemaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Data_schemaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Data_schemaMaxAggregateInputType
  }

  export type GetData_schemaAggregateType<T extends Data_schemaAggregateArgs> = {
        [P in keyof T & keyof AggregateData_schema]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateData_schema[P]>
      : GetScalarType<T[P], AggregateData_schema[P]>
  }




  export type data_schemaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: data_schemaWhereInput
    orderBy?: data_schemaOrderByWithAggregationInput | data_schemaOrderByWithAggregationInput[]
    by: Data_schemaScalarFieldEnum[] | Data_schemaScalarFieldEnum
    having?: data_schemaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Data_schemaCountAggregateInputType | true
    _avg?: Data_schemaAvgAggregateInputType
    _sum?: Data_schemaSumAggregateInputType
    _min?: Data_schemaMinAggregateInputType
    _max?: Data_schemaMaxAggregateInputType
  }

  export type Data_schemaGroupByOutputType = {
    rootid: string
    id: number
    business_id: number | null
    prev_id: number | null
    name: string
    json: JsonValue
    flag: string | null
    activate: boolean
    modify_datetime: bigint | null
    _count: Data_schemaCountAggregateOutputType | null
    _avg: Data_schemaAvgAggregateOutputType | null
    _sum: Data_schemaSumAggregateOutputType | null
    _min: Data_schemaMinAggregateOutputType | null
    _max: Data_schemaMaxAggregateOutputType | null
  }

  type GetData_schemaGroupByPayload<T extends data_schemaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Data_schemaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Data_schemaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Data_schemaGroupByOutputType[P]>
            : GetScalarType<T[P], Data_schemaGroupByOutputType[P]>
        }
      >
    >


  export type data_schemaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    business_id?: boolean
    prev_id?: boolean
    name?: boolean
    json?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    versions?: boolean | data_schema$versionsArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
    views?: boolean | data_schema$viewsArgs<ExtArgs>
    forms?: boolean | data_schema$formsArgs<ExtArgs>
    records?: boolean | data_schema$recordsArgs<ExtArgs>
    _count?: boolean | Data_schemaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["data_schema"]>

  export type data_schemaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    business_id?: boolean
    prev_id?: boolean
    name?: boolean
    json?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
  }, ExtArgs["result"]["data_schema"]>

  export type data_schemaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    business_id?: boolean
    prev_id?: boolean
    name?: boolean
    json?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
  }, ExtArgs["result"]["data_schema"]>

  export type data_schemaSelectScalar = {
    rootid?: boolean
    id?: boolean
    business_id?: boolean
    prev_id?: boolean
    name?: boolean
    json?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
  }

  export type data_schemaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"rootid" | "id" | "business_id" | "prev_id" | "name" | "json" | "flag" | "activate" | "modify_datetime", ExtArgs["result"]["data_schema"]>
  export type data_schemaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    versions?: boolean | data_schema$versionsArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
    views?: boolean | data_schema$viewsArgs<ExtArgs>
    forms?: boolean | data_schema$formsArgs<ExtArgs>
    records?: boolean | data_schema$recordsArgs<ExtArgs>
    _count?: boolean | Data_schemaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type data_schemaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
  }
  export type data_schemaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data_schema$previousArgs<ExtArgs>
    business?: boolean | data_schema$businessArgs<ExtArgs>
  }

  export type $data_schemaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "data_schema"
    objects: {
      previous: Prisma.$data_schemaPayload<ExtArgs> | null
      versions: Prisma.$data_schemaPayload<ExtArgs>[]
      business: Prisma.$businessPayload<ExtArgs> | null
      views: Prisma.$viewPayload<ExtArgs>[]
      forms: Prisma.$formPayload<ExtArgs>[]
      records: Prisma.$dataPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      rootid: string
      id: number
      business_id: number | null
      prev_id: number | null
      name: string
      json: Prisma.JsonValue
      flag: string | null
      activate: boolean
      modify_datetime: bigint | null
    }, ExtArgs["result"]["data_schema"]>
    composites: {}
  }

  type data_schemaGetPayload<S extends boolean | null | undefined | data_schemaDefaultArgs> = $Result.GetResult<Prisma.$data_schemaPayload, S>

  type data_schemaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<data_schemaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Data_schemaCountAggregateInputType | true
    }

  export interface data_schemaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['data_schema'], meta: { name: 'data_schema' } }
    /**
     * Find zero or one Data_schema that matches the filter.
     * @param {data_schemaFindUniqueArgs} args - Arguments to find a Data_schema
     * @example
     * // Get one Data_schema
     * const data_schema = await prisma.data_schema.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends data_schemaFindUniqueArgs>(args: SelectSubset<T, data_schemaFindUniqueArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Data_schema that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {data_schemaFindUniqueOrThrowArgs} args - Arguments to find a Data_schema
     * @example
     * // Get one Data_schema
     * const data_schema = await prisma.data_schema.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends data_schemaFindUniqueOrThrowArgs>(args: SelectSubset<T, data_schemaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Data_schema that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaFindFirstArgs} args - Arguments to find a Data_schema
     * @example
     * // Get one Data_schema
     * const data_schema = await prisma.data_schema.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends data_schemaFindFirstArgs>(args?: SelectSubset<T, data_schemaFindFirstArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Data_schema that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaFindFirstOrThrowArgs} args - Arguments to find a Data_schema
     * @example
     * // Get one Data_schema
     * const data_schema = await prisma.data_schema.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends data_schemaFindFirstOrThrowArgs>(args?: SelectSubset<T, data_schemaFindFirstOrThrowArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Data_schemas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Data_schemas
     * const data_schemas = await prisma.data_schema.findMany()
     * 
     * // Get first 10 Data_schemas
     * const data_schemas = await prisma.data_schema.findMany({ take: 10 })
     * 
     * // Only select the `rootid`
     * const data_schemaWithRootidOnly = await prisma.data_schema.findMany({ select: { rootid: true } })
     * 
     */
    findMany<T extends data_schemaFindManyArgs>(args?: SelectSubset<T, data_schemaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Data_schema.
     * @param {data_schemaCreateArgs} args - Arguments to create a Data_schema.
     * @example
     * // Create one Data_schema
     * const Data_schema = await prisma.data_schema.create({
     *   data: {
     *     // ... data to create a Data_schema
     *   }
     * })
     * 
     */
    create<T extends data_schemaCreateArgs>(args: SelectSubset<T, data_schemaCreateArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Data_schemas.
     * @param {data_schemaCreateManyArgs} args - Arguments to create many Data_schemas.
     * @example
     * // Create many Data_schemas
     * const data_schema = await prisma.data_schema.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends data_schemaCreateManyArgs>(args?: SelectSubset<T, data_schemaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Data_schemas and returns the data saved in the database.
     * @param {data_schemaCreateManyAndReturnArgs} args - Arguments to create many Data_schemas.
     * @example
     * // Create many Data_schemas
     * const data_schema = await prisma.data_schema.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Data_schemas and only return the `rootid`
     * const data_schemaWithRootidOnly = await prisma.data_schema.createManyAndReturn({
     *   select: { rootid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends data_schemaCreateManyAndReturnArgs>(args?: SelectSubset<T, data_schemaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Data_schema.
     * @param {data_schemaDeleteArgs} args - Arguments to delete one Data_schema.
     * @example
     * // Delete one Data_schema
     * const Data_schema = await prisma.data_schema.delete({
     *   where: {
     *     // ... filter to delete one Data_schema
     *   }
     * })
     * 
     */
    delete<T extends data_schemaDeleteArgs>(args: SelectSubset<T, data_schemaDeleteArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Data_schema.
     * @param {data_schemaUpdateArgs} args - Arguments to update one Data_schema.
     * @example
     * // Update one Data_schema
     * const data_schema = await prisma.data_schema.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends data_schemaUpdateArgs>(args: SelectSubset<T, data_schemaUpdateArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Data_schemas.
     * @param {data_schemaDeleteManyArgs} args - Arguments to filter Data_schemas to delete.
     * @example
     * // Delete a few Data_schemas
     * const { count } = await prisma.data_schema.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends data_schemaDeleteManyArgs>(args?: SelectSubset<T, data_schemaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Data_schemas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Data_schemas
     * const data_schema = await prisma.data_schema.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends data_schemaUpdateManyArgs>(args: SelectSubset<T, data_schemaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Data_schemas and returns the data updated in the database.
     * @param {data_schemaUpdateManyAndReturnArgs} args - Arguments to update many Data_schemas.
     * @example
     * // Update many Data_schemas
     * const data_schema = await prisma.data_schema.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Data_schemas and only return the `rootid`
     * const data_schemaWithRootidOnly = await prisma.data_schema.updateManyAndReturn({
     *   select: { rootid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends data_schemaUpdateManyAndReturnArgs>(args: SelectSubset<T, data_schemaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Data_schema.
     * @param {data_schemaUpsertArgs} args - Arguments to update or create a Data_schema.
     * @example
     * // Update or create a Data_schema
     * const data_schema = await prisma.data_schema.upsert({
     *   create: {
     *     // ... data to create a Data_schema
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Data_schema we want to update
     *   }
     * })
     */
    upsert<T extends data_schemaUpsertArgs>(args: SelectSubset<T, data_schemaUpsertArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Data_schemas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaCountArgs} args - Arguments to filter Data_schemas to count.
     * @example
     * // Count the number of Data_schemas
     * const count = await prisma.data_schema.count({
     *   where: {
     *     // ... the filter for the Data_schemas we want to count
     *   }
     * })
    **/
    count<T extends data_schemaCountArgs>(
      args?: Subset<T, data_schemaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Data_schemaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Data_schema.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Data_schemaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Data_schemaAggregateArgs>(args: Subset<T, Data_schemaAggregateArgs>): Prisma.PrismaPromise<GetData_schemaAggregateType<T>>

    /**
     * Group by Data_schema.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {data_schemaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends data_schemaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: data_schemaGroupByArgs['orderBy'] }
        : { orderBy?: data_schemaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, data_schemaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetData_schemaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the data_schema model
   */
  readonly fields: data_schemaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for data_schema.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__data_schemaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    previous<T extends data_schema$previousArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$previousArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versions<T extends data_schema$versionsArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    business<T extends data_schema$businessArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$businessArgs<ExtArgs>>): Prisma__businessClient<$Result.GetResult<Prisma.$businessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    views<T extends data_schema$viewsArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$viewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    forms<T extends data_schema$formsArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$formsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    records<T extends data_schema$recordsArgs<ExtArgs> = {}>(args?: Subset<T, data_schema$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the data_schema model
   */
  interface data_schemaFieldRefs {
    readonly rootid: FieldRef<"data_schema", 'String'>
    readonly id: FieldRef<"data_schema", 'Int'>
    readonly business_id: FieldRef<"data_schema", 'Int'>
    readonly prev_id: FieldRef<"data_schema", 'Int'>
    readonly name: FieldRef<"data_schema", 'String'>
    readonly json: FieldRef<"data_schema", 'Json'>
    readonly flag: FieldRef<"data_schema", 'String'>
    readonly activate: FieldRef<"data_schema", 'Boolean'>
    readonly modify_datetime: FieldRef<"data_schema", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * data_schema findUnique
   */
  export type data_schemaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter, which data_schema to fetch.
     */
    where: data_schemaWhereUniqueInput
  }

  /**
   * data_schema findUniqueOrThrow
   */
  export type data_schemaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter, which data_schema to fetch.
     */
    where: data_schemaWhereUniqueInput
  }

  /**
   * data_schema findFirst
   */
  export type data_schemaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter, which data_schema to fetch.
     */
    where?: data_schemaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data_schemas to fetch.
     */
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for data_schemas.
     */
    cursor?: data_schemaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data_schemas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data_schemas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data_schemas.
     */
    distinct?: Data_schemaScalarFieldEnum | Data_schemaScalarFieldEnum[]
  }

  /**
   * data_schema findFirstOrThrow
   */
  export type data_schemaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter, which data_schema to fetch.
     */
    where?: data_schemaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data_schemas to fetch.
     */
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for data_schemas.
     */
    cursor?: data_schemaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data_schemas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data_schemas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data_schemas.
     */
    distinct?: Data_schemaScalarFieldEnum | Data_schemaScalarFieldEnum[]
  }

  /**
   * data_schema findMany
   */
  export type data_schemaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter, which data_schemas to fetch.
     */
    where?: data_schemaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data_schemas to fetch.
     */
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing data_schemas.
     */
    cursor?: data_schemaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data_schemas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data_schemas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data_schemas.
     */
    distinct?: Data_schemaScalarFieldEnum | Data_schemaScalarFieldEnum[]
  }

  /**
   * data_schema create
   */
  export type data_schemaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * The data needed to create a data_schema.
     */
    data: XOR<data_schemaCreateInput, data_schemaUncheckedCreateInput>
  }

  /**
   * data_schema createMany
   */
  export type data_schemaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many data_schemas.
     */
    data: data_schemaCreateManyInput | data_schemaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * data_schema createManyAndReturn
   */
  export type data_schemaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * The data used to create many data_schemas.
     */
    data: data_schemaCreateManyInput | data_schemaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * data_schema update
   */
  export type data_schemaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * The data needed to update a data_schema.
     */
    data: XOR<data_schemaUpdateInput, data_schemaUncheckedUpdateInput>
    /**
     * Choose, which data_schema to update.
     */
    where: data_schemaWhereUniqueInput
  }

  /**
   * data_schema updateMany
   */
  export type data_schemaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update data_schemas.
     */
    data: XOR<data_schemaUpdateManyMutationInput, data_schemaUncheckedUpdateManyInput>
    /**
     * Filter which data_schemas to update
     */
    where?: data_schemaWhereInput
    /**
     * Limit how many data_schemas to update.
     */
    limit?: number
  }

  /**
   * data_schema updateManyAndReturn
   */
  export type data_schemaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * The data used to update data_schemas.
     */
    data: XOR<data_schemaUpdateManyMutationInput, data_schemaUncheckedUpdateManyInput>
    /**
     * Filter which data_schemas to update
     */
    where?: data_schemaWhereInput
    /**
     * Limit how many data_schemas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * data_schema upsert
   */
  export type data_schemaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * The filter to search for the data_schema to update in case it exists.
     */
    where: data_schemaWhereUniqueInput
    /**
     * In case the data_schema found by the `where` argument doesn't exist, create a new data_schema with this data.
     */
    create: XOR<data_schemaCreateInput, data_schemaUncheckedCreateInput>
    /**
     * In case the data_schema was found with the provided `where` argument, update it with this data.
     */
    update: XOR<data_schemaUpdateInput, data_schemaUncheckedUpdateInput>
  }

  /**
   * data_schema delete
   */
  export type data_schemaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    /**
     * Filter which data_schema to delete.
     */
    where: data_schemaWhereUniqueInput
  }

  /**
   * data_schema deleteMany
   */
  export type data_schemaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which data_schemas to delete
     */
    where?: data_schemaWhereInput
    /**
     * Limit how many data_schemas to delete.
     */
    limit?: number
  }

  /**
   * data_schema.previous
   */
  export type data_schema$previousArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    where?: data_schemaWhereInput
  }

  /**
   * data_schema.versions
   */
  export type data_schema$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
    where?: data_schemaWhereInput
    orderBy?: data_schemaOrderByWithRelationInput | data_schemaOrderByWithRelationInput[]
    cursor?: data_schemaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Data_schemaScalarFieldEnum | Data_schemaScalarFieldEnum[]
  }

  /**
   * data_schema.business
   */
  export type data_schema$businessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the business
     */
    select?: businessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the business
     */
    omit?: businessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: businessInclude<ExtArgs> | null
    where?: businessWhereInput
  }

  /**
   * data_schema.views
   */
  export type data_schema$viewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    where?: viewWhereInput
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    cursor?: viewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViewScalarFieldEnum | ViewScalarFieldEnum[]
  }

  /**
   * data_schema.forms
   */
  export type data_schema$formsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    where?: formWhereInput
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    cursor?: formWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FormScalarFieldEnum | FormScalarFieldEnum[]
  }

  /**
   * data_schema.records
   */
  export type data_schema$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    where?: dataWhereInput
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    cursor?: dataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataScalarFieldEnum | DataScalarFieldEnum[]
  }

  /**
   * data_schema without action
   */
  export type data_schemaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data_schema
     */
    select?: data_schemaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data_schema
     */
    omit?: data_schemaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: data_schemaInclude<ExtArgs> | null
  }


  /**
   * Model view
   */

  export type AggregateView = {
    _count: ViewCountAggregateOutputType | null
    _avg: ViewAvgAggregateOutputType | null
    _sum: ViewSumAggregateOutputType | null
    _min: ViewMinAggregateOutputType | null
    _max: ViewMaxAggregateOutputType | null
  }

  export type ViewAvgAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    modify_datetime: number | null
  }

  export type ViewSumAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    modify_datetime: bigint | null
  }

  export type ViewMinAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    view_type: string | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type ViewMaxAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    view_type: string | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type ViewCountAggregateOutputType = {
    rootid: number
    id: number
    prev_id: number
    data_schema_id: number
    view_type: number
    name: number
    json_table_config: number
    flag: number
    activate: number
    modify_datetime: number
    _all: number
  }


  export type ViewAvgAggregateInputType = {
    id?: true
    prev_id?: true
    data_schema_id?: true
    modify_datetime?: true
  }

  export type ViewSumAggregateInputType = {
    id?: true
    prev_id?: true
    data_schema_id?: true
    modify_datetime?: true
  }

  export type ViewMinAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    view_type?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type ViewMaxAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    view_type?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type ViewCountAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    view_type?: true
    name?: true
    json_table_config?: true
    flag?: true
    activate?: true
    modify_datetime?: true
    _all?: true
  }

  export type ViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which view to aggregate.
     */
    where?: viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of views to fetch.
     */
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned views
    **/
    _count?: true | ViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ViewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ViewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ViewMaxAggregateInputType
  }

  export type GetViewAggregateType<T extends ViewAggregateArgs> = {
        [P in keyof T & keyof AggregateView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateView[P]>
      : GetScalarType<T[P], AggregateView[P]>
  }




  export type viewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: viewWhereInput
    orderBy?: viewOrderByWithAggregationInput | viewOrderByWithAggregationInput[]
    by: ViewScalarFieldEnum[] | ViewScalarFieldEnum
    having?: viewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ViewCountAggregateInputType | true
    _avg?: ViewAvgAggregateInputType
    _sum?: ViewSumAggregateInputType
    _min?: ViewMinAggregateInputType
    _max?: ViewMaxAggregateInputType
  }

  export type ViewGroupByOutputType = {
    rootid: string
    id: number
    prev_id: number | null
    data_schema_id: number
    view_type: string
    name: string | null
    json_table_config: JsonValue
    flag: string | null
    activate: boolean
    modify_datetime: bigint | null
    _count: ViewCountAggregateOutputType | null
    _avg: ViewAvgAggregateOutputType | null
    _sum: ViewSumAggregateOutputType | null
    _min: ViewMinAggregateOutputType | null
    _max: ViewMaxAggregateOutputType | null
  }

  type GetViewGroupByPayload<T extends viewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ViewGroupByOutputType[P]>
            : GetScalarType<T[P], ViewGroupByOutputType[P]>
        }
      >
    >


  export type viewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    view_type?: boolean
    name?: boolean
    json_table_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | view$previousArgs<ExtArgs>
    versions?: boolean | view$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | ViewCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["view"]>

  export type viewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    view_type?: boolean
    name?: boolean
    json_table_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | view$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["view"]>

  export type viewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    view_type?: boolean
    name?: boolean
    json_table_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | view$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["view"]>

  export type viewSelectScalar = {
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    view_type?: boolean
    name?: boolean
    json_table_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
  }

  export type viewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"rootid" | "id" | "prev_id" | "data_schema_id" | "view_type" | "name" | "json_table_config" | "flag" | "activate" | "modify_datetime", ExtArgs["result"]["view"]>
  export type viewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | view$previousArgs<ExtArgs>
    versions?: boolean | view$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | ViewCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type viewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | view$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }
  export type viewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | view$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }

  export type $viewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "view"
    objects: {
      previous: Prisma.$viewPayload<ExtArgs> | null
      versions: Prisma.$viewPayload<ExtArgs>[]
      schema: Prisma.$data_schemaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      rootid: string
      id: number
      prev_id: number | null
      data_schema_id: number
      view_type: string
      name: string | null
      json_table_config: Prisma.JsonValue
      flag: string | null
      activate: boolean
      modify_datetime: bigint | null
    }, ExtArgs["result"]["view"]>
    composites: {}
  }

  type viewGetPayload<S extends boolean | null | undefined | viewDefaultArgs> = $Result.GetResult<Prisma.$viewPayload, S>

  type viewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<viewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ViewCountAggregateInputType | true
    }

  export interface viewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['view'], meta: { name: 'view' } }
    /**
     * Find zero or one View that matches the filter.
     * @param {viewFindUniqueArgs} args - Arguments to find a View
     * @example
     * // Get one View
     * const view = await prisma.view.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends viewFindUniqueArgs>(args: SelectSubset<T, viewFindUniqueArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one View that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {viewFindUniqueOrThrowArgs} args - Arguments to find a View
     * @example
     * // Get one View
     * const view = await prisma.view.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends viewFindUniqueOrThrowArgs>(args: SelectSubset<T, viewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first View that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewFindFirstArgs} args - Arguments to find a View
     * @example
     * // Get one View
     * const view = await prisma.view.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends viewFindFirstArgs>(args?: SelectSubset<T, viewFindFirstArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first View that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewFindFirstOrThrowArgs} args - Arguments to find a View
     * @example
     * // Get one View
     * const view = await prisma.view.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends viewFindFirstOrThrowArgs>(args?: SelectSubset<T, viewFindFirstOrThrowArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Views that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Views
     * const views = await prisma.view.findMany()
     * 
     * // Get first 10 Views
     * const views = await prisma.view.findMany({ take: 10 })
     * 
     * // Only select the `rootid`
     * const viewWithRootidOnly = await prisma.view.findMany({ select: { rootid: true } })
     * 
     */
    findMany<T extends viewFindManyArgs>(args?: SelectSubset<T, viewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a View.
     * @param {viewCreateArgs} args - Arguments to create a View.
     * @example
     * // Create one View
     * const View = await prisma.view.create({
     *   data: {
     *     // ... data to create a View
     *   }
     * })
     * 
     */
    create<T extends viewCreateArgs>(args: SelectSubset<T, viewCreateArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Views.
     * @param {viewCreateManyArgs} args - Arguments to create many Views.
     * @example
     * // Create many Views
     * const view = await prisma.view.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends viewCreateManyArgs>(args?: SelectSubset<T, viewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Views and returns the data saved in the database.
     * @param {viewCreateManyAndReturnArgs} args - Arguments to create many Views.
     * @example
     * // Create many Views
     * const view = await prisma.view.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Views and only return the `rootid`
     * const viewWithRootidOnly = await prisma.view.createManyAndReturn({
     *   select: { rootid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends viewCreateManyAndReturnArgs>(args?: SelectSubset<T, viewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a View.
     * @param {viewDeleteArgs} args - Arguments to delete one View.
     * @example
     * // Delete one View
     * const View = await prisma.view.delete({
     *   where: {
     *     // ... filter to delete one View
     *   }
     * })
     * 
     */
    delete<T extends viewDeleteArgs>(args: SelectSubset<T, viewDeleteArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one View.
     * @param {viewUpdateArgs} args - Arguments to update one View.
     * @example
     * // Update one View
     * const view = await prisma.view.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends viewUpdateArgs>(args: SelectSubset<T, viewUpdateArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Views.
     * @param {viewDeleteManyArgs} args - Arguments to filter Views to delete.
     * @example
     * // Delete a few Views
     * const { count } = await prisma.view.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends viewDeleteManyArgs>(args?: SelectSubset<T, viewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Views.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Views
     * const view = await prisma.view.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends viewUpdateManyArgs>(args: SelectSubset<T, viewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Views and returns the data updated in the database.
     * @param {viewUpdateManyAndReturnArgs} args - Arguments to update many Views.
     * @example
     * // Update many Views
     * const view = await prisma.view.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Views and only return the `rootid`
     * const viewWithRootidOnly = await prisma.view.updateManyAndReturn({
     *   select: { rootid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends viewUpdateManyAndReturnArgs>(args: SelectSubset<T, viewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one View.
     * @param {viewUpsertArgs} args - Arguments to update or create a View.
     * @example
     * // Update or create a View
     * const view = await prisma.view.upsert({
     *   create: {
     *     // ... data to create a View
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the View we want to update
     *   }
     * })
     */
    upsert<T extends viewUpsertArgs>(args: SelectSubset<T, viewUpsertArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Views.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewCountArgs} args - Arguments to filter Views to count.
     * @example
     * // Count the number of Views
     * const count = await prisma.view.count({
     *   where: {
     *     // ... the filter for the Views we want to count
     *   }
     * })
    **/
    count<T extends viewCountArgs>(
      args?: Subset<T, viewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a View.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ViewAggregateArgs>(args: Subset<T, ViewAggregateArgs>): Prisma.PrismaPromise<GetViewAggregateType<T>>

    /**
     * Group by View.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {viewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends viewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: viewGroupByArgs['orderBy'] }
        : { orderBy?: viewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, viewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the view model
   */
  readonly fields: viewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for view.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__viewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    previous<T extends view$previousArgs<ExtArgs> = {}>(args?: Subset<T, view$previousArgs<ExtArgs>>): Prisma__viewClient<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versions<T extends view$versionsArgs<ExtArgs> = {}>(args?: Subset<T, view$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$viewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    schema<T extends data_schemaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, data_schemaDefaultArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the view model
   */
  interface viewFieldRefs {
    readonly rootid: FieldRef<"view", 'String'>
    readonly id: FieldRef<"view", 'Int'>
    readonly prev_id: FieldRef<"view", 'Int'>
    readonly data_schema_id: FieldRef<"view", 'Int'>
    readonly view_type: FieldRef<"view", 'String'>
    readonly name: FieldRef<"view", 'String'>
    readonly json_table_config: FieldRef<"view", 'Json'>
    readonly flag: FieldRef<"view", 'String'>
    readonly activate: FieldRef<"view", 'Boolean'>
    readonly modify_datetime: FieldRef<"view", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * view findUnique
   */
  export type viewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter, which view to fetch.
     */
    where: viewWhereUniqueInput
  }

  /**
   * view findUniqueOrThrow
   */
  export type viewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter, which view to fetch.
     */
    where: viewWhereUniqueInput
  }

  /**
   * view findFirst
   */
  export type viewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter, which view to fetch.
     */
    where?: viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of views to fetch.
     */
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for views.
     */
    cursor?: viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of views.
     */
    distinct?: ViewScalarFieldEnum | ViewScalarFieldEnum[]
  }

  /**
   * view findFirstOrThrow
   */
  export type viewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter, which view to fetch.
     */
    where?: viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of views to fetch.
     */
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for views.
     */
    cursor?: viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of views.
     */
    distinct?: ViewScalarFieldEnum | ViewScalarFieldEnum[]
  }

  /**
   * view findMany
   */
  export type viewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter, which views to fetch.
     */
    where?: viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of views to fetch.
     */
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing views.
     */
    cursor?: viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of views.
     */
    distinct?: ViewScalarFieldEnum | ViewScalarFieldEnum[]
  }

  /**
   * view create
   */
  export type viewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * The data needed to create a view.
     */
    data: XOR<viewCreateInput, viewUncheckedCreateInput>
  }

  /**
   * view createMany
   */
  export type viewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many views.
     */
    data: viewCreateManyInput | viewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * view createManyAndReturn
   */
  export type viewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * The data used to create many views.
     */
    data: viewCreateManyInput | viewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * view update
   */
  export type viewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * The data needed to update a view.
     */
    data: XOR<viewUpdateInput, viewUncheckedUpdateInput>
    /**
     * Choose, which view to update.
     */
    where: viewWhereUniqueInput
  }

  /**
   * view updateMany
   */
  export type viewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update views.
     */
    data: XOR<viewUpdateManyMutationInput, viewUncheckedUpdateManyInput>
    /**
     * Filter which views to update
     */
    where?: viewWhereInput
    /**
     * Limit how many views to update.
     */
    limit?: number
  }

  /**
   * view updateManyAndReturn
   */
  export type viewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * The data used to update views.
     */
    data: XOR<viewUpdateManyMutationInput, viewUncheckedUpdateManyInput>
    /**
     * Filter which views to update
     */
    where?: viewWhereInput
    /**
     * Limit how many views to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * view upsert
   */
  export type viewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * The filter to search for the view to update in case it exists.
     */
    where: viewWhereUniqueInput
    /**
     * In case the view found by the `where` argument doesn't exist, create a new view with this data.
     */
    create: XOR<viewCreateInput, viewUncheckedCreateInput>
    /**
     * In case the view was found with the provided `where` argument, update it with this data.
     */
    update: XOR<viewUpdateInput, viewUncheckedUpdateInput>
  }

  /**
   * view delete
   */
  export type viewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    /**
     * Filter which view to delete.
     */
    where: viewWhereUniqueInput
  }

  /**
   * view deleteMany
   */
  export type viewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which views to delete
     */
    where?: viewWhereInput
    /**
     * Limit how many views to delete.
     */
    limit?: number
  }

  /**
   * view.previous
   */
  export type view$previousArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    where?: viewWhereInput
  }

  /**
   * view.versions
   */
  export type view$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
    where?: viewWhereInput
    orderBy?: viewOrderByWithRelationInput | viewOrderByWithRelationInput[]
    cursor?: viewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViewScalarFieldEnum | ViewScalarFieldEnum[]
  }

  /**
   * view without action
   */
  export type viewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the view
     */
    select?: viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the view
     */
    omit?: viewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: viewInclude<ExtArgs> | null
  }


  /**
   * Model form
   */

  export type AggregateForm = {
    _count: FormCountAggregateOutputType | null
    _avg: FormAvgAggregateOutputType | null
    _sum: FormSumAggregateOutputType | null
    _min: FormMinAggregateOutputType | null
    _max: FormMaxAggregateOutputType | null
  }

  export type FormAvgAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_id: number | null
    modify_datetime: number | null
  }

  export type FormSumAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_id: number | null
    modify_datetime: bigint | null
  }

  export type FormMinAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_id: number | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type FormMaxAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_id: number | null
    name: string | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type FormCountAggregateOutputType = {
    rootid: number
    id: number
    prev_id: number
    data_id: number
    name: number
    json_form_config: number
    flag: number
    activate: number
    modify_datetime: number
    _all: number
  }


  export type FormAvgAggregateInputType = {
    id?: true
    prev_id?: true
    data_id?: true
    modify_datetime?: true
  }

  export type FormSumAggregateInputType = {
    id?: true
    prev_id?: true
    data_id?: true
    modify_datetime?: true
  }

  export type FormMinAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_id?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type FormMaxAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_id?: true
    name?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type FormCountAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_id?: true
    name?: true
    json_form_config?: true
    flag?: true
    activate?: true
    modify_datetime?: true
    _all?: true
  }

  export type FormAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which form to aggregate.
     */
    where?: formWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forms to fetch.
     */
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: formWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned forms
    **/
    _count?: true | FormCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FormAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FormSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FormMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FormMaxAggregateInputType
  }

  export type GetFormAggregateType<T extends FormAggregateArgs> = {
        [P in keyof T & keyof AggregateForm]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateForm[P]>
      : GetScalarType<T[P], AggregateForm[P]>
  }




  export type formGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: formWhereInput
    orderBy?: formOrderByWithAggregationInput | formOrderByWithAggregationInput[]
    by: FormScalarFieldEnum[] | FormScalarFieldEnum
    having?: formScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FormCountAggregateInputType | true
    _avg?: FormAvgAggregateInputType
    _sum?: FormSumAggregateInputType
    _min?: FormMinAggregateInputType
    _max?: FormMaxAggregateInputType
  }

  export type FormGroupByOutputType = {
    rootid: string
    id: number
    prev_id: number | null
    data_id: number
    name: string | null
    json_form_config: JsonValue
    flag: string | null
    activate: boolean
    modify_datetime: bigint | null
    _count: FormCountAggregateOutputType | null
    _avg: FormAvgAggregateOutputType | null
    _sum: FormSumAggregateOutputType | null
    _min: FormMinAggregateOutputType | null
    _max: FormMaxAggregateOutputType | null
  }

  type GetFormGroupByPayload<T extends formGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FormGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FormGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FormGroupByOutputType[P]>
            : GetScalarType<T[P], FormGroupByOutputType[P]>
        }
      >
    >


  export type formSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_id?: boolean
    name?: boolean
    json_form_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | form$previousArgs<ExtArgs>
    versions?: boolean | form$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | FormCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["form"]>

  export type formSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_id?: boolean
    name?: boolean
    json_form_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | form$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["form"]>

  export type formSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_id?: boolean
    name?: boolean
    json_form_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | form$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["form"]>

  export type formSelectScalar = {
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_id?: boolean
    name?: boolean
    json_form_config?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
  }

  export type formOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"rootid" | "id" | "prev_id" | "data_id" | "name" | "json_form_config" | "flag" | "activate" | "modify_datetime", ExtArgs["result"]["form"]>
  export type formInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | form$previousArgs<ExtArgs>
    versions?: boolean | form$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | FormCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type formIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | form$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }
  export type formIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | form$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }

  export type $formPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "form"
    objects: {
      previous: Prisma.$formPayload<ExtArgs> | null
      versions: Prisma.$formPayload<ExtArgs>[]
      schema: Prisma.$data_schemaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      rootid: string
      id: number
      prev_id: number | null
      data_id: number
      name: string | null
      json_form_config: Prisma.JsonValue
      flag: string | null
      activate: boolean
      modify_datetime: bigint | null
    }, ExtArgs["result"]["form"]>
    composites: {}
  }

  type formGetPayload<S extends boolean | null | undefined | formDefaultArgs> = $Result.GetResult<Prisma.$formPayload, S>

  type formCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<formFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FormCountAggregateInputType | true
    }

  export interface formDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['form'], meta: { name: 'form' } }
    /**
     * Find zero or one Form that matches the filter.
     * @param {formFindUniqueArgs} args - Arguments to find a Form
     * @example
     * // Get one Form
     * const form = await prisma.form.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends formFindUniqueArgs>(args: SelectSubset<T, formFindUniqueArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Form that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {formFindUniqueOrThrowArgs} args - Arguments to find a Form
     * @example
     * // Get one Form
     * const form = await prisma.form.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends formFindUniqueOrThrowArgs>(args: SelectSubset<T, formFindUniqueOrThrowArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Form that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formFindFirstArgs} args - Arguments to find a Form
     * @example
     * // Get one Form
     * const form = await prisma.form.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends formFindFirstArgs>(args?: SelectSubset<T, formFindFirstArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Form that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formFindFirstOrThrowArgs} args - Arguments to find a Form
     * @example
     * // Get one Form
     * const form = await prisma.form.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends formFindFirstOrThrowArgs>(args?: SelectSubset<T, formFindFirstOrThrowArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Forms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Forms
     * const forms = await prisma.form.findMany()
     * 
     * // Get first 10 Forms
     * const forms = await prisma.form.findMany({ take: 10 })
     * 
     * // Only select the `rootid`
     * const formWithRootidOnly = await prisma.form.findMany({ select: { rootid: true } })
     * 
     */
    findMany<T extends formFindManyArgs>(args?: SelectSubset<T, formFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Form.
     * @param {formCreateArgs} args - Arguments to create a Form.
     * @example
     * // Create one Form
     * const Form = await prisma.form.create({
     *   data: {
     *     // ... data to create a Form
     *   }
     * })
     * 
     */
    create<T extends formCreateArgs>(args: SelectSubset<T, formCreateArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Forms.
     * @param {formCreateManyArgs} args - Arguments to create many Forms.
     * @example
     * // Create many Forms
     * const form = await prisma.form.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends formCreateManyArgs>(args?: SelectSubset<T, formCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Forms and returns the data saved in the database.
     * @param {formCreateManyAndReturnArgs} args - Arguments to create many Forms.
     * @example
     * // Create many Forms
     * const form = await prisma.form.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Forms and only return the `rootid`
     * const formWithRootidOnly = await prisma.form.createManyAndReturn({
     *   select: { rootid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends formCreateManyAndReturnArgs>(args?: SelectSubset<T, formCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Form.
     * @param {formDeleteArgs} args - Arguments to delete one Form.
     * @example
     * // Delete one Form
     * const Form = await prisma.form.delete({
     *   where: {
     *     // ... filter to delete one Form
     *   }
     * })
     * 
     */
    delete<T extends formDeleteArgs>(args: SelectSubset<T, formDeleteArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Form.
     * @param {formUpdateArgs} args - Arguments to update one Form.
     * @example
     * // Update one Form
     * const form = await prisma.form.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends formUpdateArgs>(args: SelectSubset<T, formUpdateArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Forms.
     * @param {formDeleteManyArgs} args - Arguments to filter Forms to delete.
     * @example
     * // Delete a few Forms
     * const { count } = await prisma.form.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends formDeleteManyArgs>(args?: SelectSubset<T, formDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Forms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Forms
     * const form = await prisma.form.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends formUpdateManyArgs>(args: SelectSubset<T, formUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Forms and returns the data updated in the database.
     * @param {formUpdateManyAndReturnArgs} args - Arguments to update many Forms.
     * @example
     * // Update many Forms
     * const form = await prisma.form.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Forms and only return the `rootid`
     * const formWithRootidOnly = await prisma.form.updateManyAndReturn({
     *   select: { rootid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends formUpdateManyAndReturnArgs>(args: SelectSubset<T, formUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Form.
     * @param {formUpsertArgs} args - Arguments to update or create a Form.
     * @example
     * // Update or create a Form
     * const form = await prisma.form.upsert({
     *   create: {
     *     // ... data to create a Form
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Form we want to update
     *   }
     * })
     */
    upsert<T extends formUpsertArgs>(args: SelectSubset<T, formUpsertArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Forms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formCountArgs} args - Arguments to filter Forms to count.
     * @example
     * // Count the number of Forms
     * const count = await prisma.form.count({
     *   where: {
     *     // ... the filter for the Forms we want to count
     *   }
     * })
    **/
    count<T extends formCountArgs>(
      args?: Subset<T, formCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FormCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Form.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FormAggregateArgs>(args: Subset<T, FormAggregateArgs>): Prisma.PrismaPromise<GetFormAggregateType<T>>

    /**
     * Group by Form.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {formGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends formGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: formGroupByArgs['orderBy'] }
        : { orderBy?: formGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, formGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the form model
   */
  readonly fields: formFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for form.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__formClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    previous<T extends form$previousArgs<ExtArgs> = {}>(args?: Subset<T, form$previousArgs<ExtArgs>>): Prisma__formClient<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versions<T extends form$versionsArgs<ExtArgs> = {}>(args?: Subset<T, form$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$formPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    schema<T extends data_schemaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, data_schemaDefaultArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the form model
   */
  interface formFieldRefs {
    readonly rootid: FieldRef<"form", 'String'>
    readonly id: FieldRef<"form", 'Int'>
    readonly prev_id: FieldRef<"form", 'Int'>
    readonly data_id: FieldRef<"form", 'Int'>
    readonly name: FieldRef<"form", 'String'>
    readonly json_form_config: FieldRef<"form", 'Json'>
    readonly flag: FieldRef<"form", 'String'>
    readonly activate: FieldRef<"form", 'Boolean'>
    readonly modify_datetime: FieldRef<"form", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * form findUnique
   */
  export type formFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter, which form to fetch.
     */
    where: formWhereUniqueInput
  }

  /**
   * form findUniqueOrThrow
   */
  export type formFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter, which form to fetch.
     */
    where: formWhereUniqueInput
  }

  /**
   * form findFirst
   */
  export type formFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter, which form to fetch.
     */
    where?: formWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forms to fetch.
     */
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forms.
     */
    cursor?: formWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forms.
     */
    distinct?: FormScalarFieldEnum | FormScalarFieldEnum[]
  }

  /**
   * form findFirstOrThrow
   */
  export type formFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter, which form to fetch.
     */
    where?: formWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forms to fetch.
     */
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for forms.
     */
    cursor?: formWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forms.
     */
    distinct?: FormScalarFieldEnum | FormScalarFieldEnum[]
  }

  /**
   * form findMany
   */
  export type formFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter, which forms to fetch.
     */
    where?: formWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of forms to fetch.
     */
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing forms.
     */
    cursor?: formWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` forms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` forms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of forms.
     */
    distinct?: FormScalarFieldEnum | FormScalarFieldEnum[]
  }

  /**
   * form create
   */
  export type formCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * The data needed to create a form.
     */
    data: XOR<formCreateInput, formUncheckedCreateInput>
  }

  /**
   * form createMany
   */
  export type formCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many forms.
     */
    data: formCreateManyInput | formCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * form createManyAndReturn
   */
  export type formCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * The data used to create many forms.
     */
    data: formCreateManyInput | formCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * form update
   */
  export type formUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * The data needed to update a form.
     */
    data: XOR<formUpdateInput, formUncheckedUpdateInput>
    /**
     * Choose, which form to update.
     */
    where: formWhereUniqueInput
  }

  /**
   * form updateMany
   */
  export type formUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update forms.
     */
    data: XOR<formUpdateManyMutationInput, formUncheckedUpdateManyInput>
    /**
     * Filter which forms to update
     */
    where?: formWhereInput
    /**
     * Limit how many forms to update.
     */
    limit?: number
  }

  /**
   * form updateManyAndReturn
   */
  export type formUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * The data used to update forms.
     */
    data: XOR<formUpdateManyMutationInput, formUncheckedUpdateManyInput>
    /**
     * Filter which forms to update
     */
    where?: formWhereInput
    /**
     * Limit how many forms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * form upsert
   */
  export type formUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * The filter to search for the form to update in case it exists.
     */
    where: formWhereUniqueInput
    /**
     * In case the form found by the `where` argument doesn't exist, create a new form with this data.
     */
    create: XOR<formCreateInput, formUncheckedCreateInput>
    /**
     * In case the form was found with the provided `where` argument, update it with this data.
     */
    update: XOR<formUpdateInput, formUncheckedUpdateInput>
  }

  /**
   * form delete
   */
  export type formDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    /**
     * Filter which form to delete.
     */
    where: formWhereUniqueInput
  }

  /**
   * form deleteMany
   */
  export type formDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which forms to delete
     */
    where?: formWhereInput
    /**
     * Limit how many forms to delete.
     */
    limit?: number
  }

  /**
   * form.previous
   */
  export type form$previousArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    where?: formWhereInput
  }

  /**
   * form.versions
   */
  export type form$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
    where?: formWhereInput
    orderBy?: formOrderByWithRelationInput | formOrderByWithRelationInput[]
    cursor?: formWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FormScalarFieldEnum | FormScalarFieldEnum[]
  }

  /**
   * form without action
   */
  export type formDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the form
     */
    select?: formSelect<ExtArgs> | null
    /**
     * Omit specific fields from the form
     */
    omit?: formOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: formInclude<ExtArgs> | null
  }


  /**
   * Model data
   */

  export type AggregateData = {
    _count: DataCountAggregateOutputType | null
    _avg: DataAvgAggregateOutputType | null
    _sum: DataSumAggregateOutputType | null
    _min: DataMinAggregateOutputType | null
    _max: DataMaxAggregateOutputType | null
  }

  export type DataAvgAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    modify_datetime: number | null
  }

  export type DataSumAggregateOutputType = {
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    modify_datetime: bigint | null
  }

  export type DataMinAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type DataMaxAggregateOutputType = {
    rootid: string | null
    id: number | null
    prev_id: number | null
    data_schema_id: number | null
    flag: string | null
    activate: boolean | null
    modify_datetime: bigint | null
  }

  export type DataCountAggregateOutputType = {
    rootid: number
    id: number
    prev_id: number
    data_schema_id: number
    data: number
    flag: number
    activate: number
    modify_datetime: number
    _all: number
  }


  export type DataAvgAggregateInputType = {
    id?: true
    prev_id?: true
    data_schema_id?: true
    modify_datetime?: true
  }

  export type DataSumAggregateInputType = {
    id?: true
    prev_id?: true
    data_schema_id?: true
    modify_datetime?: true
  }

  export type DataMinAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type DataMaxAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    flag?: true
    activate?: true
    modify_datetime?: true
  }

  export type DataCountAggregateInputType = {
    rootid?: true
    id?: true
    prev_id?: true
    data_schema_id?: true
    data?: true
    flag?: true
    activate?: true
    modify_datetime?: true
    _all?: true
  }

  export type DataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which data to aggregate.
     */
    where?: dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data to fetch.
     */
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned data
    **/
    _count?: true | DataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataMaxAggregateInputType
  }

  export type GetDataAggregateType<T extends DataAggregateArgs> = {
        [P in keyof T & keyof AggregateData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateData[P]>
      : GetScalarType<T[P], AggregateData[P]>
  }




  export type dataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dataWhereInput
    orderBy?: dataOrderByWithAggregationInput | dataOrderByWithAggregationInput[]
    by: DataScalarFieldEnum[] | DataScalarFieldEnum
    having?: dataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataCountAggregateInputType | true
    _avg?: DataAvgAggregateInputType
    _sum?: DataSumAggregateInputType
    _min?: DataMinAggregateInputType
    _max?: DataMaxAggregateInputType
  }

  export type DataGroupByOutputType = {
    rootid: string
    id: number
    prev_id: number | null
    data_schema_id: number
    data: JsonValue
    flag: string | null
    activate: boolean
    modify_datetime: bigint | null
    _count: DataCountAggregateOutputType | null
    _avg: DataAvgAggregateOutputType | null
    _sum: DataSumAggregateOutputType | null
    _min: DataMinAggregateOutputType | null
    _max: DataMaxAggregateOutputType | null
  }

  type GetDataGroupByPayload<T extends dataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataGroupByOutputType[P]>
            : GetScalarType<T[P], DataGroupByOutputType[P]>
        }
      >
    >


  export type dataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    data?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data$previousArgs<ExtArgs>
    versions?: boolean | data$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | DataCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["data"]>

  export type dataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    data?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["data"]>

  export type dataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    data?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
    previous?: boolean | data$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["data"]>

  export type dataSelectScalar = {
    rootid?: boolean
    id?: boolean
    prev_id?: boolean
    data_schema_id?: boolean
    data?: boolean
    flag?: boolean
    activate?: boolean
    modify_datetime?: boolean
  }

  export type dataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"rootid" | "id" | "prev_id" | "data_schema_id" | "data" | "flag" | "activate" | "modify_datetime", ExtArgs["result"]["data"]>
  export type dataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data$previousArgs<ExtArgs>
    versions?: boolean | data$versionsArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
    _count?: boolean | DataCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type dataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }
  export type dataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    previous?: boolean | data$previousArgs<ExtArgs>
    schema?: boolean | data_schemaDefaultArgs<ExtArgs>
  }

  export type $dataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "data"
    objects: {
      previous: Prisma.$dataPayload<ExtArgs> | null
      versions: Prisma.$dataPayload<ExtArgs>[]
      schema: Prisma.$data_schemaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      rootid: string
      id: number
      prev_id: number | null
      data_schema_id: number
      data: Prisma.JsonValue
      flag: string | null
      activate: boolean
      modify_datetime: bigint | null
    }, ExtArgs["result"]["data"]>
    composites: {}
  }

  type dataGetPayload<S extends boolean | null | undefined | dataDefaultArgs> = $Result.GetResult<Prisma.$dataPayload, S>

  type dataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<dataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DataCountAggregateInputType | true
    }

  export interface dataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['data'], meta: { name: 'data' } }
    /**
     * Find zero or one Data that matches the filter.
     * @param {dataFindUniqueArgs} args - Arguments to find a Data
     * @example
     * // Get one Data
     * const data = await prisma.data.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dataFindUniqueArgs>(args: SelectSubset<T, dataFindUniqueArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Data that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {dataFindUniqueOrThrowArgs} args - Arguments to find a Data
     * @example
     * // Get one Data
     * const data = await prisma.data.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dataFindUniqueOrThrowArgs>(args: SelectSubset<T, dataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Data that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataFindFirstArgs} args - Arguments to find a Data
     * @example
     * // Get one Data
     * const data = await prisma.data.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dataFindFirstArgs>(args?: SelectSubset<T, dataFindFirstArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Data that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataFindFirstOrThrowArgs} args - Arguments to find a Data
     * @example
     * // Get one Data
     * const data = await prisma.data.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dataFindFirstOrThrowArgs>(args?: SelectSubset<T, dataFindFirstOrThrowArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Data that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Data
     * const data = await prisma.data.findMany()
     * 
     * // Get first 10 Data
     * const data = await prisma.data.findMany({ take: 10 })
     * 
     * // Only select the `rootid`
     * const dataWithRootidOnly = await prisma.data.findMany({ select: { rootid: true } })
     * 
     */
    findMany<T extends dataFindManyArgs>(args?: SelectSubset<T, dataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Data.
     * @param {dataCreateArgs} args - Arguments to create a Data.
     * @example
     * // Create one Data
     * const Data = await prisma.data.create({
     *   data: {
     *     // ... data to create a Data
     *   }
     * })
     * 
     */
    create<T extends dataCreateArgs>(args: SelectSubset<T, dataCreateArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Data.
     * @param {dataCreateManyArgs} args - Arguments to create many Data.
     * @example
     * // Create many Data
     * const data = await prisma.data.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dataCreateManyArgs>(args?: SelectSubset<T, dataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Data and returns the data saved in the database.
     * @param {dataCreateManyAndReturnArgs} args - Arguments to create many Data.
     * @example
     * // Create many Data
     * const data = await prisma.data.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Data and only return the `rootid`
     * const dataWithRootidOnly = await prisma.data.createManyAndReturn({
     *   select: { rootid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends dataCreateManyAndReturnArgs>(args?: SelectSubset<T, dataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Data.
     * @param {dataDeleteArgs} args - Arguments to delete one Data.
     * @example
     * // Delete one Data
     * const Data = await prisma.data.delete({
     *   where: {
     *     // ... filter to delete one Data
     *   }
     * })
     * 
     */
    delete<T extends dataDeleteArgs>(args: SelectSubset<T, dataDeleteArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Data.
     * @param {dataUpdateArgs} args - Arguments to update one Data.
     * @example
     * // Update one Data
     * const data = await prisma.data.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dataUpdateArgs>(args: SelectSubset<T, dataUpdateArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Data.
     * @param {dataDeleteManyArgs} args - Arguments to filter Data to delete.
     * @example
     * // Delete a few Data
     * const { count } = await prisma.data.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dataDeleteManyArgs>(args?: SelectSubset<T, dataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Data
     * const data = await prisma.data.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dataUpdateManyArgs>(args: SelectSubset<T, dataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Data and returns the data updated in the database.
     * @param {dataUpdateManyAndReturnArgs} args - Arguments to update many Data.
     * @example
     * // Update many Data
     * const data = await prisma.data.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Data and only return the `rootid`
     * const dataWithRootidOnly = await prisma.data.updateManyAndReturn({
     *   select: { rootid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends dataUpdateManyAndReturnArgs>(args: SelectSubset<T, dataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Data.
     * @param {dataUpsertArgs} args - Arguments to update or create a Data.
     * @example
     * // Update or create a Data
     * const data = await prisma.data.upsert({
     *   create: {
     *     // ... data to create a Data
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Data we want to update
     *   }
     * })
     */
    upsert<T extends dataUpsertArgs>(args: SelectSubset<T, dataUpsertArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataCountArgs} args - Arguments to filter Data to count.
     * @example
     * // Count the number of Data
     * const count = await prisma.data.count({
     *   where: {
     *     // ... the filter for the Data we want to count
     *   }
     * })
    **/
    count<T extends dataCountArgs>(
      args?: Subset<T, dataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataAggregateArgs>(args: Subset<T, DataAggregateArgs>): Prisma.PrismaPromise<GetDataAggregateType<T>>

    /**
     * Group by Data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dataGroupByArgs['orderBy'] }
        : { orderBy?: dataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the data model
   */
  readonly fields: dataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for data.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    previous<T extends data$previousArgs<ExtArgs> = {}>(args?: Subset<T, data$previousArgs<ExtArgs>>): Prisma__dataClient<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    versions<T extends data$versionsArgs<ExtArgs> = {}>(args?: Subset<T, data$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    schema<T extends data_schemaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, data_schemaDefaultArgs<ExtArgs>>): Prisma__data_schemaClient<$Result.GetResult<Prisma.$data_schemaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the data model
   */
  interface dataFieldRefs {
    readonly rootid: FieldRef<"data", 'String'>
    readonly id: FieldRef<"data", 'Int'>
    readonly prev_id: FieldRef<"data", 'Int'>
    readonly data_schema_id: FieldRef<"data", 'Int'>
    readonly data: FieldRef<"data", 'Json'>
    readonly flag: FieldRef<"data", 'String'>
    readonly activate: FieldRef<"data", 'Boolean'>
    readonly modify_datetime: FieldRef<"data", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * data findUnique
   */
  export type dataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter, which data to fetch.
     */
    where: dataWhereUniqueInput
  }

  /**
   * data findUniqueOrThrow
   */
  export type dataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter, which data to fetch.
     */
    where: dataWhereUniqueInput
  }

  /**
   * data findFirst
   */
  export type dataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter, which data to fetch.
     */
    where?: dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data to fetch.
     */
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for data.
     */
    cursor?: dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data.
     */
    distinct?: DataScalarFieldEnum | DataScalarFieldEnum[]
  }

  /**
   * data findFirstOrThrow
   */
  export type dataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter, which data to fetch.
     */
    where?: dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data to fetch.
     */
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for data.
     */
    cursor?: dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data.
     */
    distinct?: DataScalarFieldEnum | DataScalarFieldEnum[]
  }

  /**
   * data findMany
   */
  export type dataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter, which data to fetch.
     */
    where?: dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of data to fetch.
     */
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing data.
     */
    cursor?: dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of data.
     */
    distinct?: DataScalarFieldEnum | DataScalarFieldEnum[]
  }

  /**
   * data create
   */
  export type dataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * The data needed to create a data.
     */
    data: XOR<dataCreateInput, dataUncheckedCreateInput>
  }

  /**
   * data createMany
   */
  export type dataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many data.
     */
    data: dataCreateManyInput | dataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * data createManyAndReturn
   */
  export type dataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * The data used to create many data.
     */
    data: dataCreateManyInput | dataCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * data update
   */
  export type dataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * The data needed to update a data.
     */
    data: XOR<dataUpdateInput, dataUncheckedUpdateInput>
    /**
     * Choose, which data to update.
     */
    where: dataWhereUniqueInput
  }

  /**
   * data updateMany
   */
  export type dataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update data.
     */
    data: XOR<dataUpdateManyMutationInput, dataUncheckedUpdateManyInput>
    /**
     * Filter which data to update
     */
    where?: dataWhereInput
    /**
     * Limit how many data to update.
     */
    limit?: number
  }

  /**
   * data updateManyAndReturn
   */
  export type dataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * The data used to update data.
     */
    data: XOR<dataUpdateManyMutationInput, dataUncheckedUpdateManyInput>
    /**
     * Filter which data to update
     */
    where?: dataWhereInput
    /**
     * Limit how many data to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * data upsert
   */
  export type dataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * The filter to search for the data to update in case it exists.
     */
    where: dataWhereUniqueInput
    /**
     * In case the data found by the `where` argument doesn't exist, create a new data with this data.
     */
    create: XOR<dataCreateInput, dataUncheckedCreateInput>
    /**
     * In case the data was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dataUpdateInput, dataUncheckedUpdateInput>
  }

  /**
   * data delete
   */
  export type dataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    /**
     * Filter which data to delete.
     */
    where: dataWhereUniqueInput
  }

  /**
   * data deleteMany
   */
  export type dataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which data to delete
     */
    where?: dataWhereInput
    /**
     * Limit how many data to delete.
     */
    limit?: number
  }

  /**
   * data.previous
   */
  export type data$previousArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    where?: dataWhereInput
  }

  /**
   * data.versions
   */
  export type data$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
    where?: dataWhereInput
    orderBy?: dataOrderByWithRelationInput | dataOrderByWithRelationInput[]
    cursor?: dataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataScalarFieldEnum | DataScalarFieldEnum[]
  }

  /**
   * data without action
   */
  export type dataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the data
     */
    select?: dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the data
     */
    omit?: dataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dataInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BusinessScalarFieldEnum: {
    rootid: 'rootid',
    id: 'id',
    prev_id: 'prev_id',
    name: 'name',
    icon: 'icon',
    flag: 'flag',
    activate: 'activate',
    modify_datetime: 'modify_datetime'
  };

  export type BusinessScalarFieldEnum = (typeof BusinessScalarFieldEnum)[keyof typeof BusinessScalarFieldEnum]


  export const Data_schemaScalarFieldEnum: {
    rootid: 'rootid',
    id: 'id',
    business_id: 'business_id',
    prev_id: 'prev_id',
    name: 'name',
    json: 'json',
    flag: 'flag',
    activate: 'activate',
    modify_datetime: 'modify_datetime'
  };

  export type Data_schemaScalarFieldEnum = (typeof Data_schemaScalarFieldEnum)[keyof typeof Data_schemaScalarFieldEnum]


  export const ViewScalarFieldEnum: {
    rootid: 'rootid',
    id: 'id',
    prev_id: 'prev_id',
    data_schema_id: 'data_schema_id',
    view_type: 'view_type',
    name: 'name',
    json_table_config: 'json_table_config',
    flag: 'flag',
    activate: 'activate',
    modify_datetime: 'modify_datetime'
  };

  export type ViewScalarFieldEnum = (typeof ViewScalarFieldEnum)[keyof typeof ViewScalarFieldEnum]


  export const FormScalarFieldEnum: {
    rootid: 'rootid',
    id: 'id',
    prev_id: 'prev_id',
    data_id: 'data_id',
    name: 'name',
    json_form_config: 'json_form_config',
    flag: 'flag',
    activate: 'activate',
    modify_datetime: 'modify_datetime'
  };

  export type FormScalarFieldEnum = (typeof FormScalarFieldEnum)[keyof typeof FormScalarFieldEnum]


  export const DataScalarFieldEnum: {
    rootid: 'rootid',
    id: 'id',
    prev_id: 'prev_id',
    data_schema_id: 'data_schema_id',
    data: 'data',
    flag: 'flag',
    activate: 'activate',
    modify_datetime: 'modify_datetime'
  };

  export type DataScalarFieldEnum = (typeof DataScalarFieldEnum)[keyof typeof DataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type businessWhereInput = {
    AND?: businessWhereInput | businessWhereInput[]
    OR?: businessWhereInput[]
    NOT?: businessWhereInput | businessWhereInput[]
    rootid?: UuidFilter<"business"> | string
    id?: IntFilter<"business"> | number
    prev_id?: IntNullableFilter<"business"> | number | null
    name?: StringFilter<"business"> | string
    icon?: StringNullableFilter<"business"> | string | null
    flag?: StringNullableFilter<"business"> | string | null
    activate?: BoolFilter<"business"> | boolean
    modify_datetime?: BigIntNullableFilter<"business"> | bigint | number | null
    previous?: XOR<BusinessNullableScalarRelationFilter, businessWhereInput> | null
    versions?: BusinessListRelationFilter
    schemas?: Data_schemaListRelationFilter
  }

  export type businessOrderByWithRelationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    previous?: businessOrderByWithRelationInput
    versions?: businessOrderByRelationAggregateInput
    schemas?: data_schemaOrderByRelationAggregateInput
  }

  export type businessWhereUniqueInput = Prisma.AtLeast<{
    rootid?: string
    id?: number
    AND?: businessWhereInput | businessWhereInput[]
    OR?: businessWhereInput[]
    NOT?: businessWhereInput | businessWhereInput[]
    prev_id?: IntNullableFilter<"business"> | number | null
    name?: StringFilter<"business"> | string
    icon?: StringNullableFilter<"business"> | string | null
    flag?: StringNullableFilter<"business"> | string | null
    activate?: BoolFilter<"business"> | boolean
    modify_datetime?: BigIntNullableFilter<"business"> | bigint | number | null
    previous?: XOR<BusinessNullableScalarRelationFilter, businessWhereInput> | null
    versions?: BusinessListRelationFilter
    schemas?: Data_schemaListRelationFilter
  }, "rootid" | "id">

  export type businessOrderByWithAggregationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    name?: SortOrder
    icon?: SortOrderInput | SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    _count?: businessCountOrderByAggregateInput
    _avg?: businessAvgOrderByAggregateInput
    _max?: businessMaxOrderByAggregateInput
    _min?: businessMinOrderByAggregateInput
    _sum?: businessSumOrderByAggregateInput
  }

  export type businessScalarWhereWithAggregatesInput = {
    AND?: businessScalarWhereWithAggregatesInput | businessScalarWhereWithAggregatesInput[]
    OR?: businessScalarWhereWithAggregatesInput[]
    NOT?: businessScalarWhereWithAggregatesInput | businessScalarWhereWithAggregatesInput[]
    rootid?: UuidWithAggregatesFilter<"business"> | string
    id?: IntWithAggregatesFilter<"business"> | number
    prev_id?: IntNullableWithAggregatesFilter<"business"> | number | null
    name?: StringWithAggregatesFilter<"business"> | string
    icon?: StringNullableWithAggregatesFilter<"business"> | string | null
    flag?: StringNullableWithAggregatesFilter<"business"> | string | null
    activate?: BoolWithAggregatesFilter<"business"> | boolean
    modify_datetime?: BigIntNullableWithAggregatesFilter<"business"> | bigint | number | null
  }

  export type data_schemaWhereInput = {
    AND?: data_schemaWhereInput | data_schemaWhereInput[]
    OR?: data_schemaWhereInput[]
    NOT?: data_schemaWhereInput | data_schemaWhereInput[]
    rootid?: UuidFilter<"data_schema"> | string
    id?: IntFilter<"data_schema"> | number
    business_id?: IntNullableFilter<"data_schema"> | number | null
    prev_id?: IntNullableFilter<"data_schema"> | number | null
    name?: StringFilter<"data_schema"> | string
    json?: JsonFilter<"data_schema">
    flag?: StringNullableFilter<"data_schema"> | string | null
    activate?: BoolFilter<"data_schema"> | boolean
    modify_datetime?: BigIntNullableFilter<"data_schema"> | bigint | number | null
    previous?: XOR<Data_schemaNullableScalarRelationFilter, data_schemaWhereInput> | null
    versions?: Data_schemaListRelationFilter
    business?: XOR<BusinessNullableScalarRelationFilter, businessWhereInput> | null
    views?: ViewListRelationFilter
    forms?: FormListRelationFilter
    records?: DataListRelationFilter
  }

  export type data_schemaOrderByWithRelationInput = {
    rootid?: SortOrder
    id?: SortOrder
    business_id?: SortOrderInput | SortOrder
    prev_id?: SortOrderInput | SortOrder
    name?: SortOrder
    json?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    previous?: data_schemaOrderByWithRelationInput
    versions?: data_schemaOrderByRelationAggregateInput
    business?: businessOrderByWithRelationInput
    views?: viewOrderByRelationAggregateInput
    forms?: formOrderByRelationAggregateInput
    records?: dataOrderByRelationAggregateInput
  }

  export type data_schemaWhereUniqueInput = Prisma.AtLeast<{
    rootid?: string
    id?: number
    AND?: data_schemaWhereInput | data_schemaWhereInput[]
    OR?: data_schemaWhereInput[]
    NOT?: data_schemaWhereInput | data_schemaWhereInput[]
    business_id?: IntNullableFilter<"data_schema"> | number | null
    prev_id?: IntNullableFilter<"data_schema"> | number | null
    name?: StringFilter<"data_schema"> | string
    json?: JsonFilter<"data_schema">
    flag?: StringNullableFilter<"data_schema"> | string | null
    activate?: BoolFilter<"data_schema"> | boolean
    modify_datetime?: BigIntNullableFilter<"data_schema"> | bigint | number | null
    previous?: XOR<Data_schemaNullableScalarRelationFilter, data_schemaWhereInput> | null
    versions?: Data_schemaListRelationFilter
    business?: XOR<BusinessNullableScalarRelationFilter, businessWhereInput> | null
    views?: ViewListRelationFilter
    forms?: FormListRelationFilter
    records?: DataListRelationFilter
  }, "rootid" | "id">

  export type data_schemaOrderByWithAggregationInput = {
    rootid?: SortOrder
    id?: SortOrder
    business_id?: SortOrderInput | SortOrder
    prev_id?: SortOrderInput | SortOrder
    name?: SortOrder
    json?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    _count?: data_schemaCountOrderByAggregateInput
    _avg?: data_schemaAvgOrderByAggregateInput
    _max?: data_schemaMaxOrderByAggregateInput
    _min?: data_schemaMinOrderByAggregateInput
    _sum?: data_schemaSumOrderByAggregateInput
  }

  export type data_schemaScalarWhereWithAggregatesInput = {
    AND?: data_schemaScalarWhereWithAggregatesInput | data_schemaScalarWhereWithAggregatesInput[]
    OR?: data_schemaScalarWhereWithAggregatesInput[]
    NOT?: data_schemaScalarWhereWithAggregatesInput | data_schemaScalarWhereWithAggregatesInput[]
    rootid?: UuidWithAggregatesFilter<"data_schema"> | string
    id?: IntWithAggregatesFilter<"data_schema"> | number
    business_id?: IntNullableWithAggregatesFilter<"data_schema"> | number | null
    prev_id?: IntNullableWithAggregatesFilter<"data_schema"> | number | null
    name?: StringWithAggregatesFilter<"data_schema"> | string
    json?: JsonWithAggregatesFilter<"data_schema">
    flag?: StringNullableWithAggregatesFilter<"data_schema"> | string | null
    activate?: BoolWithAggregatesFilter<"data_schema"> | boolean
    modify_datetime?: BigIntNullableWithAggregatesFilter<"data_schema"> | bigint | number | null
  }

  export type viewWhereInput = {
    AND?: viewWhereInput | viewWhereInput[]
    OR?: viewWhereInput[]
    NOT?: viewWhereInput | viewWhereInput[]
    rootid?: UuidFilter<"view"> | string
    id?: IntFilter<"view"> | number
    prev_id?: IntNullableFilter<"view"> | number | null
    data_schema_id?: IntFilter<"view"> | number
    view_type?: StringFilter<"view"> | string
    name?: StringNullableFilter<"view"> | string | null
    json_table_config?: JsonFilter<"view">
    flag?: StringNullableFilter<"view"> | string | null
    activate?: BoolFilter<"view"> | boolean
    modify_datetime?: BigIntNullableFilter<"view"> | bigint | number | null
    previous?: XOR<ViewNullableScalarRelationFilter, viewWhereInput> | null
    versions?: ViewListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }

  export type viewOrderByWithRelationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_schema_id?: SortOrder
    view_type?: SortOrder
    name?: SortOrderInput | SortOrder
    json_table_config?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    previous?: viewOrderByWithRelationInput
    versions?: viewOrderByRelationAggregateInput
    schema?: data_schemaOrderByWithRelationInput
  }

  export type viewWhereUniqueInput = Prisma.AtLeast<{
    rootid?: string
    id?: number
    AND?: viewWhereInput | viewWhereInput[]
    OR?: viewWhereInput[]
    NOT?: viewWhereInput | viewWhereInput[]
    prev_id?: IntNullableFilter<"view"> | number | null
    data_schema_id?: IntFilter<"view"> | number
    view_type?: StringFilter<"view"> | string
    name?: StringNullableFilter<"view"> | string | null
    json_table_config?: JsonFilter<"view">
    flag?: StringNullableFilter<"view"> | string | null
    activate?: BoolFilter<"view"> | boolean
    modify_datetime?: BigIntNullableFilter<"view"> | bigint | number | null
    previous?: XOR<ViewNullableScalarRelationFilter, viewWhereInput> | null
    versions?: ViewListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }, "rootid" | "id">

  export type viewOrderByWithAggregationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_schema_id?: SortOrder
    view_type?: SortOrder
    name?: SortOrderInput | SortOrder
    json_table_config?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    _count?: viewCountOrderByAggregateInput
    _avg?: viewAvgOrderByAggregateInput
    _max?: viewMaxOrderByAggregateInput
    _min?: viewMinOrderByAggregateInput
    _sum?: viewSumOrderByAggregateInput
  }

  export type viewScalarWhereWithAggregatesInput = {
    AND?: viewScalarWhereWithAggregatesInput | viewScalarWhereWithAggregatesInput[]
    OR?: viewScalarWhereWithAggregatesInput[]
    NOT?: viewScalarWhereWithAggregatesInput | viewScalarWhereWithAggregatesInput[]
    rootid?: UuidWithAggregatesFilter<"view"> | string
    id?: IntWithAggregatesFilter<"view"> | number
    prev_id?: IntNullableWithAggregatesFilter<"view"> | number | null
    data_schema_id?: IntWithAggregatesFilter<"view"> | number
    view_type?: StringWithAggregatesFilter<"view"> | string
    name?: StringNullableWithAggregatesFilter<"view"> | string | null
    json_table_config?: JsonWithAggregatesFilter<"view">
    flag?: StringNullableWithAggregatesFilter<"view"> | string | null
    activate?: BoolWithAggregatesFilter<"view"> | boolean
    modify_datetime?: BigIntNullableWithAggregatesFilter<"view"> | bigint | number | null
  }

  export type formWhereInput = {
    AND?: formWhereInput | formWhereInput[]
    OR?: formWhereInput[]
    NOT?: formWhereInput | formWhereInput[]
    rootid?: UuidFilter<"form"> | string
    id?: IntFilter<"form"> | number
    prev_id?: IntNullableFilter<"form"> | number | null
    data_id?: IntFilter<"form"> | number
    name?: StringNullableFilter<"form"> | string | null
    json_form_config?: JsonFilter<"form">
    flag?: StringNullableFilter<"form"> | string | null
    activate?: BoolFilter<"form"> | boolean
    modify_datetime?: BigIntNullableFilter<"form"> | bigint | number | null
    previous?: XOR<FormNullableScalarRelationFilter, formWhereInput> | null
    versions?: FormListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }

  export type formOrderByWithRelationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_id?: SortOrder
    name?: SortOrderInput | SortOrder
    json_form_config?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    previous?: formOrderByWithRelationInput
    versions?: formOrderByRelationAggregateInput
    schema?: data_schemaOrderByWithRelationInput
  }

  export type formWhereUniqueInput = Prisma.AtLeast<{
    rootid?: string
    id?: number
    AND?: formWhereInput | formWhereInput[]
    OR?: formWhereInput[]
    NOT?: formWhereInput | formWhereInput[]
    prev_id?: IntNullableFilter<"form"> | number | null
    data_id?: IntFilter<"form"> | number
    name?: StringNullableFilter<"form"> | string | null
    json_form_config?: JsonFilter<"form">
    flag?: StringNullableFilter<"form"> | string | null
    activate?: BoolFilter<"form"> | boolean
    modify_datetime?: BigIntNullableFilter<"form"> | bigint | number | null
    previous?: XOR<FormNullableScalarRelationFilter, formWhereInput> | null
    versions?: FormListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }, "rootid" | "id">

  export type formOrderByWithAggregationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_id?: SortOrder
    name?: SortOrderInput | SortOrder
    json_form_config?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    _count?: formCountOrderByAggregateInput
    _avg?: formAvgOrderByAggregateInput
    _max?: formMaxOrderByAggregateInput
    _min?: formMinOrderByAggregateInput
    _sum?: formSumOrderByAggregateInput
  }

  export type formScalarWhereWithAggregatesInput = {
    AND?: formScalarWhereWithAggregatesInput | formScalarWhereWithAggregatesInput[]
    OR?: formScalarWhereWithAggregatesInput[]
    NOT?: formScalarWhereWithAggregatesInput | formScalarWhereWithAggregatesInput[]
    rootid?: UuidWithAggregatesFilter<"form"> | string
    id?: IntWithAggregatesFilter<"form"> | number
    prev_id?: IntNullableWithAggregatesFilter<"form"> | number | null
    data_id?: IntWithAggregatesFilter<"form"> | number
    name?: StringNullableWithAggregatesFilter<"form"> | string | null
    json_form_config?: JsonWithAggregatesFilter<"form">
    flag?: StringNullableWithAggregatesFilter<"form"> | string | null
    activate?: BoolWithAggregatesFilter<"form"> | boolean
    modify_datetime?: BigIntNullableWithAggregatesFilter<"form"> | bigint | number | null
  }

  export type dataWhereInput = {
    AND?: dataWhereInput | dataWhereInput[]
    OR?: dataWhereInput[]
    NOT?: dataWhereInput | dataWhereInput[]
    rootid?: UuidFilter<"data"> | string
    id?: IntFilter<"data"> | number
    prev_id?: IntNullableFilter<"data"> | number | null
    data_schema_id?: IntFilter<"data"> | number
    data?: JsonFilter<"data">
    flag?: StringNullableFilter<"data"> | string | null
    activate?: BoolFilter<"data"> | boolean
    modify_datetime?: BigIntNullableFilter<"data"> | bigint | number | null
    previous?: XOR<DataNullableScalarRelationFilter, dataWhereInput> | null
    versions?: DataListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }

  export type dataOrderByWithRelationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_schema_id?: SortOrder
    data?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    previous?: dataOrderByWithRelationInput
    versions?: dataOrderByRelationAggregateInput
    schema?: data_schemaOrderByWithRelationInput
  }

  export type dataWhereUniqueInput = Prisma.AtLeast<{
    rootid?: string
    id?: number
    AND?: dataWhereInput | dataWhereInput[]
    OR?: dataWhereInput[]
    NOT?: dataWhereInput | dataWhereInput[]
    prev_id?: IntNullableFilter<"data"> | number | null
    data_schema_id?: IntFilter<"data"> | number
    data?: JsonFilter<"data">
    flag?: StringNullableFilter<"data"> | string | null
    activate?: BoolFilter<"data"> | boolean
    modify_datetime?: BigIntNullableFilter<"data"> | bigint | number | null
    previous?: XOR<DataNullableScalarRelationFilter, dataWhereInput> | null
    versions?: DataListRelationFilter
    schema?: XOR<Data_schemaScalarRelationFilter, data_schemaWhereInput>
  }, "rootid" | "id">

  export type dataOrderByWithAggregationInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrderInput | SortOrder
    data_schema_id?: SortOrder
    data?: SortOrder
    flag?: SortOrderInput | SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrderInput | SortOrder
    _count?: dataCountOrderByAggregateInput
    _avg?: dataAvgOrderByAggregateInput
    _max?: dataMaxOrderByAggregateInput
    _min?: dataMinOrderByAggregateInput
    _sum?: dataSumOrderByAggregateInput
  }

  export type dataScalarWhereWithAggregatesInput = {
    AND?: dataScalarWhereWithAggregatesInput | dataScalarWhereWithAggregatesInput[]
    OR?: dataScalarWhereWithAggregatesInput[]
    NOT?: dataScalarWhereWithAggregatesInput | dataScalarWhereWithAggregatesInput[]
    rootid?: UuidWithAggregatesFilter<"data"> | string
    id?: IntWithAggregatesFilter<"data"> | number
    prev_id?: IntNullableWithAggregatesFilter<"data"> | number | null
    data_schema_id?: IntWithAggregatesFilter<"data"> | number
    data?: JsonWithAggregatesFilter<"data">
    flag?: StringNullableWithAggregatesFilter<"data"> | string | null
    activate?: BoolWithAggregatesFilter<"data"> | boolean
    modify_datetime?: BigIntNullableWithAggregatesFilter<"data"> | bigint | number | null
  }

  export type businessCreateInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: businessCreateNestedOneWithoutVersionsInput
    versions?: businessCreateNestedManyWithoutPreviousInput
    schemas?: data_schemaCreateNestedManyWithoutBusinessInput
  }

  export type businessUncheckedCreateInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: businessUncheckedCreateNestedManyWithoutPreviousInput
    schemas?: data_schemaUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type businessUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: businessUpdateOneWithoutVersionsNestedInput
    versions?: businessUpdateManyWithoutPreviousNestedInput
    schemas?: data_schemaUpdateManyWithoutBusinessNestedInput
  }

  export type businessUncheckedUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: businessUncheckedUpdateManyWithoutPreviousNestedInput
    schemas?: data_schemaUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type businessCreateManyInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type businessUpdateManyMutationInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type businessUncheckedUpdateManyInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type data_schemaCreateInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    business?: businessCreateNestedOneWithoutSchemasInput
    views?: viewCreateNestedManyWithoutSchemaInput
    forms?: formCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaCreateManyInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type data_schemaUpdateManyMutationInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type data_schemaUncheckedUpdateManyInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type viewCreateInput = {
    rootid?: string
    id?: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: viewCreateNestedOneWithoutVersionsInput
    versions?: viewCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutViewsInput
  }

  export type viewUncheckedCreateInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: viewUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type viewUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: viewUpdateOneWithoutVersionsNestedInput
    versions?: viewUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutViewsNestedInput
  }

  export type viewUncheckedUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: viewUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type viewCreateManyInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type viewUpdateManyMutationInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type viewUncheckedUpdateManyInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type formCreateInput = {
    rootid?: string
    id?: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: formCreateNestedOneWithoutVersionsInput
    versions?: formCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutFormsInput
  }

  export type formUncheckedCreateInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_id: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: formUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type formUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: formUpdateOneWithoutVersionsNestedInput
    versions?: formUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutFormsNestedInput
  }

  export type formUncheckedUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: formUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type formCreateManyInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_id: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type formUpdateManyMutationInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type formUncheckedUpdateManyInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dataCreateInput = {
    rootid?: string
    id?: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: dataCreateNestedOneWithoutVersionsInput
    versions?: dataCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutRecordsInput
  }

  export type dataUncheckedCreateInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: dataUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type dataUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: dataUpdateOneWithoutVersionsNestedInput
    versions?: dataUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type dataUncheckedUpdateInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: dataUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type dataCreateManyInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type dataUpdateManyMutationInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dataUncheckedUpdateManyInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type BusinessNullableScalarRelationFilter = {
    is?: businessWhereInput | null
    isNot?: businessWhereInput | null
  }

  export type BusinessListRelationFilter = {
    every?: businessWhereInput
    some?: businessWhereInput
    none?: businessWhereInput
  }

  export type Data_schemaListRelationFilter = {
    every?: data_schemaWhereInput
    some?: data_schemaWhereInput
    none?: data_schemaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type businessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type data_schemaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type businessCountOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type businessAvgOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type businessMaxOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type businessMinOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type businessSumOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type Data_schemaNullableScalarRelationFilter = {
    is?: data_schemaWhereInput | null
    isNot?: data_schemaWhereInput | null
  }

  export type ViewListRelationFilter = {
    every?: viewWhereInput
    some?: viewWhereInput
    none?: viewWhereInput
  }

  export type FormListRelationFilter = {
    every?: formWhereInput
    some?: formWhereInput
    none?: formWhereInput
  }

  export type DataListRelationFilter = {
    every?: dataWhereInput
    some?: dataWhereInput
    none?: dataWhereInput
  }

  export type viewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type formOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type dataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type data_schemaCountOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    business_id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    json?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type data_schemaAvgOrderByAggregateInput = {
    id?: SortOrder
    business_id?: SortOrder
    prev_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type data_schemaMaxOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    business_id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type data_schemaMinOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    business_id?: SortOrder
    prev_id?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type data_schemaSumOrderByAggregateInput = {
    id?: SortOrder
    business_id?: SortOrder
    prev_id?: SortOrder
    modify_datetime?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ViewNullableScalarRelationFilter = {
    is?: viewWhereInput | null
    isNot?: viewWhereInput | null
  }

  export type Data_schemaScalarRelationFilter = {
    is?: data_schemaWhereInput
    isNot?: data_schemaWhereInput
  }

  export type viewCountOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    view_type?: SortOrder
    name?: SortOrder
    json_table_config?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type viewAvgOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type viewMaxOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    view_type?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type viewMinOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    view_type?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type viewSumOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type FormNullableScalarRelationFilter = {
    is?: formWhereInput | null
    isNot?: formWhereInput | null
  }

  export type formCountOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_id?: SortOrder
    name?: SortOrder
    json_form_config?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type formAvgOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type formMaxOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_id?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type formMinOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_id?: SortOrder
    name?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type formSumOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type DataNullableScalarRelationFilter = {
    is?: dataWhereInput | null
    isNot?: dataWhereInput | null
  }

  export type dataCountOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    data?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type dataAvgOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type dataMaxOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type dataMinOrderByAggregateInput = {
    rootid?: SortOrder
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    flag?: SortOrder
    activate?: SortOrder
    modify_datetime?: SortOrder
  }

  export type dataSumOrderByAggregateInput = {
    id?: SortOrder
    prev_id?: SortOrder
    data_schema_id?: SortOrder
    modify_datetime?: SortOrder
  }

  export type businessCreateNestedOneWithoutVersionsInput = {
    create?: XOR<businessCreateWithoutVersionsInput, businessUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: businessCreateOrConnectWithoutVersionsInput
    connect?: businessWhereUniqueInput
  }

  export type businessCreateNestedManyWithoutPreviousInput = {
    create?: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput> | businessCreateWithoutPreviousInput[] | businessUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: businessCreateOrConnectWithoutPreviousInput | businessCreateOrConnectWithoutPreviousInput[]
    createMany?: businessCreateManyPreviousInputEnvelope
    connect?: businessWhereUniqueInput | businessWhereUniqueInput[]
  }

  export type data_schemaCreateNestedManyWithoutBusinessInput = {
    create?: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput> | data_schemaCreateWithoutBusinessInput[] | data_schemaUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutBusinessInput | data_schemaCreateOrConnectWithoutBusinessInput[]
    createMany?: data_schemaCreateManyBusinessInputEnvelope
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
  }

  export type businessUncheckedCreateNestedManyWithoutPreviousInput = {
    create?: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput> | businessCreateWithoutPreviousInput[] | businessUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: businessCreateOrConnectWithoutPreviousInput | businessCreateOrConnectWithoutPreviousInput[]
    createMany?: businessCreateManyPreviousInputEnvelope
    connect?: businessWhereUniqueInput | businessWhereUniqueInput[]
  }

  export type data_schemaUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput> | data_schemaCreateWithoutBusinessInput[] | data_schemaUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutBusinessInput | data_schemaCreateOrConnectWithoutBusinessInput[]
    createMany?: data_schemaCreateManyBusinessInputEnvelope
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type businessUpdateOneWithoutVersionsNestedInput = {
    create?: XOR<businessCreateWithoutVersionsInput, businessUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: businessCreateOrConnectWithoutVersionsInput
    upsert?: businessUpsertWithoutVersionsInput
    disconnect?: businessWhereInput | boolean
    delete?: businessWhereInput | boolean
    connect?: businessWhereUniqueInput
    update?: XOR<XOR<businessUpdateToOneWithWhereWithoutVersionsInput, businessUpdateWithoutVersionsInput>, businessUncheckedUpdateWithoutVersionsInput>
  }

  export type businessUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput> | businessCreateWithoutPreviousInput[] | businessUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: businessCreateOrConnectWithoutPreviousInput | businessCreateOrConnectWithoutPreviousInput[]
    upsert?: businessUpsertWithWhereUniqueWithoutPreviousInput | businessUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: businessCreateManyPreviousInputEnvelope
    set?: businessWhereUniqueInput | businessWhereUniqueInput[]
    disconnect?: businessWhereUniqueInput | businessWhereUniqueInput[]
    delete?: businessWhereUniqueInput | businessWhereUniqueInput[]
    connect?: businessWhereUniqueInput | businessWhereUniqueInput[]
    update?: businessUpdateWithWhereUniqueWithoutPreviousInput | businessUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: businessUpdateManyWithWhereWithoutPreviousInput | businessUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: businessScalarWhereInput | businessScalarWhereInput[]
  }

  export type data_schemaUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput> | data_schemaCreateWithoutBusinessInput[] | data_schemaUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutBusinessInput | data_schemaCreateOrConnectWithoutBusinessInput[]
    upsert?: data_schemaUpsertWithWhereUniqueWithoutBusinessInput | data_schemaUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: data_schemaCreateManyBusinessInputEnvelope
    set?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    disconnect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    delete?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    update?: data_schemaUpdateWithWhereUniqueWithoutBusinessInput | data_schemaUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: data_schemaUpdateManyWithWhereWithoutBusinessInput | data_schemaUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type businessUncheckedUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput> | businessCreateWithoutPreviousInput[] | businessUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: businessCreateOrConnectWithoutPreviousInput | businessCreateOrConnectWithoutPreviousInput[]
    upsert?: businessUpsertWithWhereUniqueWithoutPreviousInput | businessUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: businessCreateManyPreviousInputEnvelope
    set?: businessWhereUniqueInput | businessWhereUniqueInput[]
    disconnect?: businessWhereUniqueInput | businessWhereUniqueInput[]
    delete?: businessWhereUniqueInput | businessWhereUniqueInput[]
    connect?: businessWhereUniqueInput | businessWhereUniqueInput[]
    update?: businessUpdateWithWhereUniqueWithoutPreviousInput | businessUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: businessUpdateManyWithWhereWithoutPreviousInput | businessUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: businessScalarWhereInput | businessScalarWhereInput[]
  }

  export type data_schemaUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput> | data_schemaCreateWithoutBusinessInput[] | data_schemaUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutBusinessInput | data_schemaCreateOrConnectWithoutBusinessInput[]
    upsert?: data_schemaUpsertWithWhereUniqueWithoutBusinessInput | data_schemaUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: data_schemaCreateManyBusinessInputEnvelope
    set?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    disconnect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    delete?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    update?: data_schemaUpdateWithWhereUniqueWithoutBusinessInput | data_schemaUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: data_schemaUpdateManyWithWhereWithoutBusinessInput | data_schemaUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
  }

  export type data_schemaCreateNestedOneWithoutVersionsInput = {
    create?: XOR<data_schemaCreateWithoutVersionsInput, data_schemaUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutVersionsInput
    connect?: data_schemaWhereUniqueInput
  }

  export type data_schemaCreateNestedManyWithoutPreviousInput = {
    create?: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput> | data_schemaCreateWithoutPreviousInput[] | data_schemaUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutPreviousInput | data_schemaCreateOrConnectWithoutPreviousInput[]
    createMany?: data_schemaCreateManyPreviousInputEnvelope
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
  }

  export type businessCreateNestedOneWithoutSchemasInput = {
    create?: XOR<businessCreateWithoutSchemasInput, businessUncheckedCreateWithoutSchemasInput>
    connectOrCreate?: businessCreateOrConnectWithoutSchemasInput
    connect?: businessWhereUniqueInput
  }

  export type viewCreateNestedManyWithoutSchemaInput = {
    create?: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput> | viewCreateWithoutSchemaInput[] | viewUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: viewCreateOrConnectWithoutSchemaInput | viewCreateOrConnectWithoutSchemaInput[]
    createMany?: viewCreateManySchemaInputEnvelope
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
  }

  export type formCreateNestedManyWithoutSchemaInput = {
    create?: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput> | formCreateWithoutSchemaInput[] | formUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: formCreateOrConnectWithoutSchemaInput | formCreateOrConnectWithoutSchemaInput[]
    createMany?: formCreateManySchemaInputEnvelope
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
  }

  export type dataCreateNestedManyWithoutSchemaInput = {
    create?: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput> | dataCreateWithoutSchemaInput[] | dataUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: dataCreateOrConnectWithoutSchemaInput | dataCreateOrConnectWithoutSchemaInput[]
    createMany?: dataCreateManySchemaInputEnvelope
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
  }

  export type data_schemaUncheckedCreateNestedManyWithoutPreviousInput = {
    create?: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput> | data_schemaCreateWithoutPreviousInput[] | data_schemaUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutPreviousInput | data_schemaCreateOrConnectWithoutPreviousInput[]
    createMany?: data_schemaCreateManyPreviousInputEnvelope
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
  }

  export type viewUncheckedCreateNestedManyWithoutSchemaInput = {
    create?: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput> | viewCreateWithoutSchemaInput[] | viewUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: viewCreateOrConnectWithoutSchemaInput | viewCreateOrConnectWithoutSchemaInput[]
    createMany?: viewCreateManySchemaInputEnvelope
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
  }

  export type formUncheckedCreateNestedManyWithoutSchemaInput = {
    create?: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput> | formCreateWithoutSchemaInput[] | formUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: formCreateOrConnectWithoutSchemaInput | formCreateOrConnectWithoutSchemaInput[]
    createMany?: formCreateManySchemaInputEnvelope
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
  }

  export type dataUncheckedCreateNestedManyWithoutSchemaInput = {
    create?: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput> | dataCreateWithoutSchemaInput[] | dataUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: dataCreateOrConnectWithoutSchemaInput | dataCreateOrConnectWithoutSchemaInput[]
    createMany?: dataCreateManySchemaInputEnvelope
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
  }

  export type data_schemaUpdateOneWithoutVersionsNestedInput = {
    create?: XOR<data_schemaCreateWithoutVersionsInput, data_schemaUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutVersionsInput
    upsert?: data_schemaUpsertWithoutVersionsInput
    disconnect?: data_schemaWhereInput | boolean
    delete?: data_schemaWhereInput | boolean
    connect?: data_schemaWhereUniqueInput
    update?: XOR<XOR<data_schemaUpdateToOneWithWhereWithoutVersionsInput, data_schemaUpdateWithoutVersionsInput>, data_schemaUncheckedUpdateWithoutVersionsInput>
  }

  export type data_schemaUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput> | data_schemaCreateWithoutPreviousInput[] | data_schemaUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutPreviousInput | data_schemaCreateOrConnectWithoutPreviousInput[]
    upsert?: data_schemaUpsertWithWhereUniqueWithoutPreviousInput | data_schemaUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: data_schemaCreateManyPreviousInputEnvelope
    set?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    disconnect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    delete?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    update?: data_schemaUpdateWithWhereUniqueWithoutPreviousInput | data_schemaUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: data_schemaUpdateManyWithWhereWithoutPreviousInput | data_schemaUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
  }

  export type businessUpdateOneWithoutSchemasNestedInput = {
    create?: XOR<businessCreateWithoutSchemasInput, businessUncheckedCreateWithoutSchemasInput>
    connectOrCreate?: businessCreateOrConnectWithoutSchemasInput
    upsert?: businessUpsertWithoutSchemasInput
    disconnect?: businessWhereInput | boolean
    delete?: businessWhereInput | boolean
    connect?: businessWhereUniqueInput
    update?: XOR<XOR<businessUpdateToOneWithWhereWithoutSchemasInput, businessUpdateWithoutSchemasInput>, businessUncheckedUpdateWithoutSchemasInput>
  }

  export type viewUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput> | viewCreateWithoutSchemaInput[] | viewUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: viewCreateOrConnectWithoutSchemaInput | viewCreateOrConnectWithoutSchemaInput[]
    upsert?: viewUpsertWithWhereUniqueWithoutSchemaInput | viewUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: viewCreateManySchemaInputEnvelope
    set?: viewWhereUniqueInput | viewWhereUniqueInput[]
    disconnect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    delete?: viewWhereUniqueInput | viewWhereUniqueInput[]
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    update?: viewUpdateWithWhereUniqueWithoutSchemaInput | viewUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: viewUpdateManyWithWhereWithoutSchemaInput | viewUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: viewScalarWhereInput | viewScalarWhereInput[]
  }

  export type formUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput> | formCreateWithoutSchemaInput[] | formUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: formCreateOrConnectWithoutSchemaInput | formCreateOrConnectWithoutSchemaInput[]
    upsert?: formUpsertWithWhereUniqueWithoutSchemaInput | formUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: formCreateManySchemaInputEnvelope
    set?: formWhereUniqueInput | formWhereUniqueInput[]
    disconnect?: formWhereUniqueInput | formWhereUniqueInput[]
    delete?: formWhereUniqueInput | formWhereUniqueInput[]
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
    update?: formUpdateWithWhereUniqueWithoutSchemaInput | formUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: formUpdateManyWithWhereWithoutSchemaInput | formUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: formScalarWhereInput | formScalarWhereInput[]
  }

  export type dataUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput> | dataCreateWithoutSchemaInput[] | dataUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: dataCreateOrConnectWithoutSchemaInput | dataCreateOrConnectWithoutSchemaInput[]
    upsert?: dataUpsertWithWhereUniqueWithoutSchemaInput | dataUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: dataCreateManySchemaInputEnvelope
    set?: dataWhereUniqueInput | dataWhereUniqueInput[]
    disconnect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    delete?: dataWhereUniqueInput | dataWhereUniqueInput[]
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    update?: dataUpdateWithWhereUniqueWithoutSchemaInput | dataUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: dataUpdateManyWithWhereWithoutSchemaInput | dataUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: dataScalarWhereInput | dataScalarWhereInput[]
  }

  export type data_schemaUncheckedUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput> | data_schemaCreateWithoutPreviousInput[] | data_schemaUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: data_schemaCreateOrConnectWithoutPreviousInput | data_schemaCreateOrConnectWithoutPreviousInput[]
    upsert?: data_schemaUpsertWithWhereUniqueWithoutPreviousInput | data_schemaUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: data_schemaCreateManyPreviousInputEnvelope
    set?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    disconnect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    delete?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    connect?: data_schemaWhereUniqueInput | data_schemaWhereUniqueInput[]
    update?: data_schemaUpdateWithWhereUniqueWithoutPreviousInput | data_schemaUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: data_schemaUpdateManyWithWhereWithoutPreviousInput | data_schemaUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
  }

  export type viewUncheckedUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput> | viewCreateWithoutSchemaInput[] | viewUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: viewCreateOrConnectWithoutSchemaInput | viewCreateOrConnectWithoutSchemaInput[]
    upsert?: viewUpsertWithWhereUniqueWithoutSchemaInput | viewUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: viewCreateManySchemaInputEnvelope
    set?: viewWhereUniqueInput | viewWhereUniqueInput[]
    disconnect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    delete?: viewWhereUniqueInput | viewWhereUniqueInput[]
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    update?: viewUpdateWithWhereUniqueWithoutSchemaInput | viewUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: viewUpdateManyWithWhereWithoutSchemaInput | viewUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: viewScalarWhereInput | viewScalarWhereInput[]
  }

  export type formUncheckedUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput> | formCreateWithoutSchemaInput[] | formUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: formCreateOrConnectWithoutSchemaInput | formCreateOrConnectWithoutSchemaInput[]
    upsert?: formUpsertWithWhereUniqueWithoutSchemaInput | formUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: formCreateManySchemaInputEnvelope
    set?: formWhereUniqueInput | formWhereUniqueInput[]
    disconnect?: formWhereUniqueInput | formWhereUniqueInput[]
    delete?: formWhereUniqueInput | formWhereUniqueInput[]
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
    update?: formUpdateWithWhereUniqueWithoutSchemaInput | formUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: formUpdateManyWithWhereWithoutSchemaInput | formUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: formScalarWhereInput | formScalarWhereInput[]
  }

  export type dataUncheckedUpdateManyWithoutSchemaNestedInput = {
    create?: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput> | dataCreateWithoutSchemaInput[] | dataUncheckedCreateWithoutSchemaInput[]
    connectOrCreate?: dataCreateOrConnectWithoutSchemaInput | dataCreateOrConnectWithoutSchemaInput[]
    upsert?: dataUpsertWithWhereUniqueWithoutSchemaInput | dataUpsertWithWhereUniqueWithoutSchemaInput[]
    createMany?: dataCreateManySchemaInputEnvelope
    set?: dataWhereUniqueInput | dataWhereUniqueInput[]
    disconnect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    delete?: dataWhereUniqueInput | dataWhereUniqueInput[]
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    update?: dataUpdateWithWhereUniqueWithoutSchemaInput | dataUpdateWithWhereUniqueWithoutSchemaInput[]
    updateMany?: dataUpdateManyWithWhereWithoutSchemaInput | dataUpdateManyWithWhereWithoutSchemaInput[]
    deleteMany?: dataScalarWhereInput | dataScalarWhereInput[]
  }

  export type viewCreateNestedOneWithoutVersionsInput = {
    create?: XOR<viewCreateWithoutVersionsInput, viewUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: viewCreateOrConnectWithoutVersionsInput
    connect?: viewWhereUniqueInput
  }

  export type viewCreateNestedManyWithoutPreviousInput = {
    create?: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput> | viewCreateWithoutPreviousInput[] | viewUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: viewCreateOrConnectWithoutPreviousInput | viewCreateOrConnectWithoutPreviousInput[]
    createMany?: viewCreateManyPreviousInputEnvelope
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
  }

  export type data_schemaCreateNestedOneWithoutViewsInput = {
    create?: XOR<data_schemaCreateWithoutViewsInput, data_schemaUncheckedCreateWithoutViewsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutViewsInput
    connect?: data_schemaWhereUniqueInput
  }

  export type viewUncheckedCreateNestedManyWithoutPreviousInput = {
    create?: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput> | viewCreateWithoutPreviousInput[] | viewUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: viewCreateOrConnectWithoutPreviousInput | viewCreateOrConnectWithoutPreviousInput[]
    createMany?: viewCreateManyPreviousInputEnvelope
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
  }

  export type viewUpdateOneWithoutVersionsNestedInput = {
    create?: XOR<viewCreateWithoutVersionsInput, viewUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: viewCreateOrConnectWithoutVersionsInput
    upsert?: viewUpsertWithoutVersionsInput
    disconnect?: viewWhereInput | boolean
    delete?: viewWhereInput | boolean
    connect?: viewWhereUniqueInput
    update?: XOR<XOR<viewUpdateToOneWithWhereWithoutVersionsInput, viewUpdateWithoutVersionsInput>, viewUncheckedUpdateWithoutVersionsInput>
  }

  export type viewUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput> | viewCreateWithoutPreviousInput[] | viewUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: viewCreateOrConnectWithoutPreviousInput | viewCreateOrConnectWithoutPreviousInput[]
    upsert?: viewUpsertWithWhereUniqueWithoutPreviousInput | viewUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: viewCreateManyPreviousInputEnvelope
    set?: viewWhereUniqueInput | viewWhereUniqueInput[]
    disconnect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    delete?: viewWhereUniqueInput | viewWhereUniqueInput[]
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    update?: viewUpdateWithWhereUniqueWithoutPreviousInput | viewUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: viewUpdateManyWithWhereWithoutPreviousInput | viewUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: viewScalarWhereInput | viewScalarWhereInput[]
  }

  export type data_schemaUpdateOneRequiredWithoutViewsNestedInput = {
    create?: XOR<data_schemaCreateWithoutViewsInput, data_schemaUncheckedCreateWithoutViewsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutViewsInput
    upsert?: data_schemaUpsertWithoutViewsInput
    connect?: data_schemaWhereUniqueInput
    update?: XOR<XOR<data_schemaUpdateToOneWithWhereWithoutViewsInput, data_schemaUpdateWithoutViewsInput>, data_schemaUncheckedUpdateWithoutViewsInput>
  }

  export type viewUncheckedUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput> | viewCreateWithoutPreviousInput[] | viewUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: viewCreateOrConnectWithoutPreviousInput | viewCreateOrConnectWithoutPreviousInput[]
    upsert?: viewUpsertWithWhereUniqueWithoutPreviousInput | viewUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: viewCreateManyPreviousInputEnvelope
    set?: viewWhereUniqueInput | viewWhereUniqueInput[]
    disconnect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    delete?: viewWhereUniqueInput | viewWhereUniqueInput[]
    connect?: viewWhereUniqueInput | viewWhereUniqueInput[]
    update?: viewUpdateWithWhereUniqueWithoutPreviousInput | viewUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: viewUpdateManyWithWhereWithoutPreviousInput | viewUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: viewScalarWhereInput | viewScalarWhereInput[]
  }

  export type formCreateNestedOneWithoutVersionsInput = {
    create?: XOR<formCreateWithoutVersionsInput, formUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: formCreateOrConnectWithoutVersionsInput
    connect?: formWhereUniqueInput
  }

  export type formCreateNestedManyWithoutPreviousInput = {
    create?: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput> | formCreateWithoutPreviousInput[] | formUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: formCreateOrConnectWithoutPreviousInput | formCreateOrConnectWithoutPreviousInput[]
    createMany?: formCreateManyPreviousInputEnvelope
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
  }

  export type data_schemaCreateNestedOneWithoutFormsInput = {
    create?: XOR<data_schemaCreateWithoutFormsInput, data_schemaUncheckedCreateWithoutFormsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutFormsInput
    connect?: data_schemaWhereUniqueInput
  }

  export type formUncheckedCreateNestedManyWithoutPreviousInput = {
    create?: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput> | formCreateWithoutPreviousInput[] | formUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: formCreateOrConnectWithoutPreviousInput | formCreateOrConnectWithoutPreviousInput[]
    createMany?: formCreateManyPreviousInputEnvelope
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
  }

  export type formUpdateOneWithoutVersionsNestedInput = {
    create?: XOR<formCreateWithoutVersionsInput, formUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: formCreateOrConnectWithoutVersionsInput
    upsert?: formUpsertWithoutVersionsInput
    disconnect?: formWhereInput | boolean
    delete?: formWhereInput | boolean
    connect?: formWhereUniqueInput
    update?: XOR<XOR<formUpdateToOneWithWhereWithoutVersionsInput, formUpdateWithoutVersionsInput>, formUncheckedUpdateWithoutVersionsInput>
  }

  export type formUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput> | formCreateWithoutPreviousInput[] | formUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: formCreateOrConnectWithoutPreviousInput | formCreateOrConnectWithoutPreviousInput[]
    upsert?: formUpsertWithWhereUniqueWithoutPreviousInput | formUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: formCreateManyPreviousInputEnvelope
    set?: formWhereUniqueInput | formWhereUniqueInput[]
    disconnect?: formWhereUniqueInput | formWhereUniqueInput[]
    delete?: formWhereUniqueInput | formWhereUniqueInput[]
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
    update?: formUpdateWithWhereUniqueWithoutPreviousInput | formUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: formUpdateManyWithWhereWithoutPreviousInput | formUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: formScalarWhereInput | formScalarWhereInput[]
  }

  export type data_schemaUpdateOneRequiredWithoutFormsNestedInput = {
    create?: XOR<data_schemaCreateWithoutFormsInput, data_schemaUncheckedCreateWithoutFormsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutFormsInput
    upsert?: data_schemaUpsertWithoutFormsInput
    connect?: data_schemaWhereUniqueInput
    update?: XOR<XOR<data_schemaUpdateToOneWithWhereWithoutFormsInput, data_schemaUpdateWithoutFormsInput>, data_schemaUncheckedUpdateWithoutFormsInput>
  }

  export type formUncheckedUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput> | formCreateWithoutPreviousInput[] | formUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: formCreateOrConnectWithoutPreviousInput | formCreateOrConnectWithoutPreviousInput[]
    upsert?: formUpsertWithWhereUniqueWithoutPreviousInput | formUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: formCreateManyPreviousInputEnvelope
    set?: formWhereUniqueInput | formWhereUniqueInput[]
    disconnect?: formWhereUniqueInput | formWhereUniqueInput[]
    delete?: formWhereUniqueInput | formWhereUniqueInput[]
    connect?: formWhereUniqueInput | formWhereUniqueInput[]
    update?: formUpdateWithWhereUniqueWithoutPreviousInput | formUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: formUpdateManyWithWhereWithoutPreviousInput | formUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: formScalarWhereInput | formScalarWhereInput[]
  }

  export type dataCreateNestedOneWithoutVersionsInput = {
    create?: XOR<dataCreateWithoutVersionsInput, dataUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: dataCreateOrConnectWithoutVersionsInput
    connect?: dataWhereUniqueInput
  }

  export type dataCreateNestedManyWithoutPreviousInput = {
    create?: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput> | dataCreateWithoutPreviousInput[] | dataUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: dataCreateOrConnectWithoutPreviousInput | dataCreateOrConnectWithoutPreviousInput[]
    createMany?: dataCreateManyPreviousInputEnvelope
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
  }

  export type data_schemaCreateNestedOneWithoutRecordsInput = {
    create?: XOR<data_schemaCreateWithoutRecordsInput, data_schemaUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutRecordsInput
    connect?: data_schemaWhereUniqueInput
  }

  export type dataUncheckedCreateNestedManyWithoutPreviousInput = {
    create?: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput> | dataCreateWithoutPreviousInput[] | dataUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: dataCreateOrConnectWithoutPreviousInput | dataCreateOrConnectWithoutPreviousInput[]
    createMany?: dataCreateManyPreviousInputEnvelope
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
  }

  export type dataUpdateOneWithoutVersionsNestedInput = {
    create?: XOR<dataCreateWithoutVersionsInput, dataUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: dataCreateOrConnectWithoutVersionsInput
    upsert?: dataUpsertWithoutVersionsInput
    disconnect?: dataWhereInput | boolean
    delete?: dataWhereInput | boolean
    connect?: dataWhereUniqueInput
    update?: XOR<XOR<dataUpdateToOneWithWhereWithoutVersionsInput, dataUpdateWithoutVersionsInput>, dataUncheckedUpdateWithoutVersionsInput>
  }

  export type dataUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput> | dataCreateWithoutPreviousInput[] | dataUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: dataCreateOrConnectWithoutPreviousInput | dataCreateOrConnectWithoutPreviousInput[]
    upsert?: dataUpsertWithWhereUniqueWithoutPreviousInput | dataUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: dataCreateManyPreviousInputEnvelope
    set?: dataWhereUniqueInput | dataWhereUniqueInput[]
    disconnect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    delete?: dataWhereUniqueInput | dataWhereUniqueInput[]
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    update?: dataUpdateWithWhereUniqueWithoutPreviousInput | dataUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: dataUpdateManyWithWhereWithoutPreviousInput | dataUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: dataScalarWhereInput | dataScalarWhereInput[]
  }

  export type data_schemaUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<data_schemaCreateWithoutRecordsInput, data_schemaUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: data_schemaCreateOrConnectWithoutRecordsInput
    upsert?: data_schemaUpsertWithoutRecordsInput
    connect?: data_schemaWhereUniqueInput
    update?: XOR<XOR<data_schemaUpdateToOneWithWhereWithoutRecordsInput, data_schemaUpdateWithoutRecordsInput>, data_schemaUncheckedUpdateWithoutRecordsInput>
  }

  export type dataUncheckedUpdateManyWithoutPreviousNestedInput = {
    create?: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput> | dataCreateWithoutPreviousInput[] | dataUncheckedCreateWithoutPreviousInput[]
    connectOrCreate?: dataCreateOrConnectWithoutPreviousInput | dataCreateOrConnectWithoutPreviousInput[]
    upsert?: dataUpsertWithWhereUniqueWithoutPreviousInput | dataUpsertWithWhereUniqueWithoutPreviousInput[]
    createMany?: dataCreateManyPreviousInputEnvelope
    set?: dataWhereUniqueInput | dataWhereUniqueInput[]
    disconnect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    delete?: dataWhereUniqueInput | dataWhereUniqueInput[]
    connect?: dataWhereUniqueInput | dataWhereUniqueInput[]
    update?: dataUpdateWithWhereUniqueWithoutPreviousInput | dataUpdateWithWhereUniqueWithoutPreviousInput[]
    updateMany?: dataUpdateManyWithWhereWithoutPreviousInput | dataUpdateManyWithWhereWithoutPreviousInput[]
    deleteMany?: dataScalarWhereInput | dataScalarWhereInput[]
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type businessCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: businessCreateNestedOneWithoutVersionsInput
    schemas?: data_schemaCreateNestedManyWithoutBusinessInput
  }

  export type businessUncheckedCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    schemas?: data_schemaUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type businessCreateOrConnectWithoutVersionsInput = {
    where: businessWhereUniqueInput
    create: XOR<businessCreateWithoutVersionsInput, businessUncheckedCreateWithoutVersionsInput>
  }

  export type businessCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: businessCreateNestedManyWithoutPreviousInput
    schemas?: data_schemaCreateNestedManyWithoutBusinessInput
  }

  export type businessUncheckedCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: businessUncheckedCreateNestedManyWithoutPreviousInput
    schemas?: data_schemaUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type businessCreateOrConnectWithoutPreviousInput = {
    where: businessWhereUniqueInput
    create: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput>
  }

  export type businessCreateManyPreviousInputEnvelope = {
    data: businessCreateManyPreviousInput | businessCreateManyPreviousInput[]
    skipDuplicates?: boolean
  }

  export type data_schemaCreateWithoutBusinessInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    views?: viewCreateNestedManyWithoutSchemaInput
    forms?: formCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutBusinessInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutBusinessInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput>
  }

  export type data_schemaCreateManyBusinessInputEnvelope = {
    data: data_schemaCreateManyBusinessInput | data_schemaCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type businessUpsertWithoutVersionsInput = {
    update: XOR<businessUpdateWithoutVersionsInput, businessUncheckedUpdateWithoutVersionsInput>
    create: XOR<businessCreateWithoutVersionsInput, businessUncheckedCreateWithoutVersionsInput>
    where?: businessWhereInput
  }

  export type businessUpdateToOneWithWhereWithoutVersionsInput = {
    where?: businessWhereInput
    data: XOR<businessUpdateWithoutVersionsInput, businessUncheckedUpdateWithoutVersionsInput>
  }

  export type businessUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: businessUpdateOneWithoutVersionsNestedInput
    schemas?: data_schemaUpdateManyWithoutBusinessNestedInput
  }

  export type businessUncheckedUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    schemas?: data_schemaUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type businessUpsertWithWhereUniqueWithoutPreviousInput = {
    where: businessWhereUniqueInput
    update: XOR<businessUpdateWithoutPreviousInput, businessUncheckedUpdateWithoutPreviousInput>
    create: XOR<businessCreateWithoutPreviousInput, businessUncheckedCreateWithoutPreviousInput>
  }

  export type businessUpdateWithWhereUniqueWithoutPreviousInput = {
    where: businessWhereUniqueInput
    data: XOR<businessUpdateWithoutPreviousInput, businessUncheckedUpdateWithoutPreviousInput>
  }

  export type businessUpdateManyWithWhereWithoutPreviousInput = {
    where: businessScalarWhereInput
    data: XOR<businessUpdateManyMutationInput, businessUncheckedUpdateManyWithoutPreviousInput>
  }

  export type businessScalarWhereInput = {
    AND?: businessScalarWhereInput | businessScalarWhereInput[]
    OR?: businessScalarWhereInput[]
    NOT?: businessScalarWhereInput | businessScalarWhereInput[]
    rootid?: UuidFilter<"business"> | string
    id?: IntFilter<"business"> | number
    prev_id?: IntNullableFilter<"business"> | number | null
    name?: StringFilter<"business"> | string
    icon?: StringNullableFilter<"business"> | string | null
    flag?: StringNullableFilter<"business"> | string | null
    activate?: BoolFilter<"business"> | boolean
    modify_datetime?: BigIntNullableFilter<"business"> | bigint | number | null
  }

  export type data_schemaUpsertWithWhereUniqueWithoutBusinessInput = {
    where: data_schemaWhereUniqueInput
    update: XOR<data_schemaUpdateWithoutBusinessInput, data_schemaUncheckedUpdateWithoutBusinessInput>
    create: XOR<data_schemaCreateWithoutBusinessInput, data_schemaUncheckedCreateWithoutBusinessInput>
  }

  export type data_schemaUpdateWithWhereUniqueWithoutBusinessInput = {
    where: data_schemaWhereUniqueInput
    data: XOR<data_schemaUpdateWithoutBusinessInput, data_schemaUncheckedUpdateWithoutBusinessInput>
  }

  export type data_schemaUpdateManyWithWhereWithoutBusinessInput = {
    where: data_schemaScalarWhereInput
    data: XOR<data_schemaUpdateManyMutationInput, data_schemaUncheckedUpdateManyWithoutBusinessInput>
  }

  export type data_schemaScalarWhereInput = {
    AND?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
    OR?: data_schemaScalarWhereInput[]
    NOT?: data_schemaScalarWhereInput | data_schemaScalarWhereInput[]
    rootid?: UuidFilter<"data_schema"> | string
    id?: IntFilter<"data_schema"> | number
    business_id?: IntNullableFilter<"data_schema"> | number | null
    prev_id?: IntNullableFilter<"data_schema"> | number | null
    name?: StringFilter<"data_schema"> | string
    json?: JsonFilter<"data_schema">
    flag?: StringNullableFilter<"data_schema"> | string | null
    activate?: BoolFilter<"data_schema"> | boolean
    modify_datetime?: BigIntNullableFilter<"data_schema"> | bigint | number | null
  }

  export type data_schemaCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    business?: businessCreateNestedOneWithoutSchemasInput
    views?: viewCreateNestedManyWithoutSchemaInput
    forms?: formCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutVersionsInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutVersionsInput, data_schemaUncheckedCreateWithoutVersionsInput>
  }

  export type data_schemaCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    business?: businessCreateNestedOneWithoutSchemasInput
    views?: viewCreateNestedManyWithoutSchemaInput
    forms?: formCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutPreviousInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput>
  }

  export type data_schemaCreateManyPreviousInputEnvelope = {
    data: data_schemaCreateManyPreviousInput | data_schemaCreateManyPreviousInput[]
    skipDuplicates?: boolean
  }

  export type businessCreateWithoutSchemasInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: businessCreateNestedOneWithoutVersionsInput
    versions?: businessCreateNestedManyWithoutPreviousInput
  }

  export type businessUncheckedCreateWithoutSchemasInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: businessUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type businessCreateOrConnectWithoutSchemasInput = {
    where: businessWhereUniqueInput
    create: XOR<businessCreateWithoutSchemasInput, businessUncheckedCreateWithoutSchemasInput>
  }

  export type viewCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: viewCreateNestedOneWithoutVersionsInput
    versions?: viewCreateNestedManyWithoutPreviousInput
  }

  export type viewUncheckedCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: viewUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type viewCreateOrConnectWithoutSchemaInput = {
    where: viewWhereUniqueInput
    create: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput>
  }

  export type viewCreateManySchemaInputEnvelope = {
    data: viewCreateManySchemaInput | viewCreateManySchemaInput[]
    skipDuplicates?: boolean
  }

  export type formCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: formCreateNestedOneWithoutVersionsInput
    versions?: formCreateNestedManyWithoutPreviousInput
  }

  export type formUncheckedCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: formUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type formCreateOrConnectWithoutSchemaInput = {
    where: formWhereUniqueInput
    create: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput>
  }

  export type formCreateManySchemaInputEnvelope = {
    data: formCreateManySchemaInput | formCreateManySchemaInput[]
    skipDuplicates?: boolean
  }

  export type dataCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: dataCreateNestedOneWithoutVersionsInput
    versions?: dataCreateNestedManyWithoutPreviousInput
  }

  export type dataUncheckedCreateWithoutSchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: dataUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type dataCreateOrConnectWithoutSchemaInput = {
    where: dataWhereUniqueInput
    create: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput>
  }

  export type dataCreateManySchemaInputEnvelope = {
    data: dataCreateManySchemaInput | dataCreateManySchemaInput[]
    skipDuplicates?: boolean
  }

  export type data_schemaUpsertWithoutVersionsInput = {
    update: XOR<data_schemaUpdateWithoutVersionsInput, data_schemaUncheckedUpdateWithoutVersionsInput>
    create: XOR<data_schemaCreateWithoutVersionsInput, data_schemaUncheckedCreateWithoutVersionsInput>
    where?: data_schemaWhereInput
  }

  export type data_schemaUpdateToOneWithWhereWithoutVersionsInput = {
    where?: data_schemaWhereInput
    data: XOR<data_schemaUpdateWithoutVersionsInput, data_schemaUncheckedUpdateWithoutVersionsInput>
  }

  export type data_schemaUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUpsertWithWhereUniqueWithoutPreviousInput = {
    where: data_schemaWhereUniqueInput
    update: XOR<data_schemaUpdateWithoutPreviousInput, data_schemaUncheckedUpdateWithoutPreviousInput>
    create: XOR<data_schemaCreateWithoutPreviousInput, data_schemaUncheckedCreateWithoutPreviousInput>
  }

  export type data_schemaUpdateWithWhereUniqueWithoutPreviousInput = {
    where: data_schemaWhereUniqueInput
    data: XOR<data_schemaUpdateWithoutPreviousInput, data_schemaUncheckedUpdateWithoutPreviousInput>
  }

  export type data_schemaUpdateManyWithWhereWithoutPreviousInput = {
    where: data_schemaScalarWhereInput
    data: XOR<data_schemaUpdateManyMutationInput, data_schemaUncheckedUpdateManyWithoutPreviousInput>
  }

  export type businessUpsertWithoutSchemasInput = {
    update: XOR<businessUpdateWithoutSchemasInput, businessUncheckedUpdateWithoutSchemasInput>
    create: XOR<businessCreateWithoutSchemasInput, businessUncheckedCreateWithoutSchemasInput>
    where?: businessWhereInput
  }

  export type businessUpdateToOneWithWhereWithoutSchemasInput = {
    where?: businessWhereInput
    data: XOR<businessUpdateWithoutSchemasInput, businessUncheckedUpdateWithoutSchemasInput>
  }

  export type businessUpdateWithoutSchemasInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: businessUpdateOneWithoutVersionsNestedInput
    versions?: businessUpdateManyWithoutPreviousNestedInput
  }

  export type businessUncheckedUpdateWithoutSchemasInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: businessUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type viewUpsertWithWhereUniqueWithoutSchemaInput = {
    where: viewWhereUniqueInput
    update: XOR<viewUpdateWithoutSchemaInput, viewUncheckedUpdateWithoutSchemaInput>
    create: XOR<viewCreateWithoutSchemaInput, viewUncheckedCreateWithoutSchemaInput>
  }

  export type viewUpdateWithWhereUniqueWithoutSchemaInput = {
    where: viewWhereUniqueInput
    data: XOR<viewUpdateWithoutSchemaInput, viewUncheckedUpdateWithoutSchemaInput>
  }

  export type viewUpdateManyWithWhereWithoutSchemaInput = {
    where: viewScalarWhereInput
    data: XOR<viewUpdateManyMutationInput, viewUncheckedUpdateManyWithoutSchemaInput>
  }

  export type viewScalarWhereInput = {
    AND?: viewScalarWhereInput | viewScalarWhereInput[]
    OR?: viewScalarWhereInput[]
    NOT?: viewScalarWhereInput | viewScalarWhereInput[]
    rootid?: UuidFilter<"view"> | string
    id?: IntFilter<"view"> | number
    prev_id?: IntNullableFilter<"view"> | number | null
    data_schema_id?: IntFilter<"view"> | number
    view_type?: StringFilter<"view"> | string
    name?: StringNullableFilter<"view"> | string | null
    json_table_config?: JsonFilter<"view">
    flag?: StringNullableFilter<"view"> | string | null
    activate?: BoolFilter<"view"> | boolean
    modify_datetime?: BigIntNullableFilter<"view"> | bigint | number | null
  }

  export type formUpsertWithWhereUniqueWithoutSchemaInput = {
    where: formWhereUniqueInput
    update: XOR<formUpdateWithoutSchemaInput, formUncheckedUpdateWithoutSchemaInput>
    create: XOR<formCreateWithoutSchemaInput, formUncheckedCreateWithoutSchemaInput>
  }

  export type formUpdateWithWhereUniqueWithoutSchemaInput = {
    where: formWhereUniqueInput
    data: XOR<formUpdateWithoutSchemaInput, formUncheckedUpdateWithoutSchemaInput>
  }

  export type formUpdateManyWithWhereWithoutSchemaInput = {
    where: formScalarWhereInput
    data: XOR<formUpdateManyMutationInput, formUncheckedUpdateManyWithoutSchemaInput>
  }

  export type formScalarWhereInput = {
    AND?: formScalarWhereInput | formScalarWhereInput[]
    OR?: formScalarWhereInput[]
    NOT?: formScalarWhereInput | formScalarWhereInput[]
    rootid?: UuidFilter<"form"> | string
    id?: IntFilter<"form"> | number
    prev_id?: IntNullableFilter<"form"> | number | null
    data_id?: IntFilter<"form"> | number
    name?: StringNullableFilter<"form"> | string | null
    json_form_config?: JsonFilter<"form">
    flag?: StringNullableFilter<"form"> | string | null
    activate?: BoolFilter<"form"> | boolean
    modify_datetime?: BigIntNullableFilter<"form"> | bigint | number | null
  }

  export type dataUpsertWithWhereUniqueWithoutSchemaInput = {
    where: dataWhereUniqueInput
    update: XOR<dataUpdateWithoutSchemaInput, dataUncheckedUpdateWithoutSchemaInput>
    create: XOR<dataCreateWithoutSchemaInput, dataUncheckedCreateWithoutSchemaInput>
  }

  export type dataUpdateWithWhereUniqueWithoutSchemaInput = {
    where: dataWhereUniqueInput
    data: XOR<dataUpdateWithoutSchemaInput, dataUncheckedUpdateWithoutSchemaInput>
  }

  export type dataUpdateManyWithWhereWithoutSchemaInput = {
    where: dataScalarWhereInput
    data: XOR<dataUpdateManyMutationInput, dataUncheckedUpdateManyWithoutSchemaInput>
  }

  export type dataScalarWhereInput = {
    AND?: dataScalarWhereInput | dataScalarWhereInput[]
    OR?: dataScalarWhereInput[]
    NOT?: dataScalarWhereInput | dataScalarWhereInput[]
    rootid?: UuidFilter<"data"> | string
    id?: IntFilter<"data"> | number
    prev_id?: IntNullableFilter<"data"> | number | null
    data_schema_id?: IntFilter<"data"> | number
    data?: JsonFilter<"data">
    flag?: StringNullableFilter<"data"> | string | null
    activate?: BoolFilter<"data"> | boolean
    modify_datetime?: BigIntNullableFilter<"data"> | bigint | number | null
  }

  export type viewCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: viewCreateNestedOneWithoutVersionsInput
    schema: data_schemaCreateNestedOneWithoutViewsInput
  }

  export type viewUncheckedCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type viewCreateOrConnectWithoutVersionsInput = {
    where: viewWhereUniqueInput
    create: XOR<viewCreateWithoutVersionsInput, viewUncheckedCreateWithoutVersionsInput>
  }

  export type viewCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: viewCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutViewsInput
  }

  export type viewUncheckedCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    data_schema_id: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: viewUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type viewCreateOrConnectWithoutPreviousInput = {
    where: viewWhereUniqueInput
    create: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput>
  }

  export type viewCreateManyPreviousInputEnvelope = {
    data: viewCreateManyPreviousInput | viewCreateManyPreviousInput[]
    skipDuplicates?: boolean
  }

  export type data_schemaCreateWithoutViewsInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    business?: businessCreateNestedOneWithoutSchemasInput
    forms?: formCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutViewsInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutViewsInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutViewsInput, data_schemaUncheckedCreateWithoutViewsInput>
  }

  export type viewUpsertWithoutVersionsInput = {
    update: XOR<viewUpdateWithoutVersionsInput, viewUncheckedUpdateWithoutVersionsInput>
    create: XOR<viewCreateWithoutVersionsInput, viewUncheckedCreateWithoutVersionsInput>
    where?: viewWhereInput
  }

  export type viewUpdateToOneWithWhereWithoutVersionsInput = {
    where?: viewWhereInput
    data: XOR<viewUpdateWithoutVersionsInput, viewUncheckedUpdateWithoutVersionsInput>
  }

  export type viewUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: viewUpdateOneWithoutVersionsNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutViewsNestedInput
  }

  export type viewUncheckedUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type viewUpsertWithWhereUniqueWithoutPreviousInput = {
    where: viewWhereUniqueInput
    update: XOR<viewUpdateWithoutPreviousInput, viewUncheckedUpdateWithoutPreviousInput>
    create: XOR<viewCreateWithoutPreviousInput, viewUncheckedCreateWithoutPreviousInput>
  }

  export type viewUpdateWithWhereUniqueWithoutPreviousInput = {
    where: viewWhereUniqueInput
    data: XOR<viewUpdateWithoutPreviousInput, viewUncheckedUpdateWithoutPreviousInput>
  }

  export type viewUpdateManyWithWhereWithoutPreviousInput = {
    where: viewScalarWhereInput
    data: XOR<viewUpdateManyMutationInput, viewUncheckedUpdateManyWithoutPreviousInput>
  }

  export type data_schemaUpsertWithoutViewsInput = {
    update: XOR<data_schemaUpdateWithoutViewsInput, data_schemaUncheckedUpdateWithoutViewsInput>
    create: XOR<data_schemaCreateWithoutViewsInput, data_schemaUncheckedCreateWithoutViewsInput>
    where?: data_schemaWhereInput
  }

  export type data_schemaUpdateToOneWithWhereWithoutViewsInput = {
    where?: data_schemaWhereInput
    data: XOR<data_schemaUpdateWithoutViewsInput, data_schemaUncheckedUpdateWithoutViewsInput>
  }

  export type data_schemaUpdateWithoutViewsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutViewsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type formCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: formCreateNestedOneWithoutVersionsInput
    schema: data_schemaCreateNestedOneWithoutFormsInput
  }

  export type formUncheckedCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_id: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type formCreateOrConnectWithoutVersionsInput = {
    where: formWhereUniqueInput
    create: XOR<formCreateWithoutVersionsInput, formUncheckedCreateWithoutVersionsInput>
  }

  export type formCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: formCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutFormsInput
  }

  export type formUncheckedCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    data_id: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: formUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type formCreateOrConnectWithoutPreviousInput = {
    where: formWhereUniqueInput
    create: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput>
  }

  export type formCreateManyPreviousInputEnvelope = {
    data: formCreateManyPreviousInput | formCreateManyPreviousInput[]
    skipDuplicates?: boolean
  }

  export type data_schemaCreateWithoutFormsInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    business?: businessCreateNestedOneWithoutSchemasInput
    views?: viewCreateNestedManyWithoutSchemaInput
    records?: dataCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutFormsInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    records?: dataUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutFormsInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutFormsInput, data_schemaUncheckedCreateWithoutFormsInput>
  }

  export type formUpsertWithoutVersionsInput = {
    update: XOR<formUpdateWithoutVersionsInput, formUncheckedUpdateWithoutVersionsInput>
    create: XOR<formCreateWithoutVersionsInput, formUncheckedCreateWithoutVersionsInput>
    where?: formWhereInput
  }

  export type formUpdateToOneWithWhereWithoutVersionsInput = {
    where?: formWhereInput
    data: XOR<formUpdateWithoutVersionsInput, formUncheckedUpdateWithoutVersionsInput>
  }

  export type formUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: formUpdateOneWithoutVersionsNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutFormsNestedInput
  }

  export type formUncheckedUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type formUpsertWithWhereUniqueWithoutPreviousInput = {
    where: formWhereUniqueInput
    update: XOR<formUpdateWithoutPreviousInput, formUncheckedUpdateWithoutPreviousInput>
    create: XOR<formCreateWithoutPreviousInput, formUncheckedCreateWithoutPreviousInput>
  }

  export type formUpdateWithWhereUniqueWithoutPreviousInput = {
    where: formWhereUniqueInput
    data: XOR<formUpdateWithoutPreviousInput, formUncheckedUpdateWithoutPreviousInput>
  }

  export type formUpdateManyWithWhereWithoutPreviousInput = {
    where: formScalarWhereInput
    data: XOR<formUpdateManyMutationInput, formUncheckedUpdateManyWithoutPreviousInput>
  }

  export type data_schemaUpsertWithoutFormsInput = {
    update: XOR<data_schemaUpdateWithoutFormsInput, data_schemaUncheckedUpdateWithoutFormsInput>
    create: XOR<data_schemaCreateWithoutFormsInput, data_schemaUncheckedCreateWithoutFormsInput>
    where?: data_schemaWhereInput
  }

  export type data_schemaUpdateToOneWithWhereWithoutFormsInput = {
    where?: data_schemaWhereInput
    data: XOR<data_schemaUpdateWithoutFormsInput, data_schemaUncheckedUpdateWithoutFormsInput>
  }

  export type data_schemaUpdateWithoutFormsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutFormsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type dataCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: dataCreateNestedOneWithoutVersionsInput
    schema: data_schemaCreateNestedOneWithoutRecordsInput
  }

  export type dataUncheckedCreateWithoutVersionsInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data_schema_id: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type dataCreateOrConnectWithoutVersionsInput = {
    where: dataWhereUniqueInput
    create: XOR<dataCreateWithoutVersionsInput, dataUncheckedCreateWithoutVersionsInput>
  }

  export type dataCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: dataCreateNestedManyWithoutPreviousInput
    schema: data_schemaCreateNestedOneWithoutRecordsInput
  }

  export type dataUncheckedCreateWithoutPreviousInput = {
    rootid?: string
    id?: number
    data_schema_id: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: dataUncheckedCreateNestedManyWithoutPreviousInput
  }

  export type dataCreateOrConnectWithoutPreviousInput = {
    where: dataWhereUniqueInput
    create: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput>
  }

  export type dataCreateManyPreviousInputEnvelope = {
    data: dataCreateManyPreviousInput | dataCreateManyPreviousInput[]
    skipDuplicates?: boolean
  }

  export type data_schemaCreateWithoutRecordsInput = {
    rootid?: string
    id?: number
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    previous?: data_schemaCreateNestedOneWithoutVersionsInput
    versions?: data_schemaCreateNestedManyWithoutPreviousInput
    business?: businessCreateNestedOneWithoutSchemasInput
    views?: viewCreateNestedManyWithoutSchemaInput
    forms?: formCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaUncheckedCreateWithoutRecordsInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
    versions?: data_schemaUncheckedCreateNestedManyWithoutPreviousInput
    views?: viewUncheckedCreateNestedManyWithoutSchemaInput
    forms?: formUncheckedCreateNestedManyWithoutSchemaInput
  }

  export type data_schemaCreateOrConnectWithoutRecordsInput = {
    where: data_schemaWhereUniqueInput
    create: XOR<data_schemaCreateWithoutRecordsInput, data_schemaUncheckedCreateWithoutRecordsInput>
  }

  export type dataUpsertWithoutVersionsInput = {
    update: XOR<dataUpdateWithoutVersionsInput, dataUncheckedUpdateWithoutVersionsInput>
    create: XOR<dataCreateWithoutVersionsInput, dataUncheckedCreateWithoutVersionsInput>
    where?: dataWhereInput
  }

  export type dataUpdateToOneWithWhereWithoutVersionsInput = {
    where?: dataWhereInput
    data: XOR<dataUpdateWithoutVersionsInput, dataUncheckedUpdateWithoutVersionsInput>
  }

  export type dataUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: dataUpdateOneWithoutVersionsNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type dataUncheckedUpdateWithoutVersionsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data_schema_id?: IntFieldUpdateOperationsInput | number
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dataUpsertWithWhereUniqueWithoutPreviousInput = {
    where: dataWhereUniqueInput
    update: XOR<dataUpdateWithoutPreviousInput, dataUncheckedUpdateWithoutPreviousInput>
    create: XOR<dataCreateWithoutPreviousInput, dataUncheckedCreateWithoutPreviousInput>
  }

  export type dataUpdateWithWhereUniqueWithoutPreviousInput = {
    where: dataWhereUniqueInput
    data: XOR<dataUpdateWithoutPreviousInput, dataUncheckedUpdateWithoutPreviousInput>
  }

  export type dataUpdateManyWithWhereWithoutPreviousInput = {
    where: dataScalarWhereInput
    data: XOR<dataUpdateManyMutationInput, dataUncheckedUpdateManyWithoutPreviousInput>
  }

  export type data_schemaUpsertWithoutRecordsInput = {
    update: XOR<data_schemaUpdateWithoutRecordsInput, data_schemaUncheckedUpdateWithoutRecordsInput>
    create: XOR<data_schemaCreateWithoutRecordsInput, data_schemaUncheckedCreateWithoutRecordsInput>
    where?: data_schemaWhereInput
  }

  export type data_schemaUpdateToOneWithWhereWithoutRecordsInput = {
    where?: data_schemaWhereInput
    data: XOR<data_schemaUpdateWithoutRecordsInput, data_schemaUncheckedUpdateWithoutRecordsInput>
  }

  export type data_schemaUpdateWithoutRecordsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutRecordsInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type businessCreateManyPreviousInput = {
    rootid?: string
    id?: number
    name: string
    icon?: string | null
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type data_schemaCreateManyBusinessInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type businessUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: businessUpdateManyWithoutPreviousNestedInput
    schemas?: data_schemaUpdateManyWithoutBusinessNestedInput
  }

  export type businessUncheckedUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: businessUncheckedUpdateManyWithoutPreviousNestedInput
    schemas?: data_schemaUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type businessUncheckedUpdateManyWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type data_schemaUpdateWithoutBusinessInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: data_schemaUpdateOneWithoutVersionsNestedInput
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutBusinessInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateManyWithoutBusinessInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type data_schemaCreateManyPreviousInput = {
    rootid?: string
    id?: number
    business_id?: number | null
    name: string
    json?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type viewCreateManySchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type formCreateManySchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type dataCreateManySchemaInput = {
    rootid?: string
    id?: number
    prev_id?: number | null
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type data_schemaUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUpdateManyWithoutPreviousNestedInput
    business?: businessUpdateOneWithoutSchemasNestedInput
    views?: viewUpdateManyWithoutSchemaNestedInput
    forms?: formUpdateManyWithoutSchemaNestedInput
    records?: dataUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: data_schemaUncheckedUpdateManyWithoutPreviousNestedInput
    views?: viewUncheckedUpdateManyWithoutSchemaNestedInput
    forms?: formUncheckedUpdateManyWithoutSchemaNestedInput
    records?: dataUncheckedUpdateManyWithoutSchemaNestedInput
  }

  export type data_schemaUncheckedUpdateManyWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    business_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    json?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type viewUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: viewUpdateOneWithoutVersionsNestedInput
    versions?: viewUpdateManyWithoutPreviousNestedInput
  }

  export type viewUncheckedUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: viewUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type viewUncheckedUpdateManyWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type formUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: formUpdateOneWithoutVersionsNestedInput
    versions?: formUpdateManyWithoutPreviousNestedInput
  }

  export type formUncheckedUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: formUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type formUncheckedUpdateManyWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dataUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    previous?: dataUpdateOneWithoutVersionsNestedInput
    versions?: dataUpdateManyWithoutPreviousNestedInput
  }

  export type dataUncheckedUpdateWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: dataUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type dataUncheckedUpdateManyWithoutSchemaInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    prev_id?: NullableIntFieldUpdateOperationsInput | number | null
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type viewCreateManyPreviousInput = {
    rootid?: string
    id?: number
    data_schema_id: number
    view_type: string
    name?: string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type viewUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: viewUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutViewsNestedInput
  }

  export type viewUncheckedUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_schema_id?: IntFieldUpdateOperationsInput | number
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: viewUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type viewUncheckedUpdateManyWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_schema_id?: IntFieldUpdateOperationsInput | number
    view_type?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_table_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type formCreateManyPreviousInput = {
    rootid?: string
    id?: number
    data_id: number
    name?: string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type formUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: formUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutFormsNestedInput
  }

  export type formUncheckedUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: formUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type formUncheckedUpdateManyWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    json_form_config?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dataCreateManyPreviousInput = {
    rootid?: string
    id?: number
    data_schema_id: number
    data?: JsonNullValueInput | InputJsonValue
    flag?: string | null
    activate?: boolean
    modify_datetime?: bigint | number | null
  }

  export type dataUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: dataUpdateManyWithoutPreviousNestedInput
    schema?: data_schemaUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type dataUncheckedUpdateWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_schema_id?: IntFieldUpdateOperationsInput | number
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    versions?: dataUncheckedUpdateManyWithoutPreviousNestedInput
  }

  export type dataUncheckedUpdateManyWithoutPreviousInput = {
    rootid?: StringFieldUpdateOperationsInput | string
    id?: IntFieldUpdateOperationsInput | number
    data_schema_id?: IntFieldUpdateOperationsInput | number
    data?: JsonNullValueInput | InputJsonValue
    flag?: NullableStringFieldUpdateOperationsInput | string | null
    activate?: BoolFieldUpdateOperationsInput | boolean
    modify_datetime?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}