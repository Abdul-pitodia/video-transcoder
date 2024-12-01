import { OmitType } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum VideoConversionStatus {
    INCOMPLETE = "Incomplete",
    COMPLETED = "Completed",
    FAILED = "Failed"
}

@Entity()
export class VideoDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string;

    @Column()
    key: string;

    @Column()
    originalName: string;

    @Column()
    conversionFormat: string;

    @Column()
    conversionResolution: number

    @Column({ type: "enum", enum: VideoConversionStatus, default: VideoConversionStatus.INCOMPLETE})
    status: VideoConversionStatus;
}

export class VideoDto extends OmitType(VideoDetails, ['id', 'key']){}