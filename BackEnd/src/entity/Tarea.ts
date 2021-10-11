import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

//IMPORTAMOS LAS DEMAS CLASES
import { Urp } from "./Urp";
import { Sprint } from "./Sprint";

enum Status {
    Done = 'Done',
    InProgress  = 'InProgress',
    NotDone = 'NotDone'
}
enum Priority {
    Urgente = 'Urgente',
    Prioritario  = 'Prioritario',
    Importante = 'Importante',
    Necesario = "Necesario"
}

@Entity()
export class Tarea  extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column({type:'enum',enum:Status})
    status: string;

    @Column({type:'enum',enum:Priority})
    priority: string;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    fechaCreacion: Date;

    @Column()
    @UpdateDateColumn({type: "timestamp"})
    fechaUpdate: Date;

    @Column({nullable:true})
    urpId: number;
    @ManyToOne(() => Urp, urp => urp.tareau ,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({ name : "urpId" })
    urpta : Urp;

    @Column()
    sprintId: number;
    @ManyToOne(() => Sprint, sprint => sprint.tareaS ,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({ name : "sprintId" })
    sprta : Sprint;
}
