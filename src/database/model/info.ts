import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Information {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
      type: "varchar",
    })
    title!: string;

    @Column({
      type: "text",
    })
    content!: string;

    @Column({
      type: "timestamp",
    })
    published_at!: string;

}
