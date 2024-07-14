const { string1 } = require("./sql-string");
console.log(`string1: ${string1}`);
const db = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "83505269",
    database: "postgres",
  },
});

async function test() {
  try {
    // const users = await db.select("*").from("app_airplane");

    // const users = await db.raw("select * from app_airplane");

    // const users = await db.raw("select * from app_airplane where name = ?", [
    //   "비행기1",
    // ]);

    const users = await db.raw(string1, ["app_airplane", "app_airplane"]);

    console.log(`users : ${users}`);
    // res.json(users);
  } catch (error) {
    console.log(error);
    // res.status(500).send(error.message);
  }
}

test();

console.log("aaa");
