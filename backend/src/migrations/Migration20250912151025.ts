import { Migration } from '@mikro-orm/migrations';

export class Migration20250912151025 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`order\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`order_number\` varchar(255) not null, \`total\` numeric(10,2) not null, \`order_date\` datetime not null, \`status\` varchar(255) not null default 'proceso') default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`order\` add unique \`order_order_number_unique\`(\`order_number\`);`);

    this.addSql(`create table \`order_products\` (\`order_id\` int unsigned not null, \`product_id\` int unsigned not null, primary key (\`order_id\`, \`product_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`order_products\` add index \`order_products_order_id_index\`(\`order_id\`);`);
    this.addSql(`alter table \`order_products\` add index \`order_products_product_id_index\`(\`product_id\`);`);

    this.addSql(`alter table \`order_products\` add constraint \`order_products_order_id_foreign\` foreign key (\`order_id\`) references \`order\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`order_products\` add constraint \`order_products_product_id_foreign\` foreign key (\`product_id\`) references \`product\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`order_products\` drop foreign key \`order_products_order_id_foreign\`;`);

    this.addSql(`drop table if exists \`order\`;`);

    this.addSql(`drop table if exists \`order_products\`;`);
  }

}
