import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'contract' })
export class Contract {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  chainId: string;

  @Column()
  network: string;

  @CreateDateColumn() // Date will be coming from orchestrator
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
