import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

//IMPORTAMOS LAS DEMAS CLASES
import { Tarea } from "./Tarea";
import { Project } from "./Project";

@Entity()
export class Sprint  extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('time')
    daily: Date;

    @Column('date')
    fechaInicio: Date;

    @Column('date')
    fechaFin: Date;

    @OneToMany(()=> Tarea, tarea => tarea.sprta)
    tareaS: Tarea[];

    @Column()
    projectId:number;
    @ManyToOne(()=>Project, project => project.urpS,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({name: "projectId"})
    proS : Project;

}
