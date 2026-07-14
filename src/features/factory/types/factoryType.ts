export type FactoryRow = {
  id: string
  serial: string
  status: 'linked' | 'unlinked'
  imei: string
  linkedOn: string
}