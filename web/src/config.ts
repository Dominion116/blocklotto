import { AppConfig, UserSession } from '@stacks/auth'

const appConfig = new AppConfig(['store_write', 'publish_data'])
export const userSession = new UserSession({ appConfig })

export const appDetails = {
  name: 'BlockLotto',
  icon: 'https://avatars.githubusercontent.com/u/37784886'
}

export const connectWallet = async () => {
  // @ts-ignore - showConnect is available at runtime but not in types
  const { showConnect } = await import('@stacks/connect/dist')
  return showConnect({
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
