import prisma from './prisma'
import { hashPassword } from './auth'
import { Prisma } from '@prisma/client'

// User functions
export async function createUser(data: { name: string; email: string; password: string }) {
  const hashedPassword = await hashPassword(data.password)
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Add this function to get user by ID
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

// Itinerary functions
export async function getItineraries(userId: string) {
  return prisma.itinerary.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      destinations: true,
      collaborators: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getItineraryById(id: string, userId: string) {
  return prisma.itinerary.findFirst({
    where: {
      id,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }, { isPublic: true }],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      destinations: {
        include: {
          activities: true,
          accommodations: true,
        },
      },
      activities: {
        include: {
          destination: true,
        },
      },
      accommodations: true,
      transportation: {
        include: {
          fromDestination: true,
          toDestination: true,
        },
      },
      collaborators: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      budgetItems: true,
      notes: true,
    },
  })
}

export async function createItinerary(data: Omit<Prisma.ItineraryCreateInput, 'owner'>, userId: string) {
  return prisma.itinerary.create({
    data: {
      ...data,
      owner: {
        connect: { id: userId }
      }
    },
  })
}

export async function updateItinerary(id: string, data: Prisma.ItineraryUpdateInput, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } },
      ],
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  return prisma.itinerary.update({
    where: { id },
    data,
  })
}

export async function deleteItinerary(id: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  return prisma.itinerary.delete({
    where: { id },
  })
}

// Destination functions
export async function createDestination(data: Omit<Prisma.DestinationCreateInput, 'itinerary'>, itineraryId: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } },
      ],
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  return prisma.destination.create({
    data: {
      ...data,
      itinerary: {
        connect: { id: itineraryId }
      }
    },
  })
}

// Activity functions
export async function createActivity(data: Omit<Prisma.ActivityCreateInput, 'itinerary'>, itineraryId: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId, permission: { in: ['edit', 'admin'] } } } },
      ],
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  return prisma.activity.create({
    data: {
      ...data,
      itinerary: {
        connect: { id: itineraryId }
      }
    },
  })
}

// Budget functions
export async function getBudgetSummary(itineraryId: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  const budgetItems = await prisma.budgetItem.findMany({
    where: { itineraryId },
  })

  const accommodationCosts = await prisma.accommodation.findMany({
    where: { itineraryId },
    select: { cost: true, currency: true },
  })

  const transportationCosts = await prisma.transportation.findMany({
    where: { itineraryId },
    select: { cost: true, currency: true },
  })

  const activityCosts = await prisma.activity.findMany({
    where: { itineraryId },
    select: { cost: true, currency: true },
  })

  const totalEstimated = budgetItems.reduce(
    (sum, item) => sum + (item.estimatedCost?.toNumber() || 0),
    0
  )
  const totalActual = budgetItems.reduce(
    (sum, item) => sum + (item.actualCost?.toNumber() || 0),
    0
  )

  const accommodationTotal = accommodationCosts.reduce(
    (sum, item) => sum + (item.cost?.toNumber() || 0),
    0
  )
  const transportationTotal = transportationCosts.reduce(
    (sum, item) => sum + (item.cost?.toNumber() || 0),
    0
  )
  const activityTotal = activityCosts.reduce(
    (sum, item) => sum + (item.cost?.toNumber() || 0),
    0
  )

  return {
    budgetItems,
    summary: {
      totalEstimated,
      totalActual,
      accommodationTotal,
      transportationTotal,
      activityTotal,
    },
  }
}

// Collaborator functions
export async function addCollaborator(itineraryId: string, email: string, permission: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      ownerId: userId,
    },
  })

  if (!itinerary) {
    throw new Error('Not authorized or itinerary not found')
  }

  const collaborator = await prisma.user.findUnique({
    where: { email },
  })

  if (!collaborator) {
    throw new Error('User not found')
  }

  return prisma.collaborator.create({
    data: {
      itinerary: {
        connect: { id: itineraryId }
      },
      user: {
        connect: { id: collaborator.id }
      },
      permission,
    },
  })
}

// Offline sync functions
export async function saveOfflineChanges(changes: any[], userId: string) {
  return prisma.offlineSync.createMany({
    data: changes.map((change) => ({
      userId,
      entityType: change.entityType,
      entityId: change.entityId,
      action: change.action,
      data: change.data,
    })),
  })
}

export async function syncOfflineChanges(userId: string) {
  const changes = await prisma.offlineSync.findMany({
    where: {
      userId,
      synced: false,
    },
    orderBy: { createdAt: 'asc' },
  })

  for (const change of changes) {
    try {
      if (change.entityType === 'itinerary') {
        if (change.action === 'create') {
          const rawData = typeof change.data === 'object' && change.data !== null ? change.data : {};
          
          await prisma.itinerary.create({
            data: {
              ...rawData as Omit<Prisma.ItineraryUncheckedCreateInput, 'ownerId'>,
              owner: {
                connect: { id: userId }
              }
            },
          })
        } else if (change.action === 'update' && change.entityId) {
          const rawData = typeof change.data === 'object' && change.data !== null ? change.data : {};
          
          await prisma.itinerary.update({
            where: { id: change.entityId },
            data: rawData as Prisma.ItineraryUpdateInput,
          })
        } else if (change.action === 'delete' && change.entityId) {
          await prisma.itinerary.delete({
            where: { id: change.entityId },
          })
        }
      }
      await prisma.offlineSync.update({
        where: { id: change.id },
        data: { synced: true },
      })
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  return { synced: changes.length }
}
