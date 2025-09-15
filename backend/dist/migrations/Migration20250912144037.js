import { Migration } from '@mikro-orm/migrations';
export class Migration20250912144037 extends Migration {
    async up() {
        this.addSql(`create table \`category\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null, \`description\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
        this.addSql(`create table \`product\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null, \`price\` int not null, \`description\` varchar(255) not null, \`stock\` int not null, \`category_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
        this.addSql(`alter table \`product\` add index \`product_category_id_index\`(\`category_id\`);`);
        this.addSql(`create table \`tag\` (\`id\` int unsigned not null auto_increment primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null, \`description\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
        this.addSql(`create table \`product_tags\` (\`product_id\` int unsigned not null, \`tag_id\` int unsigned not null, primary key (\`product_id\`, \`tag_id\`)) default character set utf8mb4 engine = InnoDB;`);
        this.addSql(`alter table \`product_tags\` add index \`product_tags_product_id_index\`(\`product_id\`);`);
        this.addSql(`alter table \`product_tags\` add index \`product_tags_tag_id_index\`(\`tag_id\`);`);
        this.addSql(`alter table \`product\` add constraint \`product_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade;`);
        this.addSql(`alter table \`product_tags\` add constraint \`product_tags_product_id_foreign\` foreign key (\`product_id\`) references \`product\` (\`id\`) on update cascade on delete cascade;`);
        this.addSql(`alter table \`product_tags\` add constraint \`product_tags_tag_id_foreign\` foreign key (\`tag_id\`) references \`tag\` (\`id\`) on update cascade on delete cascade;`);
    }
}
