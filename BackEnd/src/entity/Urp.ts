import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToMany,
    PrimaryColumn
} from "typeorm";
import { Project } from "./Project";
import { Tarea } from "./Tarea";
import { User } from "./User";

enum Rol {
    ProductOwner = 'ProductOwner',
    ScrumMaster = 'ScrumMaster',
    Developer = 'Developer'
}
  
@Entity()
export class Urp extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

/*     @Column({type:'enum',enum:Rol})
    rol:Rol;
  */
    @Column()
    rol:string;
 
    @Column()
    userId: number;
    @ManyToOne(() => User, user => user.urpu,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({ name : "userId" })
    owner : User;

    @Column()
    projectId:number;
    @ManyToOne(()=>Project, project => project.urpp,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({name: "projectId"})
    pro : Project;

    @OneToMany(()=> Tarea, tarea => tarea.urpta)
    tareau: Tarea[];

}