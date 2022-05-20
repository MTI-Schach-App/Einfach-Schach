import { useStore } from '../utils/store';
import MainMenu from '../components/MainMenu';
import LoginMenu from '../components/Login';
import BackButton from '../components/BackButton';
function IndexPage() {
  const store = useStore();
  if (store.loggedInUser.name === 'None') {
    return (
    <LoginMenu />
    );
  } else {
    return <MainMenu {...store} />;
  }
}

export default IndexPage;
