import { Controller, Get, Post, Put, Delete,
    Body, Param, Request, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard' // guard de l'équipe auth
import { Request as ExpressRequest } from 'express'

interface AuthRequest extends ExpressRequest{
    user : { userId: string}
}
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    findAll(@Request() req:AuthRequest) {
        return this.categoriesService.findAll(req.user.userId)
    }

    @Post()
    create(@Request() req:AuthRequest, @Body() body: {name: string; type: string, icon?: string} ) {
        return this.categoriesService.create(req.user.userId, body)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: {name: string; type: string, icon?: string}) {
        return this.categoriesService.update(id, body)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id)
    }
}