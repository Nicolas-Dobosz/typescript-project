import prisma from '@/lib/prisma'

export default async function Page() {
  const users = await prisma.user.findMany()

  console.log(users)
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}