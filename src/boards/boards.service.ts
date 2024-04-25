import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { createBoardDto } from './dto/create-board.dto';
// import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity'
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { promises } from 'dns';
// import { v1 as uuid } from 'uuid';

// repository pattern을 적용하지 않고 service에서 db로직 처리
@Injectable()
export class BoardsService {

    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) { }
    // private boards: Board[] = [];

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    async getAllBoards(
        user: User
    ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id });

        const boards = await query.getMany();

        // return this.boardRepository.find();
        return boards;
    }

    // createBoard(createBoardDto: createBoardDto) {
    //     const { title, description } = createBoardDto;
    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);
    //     return board;
    // }

    async createBoard(createBoardDto: createBoardDto, user: User): Promise<Board> {
        const { title, description } = createBoardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        })

        await this.boardRepository.save(board);
        return board;
    }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne({ where: { id } });

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }

    // getBoardById(id: string): Board{
    //     const found = this.boards.find((board)=> board.id === id);

    //     if(!found) {
    //         throw new NotFoundException(`Can't find Board with id ${id}`);
    //     }

    //     this.boards.find((board) => board.id === id);
    //     return found;
    // }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
        console.log('result', result);
    }

    // deleteBoard(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== id);
    // }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }
}
