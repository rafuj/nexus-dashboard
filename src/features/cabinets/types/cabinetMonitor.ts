export type CabinetMonitorToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  city: string
  setCity: (value:string)=> void
  assetHealth: string
  setAssetHealth: (value:string)=> void
  doorStatus: string
  setDoorStatus: (value:string)=> void
}
