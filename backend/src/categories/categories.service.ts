import { Injectable } from '@nestjs/common'
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    findAll(user_id: string) {
        return this.prisma.category.findMany({
            where: { OR: [{ user_id }, { user_id: null }] }
        })
    }

    create(user_id: string, data: { name: string; type: string; icon?: string }) {
        return this.prisma.category.create({
            data: { ...data, user_id }
        })
    }

    update(id: string, data: { name?: string; type?: string; icon?: string }) {
        return this.prisma.category.update({ where: { id }, data })
    }

    remove(id: string) {
        return this.prisma.category.delete({ where: { id } })
    }
}