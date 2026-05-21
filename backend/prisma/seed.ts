import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const defaults = [
        { name: 'Salaire',   type: 'income',  icon: 'work' },
        { name: 'Freelance', type: 'income',  icon: 'laptop' },
        { name: 'Loyer',     type: 'expense', icon: 'home' },
        { name: 'Courses',   type: 'expense', icon: 'shopping_cart' },
        { name: 'Transport', type: 'expense', icon: 'directions_car' },
        { name: 'Santé',     type: 'expense', icon: 'medical_services' },
    ]
    for (const cat of defaults) {
        await prisma.category.upsert({
            where: { id: cat.name }, // juste pour éviter les doublons
            update: {},
            create: cat,
        })
    }
    console.log('Seed terminé ✅')
}

main().finally(() => prisma.$disconnect())