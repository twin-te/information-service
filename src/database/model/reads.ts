import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({
  name: 'already_reads',
})
export class alreadyReads {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
      type: "uuid",
    })
    information_id!: string

    @Column({
      type: "text",
    })
    read_user!: string

    @Column({
        type: "timestamp",
      })
    read_at!: string
}