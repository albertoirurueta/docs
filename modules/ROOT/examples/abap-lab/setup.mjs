import {SQLiteDatabaseClient} from "@abaplint/database-sqlite";
import {MemoryDataset} from "@abaplint/runtime";

export async function setup(abap, schemas, insert) {
  abap.context.databaseConnections["DEFAULT"] = new SQLiteDatabaseClient();
  await abap.context.databaseConnections["DEFAULT"].connect();
  await abap.context.databaseConnections["DEFAULT"].execute(schemas.sqlite);
  await abap.context.databaseConnections["DEFAULT"].execute(insert);
  abap.context.dataset = new MemoryDataset();
}
