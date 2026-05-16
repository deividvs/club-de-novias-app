import pb from '@/lib/pocketbase/client'

export interface GuestSimulation {
  id: string
  wedding_id: string
  name: string
  total_budget: number
  cost_per_person: number
  guest_budget_meta: number
}

export type RelationshipGroup = 'família_próxima' | 'amigo_íntimo' | 'colega' | 'obrigação_social'
export type SocialRisk = 'baixo' | 'médio' | 'alto'
export type PresenceProbability = 'baixa' | 'média' | 'alta' | 'confirmado' | 'improvável'

export interface Guest {
  id: string
  simulation_id: string
  name: string
  relationship_group: RelationshipGroup
  social_risk: SocialRisk
  presence_probability: PresenceProbability
  individual_cost: number
  notes: string
  manual_status: string
}

export const getGuestSimulations = (weddingId: string) =>
  pb
    .collection('guest_simulations')
    .getFullList<GuestSimulation>({ filter: `wedding_id = "${weddingId}"` })

export const createGuestSimulation = (data: Partial<GuestSimulation>) =>
  pb.collection('guest_simulations').create<GuestSimulation>(data)

export const getGuests = (simulationId: string) =>
  pb.collection('guests').getFullList<Guest>({ filter: `simulation_id = "${simulationId}"` })

export const createGuest = (data: Partial<Guest>) => pb.collection('guests').create<Guest>(data)

export const updateGuest = (id: string, data: Partial<Guest>) =>
  pb.collection('guests').update<Guest>(id, data)

export const deleteGuest = (id: string) => pb.collection('guests').delete(id)
