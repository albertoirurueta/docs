// MySQL cheat sheet content, from modules/ROOT/pages/database/mysql/cheat-sheet.adoc (versions from the
// `== Version baseline` of modules/ROOT/pages/database/mysql/index.adoc).
export default {
  file: 'mysql-cheat-sheet.pdf',
  title: 'MySQL Cheat Sheet',
  subtitle: 'MySQL 26.10 Innovation (LTS 9.7 / 8.4) · AI-generated summary — verify against the MySQL manual · see the MySQL pages for details',
  footer: 'Irurueta Docs · MySQL · full statements, options and examples: see the MySQL pages',
  boxes: [
    {
      title: 'CLIENT — CONNECT',
      color: 'indigo',
      items: [
        { label: 'Connect', code: [
          'mysql -h 127.0.0.1 -P 3306 -u root -p shop',
          'mysql -uroot -psecret shop -e "SELECT 1"',
          'mysql ... --commands shop < script.sql',
          'mysql ... --default-character-set=utf8mb4',
        ].join('\n') },
        { label: 'Connection strings', code: [
          'mysql://user:password@host:3306/shop',
          'jdbc:mysql://host:3306/shop?sslMode=REQUIRED',
          'mysqlsh --sql --uri root:secret@host/shop',
        ].join('\n') },
        { label: 'Client commands', code: [
          '\\s status     \\u shop   \\G vertical',
          '\\. file.sql   source file.sql   help SELECT',
          'SHOW TABLES;  DESCRIBE customers;',
          'SHOW CREATE TABLE customers\\G',
        ].join('\n') },
        { label: 'Note', text: 'The client may default to latin1: pass --default-character-set=utf8mb4 for non-ASCII data.' },
      ],
    },
    {
      title: 'TABLES — DEFINE',
      color: 'cyan',
      items: [
        { label: 'Create', code: [
          'CREATE TABLE IF NOT EXISTS notes (',
          '  id   int AUTO_INCREMENT PRIMARY KEY,',
          '  upd  timestamp DEFAULT CURRENT_TIMESTAMP',
          '       ON UPDATE CURRENT_TIMESTAMP,',
          "  kind enum('a','b') NOT NULL DEFAULT 'a',",
          "  label varchar(10)",
          "       AS (CONCAT('n-', kind)) STORED);",
        ].join('\n') },
        { label: 'Alter, copy, drop', code: [
          'ALTER TABLE notes ADD COLUMN flag',
          '  tinyint(1) NOT NULL DEFAULT 0,',
          '  ALGORITHM=INSTANT;',
          'CREATE TABLE notes_copy LIKE notes;',
          'DROP TABLE IF EXISTS notes_old, notes_copy;',
        ].join('\n') },
        { label: 'Data types', code: [
          'tinyint smallint mediumint int bigint',
          'tinyint(1)    usual boolean',
          'decimal(p,s)  money, never float/double',
          'varchar(n) text enum(...) blob json',
          'date datetime timestamp (UTC, 1970-2038)',
        ].join('\n') },
      ],
    },
    {
      title: 'DATA — MODIFY',
      color: 'green',
      items: [
        { label: 'Upsert', code: [
          'INSERT INTO customers (...) VALUES (...)',
          '  AS new ON DUPLICATE KEY UPDATE',
          '  name = new.name;',
          'INSERT IGNORE INTO customers VALUES (...);',
          "REPLACE INTO notes (id, body)",
          "  VALUES (1, 'replaced');  -- delete+insert",
        ].join('\n') },
        { label: 'Update, delete', code: [
          'UPDATE orders o JOIN customers c',
          '  ON c.id = o.customer_id',
          "  SET o.status='open' WHERE c.tier='free';",
          "DELETE FROM customers WHERE id='c-9'",
          '  ORDER BY id LIMIT 1;',
          'SELECT LAST_INSERT_ID(), ROW_COUNT();',
        ].join('\n') },
        { label: 'Query idioms', code: [
          'WITH t AS (SELECT customer_id, COUNT(*) n',
          '  FROM orders GROUP BY customer_id)',
          'SELECT * FROM t WHERE n > 1;',
          'ROW_NUMBER() OVER (PARTITION BY customer_id',
          '  ORDER BY order_date DESC)',
          "GROUP_CONCAT(name ORDER BY name",
          "  SEPARATOR ', ')",
        ].join('\n') },
      ],
    },
    {
      title: 'INDEXES — CREATE',
      color: 'orange',
      items: [
        { label: 'Secondary, unique, full-text', code: [
          'CREATE INDEX idx',
          '  ON orders (customer_id, order_date);',
          'CREATE UNIQUE INDEX uq ON notes (id, kind);',
          'CREATE INDEX idx ON t (col(20)); -- prefix',
          'CREATE FULLTEXT INDEX ft ON notes (body);',
          "MATCH(body) AGAINST ('mysql')",
        ].join('\n') },
        { label: 'Functional, multi-valued (JSON)', code: [
          'CREATE INDEX idx ON items',
          "  ((CAST(attrs->>'$.watts' AS UNSIGNED)));",
          'CREATE INDEX idx ON items',
          "  ((CAST(tags->'$' AS CHAR(20) ARRAY)));",
        ].join('\n') },
        { label: 'Invisible', code: [
          'ALTER TABLE t ALTER INDEX idx INVISIBLE;',
          'ALTER TABLE t ALTER INDEX idx VISIBLE;',
        ].join('\n') },
        { label: 'Note', text: 'PRIMARY KEY is the clustered index. Composite indexes serve the leftmost prefix only.' },
      ],
    },
    {
      title: 'PLANS — EXPLAIN',
      color: 'pink',
      items: [
        { label: 'Forms', code: [
          'EXPLAIN SELECT * FROM orders',
          "  WHERE customer_id='c-1';   -- TREE here",
          'EXPLAIN FORMAT=TRADITIONAL SELECT ...;',
          'EXPLAIN FORMAT=JSON SELECT ...;',
          'EXPLAIN ANALYZE SELECT ...; -- runs it',
          'SET explain_format = TRADITIONAL;',
        ].join('\n') },
        { label: 'TREE output', code: [
          '-> Index lookup on orders',
          '   using fk_orders_customer',
          "   (customer_id = 'c-1')  (cost=0.8 rows=3)",
        ].join('\n') },
        { label: 'Read the table form', text: 'type: ALL is a full scan; ref, range, const use an index. Also key, rows and Extra: Using filesort, Using temporary, Using index (covering).' },
      ],
    },
    {
      title: 'TRANSACTIONS — LOCK',
      color: 'yellow',
      items: [
        { label: 'Isolation levels', code: [
          'READ UNCOMMITTED  dirty reads possible',
          'READ COMMITTED    latest committed data',
          'REPEATABLE READ   default, next-key locks',
          'SERIALIZABLE      reads take shared locks',
        ].join('\n') },
        { label: 'Set level', code: [
          'SELECT @@transaction_isolation;',
          'SET SESSION TRANSACTION ISOLATION LEVEL',
          '  READ COMMITTED;',
        ].join('\n') },
        { label: 'Locking reads', code: [
          "SELECT ... FOR UPDATE;   -- exclusive lock",
          "SELECT ... FOR SHARE;    -- shared lock",
          'SELECT ... FOR UPDATE NOWAIT;',
          "SELECT * FROM orders WHERE status='open'",
          '  ORDER BY id LIMIT 1',
          '  FOR UPDATE SKIP LOCKED;  -- job queue',
        ].join('\n') },
        { label: 'Savepoints', code: 'SAVEPOINT s1;  ROLLBACK TO SAVEPOINT s1;' },
      ],
    },
    {
      title: 'JSON — QUERY',
      color: 'violet',
      items: [
        { label: 'Read and test', code: [
          "SELECT attrs->>'$.color'      -- oak",
          "     , JSON_EXTRACT(attrs,'$.color')",
          "  FROM products WHERE sku='A-1';",
          "WHERE 'sale' MEMBER OF (tags)",
          'SELECT JSON_ARRAYAGG(sku) FROM products;',
        ].join('\n') },
        { label: 'Functions', code: [
          'JSON_VALUE(doc,path RETURNING type)',
          'JSON_SET  JSON_INSERT  JSON_REPLACE',
          'JSON_REMOVE  JSON_MERGE_PATCH',
          'JSON_CONTAINS  JSON_OVERLAPS  JSON_VALID',
          'JSON_OBJECT  JSON_ARRAY  JSON_OBJECTAGG',
          "JSON_TABLE(doc,'$[*]' COLUMNS (...))",
        ].join('\n') },
        { label: 'Paths', code: '$  $.key  $[0]  $[last]  $[*]  $**.key' },
      ],
    },
    {
      title: 'SERVER — ADMINISTER',
      color: 'slate',
      items: [
        { label: 'Sessions, variables', code: [
          'SHOW FULL PROCESSLIST;  KILL QUERY 26;',
          "SHOW GLOBAL STATUS LIKE 'Threads%';",
          'SET GLOBAL max_connections = 300;',
          'SET PERSIST max_connections = 300;',
        ].join('\n') },
        { label: 'sys, performance_schema', code: [
          'SELECT * FROM sys.innodb_lock_waits;',
          'performance_schema.data_locks',
          'sys.statements_with_full_table_scans',
          'sys.schema_unused_indexes',
          'SHOW ENGINE INNODB STATUS\\G',
        ].join('\n') },
        { label: 'Users, roles', code: [
          "CREATE USER 'app'@'%' IDENTIFIED BY '...';",
          "CREATE ROLE 'shop_read';",
          "GRANT SELECT ON shop.* TO 'shop_read';",
          "GRANT 'shop_read' TO 'app'@'%';",
        ].join('\n') },
        { label: 'Note', text: 'SET GLOBAL lasts until restart; SET PERSIST survives it (mysqld-auto.cnf). Defaults seen: buffer pool 128 MiB, max_connections 151.' },
      ],
    },
    {
      title: 'BACKUP — REPLICATE',
      color: 'teal',
      items: [
        { label: 'Dump and restore', code: [
          'mysqldump -uroot -psecret \\',
          '  --single-transaction --routines \\',
          '  --triggers --events --source-data=2 \\',
          '  --databases shop > shop-full.sql',
          'mysql -uroot -psecret < shop-full.sql',
        ].join('\n') },
        { label: 'Point-in-time replay', code: [
          'mysqlbinlog --start-position=1795 \\',
          '  --stop-position=2781 binlog.000004 \\',
          '  | mysql -uroot -psecret',
        ].join('\n') },
        { label: 'Replication', code: [
          'SHOW BINARY LOG STATUS;  -- on a source',
          'SHOW REPLICA STATUS\\G    -- on a replica',
          'CHANGE REPLICATION SOURCE TO',
          "  SOURCE_HOST='my-b', SOURCE_USER='repl',",
          '  SOURCE_AUTO_POSITION=1, ...;',
          'START REPLICA;  STOP REPLICA;',
        ].join('\n') },
        { label: 'Note', text: 'On a replica check Replica_IO_Running, Replica_SQL_Running and Seconds_Behind_Source.' },
      ],
    },
  ],
};
