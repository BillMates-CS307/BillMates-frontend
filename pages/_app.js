import "@/styles/globals.css";
import { Provider } from "react-redux";
import { wrapper } from "@/lib/store/store";
import { ThemeProvider } from "next-themes";

export default function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <ThemeProvider enableSystem={false}>
        <Component {...props.pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
