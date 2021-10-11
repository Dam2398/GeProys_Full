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
import * as bcrypt from 'bcryptjs';

//IMPORTAMOS LAS DEMAS CLASES
import { Urp } from "./Urp";

@Entity()
export class User  extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @IsEmail()
    email:string;

    @Column()
    password: string;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    fechaCreacion: Date;

    @Column()
    @UpdateDateColumn({type: "timestamp"})
    fechaUpdate: Date;

    @OneToMany(()=> Urp, urp => urp.owner)
    urpu: Urp[];

    hashPassword(): void {//Pa encriptar
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
      }
    
    checkPassword(password: string): boolean {//para loearse
      return bcrypt.compareSync(password, this.password);
    }
}
