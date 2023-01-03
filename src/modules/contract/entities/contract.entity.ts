import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'smart_contract' })
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  channelId: string;

  @Column()
  deployer: string;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  chainId: string;

  @Column()
  network: string;

  @Column()
  revision: string;

  @CreateDateColumn() // Date will be coming from orchestrator
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
