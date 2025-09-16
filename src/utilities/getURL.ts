import canUseDOM from './canUseDOM'

const FALLBACK = 'http://localhost:3000'

export const getServerSideURL = () => {
  return (
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '') ||
    FALLBACK
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  return getServerSideURL()
}
