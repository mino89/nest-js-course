import { Report } from "../reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  email: string;
  
  @Column()
  password: string;

  @Column({default: true})
  admin: true
  
  @OneToMany(()=> Report, (report)=> report.user)
  reports: Report[]

  @AfterInsert()
  logInsert(){
    console.log(`inserted user with id`, this.id)
  }
  @AfterUpdate()
  logUpdate(){
    console.log(`updated usert with id`, this.id)
  }
  @AfterRemove()
  logRemove(){
    console.log(`removed user with id`, this.id)
  }
}