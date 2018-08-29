const {ipcRenderer, shell} = require('electron')
import { STOP_UI_SERVER, STOP_GETH, START_GETH, REQUEST_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET_DATABASE, START_UI_SERVER, STOP_AUGUR_NODE, START_AUGUR_NODE, SAVE_CONFIG } from '../../../utils/constants'
import store from '../../store'

export const requestServerConfigurations = () => {
  ipcRenderer.send(REQUEST_CONFIG)
}

export const requestLatestSyncedBlock = () => {
  ipcRenderer.send(REQUEST_LATEST_SYNCED_BLOCK)
}

export const resetDatabase = (data) => {
  ipcRenderer.send(RESET_DATABASE, data)
}

export const startUiServer = () => {
  const config = store.getState().configuration
  ipcRenderer.send(START_UI_SERVER, config)
}

export const stoptUiServer = () => {
  ipcRenderer.send(STOP_UI_SERVER)
}

export const startAugurNode = (connection) => {
  ipcRenderer.send(START_AUGUR_NODE, connection)
}

export const stopAugurNode = () => {
  ipcRenderer.send(STOP_AUGUR_NODE)
  stoptUiServer() // stop when disconnected from augur node
}

export const startGethNode = () => {
  ipcRenderer.send(START_GETH)
}

export const stopGethNode = () => {
  ipcRenderer.send(STOP_GETH)
}

export const saveConfiguration = (config) => {
  ipcRenderer.send(SAVE_CONFIG, config)
}

export const openAugurUi = (networkConfig) => {
  startUiServer() // start UI server before connecting
  const { sslEnabled, sslPort, uiPort } = store.getState().configuration
  const protocol = sslEnabled ? 'https' : 'http'
  const port = sslEnabled ? sslPort : uiPort
  const wssProtocol = 'ws://127.0.0.1:9001'
  const queryString = `augur_node=${encodeURIComponent(wssProtocol)}&ethereum_node_http=${encodeURIComponent(networkConfig.http)}&ethereum_node_ws=${encodeURIComponent(networkConfig.ws)}`
  shell.openExternal(`${protocol}://127.0.0.1:${port}/#/categories?${queryString}`)
}
