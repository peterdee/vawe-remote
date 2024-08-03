import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../store';
import { changeServerAddress } from '../../store/features/settings';
import { DEFAULT_SERVER_ADDRESS } from '../../constants';
import log from '../../utilities/logger';
import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';
import './styles.css';

const Main = React.memo((): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { storeConnection } = useContext(SocketContext);

  const [address, setAddress] = useState<string>(DEFAULT_SERVER_ADDRESS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autoConnect = useSelector<RootState, boolean>((state) => state.settings.autoConnect);
  const serverAddress = useSelector<RootState, string>((state) => state.settings.serverAddress);

  const connectToServer = useCallback(
    (serverAddress: string) => {
      if (storeConnection) {
        const newConnection = io(
          serverAddress,
          {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1,
            reconnectionDelayMax: 10,
            retries: 10,
          },
        );

        newConnection.on('connect', () => {
          storeConnection(newConnection);
          setIsLoading(false);
          log('connected as', newConnection.id);
          navigate(routes.player);
        });
      }
    },
    [
      navigate,
      storeConnection,
    ],
  );

  useEffect(
    () => {
      if (autoConnect && serverAddress && storeConnection) {
        connectToServer(serverAddress);
      } else {
        setIsLoading(false);
      }
    },
    [
      autoConnect,
      connectToServer,
      serverAddress,
      storeConnection,
    ],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      setIsLoading(true);
      if (!(address && address.trim())) {
        return null;
      }

      dispatch(changeServerAddress(address));

      return connectToServer(address);
    },
    [
      address,
      connectToServer,
      dispatch,
    ],
  );

  return (
    <div>
      <h2>
        VAWE Remote
      </h2>
      <form
        className="f d-col mt-1 form"
        onSubmit={handleSubmit}
      >
        <input
          className="input mt-1"
          onChange={(event) => setAddress(event.currentTarget.value)}
          placeholder={DEFAULT_SERVER_ADDRESS}
          type="text"
          value={address}
        />
        <button
          className="button mt-1"
          disabled={!(address && address.trim()) || isLoading}
          type="submit"
        >
          Connect
        </button>
      </form>
    </div>
  );
});

export default Main;
