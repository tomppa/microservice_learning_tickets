import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const CURRENT_USER_PATH = '/api/users/currentuser';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get(CURRENT_USER_PATH);

  let pageProps;

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return data;
};

export default AppComponent;
