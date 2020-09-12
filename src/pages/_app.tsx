import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../styles/global.sass'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
