import { AppConfig, UserSession } from '@stacks/auth'
// @ts-ignore
import { showConnect } from '@stacks/connect'

const appConfig = new AppConfig(['store_write', 'publish_data'])
export const userSession = new UserSession({ appConfig })

export const appDetails = {
  name: 'BlockLotto',
  icon: 'https://avatars.githubusercontent.com/u/37784886'
}

export const connectWallet = () => {
  showConnect({
    appDetails,
    onFinish: () => {
      window.location.reload()
    },
    userSession
  })
}

export const disconnect = () => {
  userSession.signUserOut()
  window.location.reload()
}
