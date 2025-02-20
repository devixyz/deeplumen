import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import MessageHandler from '../components/MessageHandler';
import Nav from '../components/Nav';
import MobileNav from '../components/Nav/MobileNav';
import {
  useGetPresetsQuery
} from '~/data-provider';
import store from '~/store';
import { useSetRecoilState } from 'recoil';
import { useAuthContext } from '~/hooks/AuthContext';
export default function Root() {
  const [navVisible, setNavVisible] = useState(false);

  const setEndpointsConfig = useSetRecoilState(store.endpointsConfig);
  const setPresets = useSetRecoilState(store.presets);
  const { user } = useAuthContext();


  const presetsQuery = useGetPresetsQuery({ enabled: !!user });



  useEffect(() => {
    if (presetsQuery.data) {
      setPresets(presetsQuery.data);
    } else if (presetsQuery.isError) {
      console.error('Failed to get presets', presetsQuery.error);
    }
  }, [presetsQuery.data, presetsQuery.isError]);



  return (
    <>
      <div className="flex h-screen">
        <Nav navVisible={navVisible} setNavVisible={setNavVisible} />
        <div className="flex h-full w-full flex-1 flex-col bg-gray-50">
          <div className="transition-width relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden bg-white pt-10 dark:bg-gray-800 md:pt-0">
            <MobileNav setNavVisible={setNavVisible} />
            <Outlet />
          </div>
        </div>
      </div>
      <MessageHandler />
    </>
  );
}
