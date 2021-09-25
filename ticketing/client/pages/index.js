import buildClient from '../api/build-client';

const CURRENT_USER_PATH = '/api/users/currentuser';

const LandingPage = ({ currentUser }) => {
  // This is executed from the browser.
  console.log(currentUser);

  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(CURRENT_USER_PATH);

  return data;
};

export default LandingPage;
