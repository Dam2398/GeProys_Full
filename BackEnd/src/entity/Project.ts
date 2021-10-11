import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsEmail } from "class-validator";

//IMPORTAMOS LAS DEMAS CLASES
import { Urp } from "./Urp";
import { Sprint } from "./Sprint";

@Entity()
export class Project  extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    fechaCreacion: Date;

    @Column()
    @UpdateDateColumn({type: "timestamp"})
    fechaUpdate: Date;

    @OneToMany(()=> Urp, urp => urp.pro)
    urpp: Urp[];

    @OneToMany(()=> Sprint, sprint => sprint.proS)
    urpS: Sprint[];
}
