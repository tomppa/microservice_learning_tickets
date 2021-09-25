import buildClient from '../api/build-client';

const CURRENT_USER_PATH = '/api/users/currentuser';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(CURRENT_USER_PATH);

  return data;
};

export default LandingPage;
