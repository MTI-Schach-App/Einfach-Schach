import { useStore } from '../utils/store';
import SignIn from '../components/SignIn';
import MainMenu from '../components/MainMenu';

function IndexPage() {

    const store = useStore();
    if (store.loggedInUser.name === 'None'){
        return(<SignIn/>);

    }
    else{
        return(<MainMenu {...store}/>);
    }  
}

export default IndexPage;

