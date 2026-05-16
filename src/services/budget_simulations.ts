import pb from '@/lib/pocketbase/client'

export const getSimulations = (weddingId: string) =>
  pb
    .collection('budget_simulations')
    .getFullList({ filter: `wedding_id = "${weddingId}"`, sort: '-created' })

export const createSimulation = (data: any) => pb.collection('budget_simulations').create(data)

export const updateSimulation = (id: string, data: any) =>
  pb.collection('budget_simulations').update(id, data)

export const deleteSimulation = (id: string) => pb.collection('budget_simulations').delete(id)
