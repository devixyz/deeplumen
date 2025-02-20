
import { atom, selector } from 'recoil';
import buildTree from '~/utils/buildTree';



const searchQuery = atom({
  key: 'searchQuery',
  default: ''
});

const searchResultMessages = atom({
  key: 'searchResultMessages',
  default: null
});

const searchResultMessagesTree = selector({
  key: 'searchResultMessagesTree',
  get: ({ get }) => {
    return buildTree(get(searchResultMessages), true);
  }
});



export default {
  searchResultMessages,
  searchResultMessagesTree,
  searchQuery
};
