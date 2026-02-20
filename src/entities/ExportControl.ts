import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("export_control")
export class ExportControl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, unique: true })
    export_type: string; // 'messages_ftp'

    @Column({ type: "timestamp" })
    last_export_at: Date;

    @Column({ type: "int", default: 0 })
    total_records_exported: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
}
